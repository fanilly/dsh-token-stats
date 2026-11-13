/**
 * Token usage statistics and estimated cost: folds provider-reported token
 * usage from every stored session log into per-day and per-session totals,
 * prices the durable samples with an editable model price table, and serves
 * both to the Web UI.
 *
 * The session log is the only source of truth. Each durable Assistant settlement
 * (`assistant/message`, or a streamed `assistant/attempt`) may carry a
 * `TokenUsage` sample; the fold mirrors the `tokenUsage` session projection so a
 * session total computed here equals the number the composer pill shows:
 *
 *   totalTokens = inputTokens + cacheReadTokens + cacheWriteTokens + outputTokens
 *
 * Duplicate handling:
 *   - a seeded/forked session copies its source prefix into its own log; only
 *     events at or past `inheritedEventCount` are folded;
 *   - retried steps produce several samples for one `(turn, step)` slot. A later
 *     sample replaces the earlier one, except after `llm/retry-started`, where
 *     the projection closes the slot so the next attempt counts as new.
 *
 * Cost is an ESTIMATE from the user-editable table in `prices.json` (created on
 * first save), not a bill. DeepSeek entries use the provider's peak/off-peak
 * rates; every other model uses one flat rate. Costs are computed at response
 * time from cached token cells, so editing prices never re-reads session logs.
 */

import { readFile, writeFile } from 'node:fs/promises'
import { basename } from 'node:path'

/** Data route served to the Client half. */
const ROUTE = '/dsh-token-stats'
/** Writable price table route (POST only). */
const PRICES_ROUTE = '/dsh-token-stats/prices'
/** Plugin-owned price table next to this module. */
const PRICES_FILE = new URL('./prices.json', import.meta.url)
/** How long one computed payload answers repeated opens. */
const MEMO_TTL_MS = 15_000
/** Concurrently replayed session logs. */
const READ_CONCURRENCY = 4
/** The four billable buckets reported by a provider. */
const BUCKET_KEYS = ['uncachedInputTokens', 'outputTokens', 'cacheReadTokens', 'cacheWriteTokens']
/** DeepSeek prices are declared in Beijing time. */
const PRICE_TIME_ZONE = 'Asia/Shanghai'
/** DeepSeek peak windows, in minutes from midnight, Beijing time. */
const PEAK_WINDOWS = [[9 * 60, 12 * 60], [14 * 60, 18 * 60]]
/** Maximum accepted price-table request body. */
const MAX_PRICE_BODY = 64 * 1024

/** Built-in list prices, CNY per million tokens (off-peak / peak). */
const DEFAULT_PRICING = {
  version: 1,
  currency: 'CNY',
  holidays: [],
  models: {
    'deepseek-flash': {
      kind: 'deepseek',
      peak: { hit: 0.04, miss: 2, out: 8 },
      offPeak: { hit: 0.02, miss: 1, out: 4 },
    },
    'deepseek-v4-pro': {
      kind: 'deepseek',
      peak: { hit: 0.30, miss: 9, out: 27 },
      offPeak: { hit: 0.15, miss: 4.5, out: 13.5 },
    },
  },
}

/** Hard dependency: the unified session query service. */
export const inject = ['sessionQuery']

/** @returns a fresh copy of the built-in price table. */
export function defaultPricing() {
  return JSON.parse(JSON.stringify(DEFAULT_PRICING))
}

/**
 * Zero-filled bucket set.
 * @returns a fresh bucket set.
 */
export function emptyBuckets() {
  return { uncachedInputTokens: 0, outputTokens: 0, cacheReadTokens: 0, cacheWriteTokens: 0 }
}

/**
 * The usage one durable Assistant settlement reports for its attempt, if any.
 * Settled messages carry `data.usage`; interrupted attempts may only carry the
 * last `usage` chunk of their stream record.
 * @param data - event data payload.
 * @returns the sample, or undefined.
 */
export function usageOf(data) {
  if (data === null || typeof data !== 'object') return undefined
  if (data.usage !== undefined && data.usage !== null && typeof data.usage === 'object') return data.usage
  const stream = data.stream
  if (!Array.isArray(stream)) return undefined
  for (let index = stream.length - 1; index >= 0; index -= 1) {
    const record = stream[index]
    const chunk = record === null || typeof record !== 'object' ? undefined : record.chunk
    if (chunk !== undefined && chunk !== null && chunk.type === 'usage' && chunk.usage !== undefined) {
      return chunk.usage
    }
  }
  return undefined
}

/**
 * Map one provider sample onto the projection's bucket names.
 * @param usage - provider sample.
 * @returns the four buckets.
 */
export function bucketsOf(usage) {
  return {
    uncachedInputTokens: numberOrZero(usage.inputTokens),
    outputTokens: numberOrZero(usage.outputTokens),
    cacheReadTokens: numberOrZero(usage.cacheReadTokens),
    cacheWriteTokens: numberOrZero(usage.cacheWriteTokens),
  }
}

/** @param value - unknown number. @returns the number, or 0. */
function numberOrZero(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

/** @param buckets - bucket set. @returns its total. */
export function totalOf(buckets) {
  let total = 0
  for (const key of BUCKET_KEYS) total += buckets[key]
  return total
}

/**
 * Add or subtract one bucket set.
 * @param target - mutated bucket set.
 * @param source - bucket set to apply.
 * @param sign - 1 to add, -1 to subtract.
 */
function applyBuckets(target, source, sign) {
  for (const key of BUCKET_KEYS) target[key] += sign * source[key]
}

/**
 * Build a day-key function for one IANA time zone.
 * @param timeZone - validated IANA zone, or undefined for the Host zone.
 * @returns `(time) => YYYY-MM-DD`.
 */
export function makeDayOf(timeZone) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    ...timeZone === undefined ? {} : { timeZone },
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  return (time) => {
    const parts = formatter.formatToParts(new Date(typeof time === 'number' ? time : Date.now()))
    let year = ''
    let month = ''
    let day = ''
    for (const part of parts) {
      if (part.type === 'year') year = part.value
      else if (part.type === 'month') month = part.value
      else if (part.type === 'day') day = part.value
    }
    return `${year}-${month}-${day}`
  }
}

/** Maximum age of a day whose hourly buckets are published (payload bound). */
const HOURLY_WINDOW_DAYS = 31

/** Beijing-time clock parts used by the peak/off-peak decision. */
const CLOCK = new Intl.DateTimeFormat('en-US', {
  timeZone: PRICE_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  weekday: 'short',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

/**
 * Build an hour-key function for one IANA time zone.
 * @param timeZone - validated IANA zone.
 * @returns `(time) => 0..23`.
 */
export function makeHourOf(timeZone) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    ...timeZone === undefined ? {} : { timeZone },
    hour: '2-digit',
    hour12: false,
  })
  return (time) => {
    const parts = formatter.formatToParts(new Date(typeof time === 'number' ? time : Date.now()))
    for (const part of parts) {
      if (part.type === 'hour') return Number(part.value) % 24
    }
    return 0
  }
}

/**
 * Shift a `YYYY-MM-DD` date by whole days.
 * @param date - source date.
 * @param delta - day offset.
 * @returns the shifted date.
 */
export function shiftDate(date, delta) {
  const parts = date.split('-').map(Number)
  if (parts.length !== 3 || parts.some(part => Number.isNaN(part))) return date
  const stamp = Date.UTC(parts[0], parts[1] - 1, parts[2]) + delta * 86400000
  const shifted = new Date(stamp)
  const pad = value => String(value).padStart(2, '0')
  return `${shifted.getUTCFullYear()}-${pad(shifted.getUTCMonth() + 1)}-${pad(shifted.getUTCDate())}`
}

/**
 * Whether one sample falls inside a DeepSeek peak window (Beijing time).
 * Weekends and configured holidays are always off-peak.
 * @param time - sample time in milliseconds.
 * @param holidays - `YYYY-MM-DD` dates in Beijing time.
 * @returns true for a peak sample.
 */
export function isPeak(time, holidays = []) {
  const parts = CLOCK.formatToParts(new Date(typeof time === 'number' ? time : Date.now()))
  let year = ''
  let month = ''
  let day = ''
  let weekday = ''
  let hour = 0
  let minute = 0
  for (const part of parts) {
    if (part.type === 'year') year = part.value
    else if (part.type === 'month') month = part.value
    else if (part.type === 'day') day = part.value
    else if (part.type === 'weekday') weekday = part.value
    else if (part.type === 'hour') hour = Number(part.value) % 24
    else if (part.type === 'minute') minute = Number(part.value)
  }
  if (weekday === 'Sat' || weekday === 'Sun') return false
  if (holidays.includes(`${year}-${month}-${day}`)) return false
  const minutes = hour * 60 + minute
  for (const [start, end] of PEAK_WINDOWS) {
    if (minutes >= start && minutes < end) return true
  }
  return false
}

/**
 * Fold one session's own events into totals, per-day buckets, and priced cells.
 * @param events - the session's real events, in seq order.
 * @param inheritedEventCount - length of the fork-inherited prefix to exclude.
 * @param dayOf - day-key function.
 * @param tariffOf - sample-time → 'peak' | 'offPeak'.
 * @returns totals, day buckets, priced cells, sample count, step count, and last activity.
 */
export function foldSession(events, inheritedEventCount, dayOf, tariffOf = () => 'peak', hourOf = () => 0) {
  const totals = emptyBuckets()
  const days = new Map()
  const dayRequests = new Map()
  const cells = new Map()
  const steps = new Set()
  let last
  let lastModel = 'unknown'
  let samples = 0
  let requests = 0
  let lastActivity = 0
  for (const event of events) {
    const seq = typeof event.seq === 'number' ? event.seq : 0
    if (seq < inheritedEventCount) continue
    if (typeof event.time === 'number' && event.time > lastActivity) lastActivity = event.time
    const type = event.type
    const data = event.data === null || typeof event.data !== 'object' ? {} : event.data
    if (type === 'request/header') {
      const config = data.header !== null && typeof data.header === 'object' ? data.header.config : undefined
      if (config !== null && config !== undefined && typeof config.model === 'string' && config.model !== '') {
        lastModel = config.model
      }
      continue
    }
    if (type === 'request/context') {
      if (typeof data.model === 'string' && data.model !== '') lastModel = data.model
      continue
    }
    if (type === 'llm/retry-started') {
      if (last !== undefined && last.turn === data.turn && last.step === data.step) last = undefined
      continue
    }
    if (type !== 'assistant/message' && type !== 'assistant/attempt') continue
    const usage = usageOf(data)
    if (usage === undefined) continue
    const message = data.message !== null && typeof data.message === 'object' ? data.message : {}
    const source = message.source !== null && typeof message.source === 'object' ? message.source : {}
    const model = typeof source.model === 'string' && source.model !== '' ? source.model : lastModel
    const buckets = bucketsOf(usage)
    const day = dayOf(event.time)
    const hour = hourOf(event.time)
    const tariff = tariffOf(event.time)
    const key = `${model}\u0000${day}\u0000${hour}\u0000${tariff}`
    let cell = cells.get(key)
    if (cell === undefined) {
      cell = { model, day, hour, tariff, buckets: emptyBuckets() }
      cells.set(key, cell)
    }
    if (last !== undefined && last.turn === data.turn && last.step === data.step) {
      applyBuckets(totals, last.buckets, -1)
      const previousDay = days.get(last.day)
      if (previousDay !== undefined) applyBuckets(previousDay, last.buckets, -1)
      const previousCell = cells.get(last.key)
      if (previousCell !== undefined) applyBuckets(previousCell.buckets, last.buckets, -1)
      const previousRequests = dayRequests.get(last.day) ?? 0
      if (previousRequests > 0) dayRequests.set(last.day, previousRequests - 1)
      if (requests > 0) requests -= 1
    }
    applyBuckets(totals, buckets, 1)
    let dayBuckets = days.get(day)
    if (dayBuckets === undefined) {
      dayBuckets = emptyBuckets()
      days.set(day, dayBuckets)
    }
    applyBuckets(dayBuckets, buckets, 1)
    applyBuckets(cell.buckets, buckets, 1)
    dayRequests.set(day, (dayRequests.get(day) ?? 0) + 1)
    requests += 1
    steps.add(`${String(data.turn)}:${String(data.step)}`)
    samples += 1
    last = { turn: data.turn, step: data.step, key, day, buckets }
  }
  for (const [day, buckets] of days) {
    if (totalOf(buckets) === 0) days.delete(day)
  }
  for (const [key, cell] of cells) {
    if (totalOf(cell.buckets) === 0) cells.delete(key)
  }
  return { totals, days, dayRequests, cells, samples, requests, steps: steps.size, lastActivity }
}

/**
 * Normalize a requested zone to a usable IANA name.
 * @param value - raw query value.
 * @returns a zone the Host formatter accepts.
 */
export function normalizeZone(value) {
  if (typeof value === 'string' && value.trim() !== '') {
    try {
      new Intl.DateTimeFormat('en-US', { timeZone: value })
      return value
    } catch {
      /* fall through to the Host zone */
    }
  }
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch {
    return 'UTC'
  }
}

/**
 * Read durable titles for the given sessions, best effort.
 * @param sessionQuery - session query service.
 * @param ids - session ids.
 * @returns id → title.
 */
async function readTitles(sessionQuery, ids) {
  const titles = new Map()
  if (ids.length === 0) return titles
  try {
    const results = await sessionQuery.readTitleSnapshots(ids)
    for (const result of results) {
      if (result.status !== 'fulfilled') continue
      const title = result.value === undefined || result.value.title === undefined
        ? undefined
        : result.value.title
      if (title === undefined) continue
      if (typeof title.title === 'string' && title.title !== '') titles.set(result.sessionId, title.title)
    }
  } catch {
    /* titles are decoration; a failed read must not fail the statistics */
  }
  return titles
}

/**
 * Current persistence revisions, used to re-read only logs that changed.
 * @param persistence - session persistence service.
 * @returns id → revision, or undefined when the service is unusable.
 */
async function readRevisions(persistence) {
  try {
    const snapshots = await persistence.list()
    const revisions = new Map()
    for (const snapshot of snapshots) revisions.set(snapshot.header.id, String(snapshot.revision))
    return revisions
  } catch {
    return undefined
  }
}

/**
 * Fallback display title matching the sidebar's own precedence.
 * @param title - durable title.
 * @param cwd - session working directory.
 * @param id - session id.
 * @returns display text.
 */
function displayTitle(title, cwd, id) {
  if (title !== undefined && title !== '') return title
  if (typeof cwd === 'string' && cwd !== '') {
    const base = basename(cwd)
    if (base !== '') return base
  }
  return id
}

/**
 * Validate one rate triple.
 * @param value - candidate.
 * @returns `{ hit, miss, out }`, or undefined when invalid.
 */
function normalizeRates(value) {
  if (value === null || typeof value !== 'object') return undefined
  const hit = value.hit
  const miss = value.miss
  const out = value.out
  for (const rate of [hit, miss, out]) {
    if (typeof rate !== 'number' || !Number.isFinite(rate) || rate < 0) return undefined
  }
  return { hit, miss, out }
}

/**
 * Validate and normalize one price table, dropping unknown shapes.
 * @param raw - untrusted table (file or request body).
 * @param strict - reject bad entries instead of dropping them.
 * @returns a normalized table, or undefined when nothing usable remains.
 * @throws when strict and an entry is invalid.
 */
export function normalizePricing(raw, strict = false) {
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) {
    if (strict) throw new Error('price table must be an object')
    return undefined
  }
  const currency = raw.currency === 'USD' ? 'USD' : 'CNY'
  const holidays = []
  if (Array.isArray(raw.holidays)) {
    for (const day of raw.holidays) {
      if (typeof day === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(day) && !holidays.includes(day)) holidays.push(day)
    }
  }
  const models = {}
  const entries = raw.models !== null && typeof raw.models === 'object' && !Array.isArray(raw.models) ? raw.models : {}
  for (const [id, entry] of Object.entries(entries)) {
    const model = typeof id === 'string' ? id.trim() : ''
    if (model === '' || entry === null || typeof entry !== 'object') {
      if (strict) throw new Error(`invalid model entry: ${String(id)}`)
      continue
    }
    if (entry.kind === 'deepseek') {
      const peak = normalizeRates(entry.peak)
      const offPeak = normalizeRates(entry.offPeak)
      if (peak === undefined || offPeak === undefined) {
        if (strict) throw new Error(`invalid DeepSeek rates for ${model}`)
        continue
      }
      models[model] = { kind: 'deepseek', peak, offPeak }
    } else if (entry.kind === 'flat') {
      const rates = normalizeRates(entry.rates)
      if (rates === undefined) {
        if (strict) throw new Error(`invalid flat rates for ${model}`)
        continue
      }
      models[model] = { kind: 'flat', rates }
    } else if (strict) {
      throw new Error(`invalid model kind for ${model}`)
    }
  }
  if (Object.keys(models).length === 0) {
    if (strict) throw new Error('price table needs at least one model')
    return undefined
  }
  return { version: 1, currency, holidays, models }
}

/**
 * Load the plugin-owned price table, falling back to the built-in defaults.
 * @returns the table in use.
 */
async function loadPricing() {
  try {
    const text = await readFile(PRICES_FILE, 'utf8')
    const parsed = normalizePricing(JSON.parse(text), false)
    if (parsed !== undefined) return parsed
    console.error('[token-stats] prices.json has no usable model entries; using built-in defaults')
  } catch (error) {
    if (error === null || error === undefined || error.code !== 'ENOENT') {
      console.error('[token-stats] cannot read prices.json; using built-in defaults', String(error))
    }
  }
  return defaultPricing()
}

/**
 * Persist the price table next to this module.
 * @param pricing - normalized table.
 * @returns completion.
 */
async function savePricing(pricing) {
  await writeFile(PRICES_FILE, JSON.stringify(pricing, null, 2) + '\n', 'utf8')
}

/**
 * Rates for one cell, or undefined when the model is not priced.
 * @param pricing - current table.
 * @param model - model id.
 * @param tariff - 'peak' | 'offPeak'.
 * @returns rate triple, or undefined.
 */
function ratesOf(pricing, model, tariff) {
  const entry = pricing.models[model]
  if (entry === undefined) return undefined
  if (entry.kind === 'deepseek') return entry[tariff]
  return entry.rates
}

/** @returns a zero cost split. */
function zeroCost() {
  return { total: 0, hit: 0, miss: 0, out: 0 }
}

/**
 * Price one cell.
 * @param buckets - token buckets.
 * @param rates - per-million rates.
 * @returns the cost split.
 */
function costOf(buckets, rates) {
  const hit = buckets.cacheReadTokens * rates.hit / 1e6
  const miss = (buckets.uncachedInputTokens + buckets.cacheWriteTokens) * rates.miss / 1e6
  const out = buckets.outputTokens * rates.out / 1e6
  return { total: hit + miss + out, hit, miss, out }
}

/**
 * Accumulate one cost split.
 * @param target - mutated total.
 * @param source - split to add.
 */
function addCost(target, source) {
  target.total += source.total
  target.hit += source.hit
  target.miss += source.miss
  target.out += source.out
}

/**
 * Read and fold one session.
 * @param ctx - host context carrying both services.
 * @param record - listed session record.
 * @param dayOf - day-key function.
 * @param tariffOf - sample-time → tariff.
 * @param title - durable title already cached for this session, if any.
 * @returns the session entry, or undefined when it has no usage.
 */
async function foldRecord(ctx, record, dayOf, tariffOf, hourOf, title) {
  const snapshot = await ctx.sessionQuery.readSession(record.header.id)
  const header = snapshot.session === undefined ? record.header : snapshot.session
  const inherited = typeof snapshot.inheritedEventCount === 'number' ? snapshot.inheritedEventCount : 0
  const folded = foldSession(snapshot.events, inherited, dayOf, tariffOf, hourOf)
  const totalTokens = totalOf(folded.totals)
  if (totalTokens === 0) return undefined
  const days = {}
  for (const [day, buckets] of folded.days) {
    days[day] = { ...buckets, totalTokens: totalOf(buckets), requests: folded.dayRequests.get(day) ?? 0 }
  }
  return {
    id: header.id,
    title: displayTitle(title, header.cwd, header.id),
    cwd: header.cwd,
    origin: header.origin,
    parentSession: header.parentSession,
    isSeeded: header.isSeeded === true,
    createdAt: header.createdAt,
    lastActivity: folded.lastActivity === 0 ? header.createdAt : folded.lastActivity,
    samples: folded.samples,
    requests: folded.requests,
    steps: folded.steps,
    inheritedEventCount: inherited,
    totals: { ...folded.totals, totalTokens },
    days,
    cells: folded.cells,
  }
}

/**
 * Attach estimated costs to one cached session entry.
 * @param entry - cached entry with priced cells.
 * @param pricing - current price table.
 * @returns unpriced token count for this session.
 */
function priceEntry(entry, pricing) {
  const cost = zeroCost()
  const byModel = new Map()
  const dayCost = new Map()
  let unpricedTokens = 0
  for (const cell of entry.cells.values()) {
    const bucketTotal = totalOf(cell.buckets)
    const modelEntry = byModel.get(cell.model)
    const rates = ratesOf(pricing, cell.model, cell.tariff)
    const target = modelEntry === undefined
      ? { model: cell.model, tokens: emptyBuckets(), totalTokens: 0, cost: zeroCost() }
      : modelEntry
    applyBuckets(target.tokens, cell.buckets, 1)
    target.totalTokens += bucketTotal
    if (rates === undefined) {
      unpricedTokens += bucketTotal
    } else {
      const split = costOf(cell.buckets, rates)
      addCost(cost, split)
      addCost(target.cost, split)
      let dayTotal = dayCost.get(cell.day)
      if (dayTotal === undefined) {
        dayTotal = zeroCost()
        dayCost.set(cell.day, dayTotal)
      }
      addCost(dayTotal, split)
    }
    byModel.set(cell.model, target)
  }
  entry.cost = cost
  entry.unpricedTokens = unpricedTokens
  entry.byModel = [...byModel.values()].sort((left, right) => right.cost.total - left.cost.total)
  for (const day of Object.keys(entry.days)) {
    entry.days[day].cost = dayCost.get(day) ?? zeroCost()
  }
  return unpricedTokens
}

/**
 * Build the complete statistics payload.
 * @param ctx - host context.
 * @param timeZone - validated zone for day boundaries.
 * @param state - plugin-owned caches.
 * @param force - bypass the short-lived payload memo.
 * @returns the JSON payload.
 */
async function computePayload(ctx, timeZone, state, force) {
  const startedAt = Date.now()
  if (!force
    && state.payload !== undefined
    && state.payloadZone === timeZone
    && startedAt - state.payloadAt < MEMO_TTL_MS) {
    return state.payload
  }
  const pricing = state.pricing
  const holidaysKey = JSON.stringify(pricing.holidays)
  const dayOf = makeDayOf(timeZone)
  const hourOf = makeHourOf(timeZone)
  const tariffOf = time => (isPeak(time, pricing.holidays) ? 'peak' : 'offPeak')
  const records = await ctx.sessionQuery.listSessions()
  const persistence = ctx.get('sessionPersistence')
  const revisions = persistence === undefined ? undefined : await readRevisions(persistence)
  const entries = new Map()
  const changed = []
  for (const record of records) {
    const id = record.header.id
    const revision = revisions === undefined ? undefined : revisions.get(id)
    const cached = state.sessions.get(id)
    if (revision !== undefined
      && cached !== undefined
      && cached.revision === revision
      && cached.timeZone === timeZone
      && cached.holidaysKey === holidaysKey) {
      entries.set(id, cached.entry)
    } else {
      changed.push(record)
    }
  }
  const titles = await readTitles(ctx.sessionQuery, changed.map(record => record.header.id))
  for (const [id, title] of titles) state.titles.set(id, title)
  const warnings = []
  let cursor = 0
  const worker = async () => {
    while (true) {
      const index = cursor
      cursor += 1
      if (index >= changed.length) return
      const record = changed[index]
      const id = record.header.id
      const revision = revisions === undefined ? undefined : revisions.get(id)
      try {
        const entry = await foldRecord(ctx, record, dayOf, tariffOf, hourOf, state.titles.get(id))
        entries.set(id, entry)
        state.sessions.set(id, { revision, timeZone, holidaysKey, entry })
      } catch (error) {
        warnings.push({ sessionId: id, message: String(error === null || error === undefined ? error : error.message) })
        entries.delete(id)
      }
    }
  }
  const workers = []
  for (let index = 0; index < Math.min(READ_CONCURRENCY, changed.length); index += 1) workers.push(worker())
  await Promise.all(workers)
  const live = new Set(records.map(record => record.header.id))
  for (const id of state.sessions.keys()) {
    if (!live.has(id)) state.sessions.delete(id)
  }
  for (const id of state.titles.keys()) {
    if (!live.has(id)) state.titles.delete(id)
  }
  let latestDay = ''
  for (const entry of entries.values()) {
    if (entry === undefined) continue
    for (const date of Object.keys(entry.days)) {
      if (date > latestDay) latestDay = date
    }
  }
  const hourlyCutoff = latestDay === '' ? '' : shiftDate(latestDay, -(HOURLY_WINDOW_DAYS - 1))
  const hourly = {}
  const sessions = []
  let unpricedTokens = 0
  for (const entry of entries.values()) {
    if (entry === undefined) continue
    unpricedTokens += priceEntry(entry, pricing)
    if (hourlyCutoff !== '') {
      const cwd = entry.cwd === undefined ? '' : entry.cwd
      for (const cell of entry.cells.values()) {
        if (cell.day < hourlyCutoff) continue
        const rates = ratesOf(pricing, cell.model, cell.tariff)
        const cost = rates === undefined ? 0 : costOf(cell.buckets, rates).total
        let byCwd = hourly[cell.day]
        if (byCwd === undefined) {
          byCwd = {}
          hourly[cell.day] = byCwd
        }
        let series = byCwd[cwd]
        if (series === undefined) {
          series = {
            tokens: new Array(24).fill(0),
            cost: new Array(24).fill(0),
            input: new Array(24).fill(0),
            output: new Array(24).fill(0),
            cacheRead: new Array(24).fill(0),
            cacheWrite: new Array(24).fill(0),
          }
          byCwd[cwd] = series
        }
        series.tokens[cell.hour] += totalOf(cell.buckets)
        series.cost[cell.hour] += cost
        series.input[cell.hour] += cell.buckets.uncachedInputTokens
        series.output[cell.hour] += cell.buckets.outputTokens
        series.cacheRead[cell.hour] += cell.buckets.cacheReadTokens
        series.cacheWrite[cell.hour] += cell.buckets.cacheWriteTokens
      }
    }
    const { cells, ...publicEntry } = entry
    sessions.push(publicEntry)
  }
  sessions.sort((left, right) => right.totals.totalTokens - left.totals.totalTokens)
  const dayTotals = new Map()
  for (const session of sessions) {
    for (const [day, buckets] of Object.entries(session.days)) {
      let totals = dayTotals.get(day)
      if (totals === undefined) {
        totals = { tokens: emptyBuckets(), totalTokens: 0, cost: zeroCost(), requests: 0 }
        dayTotals.set(day, totals)
      }
      applyBuckets(totals.tokens, buckets, 1)
      totals.totalTokens += buckets.totalTokens
      totals.requests += typeof buckets.requests === 'number' ? buckets.requests : 0
      if (buckets.cost !== undefined) addCost(totals.cost, buckets.cost)
    }
  }
  const days = [...dayTotals.entries()]
    .map(([date, totals]) => ({
      date,
      totals: { ...totals.tokens, totalTokens: totals.totalTokens, cost: totals.cost, requests: totals.requests },
      sessions: sessions.filter(session => session.days[date] !== undefined).map(session => session.id),
    }))
    .sort((left, right) => right.date.localeCompare(left.date))
  const payload = {
    generatedAt: Date.now(),
    buildMs: Date.now() - startedAt,
    timeZone,
    currency: pricing.currency,
    pricing,
    defaultPricing: defaultPricing(),
    unpricedTokens,
    days,
    sessions,
    hourly,
    warnings,
  }
  state.payload = payload
  state.payloadZone = timeZone
  state.payloadAt = payload.generatedAt
  return payload
}

/**
 * Answer one HTTP request on the plugin's data route.
 * @param ctx - host context.
 * @param request - incoming request.
 * @param state - plugin-owned caches.
 * @returns the response.
 */
async function respond(ctx, request, state) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response('method not allowed\n', {
      status: 405,
      headers: { allow: 'GET, HEAD', 'content-type': 'text/plain; charset=utf-8' },
    })
  }
  const url = new URL(request.url)
  const timeZone = normalizeZone(url.searchParams.get('tz'))
  const force = url.searchParams.get('refresh') === '1'
  const headers = { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
  try {
    await state.ready
    const payload = await computePayload(ctx, timeZone, state, force)
    return new Response(request.method === 'HEAD' ? null : JSON.stringify(payload), { status: 200, headers })
  } catch (error) {
    const message = error === null || error === undefined ? 'unknown error' : String(error.message)
    return new Response(JSON.stringify({ error: message }), { status: 500, headers })
  }
}

/** @param res - response that owns the write. @param status - HTTP status. @param value - JSON value. */
function writeJson(res, status, value) {
  const body = JSON.stringify(value)
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'content-length': Buffer.byteLength(body),
  })
  res.end(body)
}

/**
 * Read a bounded request body.
 * @param req - incoming request.
 * @returns the body text.
 * @throws when the body exceeds {@link MAX_PRICE_BODY}.
 */
async function readBody(req) {
  let size = 0
  const chunks = []
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    size += buffer.length
    if (size > MAX_PRICE_BODY) throw new Error('price table payload is too large')
    chunks.push(buffer)
  }
  return Buffer.concat(chunks).toString('utf8')
}

/**
 * Save the edited price table and invalidate costs.
 * @param req - incoming request.
 * @param res - response that owns the write.
 * @param state - plugin-owned caches.
 * @returns completion.
 */
async function handlePrices(req, res, state) {
  if (req.method !== 'POST') {
    res.writeHead(405, { allow: 'POST' })
    res.end()
    return
  }
  let raw
  try {
    raw = JSON.parse(await readBody(req))
  } catch (error) {
    writeJson(res, 400, { error: String(error === null || error === undefined ? error : error.message) })
    return
  }
  let pricing
  try {
    pricing = normalizePricing(raw, true)
  } catch (error) {
    writeJson(res, 400, { error: String(error === null || error === undefined ? error : error.message) })
    return
  }
  const before = state.pricing
  const holidaysChanged = JSON.stringify(before.holidays) !== JSON.stringify(pricing.holidays)
  try {
    await savePricing(pricing)
  } catch (error) {
    writeJson(res, 500, { error: `cannot write prices.json: ${String(error === null || error === undefined ? error : error.message)}` })
    return
  }
  state.pricing = pricing
  state.payloadAt = 0
  if (holidaysChanged) state.sessions.clear()
  writeJson(res, 200, { ok: true, pricing })
}

/**
 * Host plugin body: serve the data and price-table routes for the Client half.
 * @param ctx - host plugin context.
 */
export function apply(ctx) {
  const state = {
    sessions: new Map(),
    titles: new Map(),
    pricing: defaultPricing(),
    payload: undefined,
    payloadZone: '',
    payloadAt: 0,
    ready: Promise.resolve(),
  }
  state.ready = loadPricing().then((pricing) => {
    state.pricing = pricing
  }).catch(() => undefined)
  ctx.inject(['webServer'], (webCtx) => {
    webCtx.effect(() => webCtx.webServer.register({
      kind: 'prefix',
      path: ROUTE,
      resource: request => respond(webCtx, request, state),
    }), 'token-stats: usage route')
    webCtx.effect(() => webCtx.webServer.register({
      kind: 'exact',
      path: PRICES_ROUTE,
      handler: (req, res) => {
        handlePrices(req, res, state).catch((error) => {
          try {
            writeJson(res, 500, { error: String(error === null || error === undefined ? error : error.message) })
          } catch {
            /* the response is already committed */
          }
        })
      },
    }), 'token-stats: pricing route')
  })
}
