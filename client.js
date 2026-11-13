window.__ModuleLoader__.load({
  id: '@local/dsh-token-stats',
  factory(require) {
    const React = require('react')
    const ReactDOM = require('react-dom')
    const h = React.createElement
    const NS = 'token-stats'

    const BUCKET_KEYS = ['uncachedInputTokens', 'outputTokens', 'cacheReadTokens', 'cacheWriteTokens']
    const PAGE_SIZE = 10

    const zh = {
      title: 'Token 用量',
      tabDays: '按日',
      tabSessions: '按会话',
      allDirectories: '全部目录',
      refresh: '刷新',
      loading: '正在统计…',
      error: '加载失败：{message}',
      retry: '重试',
      empty: '还没有 token 用量记录。',
      daySessions: '{count} 个会话',
      subagent: '子代理',
      children: '{count} 个子代理',
      total: '合计',
      own: '自身',
      withChildren: '含子代理',
      input: '未命中输入',
      cacheRead: '缓存读取',
      cacheWrite: '缓存写入',
      output: '输出',
      cacheHit: '缓存命中',
      updated: '更新于 {time} · {zone}',
      none: '—',
      cost: '预估',
      costShort: '预估',
      costBreakdown: '缓存 {hit} · 未命中 {miss} · 输出 {out}',
      costHint: '按配置单价估算，非账单',
      todayCost: '今日成本',
      todayRequests: '今日请求',
      todayTokens: '今日 Token',
      todayCacheHit: '今日缓存命中',
      rangeCost: '区间成本',
      rangeRequests: '区间请求',
      rangeTokens: '区间 Token',
      rangeCacheHit: '区间缓存命中',
      trendTitle: '使用趋势',
      legendTokens: 'Token 消耗',
      legendCost: '预估金额',
      unpriced: '未定价 {tokens} tokens',
      editPrices: '定价设置',
      priceTitle: '定价设置',
      priceIntro: '金额按下面的单价估算，不影响实际账单。单价单位：每百万 tokens。DeepSeek 使用高峰/闲时价，其他模型使用统一价。',
      back: '返回统计',
      peak: '高峰',
      offPeak: '闲时',
      flat: '统一价',
      hit: '缓存命中',
      miss: '未命中',
      out: '输出',
      save: '保存',
      saving: '保存中…',
      saved: '已保存，金额已按新单价重算',
      resetDefaults: '恢复默认',
      addModel: '添加模型',
      modelName: '模型 ID',
      modelKind: '计费方式',
      kindFlat: '统一价',
      kindPeak: '峰谷价',
      remove: '删除',
      holidays: '节假日',
      holidaysHint: '逗号分隔的 YYYY-MM-DD，按北京时间跳过高峰（可选）',
      priceSaveFailed: '保存失败：{message}',
      invalidRates: '请填写不小于 0 的数字',
      duplicateModel: '模型 ID 已存在',
      emptyModel: '模型 ID 不能为空',
      noModels: '至少保留一个模型',
      byModel: '按模型',
      modelTokens: '{tokens} tokens',
      rateHeader: '单价（{currency} / 百万 tokens）',
      customModelPlaceholder: '例如 gpt-4o',
      emptyPrice: '还没有加载价格表。',
      allDates: '全部日期',
      last7: '最近 7 天',
      last30: '最近 30 天',
      dateFrom: '开始',
      dateTo: '结束',
      apply: '应用',
      clear: '清除',
      dateRange: '日期范围',
      emptyRange: '当前筛选没有数据。',
      pageInfo: '第 {page} / {pages} 页 · 共 {total} 条',
      prevPage: '上一页',
      nextPage: '下一页',
      totalItems: '共 {count} 条',
      pageSizeLabel: '{count} 条/页',
      jumpTo: '跳至',
      pageUnit: '页',
      trendHourly: '使用趋势 · 按小时',
      heatmapTitle: '用量热力图',
      metricTokens: 'Token 消耗',
      metricRequests: '请求',
      metricCost: '成本',
      heatSummary: '{range} · {tokens} Token · {requests} 次请求 · {cost}',
      less: '少',
      more: '多',
      heatWeekdays: '周一 周二 周三 周四 周五 周六 周日',
      monthShort: '{month} 月',
      weekdays: '日 一 二 三 四 五 六',
      monthLabel: '{year} 年 {month} 月',
      prevMonth: '上个月',
      nextMonth: '下个月',
      today: '今天',
      last14: '近 14 天',
      pickStart: '选择开始日期',
      pickEnd: '选择结束日期',
      cancel: '取消',
      confirm: '确定',
    }

    const en = {
      title: 'Token usage',
      tabDays: 'By day',
      tabSessions: 'By session',
      allDirectories: 'All directories',
      refresh: 'Refresh',
      loading: 'Computing…',
      error: 'Failed to load: {message}',
      retry: 'Retry',
      empty: 'No token usage recorded yet.',
      daySessions: '{count} sessions',
      subagent: 'Subagent',
      children: '{count} subagents',
      total: 'Total',
      own: 'Own',
      withChildren: 'With subagents',
      input: 'Uncached input',
      cacheRead: 'Cache read',
      cacheWrite: 'Cache write',
      output: 'Output',
      cacheHit: 'Cache hit',
      updated: 'Updated {time} · {zone}',
      none: '—',
      cost: 'Est.',
      costShort: 'Est.',
      costBreakdown: 'Cache {hit} · Miss {miss} · Output {out}',
      costHint: 'Estimated from configured prices, not a bill',
      todayCost: 'Today cost',
      todayRequests: 'Today requests',
      todayTokens: 'Today tokens',
      todayCacheHit: 'Today cache hit',
      rangeCost: 'Range cost',
      rangeRequests: 'Range requests',
      rangeTokens: 'Range tokens',
      rangeCacheHit: 'Range cache hit',
      trendTitle: 'Usage trend',
      legendTokens: 'Tokens',
      legendCost: 'Est. cost',
      unpriced: '{tokens} tokens unpriced',
      editPrices: 'Prices',
      priceTitle: 'Price settings',
      priceIntro: 'Amounts are estimated from the rates below and are not a bill. Rates are per million tokens. DeepSeek uses peak/off-peak rates; other models use one flat rate.',
      back: 'Back to usage',
      peak: 'Peak',
      offPeak: 'Off-peak',
      flat: 'Flat',
      hit: 'Cache hit',
      miss: 'Miss',
      out: 'Output',
      save: 'Save',
      saving: 'Saving…',
      saved: 'Saved; amounts were recomputed',
      resetDefaults: 'Reset defaults',
      addModel: 'Add model',
      modelName: 'Model id',
      modelKind: 'Pricing',
      kindFlat: 'Flat',
      kindPeak: 'Peak/off-peak',
      remove: 'Remove',
      holidays: 'Holidays',
      holidaysHint: 'Comma-separated YYYY-MM-DD dates treated as off-peak in Beijing time (optional)',
      priceSaveFailed: 'Save failed: {message}',
      invalidRates: 'Enter numeric values that are not negative',
      duplicateModel: 'That model id already exists',
      emptyModel: 'Model id is required',
      noModels: 'Keep at least one model',
      byModel: 'By model',
      modelTokens: '{tokens} tokens',
      rateHeader: 'Rates ({currency} / 1M tokens)',
      customModelPlaceholder: 'e.g. gpt-4o',
      emptyPrice: 'The price table is not loaded yet.',
      allDates: 'All dates',
      last7: 'Last 7 days',
      last30: 'Last 30 days',
      dateFrom: 'From',
      dateTo: 'To',
      apply: 'Apply',
      clear: 'Clear',
      dateRange: 'Date range',
      emptyRange: 'No data in the current filter.',
      pageInfo: 'Page {page} / {pages} · {total} items',
      prevPage: 'Previous',
      nextPage: 'Next',
      totalItems: '{count} items',
      pageSizeLabel: '{count} / page',
      jumpTo: 'Go to',
      pageUnit: 'page',
      trendHourly: 'Usage trend · hourly',
      heatmapTitle: 'Usage heatmap',
      metricTokens: 'Tokens',
      metricRequests: 'Requests',
      metricCost: 'Cost',
      heatSummary: '{range} · {tokens} tokens · {requests} requests · {cost}',
      less: 'Less',
      more: 'More',
      heatWeekdays: 'Mon Tue Wed Thu Fri Sat Sun',
      monthShort: '{month}',
      weekdays: 'Su Mo Tu We Th Fr Sa',
      monthLabel: '{month}/{year}',
      prevMonth: 'Previous month',
      nextMonth: 'Next month',
      today: 'Today',
      last14: 'Last 14 days',
      pickStart: 'Select start date',
      pickEnd: 'Select end date',
      cancel: 'Cancel',
      confirm: 'Confirm',
    }

    const CSS = `
.dts-section{display:flex;flex-direction:column;gap:12px;padding:8px 0;font-size:13px;line-height:22px;
  color:var(--dsw-alias-label-primary);box-sizing:border-box}
.dts-section *{box-sizing:border-box}
.dts-head{display:flex;flex-wrap:wrap;align-items:flex-start;justify-content:space-between;gap:8px 12px}
.dts-head-main{min-width:0}
.dts-head-title{font-size:15px;font-weight:600;line-height:22px}
.dts-head-sub{margin-top:2px;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px}
.dts-head-actions{display:flex;flex-wrap:wrap;align-items:center;justify-content:flex-end;gap:8px;flex:0 0 auto}
.dts-head-actions .dts-select{height:28px;min-width:110px;padding:0 10px;font-size:12px;gap:10px}
.dts-refresh{display:inline-flex;align-items:center;gap:6px;flex:0 0 auto;height:28px;padding:0 10px;
  border:1px solid var(--dsw-alias-border-l1);border-radius:7px;background:var(--dsw-alias-bg-layer-1);
  color:var(--dsw-alias-label-primary);font:inherit;font-size:12px;line-height:1;cursor:pointer;white-space:nowrap;
  transition:background .12s ease,border-color .12s ease,color .12s ease}
.dts-refresh:hover{background:var(--dsw-alias-interactive-bg-hover,var(--dsw-alias-bg-layer-2));border-color:var(--dsw-alias-border-l2)}
.dts-refresh:active{background:var(--dsw-alias-bg-layer-1)}
.dts-btn-icon{display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto}
.dts-refresh:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}
.dts-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(118px,1fr));gap:8px}
.dts-card-kpi{min-width:0;padding:10px 12px;border:1px solid var(--dsw-alias-border-l1);border-radius:10px;
  background:var(--dsw-alias-bg-layer-1)}
.dts-kpi-label{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-secondary);
  font-size:11px;line-height:16px}
.dts-kpi-value{margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:17px;line-height:24px;
  font-weight:600;font-variant-numeric:tabular-nums}
.dts-panel-block{display:flex;flex-direction:column;gap:8px;min-width:0;padding:12px;
  border:1px solid var(--dsw-alias-border-l1);border-radius:12px;background:var(--dsw-alias-bg-layer-1)}
.dts-block{display:flex;flex-direction:column;gap:6px}
.dts-block-head{display:flex;align-items:center;gap:12px}
.dts-block-title{font-size:13px;font-weight:600}
.dts-legend{display:flex;gap:12px;margin-left:auto;color:var(--dsw-alias-label-secondary);font-size:11px}
.dts-legend-item{display:inline-flex;align-items:center;gap:5px}
.dts-legend-bar{width:10px;height:6px;border-radius:2px;background:var(--dsw-alias-brand-primary);opacity:.75}
.dts-legend-dot{width:7px;height:7px;border-radius:50%;background:var(--dsw-alias-state-warn-primary)}
.dts-trend svg{display:block}
.dts-chart{position:relative}
.dts-tip{position:absolute;top:2px;z-index:2;transform:translateX(-50%);pointer-events:none;padding:6px 9px;
  border:1px solid var(--dsw-alias-border-l1);border-radius:8px;background:var(--dsw-alias-bg-overlay);
  box-shadow:0 6px 20px rgba(0,0,0,.18);color:var(--dsw-alias-label-primary);font-size:11px;line-height:16px;white-space:nowrap}
.dts-tip-date{margin-bottom:2px;color:var(--dsw-alias-label-secondary)}
.dts-tip-row{display:flex;align-items:center;gap:6px}
.dts-tip-row b{margin-left:auto;padding-left:8px;font-weight:600;font-variant-numeric:tabular-nums}
.dts-toolbar{display:flex;align-items:center;flex-wrap:wrap;gap:8px 12px}
.dts-block-date{margin-left:8px;color:var(--dsw-alias-label-secondary);font-size:11px;white-space:nowrap}
@keyframes dts-spin{to{transform:rotate(360deg)}}
.dts-spinning{display:inline-flex;animation:dts-spin .9s linear infinite}
.dts-tabs{display:flex;gap:2px;padding:2px;border-radius:9px;background:var(--dsw-alias-bg-layer-2)}
.dts-tab{border:0;border-radius:7px;padding:5px 12px;background:transparent;color:var(--dsw-alias-label-secondary);
  font:inherit;font-size:12px;cursor:pointer;transition:background .12s ease,color .12s ease}
.dts-tab:hover{background:var(--dsw-alias-interactive-bg-hover,var(--dsw-alias-bg-layer-1));color:var(--dsw-alias-label-primary)}
.dts-tab[data-active="true"]{background:var(--dsw-alias-bg-overlay);color:var(--dsw-alias-label-primary);box-shadow:0 1px 2px rgba(0,0,0,.12)}
.dts-tab:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}
.dts-select-wrap{position:relative;flex:0 1 auto;min-width:0}
.dts-select{display:inline-flex;align-items:center;gap:12px;min-width:120px;max-width:260px;height:32px;padding:0 12px;
  border:0;border-radius:9px;background:var(--dsw-alias-bg-module-platform,#f5f6f7);
  color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;line-height:1;cursor:pointer;
  transition:background .12s ease,box-shadow .12s ease}
.dts-select:hover{background:var(--dsw-alias-bg-module-platform,#f5f6f7);
  box-shadow:inset 0 0 0 999px var(--dsw-alias-interactive-bg-hover,#2631480f)}
.dts-select:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}
.dts-select-label{flex:1 1 auto;overflow:hidden;text-align:left;text-overflow:ellipsis;white-space:nowrap}
.dts-select-chevron{display:inline-flex;flex:0 0 auto;color:var(--dsw-alias-label-secondary);transition:transform .12s ease}
.dts-select-chevron-open{transform:rotate(180deg)}
.dts-menu.dts-menu-right{left:auto;right:0}
.dts-menu.dts-date-menu{min-width:0;max-width:calc(100vw - 24px);max-height:none;overflow:visible;padding:8px}
.dts-menu-sep{height:1px;margin:4px 2px;background:var(--dsw-alias-border-l1)}
.dts-date-chips{display:flex;flex-wrap:wrap;gap:6px;padding:2px}
.dts-date-chip{height:26px;padding:0 10px;border:1px solid var(--dsw-alias-border-l1);border-radius:13px;
  background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:11px;cursor:pointer;
  white-space:nowrap;transition:background .12s ease,color .12s ease,border-color .12s ease}
.dts-date-chip:hover{background:var(--dsw-alias-interactive-bg-hover,var(--dsw-alias-bg-layer-2));color:var(--dsw-alias-label-primary)}
.dts-date-chip[data-active="true"]{border-color:transparent;background:var(--dsw-alias-bg-module-platform,#f5f6f7);color:var(--dsw-alias-label-primary)}
.dts-date-body{display:grid;grid-template-columns:minmax(0,1fr) 168px;gap:12px;padding:2px}
.dts-date-body>.dts-calendar-card{order:1}
.dts-date-side{order:2}
.dts-date-side{display:flex;flex-direction:column;gap:8px;min-width:0}
.dts-date-side{order:2}
.dts-date-field{padding:7px 9px;border:1px solid var(--dsw-alias-border-l1);border-radius:10px;
  background:var(--dsw-alias-bg-layer-1);transition:border-color .12s ease}
.dts-date-field-active{border-color:var(--dsw-alias-brand-primary)}
.dts-date-field-label{display:block;margin-bottom:2px;color:var(--dsw-alias-label-secondary);font-size:11px;line-height:16px}
.dts-date-field-value{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px;
  line-height:18px;font-variant-numeric:tabular-nums;color:var(--dsw-alias-label-primary)}
.dts-date-buttons{display:flex;gap:8px;margin-top:auto;padding-top:6px}
.dts-button-ghost{height:32px;padding:0 12px;border:0;border-radius:7px;background:transparent;
  color:var(--dsw-alias-label-primary);font:inherit;font-size:12px;cursor:pointer;transition:background .12s ease}
.dts-button-ghost:hover{background:var(--dsw-alias-interactive-bg-hover,var(--dsw-alias-bg-layer-2))}
.dts-date-buttons .dts-primary{flex:1;height:32px}
.dts-calendar-card{padding:9px;border-radius:12px;background:var(--dsw-alias-bg-module-platform,#f5f6f7);min-width:0}
.dts-calendar-head{display:flex;align-items:center;gap:6px;padding:0 1px 6px}
.dts-calendar-nav{width:24px;height:24px;border:0;border-radius:6px;background:transparent;
  color:var(--dsw-alias-label-secondary);font:inherit;font-size:16px;line-height:1;cursor:pointer}
.dts-calendar-nav:hover{background:var(--dsw-alias-interactive-bg-hover,#2631480f);color:var(--dsw-alias-label-primary)}
.dts-calendar-title{flex:1;text-align:center;font-size:13px;font-weight:600;color:var(--dsw-alias-label-primary)}
.dts-calendar-week{display:grid;grid-template-columns:repeat(7,1fr);gap:2px;margin-bottom:2px}
.dts-calendar-weekday{text-align:center;font-size:10px;line-height:18px;color:var(--dsw-alias-label-secondary)}
.dts-calendar-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:2px}
.dts-calendar-day{height:30px;border:0;border-radius:7px;background:transparent;color:var(--dsw-alias-label-primary);
  font:inherit;font-size:12px;font-variant-numeric:tabular-nums;cursor:pointer}
.dts-calendar-day:hover{background:var(--dsw-alias-interactive-bg-hover,#2631480f)}
.dts-calendar-day[data-month="false"]{opacity:.4;color:var(--dsw-alias-label-secondary);cursor:default;background:transparent}
.dts-calendar-day[data-range="true"]{background:var(--dsw-alias-interactive-bg-hover,#2631480f)}
.dts-calendar-day[data-today="true"]{box-shadow:inset 0 0 0 1px var(--dsw-alias-border-l2)}
.dts-calendar-day[data-selected="true"]{background:var(--dsw-alias-brand-primary);color:#fff;font-weight:600}
.dts-calendar-day[data-selected="true"]:hover{background:var(--dsw-alias-brand-primary)}
.dts-pager{display:flex;flex-wrap:wrap;align-items:center;justify-content:flex-end;gap:8px 12px;padding:10px 10px 0;
  color:var(--dsw-alias-label-secondary);font-size:12px}
.dts-pager-total{white-space:nowrap;font-variant-numeric:tabular-nums}
.dts-pager-nav{display:flex;align-items:center;gap:2px}
.dts-page{min-width:26px;height:26px;padding:0 4px;border:1px solid transparent;border-radius:7px;
  background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:12px;
  font-variant-numeric:tabular-nums;cursor:pointer;
  transition:background .12s ease,border-color .12s ease,color .12s ease}
.dts-page:hover{background:var(--dsw-alias-interactive-bg-hover,var(--dsw-alias-bg-layer-2))}
.dts-page[data-active="true"]{border-color:var(--dsw-alias-brand-primary);color:var(--dsw-alias-brand-primary);font-weight:600}
.dts-page[data-ellipsis="true"]{cursor:default;border-color:transparent;background:transparent;color:var(--dsw-alias-label-secondary)}
.dts-page[data-ellipsis="true"]:hover{background:transparent}
.dts-page-arrow{width:24px;height:26px;border:0;border-radius:6px;background:transparent;
  color:var(--dsw-alias-label-secondary);font:inherit;font-size:16px;line-height:1;cursor:pointer;
  transition:background .12s ease,color .12s ease}
.dts-page-arrow:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover,var(--dsw-alias-bg-layer-2));color:var(--dsw-alias-label-primary)}
.dts-page-arrow:disabled{opacity:.35;cursor:default}
.dts-pager-tools{display:flex;align-items:center;gap:10px}
.dts-select.dts-select-sm{height:26px;min-width:0;padding:0 8px;font-size:11px;gap:8px;border-radius:7px}
.dts-menu.dts-menu-up{top:auto;bottom:calc(100% + 4px)}
.dts-menu.dts-menu-sm{min-width:120px;max-width:160px}
.dts-jump{display:inline-flex;align-items:center;gap:6px;white-space:nowrap}
.dts-jump-input{width:48px;height:26px;padding:0 6px;border:1px solid var(--dsw-alias-border-l1);border-radius:7px;
  background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:inherit;font-size:12px;
  text-align:center;font-variant-numeric:tabular-nums}
.dts-jump-input:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:-1px}
.dts-menu{position:absolute;top:calc(100% + 6px);left:0;z-index:12;min-width:210px;max-width:320px;max-height:280px;
  overflow:auto;padding:6px;border:1px solid var(--dsw-alias-border-l1);border-radius:12px;
  background:var(--dsw-alias-bg-layer-1);box-shadow:0 12px 34px rgba(0,0,0,.2)}
.dts-menu-item{display:flex;align-items:center;gap:10px;width:100%;min-height:34px;padding:7px 10px;border:0;
  border-radius:8px;background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;
  line-height:1.3;text-align:left;cursor:pointer}
.dts-menu-item:hover{background:var(--dsw-alias-interactive-bg-hover,var(--dsw-alias-bg-layer-2))}
.dts-menu-item:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:-2px}
.dts-menu-item[data-active="true"]{color:var(--dsw-alias-label-primary)}
.dts-menu-label{flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dts-menu-check{display:inline-flex;flex:0 0 auto}
.dts-total{margin-left:auto;color:var(--dsw-alias-label-secondary);font-size:12px;white-space:nowrap;font-variant-numeric:tabular-nums}
.dts-body{display:flex;flex-direction:column;gap:2px}
.dts-row{display:flex;align-items:center;gap:10px;width:100%;padding:8px 10px;border:0;border-radius:8px;
  background:transparent;color:inherit;font:inherit;text-align:left;cursor:pointer;transition:background .12s ease}
.dts-row:hover{background:var(--dsw-alias-interactive-bg-hover,var(--dsw-alias-bg-layer-2))}
.dts-row:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:-2px}
.dts-date{flex:0 0 84px;font-variant-numeric:tabular-nums}
.dts-weekday{flex:0 0 30px;color:var(--dsw-alias-label-secondary);font-size:12px}
.dts-bar{flex:1 1 auto;min-width:40px;height:6px;border-radius:3px;background:var(--dsw-alias-bg-layer-2);overflow:hidden}
.dts-bar-fill{display:block;height:100%;border-radius:3px;background:var(--dsw-alias-brand-primary);opacity:.8}
.dts-metric{flex:0 0 auto;font-variant-numeric:tabular-nums;white-space:nowrap}
.dts-muted{color:var(--dsw-alias-label-secondary)}
.dts-chevron{flex:0 0 14px;color:var(--dsw-alias-label-secondary);transition:transform .12s ease}
.dts-row[data-expanded="true"] .dts-chevron{transform:rotate(90deg)}
.dts-detail{padding:0 8px 8px 32px}
.dts-session{display:flex;align-items:center;gap:10px;width:100%;padding:7px 10px;border:0;border-radius:8px;
  background:transparent;color:inherit;font:inherit;text-align:left;cursor:pointer;transition:background .12s ease}
.dts-session:hover{background:var(--dsw-alias-interactive-bg-hover,var(--dsw-alias-bg-layer-2))}
.dts-session:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:-2px}
.dts-session-title{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dts-session-dir{flex:0 0 auto;max-width:90px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
  color:var(--dsw-alias-label-secondary);font-size:12px}
.dts-session-total{flex:0 0 auto;font-variant-numeric:tabular-nums;white-space:nowrap}
.dts-session-cost{flex:0 0 auto;min-width:58px;text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}
.dts-badge{flex:0 0 auto;padding:0 5px;border:1px solid var(--dsw-alias-border-l1);border-radius:4px;
  color:var(--dsw-alias-label-secondary);font-size:10px;line-height:15px;white-space:nowrap}
.dts-child-line{display:flex;align-items:center;gap:8px;padding:1px 0;color:var(--dsw-alias-label-secondary);font-size:12px}
.dts-child-line .dts-session-title{color:var(--dsw-alias-label-secondary)}
.dts-child-num{margin-left:auto;font-variant-numeric:tabular-nums;color:var(--dsw-alias-label-primary)}
.dts-model-line{display:flex;align-items:center;gap:8px;padding:1px 0;font-size:12px;color:var(--dsw-alias-label-secondary)}
.dts-model-line b{color:var(--dsw-alias-label-primary);font-weight:500}
.dts-empty{padding:34px 8px;text-align:center;color:var(--dsw-alias-label-secondary)}
.dts-error{padding:22px 8px;text-align:center;color:var(--dsw-alias-state-error-primary)}
.dts-retry{margin-top:10px;padding:5px 14px;border:1px solid var(--dsw-alias-border-l1);border-radius:7px;
  background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:inherit;font-size:12px;cursor:pointer;
  transition:background .12s ease,border-color .12s ease}
.dts-retry:hover{background:var(--dsw-alias-interactive-bg-hover,var(--dsw-alias-bg-layer-2));border-color:var(--dsw-alias-border-l2)}
.dts-foot{display:flex;flex-wrap:wrap;gap:4px 14px;padding-top:8px;border-top:1px solid var(--dsw-alias-border-l1);
  color:var(--dsw-alias-label-secondary);font-size:12px;font-variant-numeric:tabular-nums}
.dts-foot b{color:var(--dsw-alias-label-primary);font-weight:600}
.dts-note{color:var(--dsw-alias-label-secondary);font-size:11px}
.dts-price-intro{color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px}
.dts-card{padding:10px 12px;border:1px solid var(--dsw-alias-border-l1);border-radius:10px;background:var(--dsw-alias-bg-layer-1)}
.dts-card-head{display:flex;align-items:center;gap:8px;margin-bottom:6px}
.dts-card-title{font-weight:600;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dts-card-remove{margin-left:auto;border:0;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;
  font-size:12px;cursor:pointer;padding:2px 6px;border-radius:6px}
.dts-card-remove:hover{background:var(--dsw-alias-interactive-bg-hover,var(--dsw-alias-bg-layer-2));color:var(--dsw-alias-state-error-primary)}
.dts-rate-head,.dts-rate-row{display:grid;grid-template-columns:58px minmax(0,1fr) minmax(0,1fr) minmax(0,1fr);gap:8px;align-items:center}
.dts-rate-head{color:var(--dsw-alias-label-secondary);font-size:11px;margin-bottom:4px}
.dts-rate-row + .dts-rate-row{margin-top:6px}
.dts-rate-label{font-size:12px;color:var(--dsw-alias-label-secondary)}
.dts-input{width:100%;height:28px;padding:0 8px;border:1px solid var(--dsw-alias-border-l1);border-radius:6px;
  background:var(--dsw-alias-bg-overlay);color:var(--dsw-alias-label-primary);font:inherit;font-size:12px;
  font-variant-numeric:tabular-nums}
.dts-input:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:-1px}
.dts-holidays{width:100%;margin-top:6px}
.dts-add{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.dts-add .dts-input{flex:1 1 160px;width:auto}
.dts-add select{height:28px;padding:0 8px;border:1px solid var(--dsw-alias-border-l1);border-radius:6px;
  background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:inherit;font-size:12px}
.dts-actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap;padding-top:4px}
.dts-primary{height:28px;padding:0 14px;border:0;border-radius:7px;background:var(--dsw-alias-brand-primary);
  color:#fff;font:inherit;font-size:12px;cursor:pointer;transition:filter .12s ease,opacity .12s ease}
.dts-primary:hover:not(:disabled){filter:brightness(1.08)}
.dts-primary:active:not(:disabled){filter:brightness(.95)}
.dts-primary:disabled{opacity:.5;cursor:default}
.dts-status{font-size:12px}
.dts-ok{color:var(--dsw-alias-state-success-primary)}
.dts-bad{color:var(--dsw-alias-state-error-primary)}
.dts-field-label{display:block;font-size:11px;color:var(--dsw-alias-label-secondary);margin-bottom:2px}
.dts-heat{position:relative;display:flex;flex-direction:column;gap:8px}
.dts-heat-summary{color:var(--dsw-alias-label-secondary);font-size:11px;font-variant-numeric:tabular-nums}
.dts-heat-body{display:flex;align-items:flex-start;gap:6px;min-width:0}
.dts-heat-side{flex:0 0 28px;display:flex;flex-direction:column;gap:3px}
.dts-heat-side-spacer{height:16px}
.dts-heat-scroll{flex:1 1 auto;min-width:0;overflow-x:auto;padding-bottom:4px}
.dts-heat-track{display:flex;flex-direction:column;gap:3px;min-width:max-content}
.dts-heat-months{display:grid;gap:3px;align-items:end;height:16px}
.dts-heat-month{overflow:visible;font-size:10px;line-height:16px;color:var(--dsw-alias-label-secondary);white-space:nowrap}
.dts-heat-weekdays{display:grid;grid-template-rows:repeat(7,12px);gap:3px}
.dts-heat-weekday{display:flex;align-items:center;overflow:hidden;font-size:10px;line-height:1;
  color:var(--dsw-alias-label-secondary);white-space:nowrap}
.dts-heat-weeks{display:grid;gap:3px}
.dts-heat-week{display:grid;grid-template-rows:repeat(7,12px);gap:3px}
.dts-heat-cell{display:block;position:relative;width:12px;height:12px;border-radius:2px;
  background:var(--dsw-alias-bg-module-platform,#f5f6f7);transition:transform .1s ease,box-shadow .1s ease}
.dts-heat-cell[data-level="1"]{background:var(--dsw-alias-brand-primary);opacity:.22}
.dts-heat-cell[data-level="2"]{background:var(--dsw-alias-brand-primary);opacity:.42}
.dts-heat-cell[data-level="3"]{background:var(--dsw-alias-brand-primary);opacity:.64}
.dts-heat-cell[data-level="4"]{background:var(--dsw-alias-brand-primary);opacity:.88}
.dts-heat-cell[data-empty="true"]{background:transparent}
.dts-heat-cell:hover{transform:scale(1.5);box-shadow:0 3px 10px rgba(0,0,0,.22);z-index:4}
.dts-heat-legend{display:flex;align-items:center;gap:4px;justify-content:flex-end;color:var(--dsw-alias-label-secondary);font-size:10px}
.dts-heat-legend .dts-heat-cell{width:10px;height:10px}
.dts-heat-legend .dts-heat-cell:hover{transform:none;box-shadow:none}
.dts-tip.dts-tip-heat{transform:translate(-50%,-100%);z-index:20}

@media (max-width:760px){
  .dts-weekday{display:none}
  .dts-session-dir{display:none}
}
`

    function barsIcon(size) {
      return h('svg', {
        width: size, height: size, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true,
      }, h('rect', { x: 2, y: 8, width: 3, height: 6, rx: 1, fill: 'currentColor' }),
        h('rect', { x: 6.5, y: 5, width: 3, height: 9, rx: 1, fill: 'currentColor' }),
        h('rect', { x: 11, y: 2, width: 3, height: 12, rx: 1, fill: 'currentColor' }))
    }

    const ICON = barsIcon(16)

    const REFRESH_ICON = h('svg', {
      width: 13, height: 13, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true,
    }, h('path', { d: 'M13 8a5 5 0 1 1-1.6-3.7', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' }),
      h('path', { d: 'M13 2.6v3.2H9.8', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }))

    const CHEVRON_DOWN_ICON = h('svg', {
      width: 12, height: 12, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true,
    }, h('path', { d: 'M4 6l4 4 4-4', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }))

    const CHECK_ICON = h('svg', {
      width: 12, height: 12, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true,
    }, h('path', { d: 'M3.5 8.5l3 3 6-7', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }))

    const CHEVRON_ICON = h('svg', {
      width: 12, height: 12, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true,
    }, h('path', { d: 'M6 3l5 5-5 5', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }))

    function zero() {
      return { uncachedInputTokens: 0, outputTokens: 0, cacheReadTokens: 0, cacheWriteTokens: 0, totalTokens: 0 }
    }

    function addTotals(target, source) {
      if (source === undefined || source === null) return target
      for (const key of BUCKET_KEYS) target[key] += source[key] === undefined ? 0 : source[key]
      target.totalTokens += source.totalTokens === undefined ? 0 : source.totalTokens
      return target
    }

    function sumTotals(list, pick) {
      const total = zero()
      for (const item of list) addTotals(total, pick === undefined ? item.totals : pick(item))
      return total
    }

    function compact(value) {
      const number = typeof value === 'number' ? value : 0
      const abs = Math.abs(number)
      if (abs >= 1e9) return trim(number / 1e9) + 'B'
      if (abs >= 1e6) return trim(number / 1e6) + 'M'
      if (abs >= 1e4) return trim(number / 1e3) + 'K'
      return number.toLocaleString('en-US')
    }

    function trim(value) {
      const abs = Math.abs(value)
      if (abs >= 100) return value.toFixed(0)
      if (abs >= 10) return value.toFixed(1)
      return value.toFixed(2)
    }

    function exact(value) {
      return (typeof value === 'number' ? value : 0).toLocaleString('en-US')
    }

    function money(value, currency) {
      const symbol = currency === 'USD' ? '$' : '¥'
      const amount = typeof value === 'number' && Number.isFinite(value) ? value : 0
      if (amount === 0) return symbol + '0.00'
      if (amount >= 1) return symbol + amount.toFixed(2)
      if (amount >= 0.01) return symbol + amount.toFixed(3)
      return symbol + amount.toFixed(4)
    }

    function costOf(value) {
      return value !== null && value !== undefined && typeof value.cost === 'object' && value.cost !== null
        ? value.cost.total
        : 0
    }

    function cacheHit(totals) {
      const prompt = totals.uncachedInputTokens + totals.cacheReadTokens + totals.cacheWriteTokens
      if (prompt <= 0) return null
      return (totals.cacheReadTokens / prompt) * 100
    }

    function percent(value) {
      if (value === null) return '—'
      if (value >= 99.95) return '99.9%'
      return value.toFixed(1) + '%'
    }

    function dayLabel(date) {
      return date.slice(5).replace('-', '/')
    }

    function weekday(date) {
      const parsed = new Date(date + 'T00:00:00')
      if (Number.isNaN(parsed.getTime())) return ''
      return ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][parsed.getDay()]
    }

    function dirName(cwd) {
      if (typeof cwd !== 'string' || cwd === '') return ''
      const parts = cwd.split(/[\\/]/)
      return parts[parts.length - 1] === '' ? parts[parts.length - 2] : parts[parts.length - 1]
    }

    function timeZone() {
      try {
        const zone = Intl.DateTimeFormat().resolvedOptions().timeZone
        return typeof zone === 'string' && zone !== '' ? zone : 'Asia/Shanghai'
      } catch {
        return 'Asia/Shanghai'
      }
    }

    function apiOrigin() {
      try {
        if (typeof location !== 'undefined') {
          if (location.protocol === 'http:' || location.protocol === 'https:') return location.origin
          // Desktop serves the page from the application scheme, whose protocol
          // handler forwards every non-static path to the Host with its own cookie.
          // A relative request therefore stays same-origin and needs no CORS.
          if (location.protocol !== 'file:') return ''
        }
      } catch {
        /* fall through to the advertised transport origin */
      }
      const transport = globalThis.__DSH_TRANSPORT__
      if (transport !== undefined && transport !== null && typeof transport.streamBaseUrl === 'string') {
        return new URL(transport.streamBaseUrl).origin
      }
      return ''
    }

    async function fetchStats(zone, refresh) {
      const suffix = '?tz=' + encodeURIComponent(zone) + (refresh ? '&refresh=1' : '')
      const response = await fetch(apiOrigin() + '/dsh-token-stats' + suffix, {
        headers: { accept: 'application/json' },
      })
      if (!response.ok) throw new Error('HTTP ' + response.status)
      const payload = await response.json()
      if (payload !== null && typeof payload === 'object' && typeof payload.error === 'string') {
        throw new Error(payload.error)
      }
      return payload
    }

    async function postPricing(table) {
      const response = await fetch(apiOrigin() + '/dsh-token-stats/prices', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(table),
      })
      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(payload !== null && typeof payload === 'object' && typeof payload.error === 'string'
          ? payload.error
          : 'HTTP ' + response.status)
      }
      return payload
    }

    function useStatsData() {
      const [state, setState] = React.useState({ status: 'idle', data: undefined, error: undefined })
      const requestId = React.useRef(0)
      const load = React.useCallback(async (refresh) => {
        requestId.current += 1
        const current = requestId.current
        setState(previous => ({ ...previous, status: 'loading', error: undefined }))
        try {
          const payload = await fetchStats(timeZone(), refresh)
          if (current !== requestId.current) return
          setState({ status: 'ready', data: payload, error: undefined })
        } catch (error) {
          if (current !== requestId.current) return
          const message = error === null || error === undefined ? '' : String(error.message === undefined ? error : error.message)
          setState(previous => ({ ...previous, status: 'error', error: message }))
        }
      }, [])
      React.useEffect(() => { void load(false) }, [load])
      return { state, reload: load }
    }

    function todayKey(zone) {
      try {
        const formatter = new Intl.DateTimeFormat('en-CA', {
          timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit',
        })
        const parts = formatter.formatToParts(new Date())
        let year = ''
        let month = ''
        let day = ''
        for (const part of parts) {
          if (part.type === 'year') year = part.value
          else if (part.type === 'month') month = part.value
          else if (part.type === 'day') day = part.value
        }
        if (year !== '' && month !== '' && day !== '') return `${year}-${month}-${day}`
      } catch {
        /* fall back to the browser date */
      }
      return new Date().toISOString().slice(0, 10)
    }

    function shiftDay(date, delta) {
      const parts = date.split('-').map(Number)
      if (parts.length !== 3 || parts.some(part => Number.isNaN(part))) return date
      const stamp = Date.UTC(parts[0], parts[1] - 1, parts[2]) + delta * 86400000
      const shifted = new Date(stamp)
      const pad = value => String(value).padStart(2, '0')
      return `${shifted.getUTCFullYear()}-${pad(shifted.getUTCMonth() + 1)}-${pad(shifted.getUTCDate())}`
    }

    function filterSessionByRange(session, from, to) {
      const days = {}
      const totals = zero()
      const cost = { total: 0, hit: 0, miss: 0, out: 0 }
      let requests = 0
      let any = false
      for (const [date, buckets] of Object.entries(session.days)) {
        if (from !== '' && date < from) continue
        if (to !== '' && date > to) continue
        any = true
        days[date] = buckets
        addTotals(totals, buckets)
        const split = buckets.cost
        if (split !== undefined && split !== null) {
          cost.total += split.total
          cost.hit += split.hit
          cost.miss += split.miss
          cost.out += split.out
        }
        requests += typeof buckets.requests === 'number' ? buckets.requests : 0
      }
      if (!any) return undefined
      return { ...session, days, totals, cost, requests, byModel: [] }
    }

    function KpiCards(props) {
      const stats = props.stats
      const hit = stats === undefined ? null : cacheHit(stats.totals)
      const labels = props.rangeActive === true
        ? {
          cost: props.t('rangeCost'),
          requests: props.t('rangeRequests'),
          tokens: props.t('rangeTokens'),
          hit: props.t('rangeCacheHit'),
        }
        : {
          cost: props.t('todayCost'),
          requests: props.t('todayRequests'),
          tokens: props.t('todayTokens'),
          hit: props.t('todayCacheHit'),
        }
      const card = (label, value) => h('div', { className: 'dts-card-kpi', key: label },
        h('div', { className: 'dts-kpi-label' }, label),
        h('div', { className: 'dts-kpi-value' }, value))
      return h('div', { className: 'dts-cards' },
        props.showCost ? card(labels.cost, stats === undefined ? props.t('none') : money(stats.cost, props.currency)) : null,
        card(labels.requests, stats === undefined ? props.t('none') : exact(stats.requests)),
        card(labels.tokens, stats === undefined ? '0' : compact(stats.totals.totalTokens)),
        card(labels.hit, stats === undefined ? props.t('none') : (hit === null ? props.t('none') : percent(hit))))
    }

    function TrendChart(props) {
      const [hover, setHover] = React.useState(-1)
      const items = props.days.slice().sort((left, right) => left.date.localeCompare(right.date)).slice(-30)
      if (items.length === 0) return null
      const maxTokens = items.reduce((max, day) => Math.max(max, day.totals.totalTokens), 1)
      const maxCost = items.reduce((max, day) => Math.max(max, day.cost), 0.000001)
      const width = 600
      const height = 170
      const left = 12
      const right = 12
      const top = 14
      const bottom = 26
      const plotWidth = width - left - right
      const plotHeight = height - top - bottom
      const step = plotWidth / items.length
      const barWidth = Math.max(3, Math.min(22, step * 0.55))
      const labelEvery = Math.max(1, Math.ceil(items.length / 10))
      const currency = props.currency
      const showCost = props.showCost === true
      const hovered = hover >= 0 && hover < items.length ? items[hover] : undefined
      const hoverCenter = hovered === undefined ? 0 : left + hover * step + step / 2
      const grid = [0.25, 0.5, 0.75].map((share, index) => h('line', {
        key: 'g' + String(index),
        x1: left, x2: width - right,
        y1: top + plotHeight * (1 - share), y2: top + plotHeight * (1 - share),
        stroke: 'var(--dsw-alias-border-l1)', strokeWidth: 1, strokeDasharray: '3 4',
      }))
      const hoverBand = hovered === undefined ? null : h('rect', {
        x: left + hover * step,
        y: top,
        width: step,
        height: plotHeight,
        rx: 4,
        fill: 'var(--dsw-alias-interactive-bg-hover, var(--dsw-alias-bg-layer-2))',
        opacity: 0.55,
        style: { pointerEvents: 'none' },
      })
      const guide = hovered === undefined ? null : h('line', {
        x1: hoverCenter, x2: hoverCenter, y1: top, y2: top + plotHeight,
        stroke: 'var(--dsw-alias-border-l2)', strokeWidth: 1, strokeDasharray: '2 3',
      })
      const bars = items.map((day, index) => {
        const barHeight = Math.max(1, (day.totals.totalTokens / maxTokens) * plotHeight)
        return h('rect', {
          key: 'b' + day.date,
          x: left + index * step + (step - barWidth) / 2,
          y: top + plotHeight - barHeight,
          width: barWidth,
          height: barHeight,
          rx: 3,
          fill: 'var(--dsw-alias-brand-primary)',
          opacity: hover === index ? 1 : hover >= 0 ? 0.45 : 0.72,
        })
      })
      const points = items.map((day, index) => [
        left + index * step + step / 2,
        top + plotHeight - (day.cost / maxCost) * plotHeight,
      ])
      const line = points.map(point => point[0].toFixed(1) + ',' + point[1].toFixed(1)).join(' ')
      const dots = showCost ? points.map((point, index) => h('circle', {
        key: 'c' + items[index].date,
        cx: point[0], cy: point[1], r: hover === index ? 4.5 : 3,
        fill: 'var(--dsw-alias-state-warn-primary)',
      })) : null
      const labels = items.map((day, index) => (index % labelEvery === 0 || index === items.length - 1)
        ? h('text', {
          key: 'l' + day.date,
          x: left + index * step + step / 2,
          y: height - 8,
          textAnchor: 'middle',
          fontSize: 10,
          fill: 'var(--dsw-alias-label-secondary)',
        }, dayLabel(day.date))
        : null)
      const hitAreas = items.map((day, index) => h('rect', {
        key: 'h' + day.date,
        x: left + index * step,
        y: top,
        width: step,
        height: plotHeight,
        fill: 'transparent',
        style: { pointerEvents: 'all', cursor: 'default' },
        onMouseEnter: () => { setHover(index) },
        onMouseLeave: () => { setHover(current => (current === index ? -1 : current)) },
      }))
      const tooltip = hovered === undefined ? null : h(UsageTip, {
        t: props.t,
        title: hovered.date,
        totals: hovered.totals,
        cost: hovered.cost,
        currency,
        showCost,
        style: { left: Math.min(88, Math.max(12, (hoverCenter / width) * 100)) + '%' },
      })
      return h('div', { className: 'dts-block dts-trend' },
        h('div', { className: 'dts-block-head' },
          h('span', { className: 'dts-block-title' }, props.t('trendTitle')),
          h('span', { className: 'dts-legend' },
            h('span', { className: 'dts-legend-item' },
              h('span', { className: 'dts-legend-bar' }), props.t('legendTokens')),
            showCost
              ? h('span', { className: 'dts-legend-item' },
                h('span', { className: 'dts-legend-dot' }), props.t('legendCost'))
              : null)),
        h('div', { className: 'dts-chart' },
          tooltip,
          h('svg', {
            viewBox: `0 0 ${width} ${height}`,
            width: '100%',
            height: String(height),
            role: 'img',
            'aria-label': props.t('trendTitle'),
            onMouseLeave: () => { setHover(-1) },
          },
          grid,
          hoverBand,
          guide,
          bars,
          showCost && items.length > 1
            ? h('polyline', {
              points: line,
              fill: 'none',
              stroke: 'var(--dsw-alias-state-warn-primary)',
              strokeWidth: 1.8,
              strokeLinejoin: 'round',
              strokeLinecap: 'round',
            })
            : null,
          dots,
          labels,
          h('text', {
            x: left, y: top - 2, fontSize: 9, fill: 'var(--dsw-alias-brand-primary)',
          }, compact(maxTokens)),
          showCost
            ? h('text', {
              x: width - right, y: top - 2, textAnchor: 'end', fontSize: 9,
              fill: 'var(--dsw-alias-state-warn-primary)',
            }, money(maxCost, currency))
            : null,
          hitAreas)))
    }

    function BucketsRow(props) {
      const totals = props.totals
      const hit = cacheHit(totals)
      const unpriced = props.unpriced === undefined ? 0 : props.unpriced
      return h('div', { className: 'dts-foot' },
        props.showCost === true
          ? h('span', null, props.t('cost'), ' ', h('b', null, money(props.cost, props.currency)))
          : null,
        h('span', null, props.t('total'), ' ', h('b', null, compact(totals.totalTokens))),
        h('span', null, props.t('input'), ' ', h('b', null, compact(totals.uncachedInputTokens))),
        h('span', null, props.t('cacheRead'), ' ', h('b', null, compact(totals.cacheReadTokens))),
        h('span', null, props.t('output'), ' ', h('b', null, compact(totals.outputTokens))),
        h('span', null, props.t('cacheHit'), ' ', h('b', null, hit === null ? props.t('none') : percent(hit))),
        unpriced > 0 ? h('span', { className: 'dts-note' }, props.t('unpriced', { tokens: compact(unpriced) })) : null,
        h('span', { className: 'dts-note' }, props.t('costHint')))
    }

    function SessionDetail(props) {
      const session = props.session
      const children = props.children
      const date = props.date
      const currency = props.currency
      const showCost = props.showCost === true
      const rows = []
      if (date !== undefined) {
        const buckets = session.days[date]
        rows.push(h('div', { className: 'dts-child-line', key: 'buckets' },
          h('span', null,
            (showCost ? props.t('own') + ' ' + money(costOf(buckets), currency) + ' · ' : props.t('own') + ' · ') +
            props.t('input') + ' ' + compact(buckets.uncachedInputTokens) + ' · ' +
            props.t('cacheRead') + ' ' + compact(buckets.cacheReadTokens) + ' · ' +
            props.t('output') + ' ' + compact(buckets.outputTokens))))
      } else {
        rows.push(h('div', { className: 'dts-child-line', key: 'own' },
          h('span', null, props.t('own') +
            (showCost ? ' ' + money(session.cost === undefined ? 0 : session.cost.total, currency) + ' · ' : ' · ') +
            props.t('total') + ' ' + compact(session.totals.totalTokens))))
        if (showCost && session.cost !== undefined) {
          rows.push(h('div', { className: 'dts-child-line', key: 'cost' },
            h('span', null, props.t('costBreakdown', {
              hit: money(session.cost.hit, currency),
              miss: money(session.cost.miss, currency),
              out: money(session.cost.out, currency),
            }))))
        }
        const days = Object.keys(session.days).sort().reverse()
        for (const day of days) {
          const buckets = session.days[day]
          rows.push(h('div', { className: 'dts-child-line', key: day },
            h('span', { style: { minWidth: '52px', fontVariantNumeric: 'tabular-nums' } }, dayLabel(day)),
            h('span', { style: { flex: '1 1 auto' } },
              props.t('input') + ' ' + compact(buckets.uncachedInputTokens) + ' · ' +
              props.t('cacheRead') + ' ' + compact(buckets.cacheReadTokens) + ' · ' +
              props.t('output') + ' ' + compact(buckets.outputTokens)),
            h('span', { className: 'dts-child-num' },
              compact(buckets.totalTokens) + (showCost ? '  ' + money(costOf(buckets), currency) : ''))))
        }
        if (showCost && Array.isArray(session.byModel) && session.byModel.length > 0) {
          for (const model of session.byModel) {
            rows.push(h('div', { className: 'dts-model-line', key: 'model:' + model.model },
              h('span', null, props.t('byModel') + ':'),
              h('b', null, model.model),
              h('span', null, compact(model.totalTokens)),
              h('span', { className: 'dts-child-num' }, money(model.cost === undefined ? 0 : model.cost.total, currency))))
          }
        }
      }
      for (const child of children) {
        const childValue = props.valueOf(child)
        if (childValue === undefined) continue
        rows.push(h('div', { className: 'dts-child-line', key: child.id },
          h('span', { className: 'dts-badge' }, props.t('subagent')),
          h('span', { className: 'dts-session-title' }, child.title),
          h('span', { className: 'dts-child-num' },
            compact(childValue.totalTokens) + (showCost ? '  ' + money(props.costOf(child), currency) : ''))))
      }
      return h('div', { className: 'dts-detail' }, rows)
    }

    function SessionRow(props) {
      const session = props.session
      const value = props.valueOf(session)
      if (value === undefined) return null
      const showCost = props.showCost === true
      const children = props.children
      const expanded = props.expanded === true
      const rollup = children.length === 0 ? undefined : sumTotals([session].concat(children), props.valueOf)
      const shown = rollup === undefined ? value.totalTokens : rollup.totalTokens
      const hint = rollup === undefined
        ? undefined
        : props.t('own') + ' ' + compact(value.totalTokens) + ' · ' + props.t('withChildren') + ' ' + compact(rollup.totalTokens)
      const costOfSession = (item) => props.date === undefined
        ? (item.cost === undefined ? 0 : item.cost.total)
        : costOf(item.days[props.date])
      const ownCost = costOfSession(session)
      const shownCost = rollup === undefined
        ? ownCost
        : ownCost + children.reduce((sum, child) => sum + costOfSession(child), 0)
      return h('div', null,
        h('button', {
          type: 'button',
          className: 'dts-session',
          'data-expanded': expanded ? 'true' : 'false',
          'aria-expanded': expanded,
          onClick: props.onToggle,
        },
        h('span', { className: 'dts-chevron' }, CHEVRON_ICON),
        h('span', { className: 'dts-session-title', title: session.title }, session.title),
        session.origin === 'subagent' ? h('span', { className: 'dts-badge' }, props.t('subagent')) : null,
        h('span', { className: 'dts-session-dir', title: session.cwd === undefined ? '' : session.cwd },
          dirName(session.cwd)),
        h('span', { className: 'dts-session-total', title: hint }, compact(shown)),
        showCost ? h('span', { className: 'dts-session-cost', title: props.t('costHint') }, money(shownCost, props.currency)) : null,
        children.length === 0 ? null : h('span', { className: 'dts-badge' }, props.t('children', { count: children.length }))),
        expanded ? h(SessionDetail, {
          t: props.t,
          session,
          children,
          date: props.date,
          currency: props.currency,
          showCost,
          costOf: costOfSession,
          valueOf: props.valueOf,
        }) : null)
    }

    function groupSessions(list) {
      const byId = new Map()
      for (const session of list) byId.set(session.id, session)
      const children = new Map()
      const roots = []
      for (const session of list) {
        const parent = session.parentSession
        if (parent !== undefined && parent !== null && byId.has(parent)) {
          const bucket = children.get(parent)
          if (bucket === undefined) children.set(parent, [session])
          else bucket.push(session)
        } else {
          roots.push(session)
        }
      }
      for (const bucket of children.values()) bucket.sort((left, right) => right.totals.totalTokens - left.totals.totalTokens)
      return { roots, children }
    }

    function SectionIcon(props) {
      const size = typeof props.size === 'number' ? props.size : 16
      return barsIcon(size)
    }

    function ScopeSelect(props) {
      const [open, setOpen] = React.useState(false)
      const wrap = React.useRef(null)
      React.useEffect(() => {
        if (!open) return undefined
        const onDown = (event) => {
          if (wrap.current !== null && !wrap.current.contains(event.target)) setOpen(false)
        }
        const onKey = (event) => {
          if (event.key === 'Escape') setOpen(false)
        }
        document.addEventListener('mousedown', onDown)
        document.addEventListener('keydown', onKey)
        return () => {
          document.removeEventListener('mousedown', onDown)
          document.removeEventListener('keydown', onKey)
        }
      }, [open])
      const options = [{ value: '', label: props.allLabel, title: props.allLabel }].concat(
        props.directories.map(directory => ({ value: directory, label: dirName(directory), title: directory })))
      const current = options.find(option => option.value === props.value) || options[0]
      return h('div', { className: 'dts-select-wrap', ref: wrap },
        h('button', {
          type: 'button',
          className: 'dts-select',
          title: current.title,
          'aria-haspopup': 'listbox',
          'aria-expanded': open,
          onClick: () => { setOpen(value => !value) },
        },
        h('span', { className: 'dts-select-label' }, current.label),
        h('span', { className: open ? 'dts-select-chevron dts-select-chevron-open' : 'dts-select-chevron' },
          CHEVRON_DOWN_ICON)),
        open
          ? h('div', { className: 'dts-menu', role: 'listbox' },
            options.map(option => h('button', {
              key: option.value === '' ? '__all__' : option.value,
              type: 'button',
              role: 'option',
              'aria-selected': option.value === props.value,
              'data-active': option.value === props.value ? 'true' : 'false',
              className: 'dts-menu-item',
              title: option.title,
              onClick: () => { setOpen(false); props.onChange(option.value) },
            },
            h('span', { className: 'dts-menu-label' }, option.label),
            option.value === props.value ? h('span', { className: 'dts-menu-check' }, CHECK_ICON) : null)))
          : null)
    }

    function fullDate(date) {
      return date.replaceAll('-', '/')
    }

    function Calendar(props) {
      const [cursor, setCursor] = React.useState(() => {
        const base = props.from !== '' ? props.from : props.to !== '' ? props.to : props.today
        return base !== '' ? base.slice(0, 7) : new Date().toISOString().slice(0, 7)
      })
      const parts = cursor.split('-').map(Number)
      const year = parts[0]
      const month = parts[1]
      const firstDay = new Date(Date.UTC(year, month - 1, 1))
      const start = shiftDay(`${cursor}-01`, -firstDay.getUTCDay())
      const cells = []
      for (let index = 0; index < 42; index += 1) {
        const day = shiftDay(start, index)
        cells.push({
          day,
          inMonth: day.slice(0, 7) === cursor,
          selected: day === props.from || day === props.to,
          inRange: props.from !== '' && props.to !== '' && day > props.from && day < props.to,
          today: day === props.today,
        })
      }
      const shiftMonth = (delta) => {
        const stamp = new Date(Date.UTC(year, month - 1 + delta, 1))
        setCursor(`${stamp.getUTCFullYear()}-${String(stamp.getUTCMonth() + 1).padStart(2, '0')}`)
      }
      return h('div', { className: 'dts-calendar-card' },
        h('div', { className: 'dts-calendar-head' },
          h('button', {
            type: 'button',
            className: 'dts-calendar-nav',
            'aria-label': props.t('prevMonth'),
            onClick: () => { shiftMonth(-1) },
          }, '‹'),
          h('span', { className: 'dts-calendar-title' }, props.t('monthLabel', { year, month })),
          h('button', {
            type: 'button',
            className: 'dts-calendar-nav',
            'aria-label': props.t('nextMonth'),
            onClick: () => { shiftMonth(1) },
          }, '›')),
        h('div', { className: 'dts-calendar-week' },
          props.t('weekdays').split(' ').map((label, index) => h('span', {
            key: label + String(index),
            className: 'dts-calendar-weekday',
          }, label))),
        h('div', { className: 'dts-calendar-grid' }, cells.map(cell => h('button', {
          key: cell.day,
          type: 'button',
          className: 'dts-calendar-day',
          disabled: !cell.inMonth,
          'data-month': cell.inMonth ? 'true' : 'false',
          'data-selected': cell.selected ? 'true' : 'false',
          'data-range': cell.inRange ? 'true' : 'false',
          'data-today': cell.today ? 'true' : 'false',
          onClick: () => { if (cell.inMonth) props.onPick(cell.day) },
        }, String(Number(cell.day.slice(8)))))))
    }

    function DateRangeSelect(props) {
      const [open, setOpen] = React.useState(false)
      const [anchor, setAnchor] = React.useState(null)
      const [from, setFrom] = React.useState(props.range.from)
      const [to, setTo] = React.useState(props.range.to)
      const wrap = React.useRef(null)
      const menu = React.useRef(null)
      React.useEffect(() => {
        if (!open) return undefined
        setFrom(props.range.from)
        setTo(props.range.to)
        const onDown = (event) => {
          const target = event.target
          if (wrap.current !== null && wrap.current.contains(target)) return
          if (menu.current !== null && menu.current.contains(target)) return
          setOpen(false)
        }
        const onKey = (event) => {
          if (event.key === 'Escape') setOpen(false)
        }
        document.addEventListener('mousedown', onDown)
        document.addEventListener('keydown', onKey)
        return () => {
          document.removeEventListener('mousedown', onDown)
          document.removeEventListener('keydown', onKey)
        }
      }, [open])
      const range = props.range
      const label = range.from !== '' && range.to !== '' && range.from === range.to && range.from === props.today
        ? props.t('today')
        : range.from !== '' && range.to !== ''
        ? dayLabel(range.from) + ' ~ ' + dayLabel(range.to)
        : range.from !== ''
          ? '≥ ' + dayLabel(range.from)
          : range.to !== ''
            ? '≤ ' + dayLabel(range.to)
            : props.t('allDates')
      const active = props.presets.find(preset => preset.from === range.from && preset.to === range.to)
      const pick = (day) => {
        if (from === '' || to !== '') {
          setFrom(day)
          setTo('')
        } else if (day < from) {
          setFrom(day)
          setTo('')
        } else {
          setTo(day)
        }
      }
      const confirm = () => {
        if (from !== '' && to !== '' && from > to) props.onChange({ from: to, to: from })
        else props.onChange({ from, to })
        setOpen(false)
      }
      const toggle = () => {
        if (open) {
          setOpen(false)
          return
        }
        const rect = wrap.current === null ? undefined : wrap.current.getBoundingClientRect()
        if (rect === undefined || rect === null) {
          setOpen(true)
          return
        }
        const width = Math.min(480, Math.max(320, window.innerWidth - 24))
        setAnchor({
          width,
          right: Math.max(12, Math.min(window.innerWidth - rect.right, window.innerWidth - width - 12)),
          ...(rect.top > 420
            ? { bottom: Math.max(12, window.innerHeight - rect.top + 6) }
            : { top: Math.min(rect.bottom + 6, window.innerHeight - 80) }),
        })
        setOpen(true)
      }
      const placement = anchor === null
        ? {}
        : anchor.bottom !== undefined
          ? { top: 'auto', bottom: anchor.bottom }
          : { top: anchor.top, bottom: 'auto' }
      const menuNode = !open || anchor === null ? null : ReactDOM.createPortal(
        h('div', {
          ref: menu,
          className: 'dts-menu dts-date-menu',
          role: 'dialog',
          'aria-label': props.t('dateRange'),
          style: {
            position: 'fixed',
            left: 'auto',
            right: anchor.right,
            width: anchor.width,
            zIndex: 2000,
            ...placement,
          },
        },
        h('div', { className: 'dts-date-chips' },
          props.presets.map(preset => h('button', {
            key: preset.key,
            type: 'button',
            className: 'dts-date-chip',
            'data-active': active !== undefined && active.key === preset.key ? 'true' : 'false',
            onClick: () => { props.onChange({ from: preset.from, to: preset.to }); setOpen(false) },
          }, preset.label))),
        h('div', { className: 'dts-menu-sep' }),
        h('div', { className: 'dts-date-body' },
          h('div', { className: 'dts-date-side' },
            h('div', { className: 'dts-date-field' },
              h('span', { className: 'dts-date-field-label' }, props.t('dateFrom')),
              h('span', { className: 'dts-date-field-value' },
                from !== '' ? fullDate(from) : props.t('pickStart'))),
            h('div', { className: from !== '' && to === '' ? 'dts-date-field dts-date-field-active' : 'dts-date-field' },
              h('span', { className: 'dts-date-field-label' }, props.t('dateTo')),
              h('span', { className: 'dts-date-field-value' },
                to !== '' ? fullDate(to) : props.t('pickEnd'))),
            h('div', { className: 'dts-date-buttons' },
              h('button', {
                type: 'button',
                className: 'dts-button-ghost',
                onClick: () => { setOpen(false) },
              }, props.t('cancel')),
              h('button', {
                type: 'button',
                className: 'dts-primary',
                onClick: confirm,
              }, props.t('confirm')))),
          h(Calendar, { t: props.t, from, to, today: props.today, onPick: pick }))),
        document.body)
      return h('div', { className: 'dts-select-wrap', ref: wrap },
        h('button', {
          type: 'button',
          className: 'dts-select',
          title: props.t('dateRange'),
          'aria-haspopup': 'dialog',
          'aria-expanded': open,
          onClick: toggle,
        },
        h('span', { className: 'dts-select-label' }, label),
        h('span', { className: open ? 'dts-select-chevron dts-select-chevron-open' : 'dts-select-chevron' },
          CHEVRON_DOWN_ICON)),
        menuNode)
    }

    function paginationItems(page, pages) {
      if (pages <= 7) {
        const items = []
        for (let index = 1; index <= pages; index += 1) items.push(index)
        return items
      }
      const items = [1]
      const start = Math.max(2, page - 2)
      const end = Math.min(pages - 1, page + 2)
      if (start > 2) items.push('…')
      for (let index = start; index <= end; index += 1) items.push(index)
      if (end < pages - 1) items.push('…')
      items.push(pages)
      return items
    }

    function MiniSelect(props) {
      const [open, setOpen] = React.useState(false)
      const wrap = React.useRef(null)
      React.useEffect(() => {
        if (!open) return undefined
        const onDown = (event) => {
          if (wrap.current !== null && !wrap.current.contains(event.target)) setOpen(false)
        }
        const onKey = (event) => {
          if (event.key === 'Escape') setOpen(false)
        }
        document.addEventListener('mousedown', onDown)
        document.addEventListener('keydown', onKey)
        return () => {
          document.removeEventListener('mousedown', onDown)
          document.removeEventListener('keydown', onKey)
        }
      }, [open])
      const current = props.options.find(option => option.value === props.value) || props.options[0]
      return h('div', { className: 'dts-select-wrap', ref: wrap },
        h('button', {
          type: 'button',
          className: 'dts-select dts-select-sm',
          'aria-haspopup': 'listbox',
          'aria-expanded': open,
          onClick: () => { setOpen(value => !value) },
        },
        h('span', { className: 'dts-select-label' }, current.label),
        h('span', { className: open ? 'dts-select-chevron dts-select-chevron-open' : 'dts-select-chevron' },
          CHEVRON_DOWN_ICON)),
        open
          ? h('div', { className: 'dts-menu dts-menu-up dts-menu-sm', role: 'listbox' },
            props.options.map(option => h('button', {
              key: option.value,
              type: 'button',
              role: 'option',
              'aria-selected': option.value === props.value,
              'data-active': option.value === props.value ? 'true' : 'false',
              className: 'dts-menu-item',
              onClick: () => { setOpen(false); props.onChange(option.value) },
            },
            h('span', { className: 'dts-menu-label' }, option.label),
            option.value === props.value ? h('span', { className: 'dts-menu-check' }, CHECK_ICON) : null)))
          : null)
    }

    function JumpTo(props) {
      const [value, setValue] = React.useState('')
      const submit = () => {
        const number = Number(value)
        if (!Number.isFinite(number)) {
          setValue('')
          return
        }
        props.onChange(Math.min(props.pages, Math.max(1, Math.floor(number))))
        setValue('')
      }
      return h('span', { className: 'dts-jump' },
        h('span', null, props.t('jumpTo')),
        h('input', {
          className: 'dts-jump-input',
          type: 'text',
          inputMode: 'numeric',
          'aria-label': props.t('jumpTo'),
          value,
          onChange: (event) => { setValue(event.target.value.replace(/[^0-9]/g, '')) },
          onKeyDown: (event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              submit()
            }
          },
          onBlur: () => { if (value !== '') submit() },
        }),
        h('span', null, props.t('pageUnit')))
    }

    function Pager(props) {
      const items = paginationItems(props.page, props.pages)
      const sizes = [10, 20, 50, 100].map(value => ({
        value,
        label: props.t('pageSizeLabel', { count: value }),
      }))
      return h('div', { className: 'dts-pager' },
        h('span', { className: 'dts-pager-total' }, props.t('totalItems', { count: props.total })),
        h('div', { className: 'dts-pager-nav' },
          h('button', {
            type: 'button',
            className: 'dts-page-arrow',
            disabled: props.page <= 1,
            'aria-label': props.t('prevPage'),
            onClick: () => { props.onChange(props.page - 1) },
          }, '‹'),
          items.map((item, index) => item === '…'
            ? h('span', { key: 'ellipsis' + String(index), className: 'dts-page', 'data-ellipsis': 'true' }, '…')
            : h('button', {
              key: item,
              type: 'button',
              className: 'dts-page',
              'data-active': item === props.page ? 'true' : 'false',
              'aria-current': item === props.page ? 'page' : undefined,
              onClick: () => { props.onChange(item) },
            }, String(item))),
          h('button', {
            type: 'button',
            className: 'dts-page-arrow',
            disabled: props.page >= props.pages,
            'aria-label': props.t('nextPage'),
            onClick: () => { props.onChange(props.page + 1) },
          }, '›')),
        h('div', { className: 'dts-pager-tools' },
          h(MiniSelect, {
            value: props.pageSize,
            options: sizes,
            onChange: props.onPageSize,
          }),
          h(JumpTo, {
            t: props.t,
            page: props.page,
            pages: props.pages,
            onChange: props.onChange,
          })))
    }

    function dateDiff(left, right) {
      const [leftYear, leftMonth, leftDay] = left.split('-').map(Number)
      const [rightYear, rightMonth, rightDay] = right.split('-').map(Number)
      return Math.round((Date.UTC(rightYear, rightMonth - 1, rightDay) - Date.UTC(leftYear, leftMonth - 1, leftDay)) / 86400000)
    }

    function weekdayIndex(date) {
      const [year, month, day] = date.split('-').map(Number)
      return (new Date(Date.UTC(year, month - 1, day)).getUTCDay() + 6) % 7
    }

    function hourlySeries(hourly, date, scope) {
      const byCwd = hourly === undefined || hourly === null ? undefined : hourly[date]
      if (byCwd === undefined) return undefined
      const cwds = scope === '' ? Object.keys(byCwd) : (byCwd[scope] === undefined ? [] : [scope])
      if (cwds.length === 0) return undefined
      const series = []
      for (let hour = 0; hour < 24; hour += 1) {
        series.push({
          hour, tokens: 0, cost: 0, input: 0, output: 0, cacheRead: 0, cacheWrite: 0,
        })
      }
      const pick = (array, hour) => (array === undefined || array[hour] === undefined ? 0 : array[hour])
      for (const cwd of cwds) {
        const bucket = byCwd[cwd]
        for (let hour = 0; hour < 24; hour += 1) {
          series[hour].tokens += pick(bucket.tokens, hour)
          series[hour].cost += pick(bucket.cost, hour)
          series[hour].input += pick(bucket.input, hour)
          series[hour].output += pick(bucket.output, hour)
          series[hour].cacheRead += pick(bucket.cacheRead, hour)
          series[hour].cacheWrite += pick(bucket.cacheWrite, hour)
        }
      }
      return series
    }

    function UsageTip(props) {
      const totals = props.totals
      const hit = cacheHit(totals)
      const row = (key, label, value, icon) => h('div', { className: 'dts-tip-row', key },
        icon === undefined ? null : icon,
        h('span', null, label),
        h('b', null, value))
      return h('div', {
        className: props.heat === true ? 'dts-tip dts-tip-heat' : 'dts-tip',
        style: props.style,
      },
      h('div', { className: 'dts-tip-date' }, props.title),
      row('total', props.t('legendTokens'), compact(totals.totalTokens), h('span', { className: 'dts-legend-bar' })),
      row('hit', props.t('cacheHit'), hit === null ? props.t('none') : percent(hit)),
      row('input', props.t('input'), compact(totals.uncachedInputTokens)),
      row('read', props.t('cacheRead'), compact(totals.cacheReadTokens)),
      row('output', props.t('output'), compact(totals.outputTokens)),
      props.showCost
        ? row('cost', props.t('legendCost'), money(props.cost, props.currency), h('span', { className: 'dts-legend-dot' }))
        : null)
    }

    function HourlyChart(props) {
      const [hover, setHover] = React.useState(-1)
      const items = props.series
      const maxTokens = items.reduce((max, item) => Math.max(max, item.tokens), 1)
      const maxCost = items.reduce((max, item) => Math.max(max, item.cost), 0.000001)
      const width = 600
      const height = 170
      const left = 12
      const right = 12
      const top = 14
      const bottom = 26
      const plotWidth = width - left - right
      const plotHeight = height - top - bottom
      const step = plotWidth / 24
      const barWidth = Math.max(3, Math.min(16, step * 0.6))
      const currency = props.currency
      const showCost = props.showCost === true
      const hovered = hover >= 0 ? items[hover] : undefined
      const hoverCenter = hovered === undefined ? 0 : left + hover * step + step / 2
      const grid = [0.25, 0.5, 0.75].map((share, index) => h('line', {
        key: 'g' + String(index),
        x1: left, x2: width - right,
        y1: top + plotHeight * (1 - share), y2: top + plotHeight * (1 - share),
        stroke: 'var(--dsw-alias-border-l1)', strokeWidth: 1, strokeDasharray: '3 4',
      }))
      const hoverBand = hovered === undefined ? null : h('rect', {
        x: left + hover * step, y: top, width: step, height: plotHeight, rx: 4,
        fill: 'var(--dsw-alias-interactive-bg-hover, var(--dsw-alias-bg-layer-2))',
        opacity: 0.55, style: { pointerEvents: 'none' },
      })
      const bars = items.map((item, index) => {
        const barHeight = Math.max(1, (item.tokens / maxTokens) * plotHeight)
        return h('rect', {
          key: 'b' + String(index),
          x: left + index * step + (step - barWidth) / 2,
          y: top + plotHeight - barHeight,
          width: barWidth,
          height: barHeight,
          rx: 3,
          fill: 'var(--dsw-alias-brand-primary)',
          opacity: hover === index ? 1 : hover >= 0 ? 0.45 : 0.72,
        })
      })
      const points = items.map((item, index) => [
        left + index * step + step / 2,
        top + plotHeight - (item.cost / maxCost) * plotHeight,
      ])
      const line = points.map(point => point[0].toFixed(1) + ',' + point[1].toFixed(1)).join(' ')
      const dots = showCost ? points.map((point, index) => h('circle', {
        key: 'c' + String(index),
        cx: point[0], cy: point[1], r: hover === index ? 4.5 : 3,
        fill: 'var(--dsw-alias-state-warn-primary)',
      })) : null
      const labels = items.map((item, index) => index % 3 === 0
        ? h('text', {
          key: 'l' + String(index),
          x: left + index * step + step / 2,
          y: height - 8,
          textAnchor: 'middle',
          fontSize: 10,
          fill: 'var(--dsw-alias-label-secondary)',
        }, String(item.hour).padStart(2, '0'))
        : null)
      const hitAreas = items.map((item, index) => h('rect', {
        key: 'h' + String(index),
        x: left + index * step,
        y: top,
        width: step,
        height: plotHeight,
        fill: 'transparent',
        style: { pointerEvents: 'all', cursor: 'default' },
        onMouseEnter: () => { setHover(index) },
        onMouseLeave: () => { setHover(current => (current === index ? -1 : current)) },
      }))
      const tooltip = hovered === undefined ? null : h(UsageTip, {
        t: props.t,
        title: String(hovered.hour).padStart(2, '0') + ':00 – ' + String(hovered.hour + 1).padStart(2, '0') + ':00',
        totals: {
          uncachedInputTokens: hovered.input,
          outputTokens: hovered.output,
          cacheReadTokens: hovered.cacheRead,
          cacheWriteTokens: hovered.cacheWrite,
          totalTokens: hovered.tokens,
        },
        cost: hovered.cost,
        currency,
        showCost,
        style: { left: Math.min(88, Math.max(12, (hoverCenter / width) * 100)) + '%' },
      })
      return h('div', { className: 'dts-block dts-trend' },
        h('div', { className: 'dts-block-head' },
          h('span', { className: 'dts-block-title' }, props.t('trendHourly')),
          h('span', { className: 'dts-block-date' }, fullDate(props.date)),
          h('span', { className: 'dts-legend' },
            h('span', { className: 'dts-legend-item' },
              h('span', { className: 'dts-legend-bar' }), props.t('legendTokens')),
            showCost
              ? h('span', { className: 'dts-legend-item' },
                h('span', { className: 'dts-legend-dot' }), props.t('legendCost'))
              : null)),
        h('div', { className: 'dts-chart' },
          tooltip,
          h('svg', {
            viewBox: `0 0 ${width} ${height}`,
            width: '100%',
            height: String(height),
            role: 'img',
            'aria-label': props.t('trendHourly'),
            onMouseLeave: () => { setHover(-1) },
          },
          grid,
          hoverBand,
          bars,
          showCost && items.length > 1
            ? h('polyline', {
              points: line,
              fill: 'none',
              stroke: 'var(--dsw-alias-state-warn-primary)',
              strokeWidth: 1.8,
              strokeLinejoin: 'round',
              strokeLinecap: 'round',
            })
            : null,
          dots,
          labels,
          h('text', {
            x: left, y: top - 2, fontSize: 9, fill: 'var(--dsw-alias-brand-primary)',
          }, compact(maxTokens)),
          showCost
            ? h('text', {
              x: width - right, y: top - 2, textAnchor: 'end', fontSize: 9,
              fill: 'var(--dsw-alias-state-warn-primary)',
            }, money(maxCost, currency))
            : null,
          hitAreas)))
    }

    function Heatmap(props) {
      const [hover, setHover] = React.useState(null)
      const wrap = React.useRef(null)
      const days = props.days
      const byDate = new Map(days.map(day => [day.date, day]))
      const startMonday = shiftDay(props.start, -weekdayIndex(props.start))
      const endSunday = shiftDay(props.end, 6 - weekdayIndex(props.end))
      const weeks = Math.ceil((dateDiff(startMonday, endSunday) + 1) / 7)
      const columns = `repeat(${weeks}, 12px)`
      const maxValue = days.reduce((max, day) => Math.max(max, day.totals.totalTokens), 0)
      const levelOf = (value) => value <= 0 ? 0 : Math.max(1, Math.min(4, Math.ceil((value / maxValue) * 4)))
      const totalTokens = days.reduce((sum, day) => sum + day.totals.totalTokens, 0)
      const totalRequests = days.reduce((sum, day) => sum + day.requests, 0)
      const totalCost = days.reduce((sum, day) => sum + day.cost, 0)
      const weekdays = props.t('heatWeekdays').split(' ')
      const monthLabels = []
      const weekColumns = []
      for (let week = 0; week < weeks; week += 1) {
        const monday = shiftDay(startMonday, week * 7)
        const month = Number(monday.slice(5, 7))
        const previousMonth = week === 0 ? -1 : Number(shiftDay(startMonday, (week - 1) * 7).slice(5, 7))
        if (week === 0 || month !== previousMonth) {
          monthLabels.push(h('span', {
            key: monday,
            className: 'dts-heat-month',
            style: { gridColumn: String(week + 1) },
          }, props.t('monthShort', { month })))
        }
        const cells = []
        for (let row = 0; row < 7; row += 1) {
          const date = shiftDay(monday, row)
          const inRange = date >= props.start && date <= props.end
          const day = byDate.get(date)
          const value = day === undefined ? 0 : day.totals.totalTokens
          const enter = inRange
            ? (event) => {
              const parent = wrap.current
              if (parent === null) return
              const cellRect = event.currentTarget.getBoundingClientRect()
              const parentRect = parent.getBoundingClientRect()
              setHover({
                date,
                totals: day === undefined ? zero() : day.totals,
                cost: day === undefined ? 0 : day.cost,
                left: cellRect.left - parentRect.left + cellRect.width / 2,
                top: cellRect.top - parentRect.top,
              })
            }
            : undefined
          cells.push(h('span', {
            key: date,
            className: 'dts-heat-cell',
            'data-level': inRange ? String(levelOf(value)) : '0',
            'data-empty': inRange ? 'false' : 'true',
            onMouseEnter: enter,
            onMouseLeave: inRange ? () => { setHover(null) } : undefined,
          }))
        }
        weekColumns.push(h('div', { className: 'dts-heat-week', key: monday }, cells))
      }
      return h('div', { className: 'dts-heat', ref: wrap },
        h('div', { className: 'dts-block-head' },
          h('span', { className: 'dts-block-title' }, props.t('heatmapTitle'))),
        h('div', { className: 'dts-heat-summary' }, props.t('heatSummary', {
          range: fullDate(props.start) + ' – ' + fullDate(props.end),
          tokens: compact(totalTokens),
          requests: exact(totalRequests),
          cost: money(totalCost, props.currency),
        })),
        h('div', { className: 'dts-heat-body' },
          h('div', { className: 'dts-heat-side' },
            h('div', { className: 'dts-heat-side-spacer' }),
            h('div', { className: 'dts-heat-weekdays' },
              weekdays.map((label, index) => h('span', {
                key: label + String(index),
                className: 'dts-heat-weekday',
              }, index % 2 === 0 ? label : '')))),
          h('div', { className: 'dts-heat-scroll' },
            h('div', { className: 'dts-heat-track' },
              h('div', { className: 'dts-heat-months', style: { gridTemplateColumns: columns } }, monthLabels),
              h('div', { className: 'dts-heat-weeks', style: { gridTemplateColumns: columns } }, weekColumns)))),
        h('div', { className: 'dts-heat-legend' },
          h('span', null, props.t('less')),
          [0, 1, 2, 3, 4].map(level => h('span', {
            key: String(level),
            className: 'dts-heat-cell',
            'data-level': String(level),
          })),
          h('span', null, props.t('more'))),
        hover === null
          ? null
          : h(UsageTip, {
            t: props.t,
            title: hover.date,
            totals: hover.totals,
            cost: hover.cost,
            currency: props.currency,
            showCost: props.showCost,
            heat: true,
            style: { left: hover.left + 'px', top: hover.top + 'px' },
          }))
    }

    function UsageChart(props) {
      if (props.days.length === 0) return null
      const dates = props.days.map(day => day.date).sort()
      const dataMin = dates[0]
      const dataMax = dates[dates.length - 1]
      if (props.range.from === '' && props.range.to === '') {
        const end = props.today !== '' ? props.today : dataMax
        const oneScreenStart = shiftDay(end, -(30 * 7 - 1))
        const start = dataMin < oneScreenStart ? dataMin : oneScreenStart
        return h(Heatmap, {
          t: props.t,
          days: props.days.filter(day => day.date >= start && day.date <= end),
          start,
          end,
          showCost: props.showCost,
          currency: props.currency,
        })
      }
      const spanStart = props.range.from !== '' ? props.range.from : dataMin
      const spanEnd = props.range.to !== '' ? props.range.to : dataMax
      const span = dateDiff(spanStart, spanEnd) + 1
      if (span === 1) {
        const series = hourlySeries(props.hourly, spanStart, props.scope)
        if (series !== undefined) {
          return h(HourlyChart, {
            t: props.t,
            date: spanStart,
            series,
            showCost: props.showCost,
            currency: props.currency,
          })
        }
      }
      if (span <= 15) {
        return h(TrendChart, {
          t: props.t,
          days: props.days,
          showCost: props.showCost,
          currency: props.currency,
        })
      }
      const heatStart = dateDiff(spanStart, spanEnd) + 1 > 371 ? shiftDay(spanEnd, -370) : spanStart
      return h(Heatmap, {
        t: props.t,
        days: props.days.filter(day => day.date >= heatStart),
        start: heatStart,
        end: spanEnd,
        showCost: props.showCost,
        currency: props.currency,
      })
    }

    function StatsSection(props) {
      const t = props.t
      const { state, reload } = useStatsData()
      const [view, setView] = React.useState('stats')
      const [tab, setTab] = React.useState('days')
      const [scope, setScope] = React.useState('')
      const [expandedDay, setExpandedDay] = React.useState('')
      const [expandedSession, setExpandedSession] = React.useState('')
      const [range, setRange] = React.useState({ from: '', to: '' })
      const rangeInitialized = React.useRef(false)
      const [pageSize, setPageSize] = React.useState(10)
      const [dayPage, setDayPage] = React.useState(1)
      const [sessionPage, setSessionPage] = React.useState(1)
      React.useEffect(() => {
        setDayPage(1)
        setSessionPage(1)
      }, [scope, range.from, range.to, pageSize])

      const data = state.data
      const showCost = data !== undefined && data.pricing !== undefined && data.defaultPricing !== undefined
      const currency = data !== undefined && typeof data.currency === 'string' ? data.currency : 'CNY'
      const rawSessions = data !== undefined && Array.isArray(data.sessions) ? data.sessions : []
      const directories = []
      const seen = new Set()
      for (const session of rawSessions) {
        if (typeof session.cwd !== 'string' || session.cwd === '' || seen.has(session.cwd)) continue
        seen.add(session.cwd)
        directories.push(session.cwd)
      }
      directories.sort()
      const scopedSessions = scope === '' ? rawSessions : rawSessions.filter(session => session.cwd === scope)
      const rangeActive = range.from !== '' || range.to !== ''
      const sessions = rangeActive
        ? scopedSessions
          .map(session => filterSessionByRange(session, range.from, range.to))
          .filter(session => session !== undefined)
        : scopedSessions
      const dayMap = new Map()
      for (const session of sessions) {
        for (const [day, buckets] of Object.entries(session.days)) {
          let entry = dayMap.get(day)
          if (entry === undefined) {
            entry = { date: day, totals: zero(), count: 0, cost: 0, requests: 0 }
            dayMap.set(day, entry)
          }
          addTotals(entry.totals, buckets)
          entry.cost += costOf(buckets)
          entry.requests += typeof buckets.requests === 'number' ? buckets.requests : 0
          entry.count += 1
        }
      }
      const days = [...dayMap.values()].sort((left, right) => right.date.localeCompare(left.date))
      const pageTotal = sumTotals(sessions)
      const loading = state.status === 'loading'
      const todayDate = data === undefined ? '' : todayKey(data.timeZone)
      let today
      if (todayDate !== '') {
        let found = false
        let todayCost = 0
        let todayRequests = 0
        const todayTotals = zero()
        for (const session of scopedSessions) {
          const buckets = session.days[todayDate]
          if (buckets === undefined) continue
          found = true
          addTotals(todayTotals, buckets)
          todayCost += costOf(buckets)
          todayRequests += typeof buckets.requests === 'number' ? buckets.requests : 0
        }
        if (found) today = { totals: todayTotals, cost: todayCost, requests: todayRequests }
      }
      React.useEffect(() => {
        if (!rangeInitialized.current && todayDate !== '') {
          rangeInitialized.current = true
          setRange({ from: todayDate, to: todayDate })
        }
      }, [todayDate])
      const cardRangeActive = rangeActive && !(range.from === todayDate && range.to === todayDate)
      let cardStats = today
      if (rangeActive) {
        const totals = zero()
        let cost = 0
        let requests = 0
        for (const session of sessions) {
          addTotals(totals, session.totals)
          cost += costOf(session)
          requests += typeof session.requests === 'number' ? session.requests : 0
        }
        cardStats = { totals, cost, requests }
      }
      const pageCost = sessions.reduce((sum, session) => sum + costOf(session), 0)
      const pageUnpriced = sessions.reduce((sum, session) => sum + (typeof session.unpricedTokens === 'number' ? session.unpricedTokens : 0), 0)
      const maxDay = days.reduce((max, day) => Math.max(max, day.totals.totalTokens), 0)
      const presets = []
      if (todayDate !== '') {
        presets.push({ key: 'today', label: t('today'), from: todayDate, to: todayDate })
        presets.push({ key: '7d', label: t('last7'), from: shiftDay(todayDate, -6), to: todayDate })
        presets.push({ key: '14d', label: t('last14'), from: shiftDay(todayDate, -13), to: todayDate })
        presets.push({ key: '30d', label: t('last30'), from: shiftDay(todayDate, -29), to: todayDate })
      }
      presets.push({ key: 'all', label: t('allDates'), from: '', to: '' })
      const dayPages = Math.max(1, Math.ceil(days.length / pageSize))
      const dayCurrent = Math.min(dayPage, dayPages)
      const visibleDays = days.slice((dayCurrent - 1) * pageSize, dayCurrent * pageSize)

      const valueOfAll = (session) => session.totals
      const valueOfDay = (session) => session.days[expandedDay]

      const renderSessions = (list, date) => {
        const local = groupSessions(list)
        const pick = date === undefined ? undefined : (session) => session.days[date]
        const sorted = local.roots.slice().sort((left, right) => {
          const leftChildren = local.children.get(left.id) === undefined ? [] : local.children.get(left.id)
          const rightChildren = local.children.get(right.id) === undefined ? [] : local.children.get(right.id)
          return sumTotals([right].concat(rightChildren), pick).totalTokens
            - sumTotals([left].concat(leftChildren), pick).totalTokens
        })
        return sorted.map(root => h(SessionRow, {
          key: root.id,
          t,
          session: root,
          children: local.children.get(root.id) === undefined ? [] : local.children.get(root.id),
          date,
          currency,
          showCost,
          valueOf: pick === undefined ? valueOfAll : (session) => session.days[date],
          expanded: expandedSession === root.id,
          onToggle: () => { setExpandedSession(expandedSession === root.id ? '' : root.id) },
        }))
      }

      const dayRows = visibleDays.map(day => {
        const expanded = expandedDay === day.date
        const width = maxDay === 0 ? 0 : Math.round((day.totals.totalTokens / maxDay) * 100)
        const daySessions = sessions.filter(session => session.days[day.date] !== undefined)
        return h('div', { key: day.date },
          h('button', {
            type: 'button',
            className: 'dts-row',
            'data-expanded': expanded ? 'true' : 'false',
            'aria-expanded': expanded,
            onClick: () => { setExpandedDay(expanded ? '' : day.date) },
          },
          h('span', { className: 'dts-date' }, dayLabel(day.date)),
          h('span', { className: 'dts-weekday' }, weekday(day.date)),
          h('span', { className: 'dts-bar' }, h('span', { className: 'dts-bar-fill', style: { width: width + '%' } })),
          h('span', { className: 'dts-muted dts-metric' }, t('daySessions', { count: day.count })),
          h('span', { className: 'dts-metric', style: { minWidth: '60px', textAlign: 'right' } }, compact(day.totals.totalTokens)),
          showCost ? h('span', { className: 'dts-session-cost' }, money(day.cost, currency)) : null,
          h('span', { className: 'dts-chevron' }, CHEVRON_ICON)),
          expanded ? h('div', { className: 'dts-detail' }, renderSessions(daySessions, day.date)) : null)
      })

      const groups = groupSessions(sessions)
      const roots = groups.roots.slice().sort((left, right) => {
        const leftChildren = groups.children.get(left.id) === undefined ? [] : groups.children.get(left.id)
        const rightChildren = groups.children.get(right.id) === undefined ? [] : groups.children.get(right.id)
        return sumTotals([right].concat(rightChildren)).totalTokens - sumTotals([left].concat(leftChildren)).totalTokens
      })
      const sessionPages = Math.max(1, Math.ceil(roots.length / pageSize))
      const sessionCurrent = Math.min(sessionPage, sessionPages)
      const visibleRoots = roots.slice((sessionCurrent - 1) * pageSize, sessionCurrent * pageSize)
      const sessionRows = visibleRoots.map(root => h(SessionRow, {
        key: root.id,
        t,
        session: root,
        children: groups.children.get(root.id) === undefined ? [] : groups.children.get(root.id),
        currency,
        showCost,
        valueOf: valueOfAll,
        expanded: expandedSession === root.id,
        onToggle: () => { setExpandedSession(expandedSession === root.id ? '' : root.id) },
      }))

      let content
      if (state.status === 'loading' && data === undefined) {
        content = h('div', { className: 'dts-empty' }, t('loading'))
      } else if (state.status === 'error' && data === undefined) {
        content = h('div', { className: 'dts-error' },
          h('div', null, t('error', { message: state.error })),
          h('button', { type: 'button', className: 'dts-retry', onClick: () => { void reload(true) } }, t('retry')))
      } else if (sessions.length === 0) {
        content = h('div', { className: 'dts-empty' }, rangeActive ? t('emptyRange') : t('empty'))
      } else if (tab === 'days') {
        content = h(React.Fragment, null, dayRows,
          h(Pager, {
            t,
            page: dayCurrent,
            pages: dayPages,
            total: days.length,
            pageSize,
            onPageSize: setPageSize,
            onChange: setDayPage,
          }))
      } else {
        content = h(React.Fragment, null, sessionRows,
          h(Pager, {
            t,
            page: sessionCurrent,
            pages: sessionPages,
            total: roots.length,
            pageSize,
            onPageSize: setPageSize,
            onChange: setSessionPage,
          }))
      }

      if (view === 'pricing') {
        if (!showCost) {
          return h('div', { className: 'dts-section' },
            h('div', { className: 'dts-head' },
              h('div', { className: 'dts-head-main' }, h('div', { className: 'dts-head-title' }, t('priceTitle'))),
              h('div', { className: 'dts-head-actions' },
                h('button', { type: 'button', className: 'dts-refresh', onClick: () => { setView('stats') } }, t('back')))),
            h('div', { className: 'dts-empty' }, t('emptyPrice')))
        }
        return h(PriceEditor, {
          t,
          pricing: data.pricing,
          defaultPricing: data.defaultPricing,
          onBack: () => { setView('stats') },
          onSaved: () => { void reload(true) },
        })
      }

      return h('section', { className: 'dts-section', 'aria-label': t('title') },
        h('div', { className: 'dts-head' },
          h('div', { className: 'dts-head-main' },
            h('div', { className: 'dts-head-title' }, t('title')),
            state.status === 'error' && data === undefined
              ? null
              : h('div', { className: 'dts-head-sub' }, data === undefined
                ? t('loading')
                : t('updated', {
                  time: new Date(data.generatedAt).toLocaleTimeString('zh-CN', { hour12: false }),
                  zone: data.timeZone,
                }))),
          h('div', { className: 'dts-head-actions' },
            h(DateRangeSelect, {
              t,
              range,
              presets,
              today: todayDate,
              onChange: (next) => { setRange(next) },
            }),
            showCost
              ? h('button', {
                type: 'button',
                className: 'dts-refresh',
                onClick: () => { setView('pricing') },
              }, t('editPrices'))
              : null,
            h('button', {
              type: 'button',
              className: 'dts-refresh',
              onClick: () => { void reload(true) },
            }, h('span', { className: loading ? 'dts-btn-icon dts-spinning' : 'dts-btn-icon' }, REFRESH_ICON),
            t('refresh')))),
        h(KpiCards, { t, stats: cardStats, rangeActive: cardRangeActive, showCost, currency }),
        days.length > 0
          ? h('div', { className: 'dts-panel-block' },
            h(UsageChart, {
              t,
              days,
              range,
              today: todayDate,
              hourly: data === undefined ? undefined : data.hourly,
              scope,
              showCost,
              currency,
            }))
          : null,
        h('div', { className: 'dts-panel-block' },
          h('div', { className: 'dts-toolbar' },
          h('div', { className: 'dts-tabs', role: 'tablist' },
            h('button', {
              type: 'button',
              className: 'dts-tab',
              role: 'tab',
              'data-active': tab === 'days' ? 'true' : 'false',
              'aria-selected': tab === 'days',
              onClick: () => { setTab('days') },
            }, t('tabDays')),
            h('button', {
              type: 'button',
              className: 'dts-tab',
              role: 'tab',
              'data-active': tab === 'sessions' ? 'true' : 'false',
              'aria-selected': tab === 'sessions',
              onClick: () => { setTab('sessions') },
            }, t('tabSessions'))),
          directories.length <= 1 ? null : h(ScopeSelect, {
            value: scope,
            directories,
            allLabel: t('allDirectories'),
            onChange: (value) => { setScope(value) },
          }),
          h('span', { className: 'dts-total' },
            (showCost ? t('cost') + ' ' + money(pageCost, currency) + ' · ' : '') +
            t('total') + ' ' + compact(pageTotal.totalTokens))),
          h('div', { className: 'dts-body' }, content),
          h(BucketsRow, {
            t, totals: pageTotal, cost: pageCost, currency, showCost, unpriced: pageUnpriced,
          })))
    }

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'token-stats: dictionaries')
        const t = ctx.locale.bind(NS)
        ctx.effect(() => {
          const style = document.createElement('style')
          style.setAttribute('data-plugin', '@local/dsh-token-stats')
          style.textContent = CSS
          document.head.append(style)
          return () => { style.remove() }
        }, 'token-stats: styles')
        ctx.slots.inject('settings.section', () => ctx.slots.register({
          name: 'settings.section',
          id: 'token-stats',
          order: 30,
          label: () => t('title'),
          locale: NS,
        }, StatsSection))
        ctx.slots.inject('settings.section.icon', () => ctx.slots.register({
          name: 'settings.section.icon',
          id: 'token-stats',
          order: 30,
          locale: NS,
        }, SectionIcon))
      },
    }
  },
})
