const state = {
  itemsAi: [],
  itemsAll: [],
  itemsAllRaw: [],
  creatorItemsAi: [],
  creatorItemsAll: [],
  creatorWindowDays: 7,
  grantPolicyData: null,
  grantPolicyItems: [],
  grantPolicySources: [],
  grantPolicyReferenceSources: [],
  slowProfessorData: null,
  slowProfessorItems: [],
  slowProfessorConfirmedEntries: [],
  slowProfessorSources: [],
  githubProjectData: null,
  githubProjectItems: [],
  githubProjectSources: [],
  modelScoreData: null,
  modelScoreItems: [],
  statsAi: [],
  totalAi: 0,
  totalRaw: 0,
  totalAllMode: 0,
  allDedup: true,
  allDataLoaded: false,
  allDataUrl: "data/latest-24h-all.json",
  allDataPromise: null,
  siteFilter: "",
  authorFilter: "",
  query: "",
  mode: "ai",
  waytoagiMode: "today",
  waytoagiData: null,
  sourceStatus: null,
  generatedAt: null,
  dailyBrief: null,
  storiesMerged: null,
  storiesDataUrl: "data/stories-merged.json",
  activeSection: "grant_policy",
  boleView: "timeline",
  boleExpanded: false,
  listSort: "priority",
  sourceTypeFilter: "",
  signalLevelFilter: "",
  siteGroupsExpanded: false,
  xAuthorsExpanded: false,
};

const statsEl = document.getElementById("stats");
const siteSelectEl = document.getElementById("siteSelect");
const sitePillsEl = document.getElementById("sitePills");
const newsListEl = document.getElementById("newsList");
const updatedAtEl = document.getElementById("updatedAt");
const sourceStatusPillEl = document.getElementById("sourceStatusPill");
const stickySummaryTextEl = document.getElementById("stickySummaryText");
const searchInputEl = document.getElementById("searchInput");
const resultCountEl = document.getElementById("resultCount");
const listTitleEl = document.getElementById("listTitle");
const itemTpl = document.getElementById("itemTpl");
const modeAiBtnEl = document.getElementById("modeAiBtn");
const modeAllBtnEl = document.getElementById("modeAllBtn");
const modeHintEl = document.getElementById("modeHint");
const allDedupeWrapEl = document.getElementById("allDedupeWrap");
const allDedupeToggleEl = document.getElementById("allDedupeToggle");
const allDedupeLabelEl = document.getElementById("allDedupeLabel");
const advancedSummaryEl = document.getElementById("advancedSummary");
const sourceHealthEl = document.getElementById("sourceHealth");
const sourceHealthDetailsEl = document.getElementById("sourceHealthDetails");
const sourceStatusTableEl = document.getElementById("sourceStatusTable");
const sectionSelectEl = document.getElementById("sectionSelect");
const sourceTypeSelectEl = document.getElementById("sourceTypeSelect");
const signalLevelSelectEl = document.getElementById("signalLevelSelect");

const waytoagiWrapEl = document.querySelector(".waytoagi-wrap");
const waytoagiUpdatedAtEl = document.getElementById("waytoagiUpdatedAt");
const waytoagiMetaEl = document.getElementById("waytoagiMeta");
const waytoagiListEl = document.getElementById("waytoagiList");
const waytoagiTodayBtnEl = document.getElementById("waytoagiTodayBtn");
const waytoagi7dBtnEl = document.getElementById("waytoagi7dBtn");
const grantPolicyWrapEl = document.getElementById("grantPolicyWrap");
const grantPolicyUpdatedAtEl = document.getElementById("grantPolicyUpdatedAt");
const grantPolicyMetaEl = document.getElementById("grantPolicyMeta");
const grantPolicySourcesEl = document.getElementById("grantPolicySources");
const grantPolicyReferenceEl = document.getElementById("grantPolicyReference");
const coverageStripEl = document.getElementById("coverageStrip");
const bolePicksListEl = document.getElementById("bolePicksList");
const bolePicksMetaEl = document.getElementById("bolePicksMeta");
const bolePicksWrapEl = document.getElementById("bolePicksWrap");
const boleViewToggleEl = document.getElementById("boleViewToggle");
const boleHotBtnEl = document.getElementById("boleHotBtn");
const boleTimelineBtnEl = document.getElementById("boleTimelineBtn");
const sectionTabsEl = document.getElementById("sectionTabs");
const sectionSummaryEl = document.getElementById("sectionSummary");
const topStoriesTitleEl = document.getElementById("topStoriesTitle");
const listSortToolsEl = document.getElementById("listSortTools");

const SOURCE_KINDS = {
  official_ai: { label: "官方", tone: "official" },
  curated_media: { label: "精选媒体", tone: "aihub" },
  aihot: { label: "AI HOT", tone: "hot" },
  aibreakfast: { label: "日报", tone: "newsletter" },
  followbuilders: { label: "Builders/X", tone: "builders" },
  xapi: { label: "X API", tone: "builders" },
  socialdata_x: { label: "X 搜索", tone: "builders" },
  tikhub_douyin: { label: "抖音", tone: "creator" },
  tikhub_xiaohongshu: { label: "小红书", tone: "creator" },
  techurls: { label: "聚合", tone: "aggregate" },
  buzzing: { label: "聚合", tone: "aggregate" },
  iris: { label: "聚合", tone: "aggregate" },
  bestblogs: { label: "博客", tone: "blogs" },
  tophub: { label: "聚合", tone: "aggregate" },
  zeli: { label: "聚合", tone: "aggregate" },
  hackernews: { label: "HN", tone: "aggregate" },
  aihubtoday: { label: "AI站点", tone: "aihub" },
  aibase: { label: "AI站点", tone: "aihub" },
  waytoagi: { label: "社区", tone: "builders" },
  newsnow: { label: "聚合", tone: "aggregate" },
  opmlrss: { label: "OPML", tone: "newsletter" },
  wechat_slow_professor: { label: "慢教授", tone: "newsletter" },
  grant_qstheory: { label: "科研政策", tone: "official" },
  grant_nsfc: { label: "国自然", tone: "official" },
  grant_bnsfc: { label: "科学基金", tone: "research" },
  grant_fundamental_research: { label: "基础研究", tone: "research" },
  grant_xssc: { label: "香山会议", tone: "research" },
  grant_most_service: { label: "科技管理", tone: "official" },
  grant_csb: { label: "科学通报", tone: "research" },
  grant_casisd: { label: "中科院", tone: "research" },
  model_scores: { label: "模型评分", tone: "aihub" },
  github_hellogithub: { label: "HelloGitHub", tone: "builders" },
  github_weekly: { label: "科技周刊", tone: "builders" },
  github_awesome: { label: "Awesome", tone: "builders" },
};

const GRANT_POLICY_SITE_IDS = new Set([
  "grant_qstheory",
  "grant_nsfc",
  "grant_bnsfc",
  "grant_fundamental_research",
  "grant_xssc",
  "grant_most_service",
  "grant_csb",
  "grant_casisd",
]);

const GRANT_JOURNAL_DISPLAY_NAMES = {
  grant_fundamental_research: "Fundamental Research（基础研究，基金委主管/主办的期刊）",
  grant_bnsfc: "中国科学基金（基金委主管/主办的期刊）",
};

const GRANT_SOURCE_GROUP_ORDER = {
  grant_nsfc: 0,
  grant_fundamental_research: 1,
  grant_bnsfc: 2,
  grant_casisd: 3,
  grant_qstheory: 4,
};

const MODEL_SCORE_SOURCE_ORDER = {
  "Best Overall (Humanity's Last Exam)": 0,
  "Best in Reasoning (GPQA Diamond)": 1,
  "Best in Agentic Coding (SWE Bench)": 2,
  "Best for Work Automations (AutoBench)": 3,
  "Best in Computer Use (OSWorld)": 4,
  "Best in Browsing (BrowseComp)": 5,
  "Best in Terminal Use (Terminal-Bench 2.1)": 6,
  "Fastest Models (Tokens/sec)": 7,
  "Lowest Latency (TTFT)": 8,
  "Cheapest Models (per 1M tokens)": 9,
};

const SECTION_DEFS = [
  { id: "grant_policy", label: "国自然", short: "国自然", description: "国自然、科研政策、基础研究期刊和国际对标入口" },
  { id: "slow_professor", label: "慢教授", short: "慢教授", description: "慢教授科研江湖近一周公众号文章与已确认入口" },
  { id: "github_projects", label: "GitHub", short: "GitHub", description: "HelloGitHub、科技爱好者周刊、Awesome 推荐的好玩开源项目" },
  { id: "model_scores", label: "模型评分", short: "模型评分", description: "Vellum LLM Leaderboard 的最新模型评分与任务榜单" },
  { id: "hot", label: "热点流（优先看）", short: "热点流", description: "高优先级信号流：按来源质量、AI 相关度、时间和编辑分排序" },
  { id: "models", label: "模型", short: "模型", description: "模型发布、能力升级、评测与开源权重" },
  { id: "products", label: "产品", short: "产品", description: "AI 应用、Agent、生成工具和用户产品更新" },
  { id: "devtools", label: "开发者", short: "开发者", description: "编程工具、API、开源项目、推理与工程实践" },
  { id: "hn", label: "HN热议", short: "HN", description: "Hacker News 过去 24 小时的 AI 关键词讨论与高互动 story" },
  { id: "industry", label: "行业", short: "行业", description: "公司战略、融资收购、监管、芯片与产业变化" },
  { id: "research", label: "研究", short: "研究", description: "论文、基准、方法、数据集与研究团队动态" },
  { id: "creator", label: "自媒体", short: "自媒体", description: "一周内互动热度优先，24 小时新内容额外加分" },
  { id: "community", label: "社区", short: "社区", description: "WaytoAGI、中文社区、AIbase、公众号和 Builders/X 信号" },
];

const SECTION_BY_ID = Object.fromEntries(SECTION_DEFS.map((section) => [section.id, section]));

const LIST_SORT_DEFS = [
  { id: "priority", label: "综合" },
  { id: "latest", label: "最新" },
  { id: "ai", label: "高分" },
  { id: "source", label: "来源" },
];

function fmtNumber(n) {
  return new Intl.NumberFormat("zh-CN").format(n || 0);
}

function fmtTime(iso) {
  if (!iso) return "时间未知";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "时间未知";
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function fmtDate(iso) {
  if (!iso) return "未知日期";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

function setStats() {
  statsEl.innerHTML = "";
  const items = state.itemsAi || [];
  const highCount = items.filter((item) => isHighPriorityItem(item)).length;
  const curatedCount = briefStories().length || Math.min(20, mergedStories().filter((story) => storyScore(story) >= 75).length);
  const status = state.sourceStatus;
  const totalSites = Array.isArray(status?.sites) ? status.sites.length : 0;
  const okSites = Number(status?.successful_sites || 0);
  const health = totalSites ? `${fmtNumber(okSites)}/${fmtNumber(totalSites)}正常` : "加载中";
  const cards = [
    ["AI", `${fmtNumber(state.totalAi || items.length)}条`],
    ["高优", `${fmtNumber(highCount)}条`],
    ["精选", `${fmtNumber(curatedCount)}条`],
    ["源", health],
  ];
  statsEl.setAttribute(
    "aria-label",
    `过去 24 小时：AI 信号 ${fmtNumber(state.totalAi || items.length)} 条，高优先级 ${fmtNumber(highCount)} 条，精选 ${fmtNumber(curatedCount)} 条，源状态 ${totalSites ? `${fmtNumber(okSites)}/${fmtNumber(totalSites)} 源正常` : "加载中"}`,
  );

  const prefix = document.createElement("div");
  prefix.className = "stat-prefix";
  prefix.textContent = "过去 24 小时：";
  statsEl.appendChild(prefix);

  cards.forEach(([k, v]) => {
    const node = document.createElement("div");
    node.className = "stat";
    node.innerHTML = `<div class="k">${k}</div><div class="v">${v}</div>`;
    statsEl.appendChild(node);
  });
  renderStickySummary();
  renderSourceStatusPill();
}

function failedSourceCount(status = state.sourceStatus) {
  const failedSites = Array.isArray(status?.failed_sites) ? status.failed_sites.length : 0;
  const rss = status?.rss_opml || {};
  const failedFeeds = Array.isArray(rss.failed_feeds) ? rss.failed_feeds.length : 0;
  return failedSites + failedFeeds;
}

function renderSourceStatusPill(errorMessage = "") {
  if (!sourceStatusPillEl) return;
  const status = state.sourceStatus;
  sourceStatusPillEl.className = "source-status-pill";
  if (!status) {
    sourceStatusPillEl.textContent = errorMessage || "源状态加载中";
    if (errorMessage) sourceStatusPillEl.classList.add("bad");
    return;
  }
  const totalSites = Array.isArray(status.sites) ? status.sites.length : 0;
  const okSites = Number(status.successful_sites || 0);
  const failed = failedSourceCount(status);
  sourceStatusPillEl.textContent = failed
    ? `${fmtNumber(okSites)}/${fmtNumber(totalSites)} 源正常 · 失败 ${fmtNumber(failed)}`
    : `${fmtNumber(okSites)}/${fmtNumber(totalSites)} 源正常`;
  if (failed) sourceStatusPillEl.classList.add("warn");
}

function renderStickySummary() {
  if (!stickySummaryTextEl) return;
  const filteredCount = getFilteredItems().length;
  const section = SECTION_BY_ID[state.activeSection] || SECTION_BY_ID.hot;
  const query = state.query.trim();
  const site = state.siteFilter
    ? (currentSiteStats().find((row) => row.site_id === state.siteFilter)?.site_name || state.siteFilter)
    : "";
  const sourceType = sourceTypeSelectEl?.selectedOptions?.[0]?.textContent || "";
  const signalLevel = signalLevelSelectEl?.selectedOptions?.[0]?.textContent || "";
  const filters = [
    state.activeSection === "hot" ? "" : section.label,
    site,
    state.sourceTypeFilter ? sourceType : "",
    state.signalLevelFilter ? signalLevel : "",
    query ? `搜索“${query}”` : "",
  ].filter(Boolean);
  if (state.activeSection === "grant_policy") {
    stickySummaryTextEl.textContent = `${fmtNumber(filteredCount)} 条 · 科研政策专题${filters.length ? ` · ${filters.join(" · ")}` : ""}`;
    return;
  }
  if (state.activeSection === "slow_professor") {
    const confirmedCount = state.slowProfessorConfirmedEntries.length;
    stickySummaryTextEl.textContent = `${fmtNumber(filteredCount)} 条 · 慢教授近一周专题 · 已确认入口 ${fmtNumber(confirmedCount)} 条${filters.length ? ` · ${filters.join(" · ")}` : ""}`;
    return;
  }
  if (state.activeSection === "github_projects") {
    stickySummaryTextEl.textContent = `${fmtNumber(filteredCount)} 个 · GitHub好玩项目${filters.length ? ` · ${filters.join(" · ")}` : ""}`;
    return;
  }
  const mode = state.mode === "all" ? "全量" : "AI强相关";
  stickySummaryTextEl.textContent = `${fmtNumber(filteredCount)} 条 · ${mode}${filters.length ? ` · ${filters.join(" · ")}` : ""}`;
}

function sourceKind(siteId) {
  return SOURCE_KINDS[siteId] || { label: "来源", tone: "default" };
}

function itemSourceDisplayName(item) {
  if (!item) return "";
  const siteId = item.site_id || "";
  if (GRANT_JOURNAL_DISPLAY_NAMES[siteId]) return GRANT_JOURNAL_DISPLAY_NAMES[siteId];
  if (itemSections(item).has("grant_policy") && item.grant_source_type === "journal") {
    return item.site_name || item.source || siteId;
  }
  return item.source || item.site_name || siteId;
}

function sourceDisplayName(source) {
  if (!source) return "";
  return source.site_display_name || GRANT_JOURNAL_DISPLAY_NAMES[source.site_id] || source.site_name || source.site_id || "公开源";
}

function grantSourceGroupRank(items) {
  const ranks = items
    .map((item) => GRANT_SOURCE_GROUP_ORDER[item.site_id])
    .filter((rank) => Number.isFinite(rank));
  return ranks.length ? Math.min(...ranks) : Number.POSITIVE_INFINITY;
}

function sourceSignalTone(signal) {
  const text = String(signal || "").toLowerCase();
  if (text.includes("官方") || text.includes("official")) return "official";
  if (text.includes("ai hot") || text.includes("精选")) return "hot";
  if (text.includes("自媒体") || text.includes("tikhub") || text.includes("douyin") || text.includes("xiaohongshu") || text.includes("抖音") || text.includes("小红书")) return "creator";
  if (text.includes("builders") || text.includes("github") || text.includes("x")) return "builders";
  if (text.includes("aihub") || text.includes("aibase") || text.includes("媒体")) return "aihub";
  if (text.includes("hn") || text.includes("hacker") || text.includes("聚合")) return "aggregate";
  if (text.includes("opml") || text.includes("日报")) return "newsletter";
  return "default";
}

function sourceChip(label, tone = "default", className = "source-chip") {
  const chip = document.createElement("span");
  chip.className = `${className} kind-${tone}`.trim();
  const dot = document.createElement("span");
  dot.className = "source-dot";
  dot.setAttribute("aria-hidden", "true");
  const text = document.createElement("span");
  text.className = "source-chip-label";
  text.textContent = label || "来源";
  chip.append(dot, text);
  return chip;
}

function appendSourceChip(parent, label, tone = "default", className = "source-chip") {
  parent.appendChild(sourceChip(label, tone, className));
}

function siteRows() {
  return Array.isArray(state.sourceStatus?.sites) ? state.sourceStatus.sites : [];
}

function siteRow(siteId) {
  return siteRows().find((site) => site.site_id === siteId) || null;
}

function aiSiteStat(siteId) {
  const stats = Array.isArray(state.statsAi) && state.statsAi.length
    ? state.statsAi
    : computeSiteStats(state.itemsAi || []);
  return stats.find((site) => site.site_id === siteId) || null;
}

function siteAiPoolCount(siteId) {
  return Number(aiSiteStat(siteId)?.count || 0);
}

function siteRawPoolCount(siteId) {
  const stat = aiSiteStat(siteId);
  return Number(stat?.raw_count ?? stat?.count ?? 0);
}

function sourcePoolMeta(aiCount, rawCount, fallback) {
  if (rawCount && rawCount !== aiCount) return `AI强相关 · 原始 ${fmtNumber(rawCount)} 条`;
  return fallback;
}

function paidSourceLabel(status, poolCount, activeLabel, idleLabel) {
  const connected = Boolean(status?.enabled);
  const liveCount = Number(status?.item_count || 0);
  const displayCount = liveCount || Number(poolCount || 0);
  if (connected) {
    if (displayCount) return `${activeLabel} ${fmtNumber(displayCount)}条`;
    return `${activeLabel} ${status?.skipped ? "待窗口" : "已连接暂无匹配"}`;
  }
  if (displayCount) return `${activeLabel} ${fmtNumber(displayCount)}条`;
  return idleLabel;
}

function renderCoverageCard(label, value, meta, tone = "") {
  const node = document.createElement("div");
  node.className = `coverage-card ${tone}`.trim();
  const labelEl = document.createElement("span");
  labelEl.className = "coverage-label";
  labelEl.textContent = label;
  const valueEl = document.createElement("strong");
  valueEl.textContent = value;
  const metaEl = document.createElement("span");
  metaEl.className = "coverage-meta";
  metaEl.textContent = meta;
  node.append(labelEl, valueEl, metaEl);
  return node;
}

function renderCoverageStrip(errorMessage = "") {
  if (!coverageStripEl) return;
  coverageStripEl.innerHTML = "";

  const rows = siteRows();
  const failedSites = Array.isArray(state.sourceStatus?.failed_sites) ? state.sourceStatus.failed_sites : [];
  const rss = state.sourceStatus?.rss_opml || {};
  const agentmail = state.sourceStatus?.agentmail || {};
  const xApi = state.sourceStatus?.x_api || {};
  const socialdata = state.sourceStatus?.socialdata || {};
  const grantPolicy = state.sourceStatus?.grant_policy || {};
  const slowProfessor = state.sourceStatus?.slow_professor || {};
  const githubProjects = state.sourceStatus?.github_projects || {};
  const allCount = Number(state.sourceStatus?.items_before_topic_filter || state.totalAllMode || state.itemsAll.length || 0);
  const coverageCount = Number(state.sourceStatus?.fetched_raw_items || state.totalRaw || allCount || 0);
  const officialCount = Number(siteRow("official_ai")?.item_count || 0);
  const newsletterCount = Number(siteRow("aibreakfast")?.item_count || 0);
  const curatedMediaCount = Number(siteRow("curated_media")?.item_count || 0);
  const buildersCount = Number(siteRow("followbuilders")?.item_count || 0);
  const creatorCount = state.creatorItemsAi.length || (siteAiPoolCount("tikhub_douyin") + siteAiPoolCount("tikhub_xiaohongshu"));
  const creatorRawCount = state.creatorItemsAll.length || (siteRawPoolCount("tikhub_douyin") + siteRawPoolCount("tikhub_xiaohongshu"));
  const socialdataPoolCount = siteAiPoolCount("socialdata_x");
  const xApiPoolCount = siteAiPoolCount("xapi");
  const xPoolCount = socialdataPoolCount + xApiPoolCount;
  const mailCount = Number(agentmail.item_count || 0);
  const totalSites = rows.length;
  const okSites = Number(state.sourceStatus?.successful_sites || 0);
  const opmlValue = rss.enabled ? `${fmtNumber(rss.ok_feeds || 0)}/${fmtNumber(rss.effective_feed_total || 0)}` : "OPML";
  const opmlMeta = rss.enabled ? "RSS示例/自定义订阅已接入" : "可用OPML批量接入RSS";
  const socialdataLabel = paidSourceLabel(socialdata, socialdataPoolCount, "SocialData", "");
  const xApiLabel = paidSourceLabel(xApi, xApiPoolCount, "X API", "");
  const xSourceLabel = socialdataLabel || xApiLabel || "X待配置";
  const mailLabel = agentmail.enabled ? `Mail ${fmtNumber(mailCount)}` : "Mail待配置";
  const grantValue = grantPolicy.enabled
    ? `${fmtNumber(grantPolicy.item_count || state.grantPolicyItems.length)} 条`
    : "专题待生成";
  const grantMeta = grantPolicy.enabled
    ? `公开源 ${fmtNumber(grantPolicy.ok_sources || 0)}/${fmtNumber(grantPolicy.source_total || 0)} · 国际入口 ${fmtNumber(grantPolicy.reference_source_count || 0)}`
    : "国自然 / 科研政策专题源";
  const slowProfessorValue = slowProfessor.enabled
    ? `${fmtNumber(slowProfessor.item_count || state.slowProfessorItems.length)} 条`
    : "专题待生成";
  const slowProfessorMeta = slowProfessor.enabled
    ? `近一周 · 已确认入口 ${fmtNumber(slowProfessor.confirmed_entry_count || state.slowProfessorConfirmedEntries.length)} · ${slowProfessor.source_mode === "needs_public_feed_url" ? "待公网RSS" : "RSS已接入"}`
    : "慢教授科研江湖公众号专题";
  const githubValue = githubProjects.enabled
    ? `${fmtNumber(githubProjects.item_count || state.githubProjectItems.length)} 个`
    : "项目待生成";
  const githubMeta = githubProjects.enabled
    ? `公开源 ${fmtNumber(githubProjects.ok_sources || 0)}/${fmtNumber(githubProjects.source_total || 0)} · 趣味项目排序`
    : "HelloGitHub / 科技周刊 / Awesome";
  const advancedValue = xPoolCount || mailCount
    ? `${xPoolCount ? `X ${fmtNumber(xPoolCount)}` : "X"} / ${mailCount ? `Mail ${fmtNumber(mailCount)}` : "Mail"}`
    : "X / Mail";
  const advancedMeta = socialdata.enabled || xApi.enabled || agentmail.enabled || xPoolCount
    ? `额度保护 · ${xSourceLabel} / ${mailLabel}`
    : "X API 与 AgentMail 默认关闭";

  const cards = [
    ["源健康", totalSites ? `${fmtNumber(okSites)}/${fmtNumber(totalSites)}` : "加载中", failedSites.length ? `${fmtNumber(failedSites.length)} 个失败源` : (errorMessage || "内置源正常"), failedSites.length ? "warn" : "ok"],
    ["今日覆盖池", `${fmtNumber(coverageCount)} 条`, allCount ? `全网抓取原始信号 · ${fmtNumber(allCount)} 条入池` : "全网抓取原始信号", "signal"],
    ["AI强相关", `${fmtNumber(state.totalAi)} 条`, "24小时强相关信号", "signal"],
    ["官方/日报源池", `${fmtNumber(officialCount + newsletterCount)} 条`, "官方节点 + AI Breakfast", "official"],
    ["精选媒体源池", `${fmtNumber(curatedMediaCount)} 条`, "The Decoder / TC / Verge / MTP 等", "signal"],
    ["国自然专题", grantValue, grantMeta, "official"],
    ["慢教授专题", slowProfessorValue, slowProfessorMeta, "private"],
    ["GitHub项目", githubValue, githubMeta, "builders"],
    ["Builders/X源池", `${fmtNumber(buildersCount)} 条`, "Follow Builders公开feed", "builders"],
    ["自媒体源池", `${fmtNumber(creatorCount)} 条`, sourcePoolMeta(creatorCount, creatorRawCount, "TikHub · 抖音 + 小红书"), "creator"],
    ["RSS/OPML扩展", opmlValue, opmlMeta, "private"],
    ["高级源", advancedValue, advancedMeta, "private"],
  ];

  cards.forEach(([label, value, meta, tone]) => {
    coverageStripEl.appendChild(renderCoverageCard(label, value, meta, tone));
  });
}

function renderAdvancedSummary() {
  if (!advancedSummaryEl) return;
  const status = state.sourceStatus;
  const filteredCount = getFilteredItems().length;
  if (!status) {
    advancedSummaryEl.textContent = `${fmtNumber(filteredCount)} 条结果`;
    return;
  }
  const sites = Array.isArray(status.sites) ? status.sites : [];
  const totalSites = sites.length;
  const okSites = Number(status.successful_sites || 0);
  const failed = failedSourceCount(status);
  advancedSummaryEl.textContent = `${fmtNumber(filteredCount)} 条结果 · ${fmtNumber(okSites)}/${fmtNumber(totalSites)} 源正常${failed ? ` · 失败 ${fmtNumber(failed)}` : ""}`;
}

function computeSiteStats(items) {
  const m = new Map();
  items.forEach((item) => {
    if (!m.has(item.site_id)) {
      m.set(item.site_id, { site_id: item.site_id, site_name: item.site_name, count: 0, raw_count: 0 });
    }
    const row = m.get(item.site_id);
    row.count += 1;
    row.raw_count += 1;
  });
  return Array.from(m.values()).sort((a, b) => b.count - a.count || a.site_name.localeCompare(b.site_name, "zh-CN"));
}

function currentSiteStats() {
  if (state.activeSection === "grant_policy") {
    return computeSiteStats(state.grantPolicyItems || []);
  }
  if (state.activeSection === "slow_professor") {
    return computeSiteStats(slowProfessorDisplayItems());
  }
  if (state.activeSection === "github_projects") {
    return computeSiteStats(state.githubProjectItems || []);
  }
  if (state.activeSection === "model_scores") {
    return computeSiteStats(state.modelScoreItems || []);
  }
  if (state.activeSection === "creator") {
    return computeSiteStats(state.mode === "all" ? state.creatorItemsAll : state.creatorItemsAi);
  }
  if (state.mode === "ai") return state.statsAi || [];
  return computeSiteStats(state.allDedup ? (state.itemsAll || []) : (state.itemsAllRaw || []));
}

function creatorHotScore(item) {
  return normalizedPercent(item?.creator_hot_score);
}

function highPriorityScore(item) {
  if (itemSections(item).has("github_projects")) return normalizedPercent(item.github_project_score || item.ai_score);
  if (itemSections(item).has("creator") && creatorHotScore(item)) return creatorHotScore(item);
  return scorePercent(item);
}

function isHighPriorityItem(item) {
  return highPriorityScore(item) >= 75 || itemPriorityScore(item) >= 82 || item.site_id === "official_ai" || item.site_id === "aihot";
}

function isCuratedItem(item) {
  return item.site_id === "official_ai" || item.site_id === "aihot" || item.source_tier === "official" || item.source_tier === "curated" || item.source_tier === "github_projects";
}

function itemSourceType(item) {
  const siteId = item.site_id || "";
  const tier = item.source_tier || "";
  if (GRANT_POLICY_SITE_IDS.has(siteId) || tier === "grant_policy") return "grant_policy";
  if (tier === "slow_professor" || siteId === "wechat_slow_professor") return "community";
  if (tier === "github_projects" || siteId.startsWith("github_")) return "github_projects";
  if (tier === "model_scores" || siteId === "model_scores") return "advanced";
  if (siteId === "official_ai" || tier === "official") return "official";
  if (siteId === "curated_media" || siteId === "aibreakfast" || siteId === "aihot") return "media";
  if (siteId === "opmlrss" || tier === "user_opml") return "rss";
  if (siteId === "waytoagi" || siteId === "followbuilders" || siteId === "hackernews" || siteId === "zeli" || siteId === "aibase") return "community";
  if (siteId === "tikhub_douyin" || siteId === "tikhub_xiaohongshu") return "creator";
  if (siteId === "socialdata_x" || siteId === "xapi" || siteId === "agentmail") return "advanced";
  return "aggregate";
}

function multiSourceEventKeys(items) {
  const map = new Map();
  (items || []).forEach((item) => {
    const key = eventKey(item);
    if (!map.has(key)) map.set(key, new Set());
    map.get(key).add(sourceSignal(item));
  });
  return new Set(Array.from(map.entries())
    .filter(([, sources]) => sources.size > 1)
    .map(([key]) => key));
}

function itemMatchesSignalLevel(item, multiSourceKeys = new Set()) {
  if (!state.signalLevelFilter) return true;
  if (state.signalLevelFilter === "high") return isHighPriorityItem(item);
  if (state.signalLevelFilter === "curated") return isCuratedItem(item);
  if (state.signalLevelFilter === "multi") return multiSourceKeys.has(eventKey(item));
  return true;
}

function sectionStats(sectionId) {
  const items = sectionItems(modeItems(), sectionId);
  const highCount = items.filter((item) => isHighPriorityItem(item)).length;
  const sourceSet = new Set(items.map((item) => item.source || item.site_name || item.site_id).filter(Boolean));
  return { items, count: items.length, highCount, sourceCount: sourceSet.size };
}

function renderSectionTabs() {
  if (!sectionTabsEl) return;
  sectionTabsEl.innerHTML = "";
  SECTION_DEFS.forEach((section) => {
    const stats = sectionStats(section.id);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `section-tab ${state.activeSection === section.id ? "active" : ""}`;
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", state.activeSection === section.id ? "true" : "false");
    btn.dataset.section = section.id;
    btn.innerHTML = `<span>${section.label}</span><strong>${fmtNumber(stats.count)}</strong>`;
    btn.addEventListener("click", () => {
      state.activeSection = section.id;
      state.boleExpanded = false;
      renderSectionTabs();
      renderModeSwitch();
      renderSiteFilters();
      renderBolePicks();
      if (state.waytoagiData) renderWaytoagi(state.waytoagiData);
      renderGrantPolicy();
      renderList();
    });
    sectionTabsEl.appendChild(btn);
  });
  renderSectionFilterSelect();
}

function renderSectionFilterSelect() {
  if (!sectionSelectEl) return;
  if (!sectionSelectEl.options.length) {
    SECTION_DEFS.forEach((section) => {
      const option = document.createElement("option");
      option.value = section.id;
      option.textContent = section.label;
      sectionSelectEl.appendChild(option);
    });
  }
  sectionSelectEl.value = state.activeSection;
}

function renderSectionSummary(filteredItems = null) {
  if (!sectionSummaryEl) return;
  const section = SECTION_BY_ID[state.activeSection] || SECTION_BY_ID.hot;
  const items = filteredItems || getFilteredItems();
  const highCount = items.filter((item) => isHighPriorityItem(item)).length;
  const sources = new Set(items.map((item) => item.source || item.site_name || item.site_id).filter(Boolean));
  if (state.activeSection === "grant_policy") {
    const datedCount = items.filter((item) => item.published_at && item.grant_date_status !== "unknown").length;
    const unknownDateCount = Math.max(0, items.length - datedCount);
    sectionSummaryEl.textContent = `专题池 · ${fmtNumber(items.length)} 条国自然 / 科研政策信号 · ${fmtNumber(datedCount)} 条有发布时间 · ${fmtNumber(unknownDateCount)} 条日期待核 · ${fmtNumber(sources.size)} 个来源`;
    renderStickySummary();
    return;
  }
  if (state.activeSection === "slow_professor") {
    const recentCount = state.slowProfessorItems.length;
    const confirmedCount = state.slowProfessorConfirmedEntries.length;
    const mode = state.slowProfessorData?.source_mode === "needs_public_feed_url"
      ? "待配置公网 RSS/WeWe"
      : "RSS/Atom 可用";
    sectionSummaryEl.textContent = `专题池 · 近一周 ${fmtNumber(recentCount)} 条 · 已确认入口 ${fmtNumber(confirmedCount)} 条 · ${mode} · 不使用第三方转载页冒充公众号`;
    renderStickySummary();
    return;
  }
  if (state.activeSection === "github_projects") {
    const starTotal = items.reduce((sum, item) => sum + Number(item.stars || 0), 0);
    sectionSummaryEl.textContent = `专题池 · ${fmtNumber(items.length)} 个好玩项目 · ${fmtNumber(sources.size)} 个推荐来源 · 合计 ${fmtNumber(starTotal)} stars · 小白友好优先`;
    renderStickySummary();
    return;
  }
  if (state.activeSection === "model_scores") {
    const updated = state.modelScoreData?.updated_label || "最新公开榜单";
    const benchmarks = new Set(items.map((item) => item.benchmark || item.source).filter(Boolean));
    sectionSummaryEl.textContent = `专题池 · ${fmtNumber(items.length)} 条模型评分 · ${fmtNumber(benchmarks.size)} 个榜单/指标 · 来源 Vellum LLM Leaderboard · ${updated}`;
    renderStickySummary();
    return;
  }
  const modeText = state.mode === "all" ? (state.allDedup ? "全量去重" : "全量原始") : "AI强相关";
  const windowText = state.activeSection === "creator" ? `过去 ${fmtNumber(state.creatorWindowDays)} 天 · 热度优先` : "过去 24 小时";
  const sectionName = section.id === "hot" ? "热点流" : section.label;
  sectionSummaryEl.textContent = `${windowText} · ${fmtNumber(items.length)} 条 ${sectionName}信号 · ${fmtNumber(highCount)} 条高优先级 · ${fmtNumber(sources.size)} 个来源 · ${modeText}`;
  renderStickySummary();
}

function siteRatioText(siteStats) {
  const count = Number(siteStats.count || 0);
  const raw = Number(siteStats.raw_count ?? siteStats.count ?? 0);
  if (!raw) {
    const scanned = Number(siteRow(siteStats.site_id)?.item_count || 0);
    if (!count && scanned) return `24h 0 · 已扫 ${fmtNumber(scanned)}`;
    if (!count) return "已扫 0";
    return `${fmtNumber(count)} 条`;
  }
  if (raw === count) return `${fmtNumber(count)} 条`;
  return `${fmtNumber(count)}/${fmtNumber(raw)} · ${Math.round((count / raw) * 100)}%AI`;
}

function renderSiteFilters() {
  const stats = currentSiteStats();

  siteSelectEl.innerHTML = '<option value="">全部站点</option>';
  stats.forEach((s) => {
    const opt = document.createElement("option");
    opt.value = s.site_id;
    opt.textContent = `${s.site_name} (${siteRatioText(s)})`;
    siteSelectEl.appendChild(opt);
  });
  siteSelectEl.value = state.siteFilter;

  sitePillsEl.innerHTML = "";
  const allPill = document.createElement("button");
  allPill.className = `pill ${state.siteFilter === "" ? "active" : ""}`;
  allPill.textContent = "全部";
  allPill.onclick = () => {
    state.siteFilter = "";
    renderSiteFilters();
    renderBolePicks();
    renderList();
  };
  sitePillsEl.appendChild(allPill);

  if (state.authorFilter) {
    const authorPill = document.createElement("button");
    authorPill.type = "button";
    authorPill.className = "pill active author-filter-pill";
    authorPill.textContent = `X 博主 ${state.authorFilter} ×`;
    authorPill.title = "清除博主筛选";
    authorPill.onclick = () => {
      state.authorFilter = "";
      state.siteFilter = "";
      state.siteGroupsExpanded = false;
      renderSiteFilters();
      renderBolePicks();
      renderList();
    };
    sitePillsEl.appendChild(authorPill);
  }

  stats.forEach((s) => {
    const btn = document.createElement("button");
    btn.className = `pill ${state.siteFilter === s.site_id ? "active" : ""}`;
    btn.textContent = `${s.site_name} ${siteRatioText(s)}`;
    btn.onclick = () => {
      state.siteFilter = s.site_id;
      if (s.site_id !== "socialdata_x") state.authorFilter = "";
      renderSiteFilters();
      renderBolePicks();
      renderList();
    };
    sitePillsEl.appendChild(btn);
  });
}

function renderModeSwitch() {
  modeAiBtnEl.classList.toggle("active", state.mode === "ai");
  modeAllBtnEl.classList.toggle("active", state.mode === "all");
  if (allDedupeWrapEl) allDedupeWrapEl.classList.toggle("show", state.mode === "all");
  if (allDedupeToggleEl) allDedupeToggleEl.checked = state.allDedup;
  if (allDedupeLabelEl) allDedupeLabelEl.textContent = state.allDedup ? "去重开" : "去重关";
  if (state.activeSection === "grant_policy") {
    modeHintEl.textContent = `科研政策 · ${fmtNumber(state.grantPolicyItems.length)} 条`;
  } else if (state.activeSection === "slow_professor") {
    modeHintEl.textContent = `慢教授 · 近一周 ${fmtNumber(state.slowProfessorItems.length)} 条`;
  } else if (state.activeSection === "github_projects") {
    modeHintEl.textContent = `GitHub项目 · ${fmtNumber(state.githubProjectItems.length)} 个`;
  } else if (state.activeSection === "model_scores") {
    modeHintEl.textContent = `模型评分 · ${fmtNumber(state.modelScoreItems.length)} 条`;
  } else if (state.mode === "ai") {
    modeHintEl.textContent = `AI强相关 · ${fmtNumber(state.totalAi)} 条`;
  } else {
    const allCount = state.allDedup
      ? (state.totalAllMode || state.itemsAll.length)
      : (state.totalRaw || state.itemsAllRaw.length);
    modeHintEl.textContent = `全量 · ${state.allDedup ? "去重开" : "去重关"} · ${fmtNumber(allCount)} 条`;
  }
  if (listTitleEl) {
    listTitleEl.textContent = listTitleText();
  }
  renderAdvancedSummary();
  renderSectionSummary();
}

function listTitleText() {
  const section = SECTION_BY_ID[state.activeSection] || SECTION_BY_ID.hot;
  if (state.activeSection === "slow_professor") return "慢教授科研江湖 · 近一周文章";
  if (state.activeSection === "github_projects") return "GitHub · 好玩项目榜";
  if (state.activeSection === "model_scores") return "模型评分 · Vellum LLM Leaderboard";
  const pool = state.mode === "all"
    ? (state.allDedup ? "情报流 · 全量去重" : "情报流 · 全量原始")
    : "情报流";
  return state.activeSection === "hot" ? pool : `${section.label} · ${pool}`;
}

function renderListSortTools() {
  if (!listSortToolsEl) return;
  const validSort = LIST_SORT_DEFS.some((item) => item.id === state.listSort);
  if (!validSort) state.listSort = "priority";
  listSortToolsEl.querySelectorAll("[data-sort]").forEach((button) => {
    const active = button.dataset.sort === state.listSort;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });
}

function itemSourceSortKey(item) {
  return [
    sourceSignal(item),
    item.site_name || item.site_id || "",
    item.source || "",
  ].join(" ").trim() || "来源";
}

function sortItemsForList(items) {
  if (state.activeSection === "model_scores") {
    return [...items].sort((a, b) => {
      const bySource = (MODEL_SCORE_SOURCE_ORDER[a.source] ?? 99) - (MODEL_SCORE_SOURCE_ORDER[b.source] ?? 99);
      if (bySource !== 0) return bySource;
      return Number(a.rank || 999) - Number(b.rank || 999) || Number(b.score || b.ai_score || 0) - Number(a.score || a.ai_score || 0);
    });
  }
  const sorted = [...items];
  if (state.listSort === "latest") {
    return sorted.sort((a, b) => timelineMs(b) - timelineMs(a) || itemPriorityScore(b) - itemPriorityScore(a));
  }
  if (state.listSort === "ai") {
    return sorted.sort((a, b) => scorePercent(b) - scorePercent(a) || itemPriorityScore(b) - itemPriorityScore(a) || timelineMs(b) - timelineMs(a));
  }
  if (state.listSort === "source") {
    const counts = new Map();
    sorted.forEach((item) => {
      const key = itemSourceSortKey(item);
      counts.set(key, (counts.get(key) || 0) + 1);
    });
    return sorted.sort((a, b) => {
      const aKey = itemSourceSortKey(a);
      const bKey = itemSourceSortKey(b);
      const byCount = (counts.get(bKey) || 0) - (counts.get(aKey) || 0);
      if (byCount !== 0) return byCount;
      const bySource = aKey.localeCompare(bKey, "zh-CN");
      if (bySource !== 0) return bySource;
      return itemPriorityScore(b) - itemPriorityScore(a) || timelineMs(b) - timelineMs(a);
    });
  }
  return sorted.sort((a, b) => itemPriorityScore(b) - itemPriorityScore(a) || timelineMs(b) - timelineMs(a));
}

function effectiveAllItems() {
  return state.allDedup ? state.itemsAll : state.itemsAllRaw;
}

function slowProfessorDisplayItems() {
  return Array.isArray(state.slowProfessorItems) ? state.slowProfessorItems : [];
}

function modeItems() {
  return state.mode === "all" ? effectiveAllItems() : state.itemsAi;
}

function sectionItems(items = modeItems(), sectionId = state.activeSection) {
  if (sectionId === "grant_policy") {
    return [...(state.grantPolicyItems || [])].sort((a, b) => timelineMs(b) - timelineMs(a));
  }
  if (sectionId === "slow_professor") {
    return slowProfessorDisplayItems().sort((a, b) => timelineMs(b) - timelineMs(a));
  }
  if (sectionId === "github_projects") {
    return [...(state.githubProjectItems || [])].sort((a, b) => itemPriorityScore(b) - itemPriorityScore(a) || Number(b.stars || 0) - Number(a.stars || 0));
  }
  if (sectionId === "model_scores") {
    return [...(state.modelScoreItems || [])].sort((a, b) => {
      const bySource = (MODEL_SCORE_SOURCE_ORDER[a.source] ?? 99) - (MODEL_SCORE_SOURCE_ORDER[b.source] ?? 99);
      if (bySource !== 0) return bySource;
      return Number(a.rank || 999) - Number(b.rank || 999) || Number(b.score || b.ai_score || 0) - Number(a.score || a.ai_score || 0);
    });
  }
  if (sectionId === "creator") {
    const creatorSource = state.mode === "all" ? state.creatorItemsAll : state.creatorItemsAi;
    return [...creatorSource].sort((a, b) => creatorHotScore(b) - creatorHotScore(a) || timelineMs(b) - timelineMs(a));
  }
  const source = Array.isArray(items) ? items : [];
  if (sectionId === "hot") {
    return [...source].sort((a, b) => itemPriorityScore(b) - itemPriorityScore(a) || timelineMs(b) - timelineMs(a));
  }
  return source.filter((item) => itemMatchesSection(item, sectionId));
}

function getFilteredItems() {
  const q = state.query.trim().toLowerCase();
  const preliminary = sectionItems().filter((item) => {
    if (state.siteFilter && item.site_id !== state.siteFilter) return false;
    if (state.authorFilter && (item.site_id !== "socialdata_x" || item.source !== state.authorFilter)) return false;
    if (state.sourceTypeFilter && itemSourceType(item) !== state.sourceTypeFilter) return false;
    if (!q) return true;
    const hay = `${item.title || ""} ${item.title_zh || ""} ${item.title_en || ""} ${item.site_name || ""} ${item.source || ""}`.toLowerCase();
    return hay.includes(q);
  });
  const multiKeys = multiSourceEventKeys(preliminary);
  return preliminary.filter((item) => itemMatchesSignalLevel(item, multiKeys));
}

function itemTitleText(item) {
  return (item.title_zh || item.title || item.title_en || "未命名更新").trim();
}

function scorePercent(item) {
  const score = Number(item.ai_score ?? item.score ?? 0);
  if (!Number.isFinite(score) || score <= 0) return 0;
  return Math.round(score <= 1 ? score * 100 : score);
}

function normalizedPercent(value) {
  const score = Number(value);
  if (!Number.isFinite(score) || score <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round(score <= 1 ? score * 100 : score)));
}

function scoreTone(score) {
  if (score >= 90) return "hot";
  if (score >= 75) return "strong";
  return "watch";
}

function itemLabelTone(item) {
  const label = item.ai_label || "";
  if (item.site_id === "official_ai") return "official";
  if (item.site_id === "aihot" || label === "curated_hotlist") return "hot";
  if (itemSections(item).has("grant_policy")) return "official";
  if (itemSections(item).has("slow_professor")) return "community";
  if (itemSections(item).has("github_projects")) return "devtools";
  if (itemSections(item).has("creator")) return "creator";
  if (label === "model_release") return "models";
  if (label === "developer_tool" || label === "developer_tooling" || label === "infrastructure" || label === "infra_compute") return "devtools";
  if (label === "research_paper") return "research";
  if (label === "industry_business") return "industry";
  if (label === "ai_product_update" || label === "agent_workflow" || label === "robotics") return "products";
  if (itemSections(item).has("community")) return "community";
  return "default";
}

function itemTagTone(label) {
  const text = String(label || "");
  if (text.includes("多源")) return "strong";
  if (text.includes("官方")) return "official";
  if (text.includes("精选") || text.includes("热点")) return "hot";
  if (text.includes("HN")) return "aggregate";
  if (text.includes("GitHub") || text.includes("开源项目")) return "devtools";
  if (text.includes("国自然") || text.includes("科研政策")) return "official";
  if (text.includes("科研写作")) return "research";
  if (text.includes("模型")) return "models";
  if (text.includes("开发")) return "devtools";
  if (text.includes("研究")) return "research";
  if (text.includes("自媒体")) return "creator";
  if (text.includes("社区")) return "community";
  if (text.includes("产品")) return "products";
  if (text.includes("行业")) return "industry";
  return "default";
}

function itemTagChip(label) {
  const tag = document.createElement("span");
  tag.className = `signal-tag tone-${itemTagTone(label)}`;
  tag.textContent = label;
  return tag;
}

function setSourceBadge(el, label, tone = "default", title = "") {
  el.className = `source source-chip kind-${tone}`;
  el.innerHTML = "";
  if (title) el.title = title;
  const dot = document.createElement("span");
  dot.className = "source-dot";
  dot.setAttribute("aria-hidden", "true");
  const text = document.createElement("span");
  text.className = "source-chip-label";
  text.textContent = label || "来源";
  el.append(dot, text);
}

function sourceTierPercent(item) {
  if (item.site_id === "official_ai") return 100;
  if (item.site_id === "aihot") return 90;
  const rank = Number(item.source_tier_rank);
  if (!Number.isFinite(rank)) return 38;
  return Math.max(28, Math.min(86, 86 - rank * 9));
}

function editorialPercent(item) {
  const aihotScore = normalizedPercent(item.aihot_score);
  if (aihotScore) return aihotScore;
  if (item.site_id === "official_ai") return 90;
  if (item.site_id === "aihot") return 78;
  const internal = scorePercent(item);
  return internal ? Math.max(45, Math.round(internal * 0.72)) : 36;
}

function freshnessPercent(item, halfLifeHours = 48) {
  const ageMs = Date.now() - timelineMs(item);
  if (!Number.isFinite(ageMs) || ageMs < 0) return 100;
  const ageHours = ageMs / 3600000;
  return Math.max(0, Math.min(100, Math.round(100 * Math.pow(0.5, ageHours / halfLifeHours))));
}

function itemPriorityScore(item) {
  if (itemSections(item).has("github_projects")) return normalizedPercent(item.github_project_score || item.ai_score);
  const creatorScore = creatorHotScore(item);
  if (creatorScore && itemSections(item).has("creator")) return creatorScore;
  const internal = scorePercent(item);
  const editorial = editorialPercent(item);
  const source = sourceTierPercent(item);
  const freshness = freshnessPercent(item);
  const signal = Array.isArray(item.ai_signals) ? Math.min(100, item.ai_signals.length * 18) : 0;
  return Math.round((editorial * 0.3) + (source * 0.22) + (internal * 0.2) + (freshness * 0.18) + (signal * 0.1));
}

function labelText(item) {
  const labels = {
    ai_general: "AI信号",
    model_release: "模型发布",
    agent_workflow: "Agent工作流",
    ai_product_update: "产品更新",
    developer_tooling: "开发工具",
    developer_tool: "开发工具",
    infrastructure: "基础设施",
    infra_compute: "基础设施",
    industry_business: "行业动态",
    research_paper: "研究论文",
    research_policy: "科研政策",
    research_writing: "科研写作",
    github_project: "开源项目",
    robotics: "机器人",
    curated_hotlist: "热点",
    ai_tech: "技术趋势",
  };
  return labels[item.ai_label] || item.ai_label || "精选信号";
}

function itemHaystack(item) {
  return [
    item.title,
    item.title_zh,
    item.title_en,
    item.title_original,
    item.source,
    item.site_name,
    item.site_id,
    item.ai_label,
    ...(Array.isArray(item.ai_signals) ? item.ai_signals : []),
  ].filter(Boolean).join(" ").toLowerCase();
}

function matchesAny(text, patterns) {
  return patterns.some((pattern) => pattern.test(text));
}

function itemSections(item) {
  const hay = itemHaystack(item);
  const contentHay = [
    item.title,
    item.title_zh,
    item.title_en,
    item.title_original,
    item.source,
    item.site_name,
    item.site_id,
    ...(Array.isArray(item.ai_signals) ? item.ai_signals : []),
  ].filter(Boolean).join(" ").toLowerCase();
  const sections = new Set();
  const label = item.ai_label || "";
  const source = `${item.source || ""} ${item.site_name || ""}`.toLowerCase();
  if (GRANT_POLICY_SITE_IDS.has(item.site_id) || item.source_tier === "grant_policy") {
    sections.add("grant_policy");
  }
  if (item.site_id === "wechat_slow_professor" || item.source_tier === "slow_professor") {
    sections.add("slow_professor");
  }
  if (item.source_tier === "github_projects" || String(item.site_id || "").startsWith("github_")) {
    sections.add("github_projects");
  }
  if (item.source_tier === "model_scores" || item.site_id === "model_scores") {
    sections.add("model_scores");
  }
  const hasExplicitModelTerm = matchesAny(contentHay, [
    /gpt[-\s]?\d|claude|gemini|grok|llama|qwen|deepseek|mistral|kimi\s?k\d|glm|gemma|模型|model|weights|权重|多模态|视频生成|diffusion|sora|seedance|llm|大模型/,
  ]);
  const looksLikeToolOrProduct = matchesAny(hay, [
    /skill|copilot|codex|cli|api|sdk|dashboard|workflow|tool|工具|助手|应用|插件|工作流|支付宝|浏览器|搜索/,
  ]);

  if (
    hasExplicitModelTerm ||
    (label === "model_release" && !looksLikeToolOrProduct)
  ) sections.add("models");

  if (
    label === "ai_product_update" ||
    label === "agent_workflow" ||
    label === "robotics" ||
    matchesAny(hay, [
      /app|product|agent|workflow|siri|copilot|chatgpt|perplexity|runway|suno|支付宝|产品|应用|智能体|机器人|浏览器|搜索|助手|生成工具|办公|教育/,
    ])
  ) sections.add("products");

  if (
    label === "developer_tool" ||
    label === "developer_tooling" ||
    label === "infra_compute" ||
    matchesAny(hay, [
      /github|cursor|codex|copilot|openrouter|api|sdk|mcp|cli|framework|inference|推理|开发者|开源|代码|编程|算力|芯片|nvidia|cloud|部署|benchmarking|token/,
    ])
  ) sections.add("devtools");

  if (
    item.site_id === "hackernews" ||
    item.site_id === "zeli" ||
    source.includes("hacker news") ||
    source.includes("hackernews") ||
    source.includes("hn algolia")
  ) sections.add("hn");

  if (
    label === "industry_business" ||
    matchesAny(hay, [
      /funding|raised|ipo|acquire|acquisition|lawsuit|regulation|policy|white house|pentagon|nvidia|salesforce|meta|microsoft|融资|收购|上市|监管|政策|裁员|估值|债券|芯片|公司|行业|政府|五角大楼|白宫/,
    ])
  ) sections.add("industry");

  if (
    label === "research_paper" ||
    matchesAny(hay, [
      /paper|arxiv|research|benchmark|eval|dataset|lmsys|rdi|berkeley|huggingface daily papers|论文|研究|基准|评测|数据集|训练|k-means|speculative decoding/,
    ])
  ) sections.add("research");

  if (
    item.site_id === "tikhub_douyin" ||
    item.site_id === "tikhub_xiaohongshu" ||
    source.includes("douyin") ||
    source.includes("xiaohongshu") ||
    source.includes("小红书") ||
    source.includes("抖音")
  ) sections.add("creator");

  if (
    item.site_id === "wechat_slow_professor" ||
    item.site_id === "waytoagi" ||
    item.site_id === "followbuilders" ||
    item.site_id === "aibase" ||
    source.includes("it之家") ||
    source.includes("36氪") ||
    source.includes("掘金") ||
    source.includes("readhub") ||
    source.includes("aibase") ||
    source.includes("公众号") ||
    source.includes("宝玉") ||
    source.includes("小互") ||
    source.includes("ayi") ||
    matchesAny(hay, [
      /waytoagi|社区|公众号|阿里|通义|千问|智谱|kimi|月之暗面|minimax|字节|火山|百度|腾讯|华为|蚂蚁|讯飞|国内|中文|开源中国|少数派|虎嗅/,
    ])
  ) sections.add("community");

  if (!sections.size) sections.add("industry");
  return sections;
}

function itemMatchesSection(item, sectionId) {
  return sectionId === "hot" || itemSections(item).has(sectionId);
}

function sectionBadgeLabel(sectionId) {
  return SECTION_BY_ID[sectionId]?.short || "栏目";
}

function reasonText(item) {
  const creatorScore = creatorHotScore(item);
  if (creatorScore && itemSections(item).has("creator")) {
    const metrics = item.creator_metrics || {};
    const parts = [
      `赞 ${fmtNumber(metrics.likes)}`,
      `藏 ${fmtNumber(metrics.collects)}`,
      `评 ${fmtNumber(metrics.comments)}`,
      `转 ${fmtNumber(metrics.shares)}`,
    ];
    if (Number(item.creator_freshness_bonus || 0) > 0) parts.push("24h 加分");
    return `一周互动：${parts.join(" · ")}`;
  }
  if (itemSections(item).has("github_projects")) {
    const stars = Number(item.stars || 0);
    const language = item.language || "未标注语言";
    const sources = Array.isArray(item.recommend_sources) ? item.recommend_sources.slice(0, 3).join(" / ") : item.site_name;
    return `推荐来源：${sources || "GitHub"} · ${stars ? `${fmtNumber(stars)} stars` : "热度待核"} · ${language}`;
  }
  const signals = Array.isArray(item.ai_signals) ? item.ai_signals.filter(Boolean).slice(0, 3) : [];
  if (signals.length) return `命中方向：${signals.join(" / ")}`;
  if (item.ai_relevance_reason) return String(item.ai_relevance_reason).replaceAll("_", " ");
  return "来源与标题信号通过筛选";
}

function timelineIso(item) {
  const published = item.published_at || "";
  const seen = item.first_seen_at || "";
  const generated = state.generatedAt || "";
  if (itemSections(item).has("grant_policy") && !published && item.grant_date_status === "unknown") {
    return "";
  }
  if (published && generated) {
    const publishedMs = new Date(published).getTime();
    const generatedMs = new Date(generated).getTime();
    if (Number.isFinite(publishedMs) && Number.isFinite(generatedMs) && publishedMs > generatedMs + 10 * 60 * 1000) {
      return seen || published;
    }
  }
  return published || seen;
}

function timelineMs(item) {
  const d = new Date(timelineIso(item));
  return Number.isNaN(d.getTime()) ? 0 : d.getTime();
}

function timeLabelText(item, fallbackIso = "") {
  if (itemSections(item).has("grant_policy") && item.grant_date_status === "unknown") {
    return item.grant_date_label || "日期待核";
  }
  if (itemSections(item).has("slow_professor")) {
    if (item.date_status === "confirmed_entry") return item.date_label || "已确认入口";
    if (!item.published_at) return item.date_label || "日期待核";
  }
  if (itemSections(item).has("github_projects")) {
    return item.github_project_date_label || "本次收录";
  }
  return fmtTime(timelineIso(item) || fallbackIso);
}

function normalizedEventText(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[\s\u3000]+/g, "")
    .replace(/[，。、“”‘’：:；;！!？?（）()\[\]【】《》<>·.,/\\|_-]/g, "");
}

function eventKey(item) {
  const raw = itemTitleText(item);
  const bracket = raw.match(/《([^》]{4,40})》/);
  if (bracket) return `book:${normalizedEventText(bracket[1]).slice(0, 36)}`;

  const normalized = normalizedEventText(raw);
  const model = normalized.match(/(bitcpmcann|deepseekv\d+(?:pro)?|grokv\d+(?:medium)?|gemini\d+(?:\.\d+)?(?:flash|pro)?|gpt\d+(?:\.\d+)?|llama\d+)/);
  if (model) return `entity:${model[1]}`;

  return `title:${normalized.slice(0, 34)}`;
}

function itemIdentityKeys(item) {
  const keys = new Set();
  if (!item) return keys;
  const url = item.url || item.primary_url;
  if (url) keys.add(`url:${url}`);
  if (item.id) keys.add(`id:${item.id}`);
  const title = item.title_zh || item.title || item.title_en || item.title_original;
  if (title) {
    keys.add(`event:${eventKey({ ...item, title, title_zh: item.title_zh || title })}`);
    keys.add(`title:${normalizedEventText(title).slice(0, 34)}`);
  }
  return keys;
}

function storyIdentityKeys(story) {
  const keys = new Set();
  if (!story) return keys;
  const refs = [
    { id: story.story_id, title: story.title, url: story.primary_url || story.url },
    story.primary_item,
    ...(Array.isArray(story.sources) ? story.sources : []),
    ...(Array.isArray(story.items) ? story.items : []),
  ].filter(Boolean);
  refs.forEach((ref) => {
    itemIdentityKeys(ref).forEach((key) => keys.add(key));
  });
  return keys;
}

function headlineRowIdentityKeys(row) {
  const keys = new Set();
  if (!row) return keys;
  const refs = [
    row.item,
    ...(Array.isArray(row.rows) ? row.rows.map((entry) => entry.item).filter(Boolean) : []),
  ].filter(Boolean);
  refs.forEach((ref) => {
    itemIdentityKeys(ref).forEach((key) => keys.add(key));
  });
  return keys;
}

function excludedStoryKeySet(rows) {
  const keys = new Set();
  rows.forEach((row) => {
    headlineRowIdentityKeys(row).forEach((key) => keys.add(key));
  });
  return keys;
}

function storyHasAnyKey(story, keys) {
  if (!keys || !keys.size) return false;
  for (const key of storyIdentityKeys(story)) {
    if (keys.has(key)) return true;
  }
  return false;
}

function sourceSignal(item) {
  const site = item.site_name || "";
  const source = item.source || "";
  const hay = `${site} ${source}`.toLowerCase();
  if (site === "AI HOT") return "AI HOT精选";
  if (item.site_id === "wechat_slow_professor" || hay.includes("慢教授")) return "慢教授";
  if (hay.includes("hackernews") || hay.includes("hacker news")) return "HN热议";
  if (hay.includes("hellogithub")) return "HelloGitHub";
  if (hay.includes("科技爱好者周刊") || hay.includes("weekly")) return "科技周刊";
  if (hay.includes("awesome")) return "Awesome";
  if (source.includes("GitHub · Trending Today") || hay.includes("github")) return "GitHub趋势";
  if (site === "Official AI Updates") return "官方更新";
  if (site === "Follow Builders") return "Builders";
  if (site === "TikHub Douyin" || hay.includes("tikhub douyin")) return "抖音自媒体";
  if (site === "TikHub Xiaohongshu" || hay.includes("tikhub xiaohongshu")) return "小红书自媒体";
  if (site === "AIbase") return "AIbase";
  if (site === "OPML RSS") return "OPML";
  return site || "来源";
}

function sourcePriority(item) {
  const signal = sourceSignal(item);
  if (signal === "官方更新") return 100;
  if (signal === "AI HOT精选") return 90;
  if (signal === "AIbase") return 82;
  if (signal === "慢教授") return 82;
  if (signal === "HelloGitHub") return 80;
  if (signal === "科技周刊") return 76;
  if (signal === "Awesome") return 68;
  if (signal === "Builders") return 74;
  if (signal === "抖音自媒体" || signal === "小红书自媒体") return 70;
  if (signal === "OPML") return 68;
  if (signal === "HN热议" || signal === "GitHub趋势") return 62;
  return 50;
}

function clusterBoleEvents(rows) {
  const clusters = new Map();
  rows.forEach((row) => {
    const key = eventKey(row.item);
    if (!clusters.has(key)) clusters.set(key, { key, rows: [], signals: new Set(), score: 0, primary: row });
    const cluster = clusters.get(key);
    cluster.rows.push(row);
    cluster.signals.add(sourceSignal(row.item));
    const currentPrimary = cluster.primary;
    const betterPrimary = sourcePriority(row.item) - sourcePriority(currentPrimary.item)
      || row.score - currentPrimary.score
      || timelineMs(row.item) - timelineMs(currentPrimary.item);
    if (betterPrimary > 0) cluster.primary = row;
  });
  return Array.from(clusters.values()).map((cluster) => {
    const signals = Array.from(cluster.signals);
    const maxScore = Math.max(...cluster.rows.map((row) => row.score));
    const sourceBonus = Math.min(12, Math.max(0, signals.length - 1) * 6);
    const candidateBonus = signals.some((s) => s === "AI HOT精选") ? 8
      : signals.some((s) => s === "HN热议" || s === "GitHub趋势") ? 6
      : signals.some((s) => s === "官方更新") ? 5
      : 0;
    return {
      item: cluster.primary.item,
      index: cluster.primary.index,
      rows: cluster.rows,
      sourceSignals: signals,
      sourceCount: signals.length,
      mergedCount: cluster.rows.length,
      score: Math.min(100, Math.round(maxScore + sourceBonus + candidateBonus)),
    };
  });
}

function storyTimeMs(story, key) {
  const iso = story && story[key];
  if (!iso) return 0;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? 0 : d.getTime();
}

function storyScore(story) {
  const raw = (story && (story.importance_score ?? story.score ?? story.importance)) || 0;
  const score = Number(raw);
  if (!Number.isFinite(score) || score <= 0) return 0;
  return Math.round(score <= 1 ? score * 100 : score);
}

function storyImportanceTone(label) {
  if (!label) return "watch";
  if (label.includes("重大")) return "hot";
  if (label.includes("官方")) return "official";
  if (label.includes("多源")) return "strong";
  if (label.includes("行业")) return "watch";
  return "watch";
}

function storyPrimaryTitleText(story) {
  const primary = (story && story.primary_item) || {};
  const bilingual = String(primary.title || (story && story.title) || "").trim();
  if (bilingual.includes(" / ")) {
    const [zh, en] = bilingual.split(" / ");
    return (zh || en || bilingual).trim();
  }
  return bilingual || "未命名更新";
}

function storyPrimaryEnText(story) {
  const primary = (story && story.primary_item) || {};
  const bilingual = String(primary.title || (story && story.title) || "").trim();
  if (bilingual.includes(" / ")) {
    const [, en] = bilingual.split(" / ");
    return (en || "").trim();
  }
  return "";
}

function storySourceCount(story) {
  const sources = Array.isArray(story && story.sources) ? story.sources : [];
  const explicit = Number(story && story.duplicate_count);
  if (Number.isFinite(explicit) && explicit > 0) return explicit;
  return Math.max(1, sources.length);
}

function storyDurationLabel(earliest, latest) {
  if (!earliest || !latest || earliest === latest) return "";
  const start = new Date(earliest).getTime();
  const end = new Date(latest).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end)) return "";
  const minutes = Math.round(Math.abs(end - start) / 60000);
  if (minutes < 20) return "短时集中";
  if (minutes < 60) return `发酵 ${minutes} 分钟`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `发酵 ${hours}小时${rest}分` : `发酵 ${hours}小时`;
}

function formatStoryTime(story) {
  const earliest = story.earliest_at;
  const latest = story.latest_at;
  if (latest && earliest && latest !== earliest) {
    return { latest, rangeLabel: storyDurationLabel(earliest, latest) };
  }
  return { latest: latest || earliest, rangeLabel: "" };
}

function pickBoleItems(items) {
  const ranked = [...items]
    .map((item, index) => ({ item, index, score: scorePercent(item) }))
    .filter((row) => row.score > 0)
    .sort((a, b) => {
      const byScore = b.score - a.score;
      if (byScore !== 0) return byScore;
      return timelineMs(b.item) - timelineMs(a.item) || a.index - b.index;
    });

  const sorted = clusterBoleEvents(ranked).sort((a, b) => {
    const byMultiSource = b.sourceCount - a.sourceCount;
    const byScore = b.score - a.score;
    return byMultiSource || byScore || timelineMs(b.item) - timelineMs(a.item) || a.index - b.index;
  });

  const picked = [];
  const addPick = (cluster) => {
    if (cluster && !picked.includes(cluster) && picked.length < 8) picked.push(cluster);
  };
  ["AI HOT精选", "HN热议", "GitHub趋势"].forEach((signal) => {
    addPick(sorted.find((cluster) => cluster.sourceSignals.includes(signal)));
  });
  sorted.forEach(addPick);
  return picked;
}

function boleReasonText(row) {
  const signals = row.sourceSignals || [];
  const sourceText = signals.length ? `来源命中：${signals.join(" / ")}` : "来源命中：单源";
  const mergeText = row.mergedCount > 1 ? `合并${row.mergedCount}条同事件` : "单条事件";
  return `${sourceText} · ${mergeText} · ${reasonText(row.item)}`;
}

function cleanBriefText(text, max = 220) {
  const raw = String(text || "").trim();
  if (!raw) return "";
  const probe = document.createElement("div");
  probe.innerHTML = raw.replace(/<br\s*\/?>/gi, " ");
  const plain = (probe.textContent || raw).replace(/\s+/g, " ").trim();
  if (!plain) return "";
  if (plain.length <= max) return plain;
  return `${plain.slice(0, Math.max(0, max - 1)).trim()}…`;
}

function insightSummaryText(item, context = {}, max = 260) {
  return cleanBriefText(
    item.summary
      || context.summary
      || context.description
      || item.description
      || item.abstract
      || item.preview
      || item.excerpt,
    max
  );
}

function paperLikeItem(item) {
  if (itemSections(item).has("github_projects")) return false;
  const hay = [
    item.ai_label,
    item.grant_source_type,
    item.site_id,
    item.site_name,
    item.source,
    item.title,
    item.title_zh,
    item.title_en,
  ].filter(Boolean).join(" ").toLowerCase();
  return item.ai_label === "research_paper"
    || item.grant_source_type === "journal"
    || ["grant_fundamental_research", "grant_bnsfc", "grant_csb"].includes(item.site_id)
    || /arxiv|paper|journal|article|论文|期刊|fundamental research|science bulletin|科学通报|中国科学基金/.test(hay);
}

function firstSentence(text, max = 160) {
  const clean = cleanBriefText(text, max);
  if (!clean) return "";
  const match = clean.match(/^(.+?[。！？.!?])\s+/);
  return cleanBriefText(match ? match[1] : clean, max);
}

function titleBeforeVerb(title) {
  const match = String(title || "").match(/^(.+?)\b(?:reveals?|enables?|improves?|detects?|identifies?|shows?|demonstrates?|predicts?|uncovers?|provides?)\b/i);
  return cleanBriefText(match ? match[1] : "", 120);
}

function titleAfterVerb(title) {
  const match = String(title || "").match(/\b(?:reveals?|enables?|improves?|detects?|identifies?|shows?|demonstrates?|predicts?|uncovers?|provides?)\s+(.+)$/i);
  return cleanBriefText(match ? match[1] : "", 140);
}

function titleMethodClause(title) {
  const byClause = String(title || "").match(/\b(?:using|via|with|based on|by)\s+(.+)$/i);
  const beforeVerb = titleBeforeVerb(title);
  if (beforeVerb) return beforeVerb;
  if (byClause) return cleanBriefText(byClause[1], 130);
  return "";
}

function titleProblemClause(title) {
  const text = String(title || "");
  const detection = text.match(/\b(?:detection|detecting|diagnosis|classification|prediction|quantification|measurement|assessment|identification)\s+of\s+(.+?)(?:\s+(?:using|via|with|based on|by)\b|$)/i);
  if (detection) return `围绕 ${cleanBriefText(detection[1], 120)} 的检测、识别或评估问题。`;
  const forClause = text.match(/\bfor\s+(.+?)(?:\s+(?:using|via|with|based on|by)\b|$)/i);
  if (forClause) return `服务于 ${cleanBriefText(forClause[1], 120)} 这一应用或研究问题。`;
  const inClause = text.match(/\bin\s+(.+?)(?:\s+(?:using|via|with|based on|by)\b|$)/i);
  if (inClause) return `聚焦 ${cleanBriefText(inClause[1], 120)} 场景中的机制或方法问题。`;
  return "";
}

function abstractSentences(text, maxSentences = 12) {
  const clean = cleanBriefText(text, 1600);
  if (!clean) return [];
  return clean
    .replace(/^abstract\s+/i, "")
    .split(/(?<=[。！？.!?])\s+/)
    .map((sentence) => cleanBriefText(sentence, 210))
    .filter(Boolean)
    .slice(0, maxSentences);
}

function pickSentence(sentences, patterns, fallback = "") {
  const hit = sentences.find((sentence) => patterns.some((pattern) => pattern.test(sentence)));
  return hit || fallback || "";
}

function paperFeynmanLine(plainText, evidence = "") {
  const cleanEvidence = cleanBriefText(evidence, 230);
  return cleanEvidence ? `${plainText} 原文线索：${cleanEvidence}` : plainText;
}

function grantPolicyFeynmanText(item) {
  const title = cleanBriefText(itemTitleText(item), 180);
  const site = item.site_name || item.source || "公开来源";
  const topic = item.grant_topic || "科研政策";
  const sourceType = item.grant_source_type || "";
  const hay = `${title} ${site} ${topic} ${sourceType}`.toLowerCase();
  const has = (...words) => words.some((word) => hay.includes(String(word).toLowerCase()));

  if (paperLikeItem(item)) {
    const problem = titleProblemClause(title);
    if (title.includes("Corrigendum") || title.includes("更正")) {
      return "大白话：这是论文更正，不是新项目通知。主要提醒你原论文有修订信息；只有正在引用或跟进这篇论文时，才值得优先点开。";
    }
    if (problem) {
      return `大白话：这是一篇基础研究论文，核心是在讲${problem.replace(/。$/, "")}。如果你的选题、方法或基金论证和这个问题相近，再点开看它的方法、数据和结论。`;
    }
    return "大白话：这是一篇基础研究论文。先把它当作“别人正在研究什么问题”的线索；如果题目和你的方向贴近，再点开看它解决了什么、怎么做、结果是否能借鉴。";
  }

  if (has("求是")) {
    return "大白话：这不是具体申报通知，更像政策风向标。它在告诉你国家为什么更重视基础研究、接下来可能鼓励什么方向，适合用来判断选题叙事和申报书背景。";
  }

  if (has("重要指示", "习近平")) {
    return "大白话：这是最高层对基础研究和基金委工作的定调。它不告诉你今天怎么填表，但会影响以后基金支持什么、评审更看重什么。";
  }

  if (has("项目指南")) {
    return "大白话：这就是“今年能报什么、按什么规则报”的说明书。准备申报的人要优先点开，看项目类型、条件、时间节点和材料要求。";
  }

  if (has("申报指南", "指南征求意见")) {
    return "大白话：这条在提前征求项目指南意见，相当于正式发车前先让大家看路线。相关方向的老师可以看看主题设置，判断自己的课题能不能贴上去。";
  }

  if (has("申请初审结果", "初审结果")) {
    return "大白话：这是项目申请过没过第一道形式审查的消息。重点不是学术水平，而是材料、资格、格式等有没有先被挡在门外。";
  }

  if (has("申请与结题", "结题", "有关事项")) {
    return "大白话：这是申报和结题的时间表、材料清单和流程提醒。它像日历和办事指南，适合用来防止错过节点或漏交材料。";
  }

  if (has("依托单位注册", "注册申请")) {
    return "大白话：这条主要给单位科研管理部门看。意思是单位要先完成注册，后面老师和团队才可能顺利通过这个单位报基金。";
  }

  if (has("评审会议", "评审会")) {
    return "大白话：这说明相关项目已经进入专家评审阶段。对申请人来说，可以借它判断评审节奏；对旁观者来说，可以看基金委近期重点推进哪些项目类型。";
  }

  if (has("资助", "重点国际", "合作研究")) {
    return "大白话：这类消息和“钱投向哪里、合作方向怎么定”有关。适合看资助导向、合作对象和后续布局机会。";
  }

  if (has("科研诚信")) {
    return "大白话：这类消息讲科研底线和规则。它提醒你哪些行为会影响项目申请、评审和结题，属于申报前必须避坑的信息。";
  }

  if (has("科技日报", "新华社", "主任", "党组书记")) {
    return "大白话：这是官方媒体或负责人对基金委工作的解读。它不一定是操作通知，但能帮你理解基金委接下来强调基础研究、原始创新和人才支持的方向。";
  }

  if (has("工作会议", "年度工作会议")) {
    return "大白话：这是机构年度部署。重点看它今年准备把精力放在哪些科研任务、政策研究或管理改革上，可作为判断大方向的背景材料。";
  }

  if (has("巡视", "党组")) {
    return "大白话：这类信息更多是机构治理和内部管理动态。和具体申报关系不大，但能看出科研机构最近在规范管理、监督和整改什么。";
  }

  if (has("招聘", "岗位")) {
    return "大白话：这是人才招聘线索，不是基金通知。适合关心科研岗位、智库岗位或政策研究岗位的人点开看条件和方向。";
  }

  if (has("毕业典礼", "学位授予")) {
    return "大白话：这是院校活动新闻，和基金申报关联较弱。除非你关注这个机构的人才培养和学科动态，否则可以低优先级处理。";
  }

  if (has("依申请公开")) {
    return "大白话：这是政务公开入口类信息，不是具体新闻。你可以把它理解为“需要向机构申请公开材料时走这里”。";
  }

  if (has("香山科学会议")) {
    const evidence = insightSummaryText(item, {}, 260);
    if (topic.includes("会议公告")) {
      return paperFeynmanLine("大白话：这是会前公告，重点看这场会是否召开、什么时候开、主题是不是贴近你的研究方向。", evidence);
    }
    if (topic.includes("会议动态")) {
      return paperFeynmanLine("大白话：这是会议动态/会议简况，重点看专家们围绕什么科学问题讨论，以及有没有形成值得追踪的共识。", evidence);
    }
    return paperFeynmanLine("大白话：这是高层次学术会议线索。它常常反映一批专家正在讨论的前沿科学问题，适合用来寻找基础研究选题的早期信号。", evidence);
  }

  if (has("科技管理", "国家重点研发计划", "科技计划")) {
    return "大白话：这类信息通常和科技项目管理有关。重点看有没有申报入口、指南变化、项目过程管理或验收要求。";
  }

  if (has("中国科学院", "中科院")) {
    return "大白话：这是中科院体系相关动态。它不一定直接告诉你怎么报基金，但能帮你看国家科研机构最近关注的方向、组织方式和政策动作。";
  }

  if (topic.includes("项目申报")) {
    return "大白话：这条和“能不能报、什么时候报、怎么报”有关。准备申请项目的人建议点开核对条件、时间和材料。";
  }

  if (topic.includes("资助评审")) {
    return "大白话：这条和“项目怎么评、评到哪一步、钱可能投向哪里”有关。适合判断评审节奏和资助导向。";
  }

  return `大白话：这是一条来自${site}的${topic}信息。先看它是不是通知、指南、评审、政策风向或机构动态，再决定是否点开原文深读。`;
}

function paperInsightRows(item, context = {}) {
  const title = itemTitleText(item);
  const summary = insightSummaryText(item, context, 1600);
  const sentences = abstractSentences(summary);
  const method = titleMethodClause(title);
  const result = titleAfterVerb(title);
  const abstractProblem = pickSentence(sentences, [
    /challenge|problem|bottleneck|risk|difficult|limitation|limited|gap|because/i,
    /问题|挑战|瓶颈|困难|不足|受限|风险|由于/,
  ]);
  const abstractExisting = pickSentence(sentences, [
    /conventional|traditional|currently|existing|mainstream|rather than/i,
    /传统|现有|已有|目前|常规|主流/,
  ]);
  const abstractMethod = pickSentence(sentences, [
    /we present|we propose|this study|this paper|we develop|we designed|employs|leverages|uses|based on/i,
    /本文|本研究|提出|构建|开发|采用|利用|通过/,
  ]);
  const abstractResult = pickSentence(sentences, [
    /\bwe show\b|\bwe demonstrate\b|\bachieved?\b|\bachieving\b|\bimproved?\b|\boutperform|\baccuracy\b|\bsignificant/i,
    /结果|表明|实现|提高|显著|证明|达到|优于/,
  ]);
  const abstractWeakness = pickSentence(sentences, [
    /limited|risk|false-negative|noise|variability|vulnerability|gap|bottleneck/i,
    /不足|受限|风险|噪声|波动|脆弱|差距|瓶颈/,
  ]);
  const problem = abstractProblem || firstSentence(summary, 170) || titleProblemClause(title);
  return [
    {
      label: "问题",
      text: paperFeynmanLine(
        "大白话：作者先指出一个卡点，也就是为什么这个问题难、容易出错或值得研究。",
        problem || `围绕《${cleanBriefText(title, 120)}》所指主题，识别一个机制、方法或应用层面的关键问题。`
      ),
    },
    {
      label: "已有做法",
      text: paperFeynmanLine(
        "大白话：先看过去通常怎么做，作者是在和哪种老办法、常规办法或主流方案比较。",
        abstractExisting
      ),
    },
    {
      label: "为何不够",
      text: paperFeynmanLine(
        "大白话：旧办法的问题通常是不够稳、不够准、不够快，或到了复杂真实场景就容易失灵。",
        abstractWeakness
      ),
    },
    {
      label: "本文做法",
      text: paperFeynmanLine(
        "大白话：这篇文章的核心贡献，是换了一个办法、平台或解释框架来处理这个问题。",
        abstractMethod || (method ? `题名显示主要用 ${method} 切入。` : "")
      ),
    },
    {
      label: "结果",
      text: paperFeynmanLine(
        "大白话：最后看它到底有没有变好，重点盯住准确率、灵敏度、效率、适用范围或验证场景。",
        abstractResult || (result ? `题名声称带来 ${result}；具体指标、样本量和局限需看原文。` : "")
      ),
    },
  ];
}

function newsInsightText(item, context = {}) {
  if (itemSections(item).has("grant_policy")) {
    return grantPolicyFeynmanText(item);
  }
  const summary = insightSummaryText(item, context, 260);
  if (summary) return summary;
  if (itemSections(item).has("creator")) {
    return `${reasonText(item)}。建议打开原文核对观点、案例和评论区反馈。`;
  }
  return `${itemTitleText(item)}。建议打开原文核对关键事实、发布时间和影响范围。`;
}

function buildInsightNode(item, context = {}) {
  const node = document.createElement("div");
  const isPaper = paperLikeItem(item);
  node.className = `story-insight ${isPaper ? "paper-insight" : "news-insight"}`;

  const title = document.createElement("div");
  title.className = "story-insight-title";
  title.textContent = isPaper
    ? `论文速读（${insightSummaryText(item, context) ? "摘要线索" : "题名线索"}）`
    : itemSections(item).has("grant_policy") ? "简要内容（大白话）" : "简要内容";
  node.appendChild(title);

  if (isPaper) {
    const qa = document.createElement("div");
    qa.className = "paper-qa";
    paperInsightRows(item, context).forEach((row) => {
      const line = document.createElement("div");
      line.className = "paper-qa-row";
      const label = document.createElement("span");
      label.className = "paper-qa-label";
      label.textContent = row.label;
      const text = document.createElement("span");
      text.className = "paper-qa-text";
      text.textContent = row.text;
      line.append(label, text);
      qa.appendChild(line);
    });
    node.appendChild(qa);
  } else {
    const text = document.createElement("div");
    text.className = "story-insight-text";
    text.textContent = newsInsightText(item, context);
    node.appendChild(text);
  }

  return node;
}

function buildBoleLead(row) {
  const { item, score } = row;
  const lead = document.createElement("a");
  lead.className = "bole-lead-card";
  lead.href = item.url || "#";
  lead.target = "_blank";
  lead.rel = "noopener noreferrer";

  const top = document.createElement("div");
  top.className = "bole-lead-top";
  const kicker = document.createElement("span");
  kicker.className = "bole-kicker";
  kicker.textContent = `${labelText(item)} · ${timeLabelText(item)}`;
  const scoreEl = document.createElement("strong");
  scoreEl.className = `bole-score-orb ${scoreTone(score)}`;
  scoreEl.innerHTML = `<span>${score}</span><small>分</small>`;
  top.append(kicker, scoreEl);

  const title = document.createElement("div");
  title.className = "bole-lead-title";
  title.textContent = itemTitleText(item);

  const reason = document.createElement("div");
  reason.className = "bole-lead-reason";
  reason.textContent = reasonText(item);

  const foot = document.createElement("div");
  foot.className = "bole-lead-foot";
  foot.innerHTML = `<span>${item.site_name || "来源"}</span><span>${item.source || "未分区"}</span>`;

  lead.append(top, title, reason, foot);
  return lead;
}

function buildBoleTimelineRow(row, rank) {
  const { item, score } = row;
  const link = document.createElement("a");
  link.className = "bole-row";
  link.href = item.url || "#";
  link.target = "_blank";
  link.rel = "noopener noreferrer";

  const time = document.createElement("time");
  time.className = "bole-row-time";
  time.textContent = timeLabelText(item);

  const body = document.createElement("div");
  body.className = "bole-row-body";
  const meta = document.createElement("div");
  meta.className = "bole-row-meta";
  meta.innerHTML = `<span>#${rank}</span><span>${item.site_name || "来源"}</span><strong>${score}分</strong>`;
  (row.sourceSignals || []).slice(0, 4).forEach((signal) => {
    appendSourceChip(meta, signal, sourceSignalTone(signal), "source-chip source-hit");
  });
  const title = document.createElement("div");
  title.className = "bole-row-title";
  title.textContent = itemTitleText(item);
  const reason = document.createElement("div");
  reason.className = "bole-row-reason";
  reason.textContent = boleReasonText(row);
  body.append(meta, title, reason, buildInsightNode(item, row));

  link.append(time, body);
  return link;
}

function buildStoryCard(story, rank) {
  const link = document.createElement("a");
  link.className = "story-row";
  const primary = story.primary_item || {};
  link.href = primary.url || story.primary_url || story.url || "#";
  link.target = "_blank";
  link.rel = "noopener noreferrer";

  const time = document.createElement("div");
  time.className = "story-time";
  const { latest, rangeLabel } = formatStoryTime(story);
  const labelEl = document.createElement("span");
  labelEl.className = "story-time-label";
  labelEl.textContent = "最新";
  const latestEl = document.createElement("span");
  latestEl.className = "story-time-latest";
  latestEl.textContent = fmtTime(latest);
  time.append(labelEl, latestEl);
  if (rangeLabel) {
    const rangeEl = document.createElement("span");
    rangeEl.className = "story-time-range";
    rangeEl.textContent = rangeLabel;
    rangeEl.title = "最早来源到最新来源的时间差，不是距离现在多久。";
    time.appendChild(rangeEl);
  }

  const body = document.createElement("div");
  body.className = "story-body";

  const meta = document.createElement("div");
  meta.className = "story-meta";
  const rankEl = document.createElement("span");
  rankEl.className = "story-rank";
  rankEl.textContent = `#${rank}`;
  meta.appendChild(rankEl);
  if (story.importance_label) {
    const imp = document.createElement("span");
    imp.className = `story-importance ${storyImportanceTone(story.importance_label)}`;
    imp.textContent = story.importance_label;
    meta.appendChild(imp);
  }
  const sourceCount = storySourceCount(story);
  const countEl = document.createElement("span");
  countEl.className = "story-count";
  countEl.textContent = `${sourceCount} 个来源`;
  meta.appendChild(countEl);
  const displayScore = storySortScore(story);
  if (displayScore > 0) {
    const scoreEl = document.createElement("strong");
    scoreEl.className = `story-score ${state.boleView === "hot" ? "heat" : ""}`.trim();
    scoreEl.title = state.boleView === "hot"
      ? "热度分 = 多源强度 × 时间衰减"
      : "编辑重要性分";
    scoreEl.innerHTML = `<span>${displayScore}</span><small>${state.boleView === "hot" ? "热度" : "分"}</small>`;
    meta.appendChild(scoreEl);
  }
  body.appendChild(meta);

  const sources = Array.isArray(story.sources) ? story.sources : [];
  if (sources.length) {
    const sourcesEl = document.createElement("div");
    sourcesEl.className = "story-sources";
    sources.slice(0, 6).forEach((src) => {
      const kind = sourceKind(src.site_id);
      const label = src.source || src.source_name || "来源";
      const tag = sourceChip(label, kind.tone, "story-source-chip source-chip");
      sourcesEl.appendChild(tag);
    });
    if (sources.length > 6) {
      const more = document.createElement("span");
      more.className = "story-source-more";
      more.textContent = `+${sources.length - 6}`;
      sourcesEl.appendChild(more);
    }
    body.appendChild(sourcesEl);
  }

  const title = document.createElement("div");
  title.className = "story-title";
  const primaryTitle = storyPrimaryTitleText(story);
  const enTitle = storyPrimaryEnText(story);
  if (enTitle && enTitle !== primaryTitle) {
    const zh = document.createElement("span");
    zh.className = "story-title-zh";
    zh.textContent = primaryTitle;
    const sub = document.createElement("span");
    sub.className = "story-title-en";
    sub.textContent = enTitle;
    title.append(zh, sub);
  } else {
    title.textContent = primaryTitle;
  }
  body.appendChild(title);
  body.appendChild(buildInsightNode(primary, story));

  link.append(time, body);
  return link;
}

const HOT_DECAY_HOURS = 12;
const HOT_SCORE_SCALE = 60;

function storyHotness(story) {
  const sources = storySourceCount(story);
  if (sources < 2) return 0;
  const latest = storyTimeMs(story, "latest_at") || storyTimeMs(story, "earliest_at");
  const ageHours = latest ? Math.max(0, (Date.now() - latest) / 3600000) : 24;
  return (sources - 1) * Math.exp(-ageHours / HOT_DECAY_HOURS);
}

function storyHotScore(story) {
  const raw = storyHotness(story);
  if (raw <= 0) return 0;
  return Math.max(1, Math.min(100, Math.round(raw * HOT_SCORE_SCALE)));
}

function storySortScore(story) {
  return state.boleView === "hot" ? storyHotScore(story) : storyScore(story);
}

function hotStories(stories) {
  return stories
    .filter((story) => storyHotness(story) > 0)
    .sort((a, b) => {
      const byHotScore = storyHotScore(b) - storyHotScore(a);
      if (byHotScore !== 0) return byHotScore;
      const byHotRaw = storyHotness(b) - storyHotness(a);
      if (byHotRaw !== 0) return byHotRaw;
      const byEditorial = storyScore(b) - storyScore(a);
      if (byEditorial !== 0) return byEditorial;
      return storyTimeMs(b, "latest_at") - storyTimeMs(a, "latest_at");
    });
}

function renderBoleBrief(stories) {
  bolePicksListEl.innerHTML = "";
  bolePicksListEl.className = "bole-board";

  const hot = hotStories(stories);
  const hotAvailable = hot.length >= 2;
  // 宁缺毋滥: the hot view only exists when there is real multi-source heat.
  if (boleViewToggleEl) boleViewToggleEl.hidden = !hotAvailable;
  if (!hotAvailable) state.boleView = "timeline";
  if (boleHotBtnEl) boleHotBtnEl.classList.toggle("active", state.boleView === "hot");
  if (boleTimelineBtnEl) boleTimelineBtnEl.classList.toggle("active", state.boleView !== "hot");

  let sorted;
  let metaLabel;
  if (state.boleView === "hot") {
    sorted = hot;
    metaLabel = `当前热点 · ${fmtNumber(sorted.length)} 簇 · 按热度分排序`;
  } else {
    sorted = [...stories].sort((a, b) => {
      const aLatest = storyTimeMs(a, "latest_at") || storyTimeMs(a, "earliest_at");
      const bLatest = storyTimeMs(b, "latest_at") || storyTimeMs(b, "earliest_at");
      if (aLatest !== bLatest) return bLatest - aLatest;
      return storyScore(b) - storyScore(a);
    });
    const topScore = Math.max(...sorted.map((s) => storyScore(s)));
    metaLabel = topScore > 0
      ? `故事时间线 · ${fmtNumber(sorted.length)} 条 · 最高 ${topScore} 分`
      : `故事时间线 · ${fmtNumber(sorted.length)} 条`;
  }

  const list = document.createElement("div");
  list.className = "bole-compact-list bole-timeline";
  const defaultLimit = state.boleView === "hot" ? BOLE_HOT_LIMIT : BOLE_TIMELINE_LIMIT;
  const visibleStories = state.boleExpanded ? sorted : sorted.slice(0, defaultLimit);
  visibleStories.forEach((story, index) => {
    list.appendChild(buildStoryCard(story, index + 1));
  });
  bolePicksListEl.appendChild(list);

  if (sorted.length > defaultLimit) {
    const moreBtn = document.createElement("button");
    moreBtn.type = "button";
    moreBtn.className = "bole-more-btn";
    moreBtn.textContent = state.boleExpanded
      ? "收起"
      : (state.boleView === "hot" ? "展开全部热点" : "展开完整时间线");
    moreBtn.addEventListener("click", () => {
      state.boleExpanded = !state.boleExpanded;
      renderBolePicks();
    });
    bolePicksListEl.appendChild(moreBtn);
  }

  const generatedAt = state.dailyBrief && state.dailyBrief.generated_at;
  bolePicksMetaEl.textContent = generatedAt ? `${metaLabel} · ${fmtTime(generatedAt)}` : metaLabel;
  document.dispatchEvent(new CustomEvent("aiRadar:briefRendered"));
}

function renderBoleFallback(picks) {
  bolePicksListEl.innerHTML = "";
  bolePicksListEl.className = "bole-board";

  const note = document.createElement("div");
  note.className = "bole-fallback-note";
  note.textContent = "故事合并数据暂未生成，先展示伯乐候选信号。";
  bolePicksListEl.appendChild(note);

  if (!picks.length) {
    const empty = document.createElement("div");
    empty.className = "bole-empty";
    empty.textContent = "当前数据里没有可展示的评分字段。";
    bolePicksListEl.appendChild(empty);
    return;
  }

  const timelinePicks = [...picks].sort((a, b) => {
    const byTime = timelineMs(b.item) - timelineMs(a.item);
    if (byTime !== 0) return byTime;
    return b.score - a.score || a.index - b.index;
  });
  const list = document.createElement("div");
  list.className = "bole-compact-list";
  const visiblePicks = state.boleExpanded ? timelinePicks : timelinePicks.slice(0, BOLE_TIMELINE_LIMIT);
  visiblePicks.forEach((row, index) => {
    list.appendChild(buildBoleTimelineRow(row, index + 1));
  });
  bolePicksListEl.appendChild(list);
  if (timelinePicks.length > BOLE_TIMELINE_LIMIT) {
    const moreBtn = document.createElement("button");
    moreBtn.type = "button";
    moreBtn.className = "bole-more-btn";
    moreBtn.textContent = state.boleExpanded ? "收起" : "展开完整时间线";
    moreBtn.addEventListener("click", () => {
      state.boleExpanded = !state.boleExpanded;
      renderBolePicks();
    });
    bolePicksListEl.appendChild(moreBtn);
  }
  document.dispatchEvent(new CustomEvent("aiRadar:briefRendered"));
}

function storyMatchesFilteredItems(story, filteredItems) {
  if (
    state.activeSection === "hot" &&
    !state.siteFilter &&
    !state.authorFilter &&
    !state.sourceTypeFilter &&
    !state.signalLevelFilter &&
    !state.query.trim()
  ) return true;
  const urls = new Set(filteredItems.map((item) => item.url).filter(Boolean));
  const ids = new Set(filteredItems.map((item) => item.id).filter(Boolean));
  const storyRefs = [
    story.primary_item,
    ...(Array.isArray(story.sources) ? story.sources : []),
    ...(Array.isArray(story.items) ? story.items : []),
  ].filter(Boolean);
  return storyRefs.some((ref) => (ref.url && urls.has(ref.url)) || (ref.id && ids.has(ref.id)));
}

function briefStories() {
  return Array.isArray(state.dailyBrief?.items) ? state.dailyBrief.items : [];
}

function mergedStories() {
  return Array.isArray(state.storiesMerged?.stories) ? state.storiesMerged.stories : [];
}

function storyStableKey(story) {
  if (!story) return "";
  return story.story_id || story.primary_url || story.url || story.primary_item?.url || story.title || "";
}

function uniqueStories(stories, excludeKeys = new Set(), excludeIdentityKeys = new Set()) {
  const seen = new Set(excludeKeys);
  return stories.filter((story) => {
    const key = storyStableKey(story);
    if (key && seen.has(key)) return false;
    if (storyHasAnyKey(story, excludeIdentityKeys)) return false;
    if (key) seen.add(key);
    return true;
  });
}

function currentStoryPools(filteredItems) {
  if (state.activeSection === "creator") return { brief: [], merged: [], followup: [] };
  const brief = briefStories().filter((story) => storyMatchesFilteredItems(story, filteredItems));
  const merged = mergedStories().filter((story) => storyMatchesFilteredItems(story, filteredItems));
  const briefKeys = new Set(brief.map(storyStableKey).filter(Boolean));
  const briefIdentityKeys = new Set();
  brief.forEach((story) => storyIdentityKeys(story).forEach((key) => briefIdentityKeys.add(key)));
  return {
    brief,
    merged,
    followup: uniqueStories(merged, briefKeys, briefIdentityKeys),
  };
}

function storyRowsForPool(stories) {
  const source = Array.isArray(stories) ? stories : [];
  const pool = state.boleView === "hot"
    ? hotStories(source).slice(0, BOLE_HOT_LIMIT)
    : latestStories(source).slice(0, BOLE_TIMELINE_LIMIT);
  return pool.map(storyToBoleRow);
}

function storyCandidateCounts(stories) {
  const source = Array.isArray(stories) ? stories : [];
  const hotTotal = hotStories(source).length;
  const timelineTotal = source.length;
  return {
    hot: Math.min(BOLE_HOT_LIMIT, hotTotal),
    timeline: Math.min(BOLE_TIMELINE_LIMIT, timelineTotal),
    hotTotal,
    timelineTotal,
  };
}

function latestStories(stories) {
  return [...(Array.isArray(stories) ? stories : [])].sort((a, b) => {
    const aLatest = storyTimeMs(a, "latest_at") || storyTimeMs(a, "earliest_at");
    const bLatest = storyTimeMs(b, "latest_at") || storyTimeMs(b, "earliest_at");
    if (aLatest !== bLatest) return bLatest - aLatest;
    return storyScore(b) - storyScore(a);
  });
}

function renderStoryViewPanel(stories, excludedRows = []) {
  const panel = document.createElement("div");
  panel.className = "bole-story-panel";

  const hot = hotStories(stories);
  let baseSorted;
  let metaLabel;
  if (state.boleView === "hot") {
    baseSorted = hot;
    metaLabel = hot.length
      ? `当前热点 · ${fmtNumber(hot.length)} 簇 · 按热度分排序`
      : "当前热点 · 暂无多源聚簇";
  } else {
    baseSorted = [...stories].sort((a, b) => {
      const aLatest = storyTimeMs(a, "latest_at") || storyTimeMs(a, "earliest_at");
      const bLatest = storyTimeMs(b, "latest_at") || storyTimeMs(b, "earliest_at");
      if (aLatest !== bLatest) return bLatest - aLatest;
      return storyScore(b) - storyScore(a);
    });
    metaLabel = `故事时间线 · ${fmtNumber(baseSorted.length)} 条 · 最新优先`;
  }

  const excludeKeys = excludedStoryKeySet(excludedRows);
  const sorted = excludeKeys.size
    ? baseSorted.filter((story) => !storyHasAnyKey(story, excludeKeys))
    : baseSorted;
  const skippedCount = baseSorted.length - sorted.length;
  const rankOffset = skippedCount > 0 ? excludedRows.length : 0;
  if (skippedCount > 0) {
    metaLabel = state.boleView === "hot"
      ? `当前热点 · ${fmtNumber(baseSorted.length)} 簇 · 续看 #${rankOffset + 1} 起`
      : `故事时间线 · ${fmtNumber(baseSorted.length)} 条 · Top3 后续`;
  }

  if (boleViewToggleEl) {
    boleViewToggleEl.hidden = false;
    if (boleHotBtnEl) boleHotBtnEl.classList.toggle("active", state.boleView === "hot");
    if (boleTimelineBtnEl) boleTimelineBtnEl.classList.toggle("active", state.boleView !== "hot");
  }

  const heading = document.createElement("div");
  heading.className = "bole-story-panel-head";
  heading.textContent = metaLabel;
  panel.appendChild(heading);

  if (!sorted.length) {
    const empty = document.createElement("div");
    empty.className = "bole-empty";
    empty.textContent = skippedCount > 0
      ? "Top3 已覆盖当前筛选下的故事，可切换筛选或时间线继续查看。"
      : state.boleView === "hot"
      ? "当前筛选下没有多源热点，可切换到时间线查看最新故事。"
      : "当前筛选下没有可展示的故事时间线。";
    panel.appendChild(empty);
    return panel;
  }

  const list = document.createElement("div");
  list.className = "bole-compact-list bole-timeline";
  const defaultLimit = state.boleView === "hot" ? BOLE_HOT_LIMIT : BOLE_TIMELINE_LIMIT;
  const visibleStories = state.boleExpanded ? sorted : sorted.slice(0, defaultLimit);
  visibleStories.forEach((story, index) => {
    list.appendChild(buildStoryCard(story, rankOffset + index + 1));
  });
  panel.appendChild(list);

  if (sorted.length > defaultLimit) {
    const moreBtn = document.createElement("button");
    moreBtn.type = "button";
    moreBtn.className = "bole-more-btn";
    moreBtn.textContent = state.boleExpanded
      ? "收起"
      : (skippedCount > 0
        ? (state.boleView === "hot" ? "展开后续热点" : "展开后续时间线")
        : (state.boleView === "hot" ? "展开全部热点" : "展开完整时间线"));
    moreBtn.addEventListener("click", () => {
      state.boleExpanded = !state.boleExpanded;
      renderBolePicks();
    });
    panel.appendChild(moreBtn);
  }

  return panel;
}

function storyToBoleRow(story, index) {
  const enrichStoryItem = (entry) => ({
    ...entry,
    site_name: entry.site_name || entry.source_name || story.source_name || "",
  });
  const item = enrichStoryItem(story.primary_item || story);
  const sourceItems = [
    item,
    ...(Array.isArray(story.sources) ? story.sources.map(enrichStoryItem) : []),
  ].filter(Boolean);
  const sourceSignals = Array.from(new Set(sourceItems.map(sourceSignal)));
  return {
    item,
    index,
    story,
    rows: sourceItems.map((sourceItem) => ({ item: sourceItem })),
    sourceSignals,
    sourceCount: storySourceCount(story),
    mergedCount: Math.max(1, Number(story.duplicate_count) || sourceItems.length),
    score: storySortScore(story),
  };
}

function rankedBriefRows(stories) {
  const sorted = [...stories].sort((a, b) => {
    const aLatest = storyTimeMs(a, "latest_at") || storyTimeMs(a, "earliest_at");
    const bLatest = storyTimeMs(b, "latest_at") || storyTimeMs(b, "earliest_at");
    if (state.boleView === "hot") {
      const byHeat = storyHotScore(b) - storyHotScore(a);
      if (byHeat !== 0) return byHeat;
      const byScore = storyScore(b) - storyScore(a);
      if (byScore !== 0) return byScore;
      return bLatest - aLatest;
    }
    const byScore = storyScore(b) - storyScore(a);
    if (byScore !== 0) return byScore;
    return bLatest - aLatest;
  });
  return sorted.map(storyToBoleRow);
}

function rankedFallbackRows(items) {
  const rows = rankedClustersForItems(items);
  if (state.activeSection === "grant_policy" || state.activeSection === "github_projects") {
    return rows.sort((a, b) => itemPriorityScore(b.item) - itemPriorityScore(a.item) || timelineMs(b.item) - timelineMs(a.item));
  }
  return state.boleView === "hot"
    ? rows.sort((a, b) => b.sourceCount - a.sourceCount || b.score - a.score || timelineMs(b.item) - timelineMs(a.item))
    : rows.sort((a, b) => timelineMs(b.item) - timelineMs(a.item) || b.score - a.score);
}

function buildBoleFollowupPanel(rows, topCount, usesStories) {
  const remaining = rows.slice(topCount);
  if (!remaining.length) return null;

  const panel = document.createElement("div");
  panel.className = "bole-story-panel";
  const heading = document.createElement("div");
  heading.className = "bole-story-panel-head";
  const viewLabel = state.boleView === "hot" ? "当前热点" : "故事时间线";
  heading.textContent = `${viewLabel} · ${fmtNumber(rows.length)} 条${usesStories ? "故事" : "候选"} · Top${topCount} 后续`;
  panel.appendChild(heading);

  const list = document.createElement("div");
  list.className = "bole-compact-list bole-timeline";
  const followupLimit = 2;
  const visibleRows = state.boleExpanded ? remaining : remaining.slice(0, followupLimit);
  visibleRows.forEach((row, index) => {
    const rank = topCount + index + 1;
    list.appendChild(row.story
      ? buildStoryCard(row.story, rank)
      : buildBoleTimelineRow(row, rank));
  });
  panel.appendChild(list);

  if (remaining.length > followupLimit) {
    const moreBtn = document.createElement("button");
    moreBtn.type = "button";
    moreBtn.className = "bole-more-btn";
    moreBtn.textContent = state.boleExpanded
      ? "收起后续"
      : `展开后续 ${fmtNumber(remaining.length - followupLimit)} 条`;
    moreBtn.addEventListener("click", () => {
      state.boleExpanded = !state.boleExpanded;
      renderBolePicks();
    });
    panel.appendChild(moreBtn);
  }
  return panel;
}

function renderBolePicks() {
  if (!bolePicksListEl || !bolePicksMetaEl) return;
  bolePicksListEl.innerHTML = "";
  bolePicksListEl.className = "top-stories-grid";
  if (boleViewToggleEl) boleViewToggleEl.hidden = true;
  if (bolePicksWrapEl) bolePicksWrapEl.hidden = false;

  const section = SECTION_BY_ID[state.activeSection] || SECTION_BY_ID.hot;
  const filtered = getFilteredItems();
  const storyPools = state.activeSection === "grant_policy" || state.activeSection === "slow_professor"
    ? { brief: [], followup: [], merged: [] }
    : currentStoryPools(filtered);
  const availableStoryPool = storyPools.brief.length
    ? [...storyPools.brief, ...storyPools.followup]
    : storyPools.merged;
  const usesStories = availableStoryPool.length > 0;
  const candidateCounts = storyCandidateCounts(availableStoryPool);
  const hotAvailable = usesStories && candidateCounts.hot >= 2;
  if (usesStories && !hotAvailable && state.boleView === "hot") {
    state.boleView = "timeline";
  }
  const defaultLimit = state.boleView === "hot" ? BOLE_HOT_LIMIT : BOLE_TIMELINE_LIMIT;
  const rows = usesStories
    ? storyRowsForPool(availableStoryPool)
    : rankedFallbackRows(filtered).slice(0, defaultLimit);
  const top = rows.slice(0, 3);
  const remainingCount = Math.max(0, rows.length - top.length);
  if (topStoriesTitleEl) {
    topStoriesTitleEl.textContent = state.activeSection === "hot"
      ? "当前热点"
      : state.activeSection === "slow_professor"
      ? "慢教授近一周文章"
      : `${section.label}重点信号`;
  }
  const storyMeta = usesStories
    ? `展示池：当前热点 ${fmtNumber(candidateCounts.hot)}/${fmtNumber(candidateCounts.hotTotal)} · 多源聚合热点 · 时间线 ${fmtNumber(candidateCounts.timeline)}/${fmtNumber(candidateCounts.timelineTotal)}`
    : `展示池：${fmtNumber(rows.length)} 条`;
  bolePicksMetaEl.textContent = storyMeta;
  if (boleViewToggleEl) {
    boleViewToggleEl.hidden = usesStories ? !hotAvailable : true;
    if (boleHotBtnEl) boleHotBtnEl.classList.toggle("active", state.boleView === "hot");
    if (boleTimelineBtnEl) boleTimelineBtnEl.classList.toggle("active", state.boleView === "timeline");
    if (boleHotBtnEl) boleHotBtnEl.textContent = `当前热点 ${fmtNumber(candidateCounts.hot)}`;
    if (boleTimelineBtnEl) boleTimelineBtnEl.textContent = `时间线 ${fmtNumber(candidateCounts.timeline)}`;
  }

  if (!top.length) {
    const empty = document.createElement("div");
    empty.className = "bole-empty";
    empty.textContent = state.activeSection === "slow_professor"
      ? "暂无可核验的近一周公众号文章。已确认入口只保留在数据说明里，不进入近一周文章列表。"
      : "当前栏目和筛选条件下没有可展示的 Top 3。";
    bolePicksListEl.appendChild(empty);
  } else {
    top.forEach((row, index) => {
      bolePicksListEl.appendChild(buildTopStoryCard(row, index + 1));
    });
  }

  const followup = buildBoleFollowupPanel(rows, top.length, usesStories);
  if (followup) {
    bolePicksListEl.appendChild(followup);
  }
  document.dispatchEvent(new CustomEvent("aiRadar:briefRendered"));
}

function rankedClustersForItems(items) {
  const rows = [...items]
    .map((item, index) => ({
      item,
      index,
      score: state.activeSection === "creator"
        ? creatorHotScore(item)
        : (scorePercent(item) || Math.round(itemPriorityScore(item))),
    }))
    .filter((row) => row.item && (row.score > 0 || row.item.title))
    .sort((a, b) => itemPriorityScore(b.item) - itemPriorityScore(a.item) || timelineMs(b.item) - timelineMs(a.item));

  return clusterBoleEvents(rows).sort((a, b) => {
    const byHeadlineScore = headlineClusterScore(b) - headlineClusterScore(a);
    if (byHeadlineScore !== 0) return byHeadlineScore;
    return timelineMs(b.item) - timelineMs(a.item) || a.index - b.index;
  });
}

function headlineClusterScore(cluster) {
  const base = itemPriorityScore(cluster.item);
  const sourceBoost = Math.min(18, Math.max(0, cluster.sourceCount - 1) * 9);
  const mergeBoost = Math.min(8, Math.max(0, cluster.mergedCount - 1) * 4);
  return Math.min(100, Math.round(base + sourceBoost + mergeBoost));
}

function pickTopHeadlineClusters(clusters, limit = 3) {
  return [...clusters]
    .sort((a, b) => headlineClusterScore(b) - headlineClusterScore(a) || timelineMs(b.item) - timelineMs(a.item) || a.index - b.index)
    .slice(0, limit)
    .map((cluster) => ({ ...cluster, score: headlineClusterScore(cluster) }));
}

function itemTagLabels(item, row = null) {
  const tags = [];
  const sections = itemSections(item);
  if (state.activeSection !== "hot") tags.push(sectionBadgeLabel(state.activeSection));
  if (row && (row.sourceCount > 1 || row.mergedCount > 1)) tags.push("多源验证");
  if (item.site_id === "official_ai") tags.push("官方");
  if (item.site_id === "aihot") tags.push("AI HOT");
  if (sections.has("grant_policy")) tags.push("国自然");
  if (sections.has("slow_professor")) tags.push("慢教授");
  if (sections.has("github_projects")) tags.push("GitHub项目");
  if (sections.has("models")) tags.push("模型发布");
  if (sections.has("devtools")) tags.push("开发者");
  if (sections.has("hn")) tags.push("社区热议");
  if (sections.has("research")) tags.push("研究");
  if (sections.has("creator")) tags.push("自媒体");
  if (sections.has("community")) tags.push("社区");
  return Array.from(new Set(tags)).slice(0, 3);
}

function itemSourceRefs(item, row = null) {
  const refs = [];
  const seen = new Set();
  const add = (label, tone) => {
    const clean = String(label || "").trim();
    if (!clean) return;
    const key = `${tone}:${clean}`;
    if (seen.has(key)) return;
    seen.add(key);
    refs.push({ label: clean, tone });
  };

  if (row && Array.isArray(row.sourceSignals) && row.sourceSignals.length) {
    row.sourceSignals.forEach((signal) => add(signal, sourceSignalTone(signal)));
  } else if (row && Array.isArray(row.rows) && row.rows.length) {
    row.rows.forEach((entry) => {
      const sourceItem = entry.item || {};
      const kind = sourceKind(sourceItem.site_id);
      add(sourceItem.source || sourceItem.site_name || kind.label, kind.tone);
    });
  } else {
    const kind = sourceKind(item.site_id);
    add(item.source || item.site_name || kind.label, kind.tone);
  }

  return refs.length ? refs : [{ label: "来源", tone: "default" }];
}

function priorityGrade(score) {
  if (score >= 92) return "A+";
  if (score >= 82) return "A";
  if (score >= 70) return "B";
  return "C";
}

function rowSourceCount(row) {
  const item = row.item || {};
  const refs = itemSourceRefs(item, row);
  const storyCount = row.story ? storySourceCount(row.story) : 0;
  return Math.max(1, refs.length, Number(row.sourceCount || 0), Number(row.mergedCount || 0), storyCount);
}

function signalSummaryText(row) {
  const item = row.item || {};
  const story = row.story || {};
  const label = story.importance_label || labelText(item);
  const sourceCount = rowSourceCount(row);
  const multi = row.sourceCount > 1 || row.mergedCount > 1;
  if (itemSections(item).has("slow_professor") && item.summary) {
    return item.summary;
  }
  if (itemSections(item).has("grant_policy")) {
    return `${itemSourceDisplayName(item) || "公开来源"} · ${item.grant_topic || label} · 先看下方大白话简介判断是否点开。`;
  }
  if (itemSections(item).has("github_projects")) {
    const stars = Number(item.stars || 0);
    const lang = item.language || "多语言";
    return `${item.repo_full_name || item.title} · ${lang}${stars ? ` · ${fmtNumber(stars)} stars` : ""} · 先看下方大白话判断是否值得打开。`;
  }
  if (multi && label) return `${label}信号，已被 ${fmtNumber(sourceCount)} 个来源验证，适合优先判断是否继续深挖。`;
  const reason = reasonText(item);
  if (reason && !reason.startsWith("来源与标题")) return reason.replace(/^命中方向：/, "核心方向：");
  return `${label}方向的新近更新，已进入 24 小时 AI 强相关池。`;
}

function whyImportantText(row) {
  const item = row.item || {};
  const story = row.story || {};
  const sections = itemSections(item);
  const reasons = Array.isArray(story.reasons) ? story.reasons : [];
  if (sections.has("grant_policy")) {
    return "科研政策和基金入口会影响选题窗口、申报节奏、评审导向和后续项目设计。";
  }
  if (sections.has("github_projects")) {
    return "这些项目已经被中文月刊、技术周刊或 Awesome 目录筛过一轮，适合拿来扩展工具箱、找灵感或练手。";
  }
  if (reasons.includes("official_source") && reasons.includes("multi_source")) {
    return "一手来源和聚合来源同时出现，说明它既有事实起点，也正在被外部信息流放大。";
  }
  if (sections.has("models")) {
    return "模型能力或训练/推理方式变化会影响后续产品路线、开发者选型和评测基准。";
  }
  if (sections.has("devtools")) {
    return "开发者工具和基础设施变化通常会很快传导到团队工作流、成本和可实现能力。";
  }
  if (sections.has("industry")) {
    return "公司、监管、芯片或资本动态会改变 AI 生态的资源分配和落地节奏。";
  }
  if (sections.has("grant_policy")) {
    return "科研政策和基金入口会影响选题窗口、申报节奏、评审导向和后续项目设计。";
  }
  if (sections.has("research")) {
    return "研究信号可能还没产品化，但会提示下一轮模型、数据或方法的技术方向。";
  }
  if (sections.has("community") || sections.has("hn")) {
    return "社区集中讨论代表开发者和早期用户正在形成共识，适合作为趋势验证入口。";
  }
  return "它在当前 24 小时窗口里同时具备相关度、新鲜度和来源权重，值得先读原文确认。";
}

function impactLabels(item) {
  const sections = itemSections(item);
  const labels = [];
  if (sections.has("devtools")) labels.push("开发者");
  if (sections.has("products")) labels.push("产品");
  if (sections.has("industry")) labels.push("企业 / 投资");
  if (sections.has("research")) labels.push("研究");
  if (sections.has("grant_policy")) labels.push("基金 / 政策");
  if (sections.has("slow_professor")) labels.push("科研写作");
  if (sections.has("github_projects")) labels.push("开源项目");
  if (sections.has("models")) labels.push("模型团队");
  if (sections.has("community") || sections.has("hn")) labels.push("社区");
  return labels.slice(0, 3).length ? labels.slice(0, 3) : ["AI 观察者"];
}

function buildTopStoryCard(row, rank) {
  const item = row.item;
  const link = document.createElement("a");
  link.className = `top-story-card ${rank === 1 ? "lead" : "secondary"}`;
  link.href = item.url || "#";
  link.target = "_blank";
  link.rel = "noopener noreferrer";

  const rankEl = document.createElement("span");
  rankEl.className = "top-rank";
  rankEl.textContent = `#${rank}`;

  const meta = document.createElement("div");
  meta.className = "intel-meta";
  const time = document.createElement("time");
  // Brief stories keep their timeline on the story object rather than repeating
  // it on primary_item. Fall back to that aggregate time so Top 3 never shows
  // "时间未知" when the story itself has a verified latest/earliest timestamp.
  const storyTimeline = row.story?.latest_at || row.story?.earliest_at || "";
  time.textContent = timeLabelText(item, storyTimeline);
  const primarySource = itemSourceRefs(item, row)[0];
  const score = document.createElement("strong");
  const displayScore = row.story
    ? Math.max(row.score || 0, storyScore(row.story))
    : Math.max(row.score || 0, headlineClusterScore(row));
  score.className = `intel-score ${scoreTone(displayScore)}`;
  score.textContent = `优先级 ${priorityGrade(displayScore)}`;
  const sourceCount = document.createElement("span");
  sourceCount.className = "source-count";
  sourceCount.textContent = `${fmtNumber(rowSourceCount(row))} 个来源`;
  meta.append(rankEl, sourceChip(primarySource.label, primarySource.tone, "source-chip intel-source"), sourceCount, score, time);

  const title = document.createElement("div");
  title.className = "top-story-title";
  title.textContent = itemTitleText(item);

  const summary = document.createElement("p");
  summary.className = "top-story-summary";
  summary.textContent = signalSummaryText(row);
  const insight = buildInsightNode(item, row);

  const why = document.createElement("div");
  why.className = "top-story-why";
  const whyLabel = document.createElement("span");
  whyLabel.textContent = "为什么重要";
  const whyText = document.createElement("p");
  whyText.textContent = whyImportantText(row);
  why.append(whyLabel, whyText);

  const tags = document.createElement("div");
  tags.className = "intel-tags";
  itemTagLabels(item, row).forEach((label) => {
    tags.appendChild(itemTagChip(label));
  });

  const impact = document.createElement("div");
  impact.className = "impact-row";
  impactLabels(item).forEach((label) => {
    const chip = document.createElement("span");
    chip.textContent = label;
    impact.appendChild(chip);
  });

  link.append(meta, title, summary, insight, why, tags, impact);
  return link;
}

function buildIntelCard(item, rank) {
  const card = document.createElement("article");
  card.className = "intel-card";

  const meta = document.createElement("div");
  meta.className = "intel-card-meta";
  const rankEl = document.createElement("span");
  rankEl.className = "intel-card-rank";
  rankEl.textContent = `#${rank}`;
  const time = document.createElement("time");
  time.textContent = timeLabelText(item);
  const score = scorePercent(item);
  const scoreEl = document.createElement("strong");
  scoreEl.className = `intel-score ${scoreTone(score)}`;
  scoreEl.textContent = score ? `AI ${score}分` : "AI观察";
  meta.append(rankEl, time, scoreEl);

  const title = document.createElement("a");
  title.className = "intel-title";
  title.href = item.url || "#";
  title.target = "_blank";
  title.rel = "noopener noreferrer";
  title.textContent = itemTitleText(item);

  const reason = document.createElement("p");
  reason.className = "intel-reason";
  reason.textContent = reasonText(item);

  const tags = document.createElement("div");
  tags.className = "intel-tags";
  itemTagLabels(item).forEach((label) => {
    tags.appendChild(itemTagChip(label));
  });

  const sources = document.createElement("div");
  sources.className = "intel-card-sources";
  const refs = itemSourceRefs(item);
  const count = document.createElement("strong");
  count.textContent = `${fmtNumber(refs.length)} 个来源`;
  sources.appendChild(count);
  refs.slice(0, 3).forEach((ref) => {
    sources.appendChild(sourceChip(ref.label, ref.tone, "source-chip"));
  });

  card.append(meta, title, reason, tags, sources);
  return card;
}

function feedSummaryText(item) {
  if (itemSections(item).has("grant_policy")) {
    if (item.grant_source_type === "journal" && item.summary_zh) {
      return `中文摘要：${cleanBriefText(item.summary_zh, 420)} ${grantPolicyFeynmanText(item)}`;
    }
    return grantPolicyFeynmanText(item);
  }
  if (itemSections(item).has("github_projects")) {
    return item.github_project_reason || item.description || item.summary || "这个项目来自公开 GitHub 推荐源，建议打开仓库看 README、示例和维护状态。";
  }
  if (itemSections(item).has("model_scores")) {
    return item.summary || `${item.model_name || item.title} 在 ${item.benchmark || item.source || "Vellum 榜单"} 中得分 ${item.score}${item.unit || ""}。`;
  }
  if (itemSections(item).has("slow_professor") && item.summary) {
    return item.summary;
  }
  const signals = Array.isArray(item.ai_signals) ? item.ai_signals.filter(Boolean).slice(0, 2) : [];
  if (signals.length) return `相关线索：${signals.join(" / ")}。`;
  const reason = reasonText(item);
  if (reason && !reason.startsWith("来源与标题")) return reason.replace(/^命中方向：/, "相关线索：");
  return `${labelText(item)} · AI 相关度 ${scorePercent(item) || "待评估"}。`;
}

function renderItemNode(item, context = {}) {
  const node = itemTpl.content.firstElementChild.cloneNode(true);
  const metaRow = node.querySelector(".meta-row");
  const siteEl = node.querySelector(".site");
  siteEl.textContent = itemSourceDisplayName(item);
  if (context.source && (context.source === item.source || context.source === itemSourceDisplayName(item))) {
    siteEl.hidden = true;
  }
  const kind = sourceKind(item.site_id);
  const categoryEl = node.querySelector(".category");
  categoryEl.textContent = kind.label;
  categoryEl.classList.add(`kind-${kind.tone}`);
  const score = scorePercent(item);
  const creatorScore = creatorHotScore(item);
  const tagEl = document.createElement("span");
  tagEl.className = `ai-tag tone-${itemLabelTone(item)}`;
  tagEl.textContent = itemSections(item).has("grant_policy")
    ? `${labelText(item)} · ${item.grant_topic || "专题"}`
    : itemSections(item).has("github_projects")
    ? `GitHub推荐 · ${normalizedPercent(item.github_project_score || item.ai_score) || "?"}分`
    : creatorScore && itemSections(item).has("creator")
    ? `自媒体热度 · ${creatorScore}分`
    : `${labelText(item)} · ${score || "?"}分`;
  categoryEl.insertAdjacentElement("afterend", tagEl);

  const sourceEl = node.querySelector(".source");
  const sourceLabel = sourceSignal(item);
  setSourceBadge(sourceEl, sourceLabel, sourceSignalTone(sourceLabel), item.source ? `分区: ${item.source}` : "");
  if (context.source && context.source === item.source) {
    sourceEl.hidden = true;
  }

  const primaryLabel = labelText(item);
  itemTagLabels(item)
    .filter((label) => label !== primaryLabel)
    .slice(0, 3)
    .forEach((label) => {
      metaRow.insertBefore(itemTagChip(label), sourceEl);
    });

  node.querySelector(".time").textContent = timeLabelText(item);

  const titleEl = node.querySelector(".title");
  const zh = (item.title_zh || "").trim();
  const en = (item.title_en || "").trim();
  titleEl.textContent = "";
  if (zh && en && zh !== en) {
    const primary = document.createElement("span");
    primary.textContent = zh;
    const sub = document.createElement("span");
    sub.className = "title-sub";
    sub.textContent = en;
    titleEl.appendChild(primary);
    titleEl.appendChild(sub);
  } else {
    titleEl.textContent = item.title || zh || en;
  }
  titleEl.href = item.url;
  const summaryEl = node.querySelector(".news-summary");
  if (summaryEl) summaryEl.textContent = feedSummaryText(item);
  return node;
}

const SOURCE_ITEM_INITIAL_LIMIT = 3;
const SITE_GROUP_INITIAL_LIMIT = 4;
const SITE_GROUP_LOAD_STEP = 4;
const SITE_SOURCE_GROUP_INITIAL_LIMIT = 4;
const SITE_SOURCE_GROUP_LOAD_STEP = 4;
const SOURCE_GROUP_INITIAL_LIMIT = 8;
const SOURCE_GROUP_LOAD_STEP = 8;
const BOLE_HOT_LIMIT = 10;
const BOLE_TIMELINE_LIMIT = 20;

function buildSourceGroupNode(source, items, rawCount = items.length) {
  const section = document.createElement("section");
  section.className = "source-group";
  const header = document.createElement("header");
  header.className = "source-group-head";
  const title = document.createElement("h3");
  title.textContent = source;
  const count = document.createElement("span");
  count.className = "group-summary";
  count.textContent = subgroupSummary(items, rawCount);
  const listEl = document.createElement("div");
  listEl.className = "source-group-list";
  header.append(title, count);
  section.append(header, listEl);

  let expanded = false;
  if (items.length > SOURCE_ITEM_INITIAL_LIMIT) {
    const moreBtn = document.createElement("button");
    moreBtn.type = "button";
    moreBtn.className = "group-more-btn";
    const renderItems = () => {
      listEl.innerHTML = "";
      const visibleItems = expanded ? items : items.slice(0, SOURCE_ITEM_INITIAL_LIMIT);
      visibleItems.forEach((item) => listEl.appendChild(renderItemNode(item, { source })));
      moreBtn.textContent = expanded
        ? `收起，仅看前 ${SOURCE_ITEM_INITIAL_LIMIT} 条`
        : `展开剩余 ${fmtNumber(items.length - SOURCE_ITEM_INITIAL_LIMIT)} 条`;
    };
    moreBtn.addEventListener("click", () => {
      expanded = !expanded;
      renderItems();
    });
    renderItems();
    section.append(moreBtn);
  } else {
    items.forEach((item) => listEl.appendChild(renderItemNode(item, { source })));
  }
  return section;
}

function displayDedupeKey(item) {
  const title = normalizedEventText(itemTitleText(item));
  // Short social-post titles such as "AI小狗" still identify the same visible
  // post within one creator subgroup; URL query strings often only carry a
  // rotating access token and must not defeat that deduplication.
  if (title) return `title:${title}`;
  try {
    const url = new URL(item.url || "");
    return `url:${url.origin}${url.pathname}`;
  } catch {
    return `url:${item.url || item.id || "untitled"}`;
  }
}

function dedupeSubgroupItems(items) {
  const seen = new Set();
  return sortItemsForList(items).filter((item) => {
    const key = displayDedupeKey(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function subgroupSortValue(items) {
  if (!items.length) return 0;
  if (state.listSort === "latest") return Math.max(...items.map(timelineMs));
  if (state.listSort === "ai") return Math.max(...items.map(scorePercent));
  if (state.listSort === "source") return items.length;
  const leading = [...items]
    .sort((a, b) => itemPriorityScore(b) - itemPriorityScore(a))
    .slice(0, 3);
  return Math.round(leading.reduce((sum, item) => sum + itemPriorityScore(item), 0) / leading.length);
}

function subgroupSummary(items, rawCount = items.length) {
  const count = `${fmtNumber(items.length)} 条`;
  const merged = rawCount - items.length;
  let ranking = "";
  if (state.listSort === "priority") ranking = `综合 ${subgroupSortValue(items)}`;
  if (state.listSort === "latest") ranking = `最新 ${timeLabelText(items[0])}`;
  if (state.listSort === "ai") ranking = `最高 AI ${subgroupSortValue(items)}分`;
  const mergedLabel = merged > 0 ? `合并 ${fmtNumber(merged)} 条重复` : "";
  return [count, ranking, mergedLabel].filter(Boolean).join(" · ");
}

function sourceGroupEntries(items) {
  const groupMap = new Map();
  items.forEach((item) => {
    const key = itemSourceDisplayName(item) || "未分区";
    if (!groupMap.has(key)) {
      groupMap.set(key, []);
    }
    groupMap.get(key).push(item);
  });

  return Array.from(groupMap.entries())
    .map(([source, rawItems]) => ({
      source,
      rawCount: rawItems.length,
      items: dedupeSubgroupItems(rawItems),
    }))
    .filter((group) => group.items.length)
    .sort((a, b) => {
      const byGrantOrder = grantSourceGroupRank(a.items) - grantSourceGroupRank(b.items);
      if (byGrantOrder !== 0) return byGrantOrder;
      const byScore = subgroupSortValue(b.items) - subgroupSortValue(a.items);
      if (byScore !== 0) return byScore;
      const byCount = b.items.length - a.items.length;
      if (byCount !== 0) return byCount;
      return a.source.localeCompare(b.source, "zh-CN");
    });
}

// Mobile-safe async rendering: avoid blocking the main thread on large lists.
// We chunk site-groups and yield between each chunk so the browser can paint
// and respond to touch events while the list is being built.
let _renderListToken = 0;

function buildSiteGroupNode(site) {
  const siteSection = document.createElement("section");
  siteSection.className = "site-group";
  const header = document.createElement("header");
  header.className = "site-group-head";
  const title = document.createElement("h3");
  title.textContent = site.siteName;
  const count = document.createElement("span");
  count.className = "group-summary";
  count.textContent = subgroupSummary(site.items, site.rawCount);
  const siteListEl = document.createElement("div");
  siteListEl.className = "site-group-list";
  header.append(title, count);
  siteSection.append(header, siteListEl);

  const sourceGroups = site.sourceGroups;
  let expanded = false;
  let moreBtn = null;
  const renderSourceGroups = () => {
    siteListEl.innerHTML = "";
    if (moreBtn) moreBtn.remove();
    const visibleGroups = expanded
      ? sourceGroups
      : sourceGroups.slice(0, SITE_SOURCE_GROUP_INITIAL_LIMIT);
    const frag = document.createDocumentFragment();
    visibleGroups.forEach((group) => {
      frag.appendChild(buildSourceGroupNode(group.source, group.items, group.rawCount));
    });
    siteListEl.appendChild(frag);
    if (sourceGroups.length > SITE_SOURCE_GROUP_INITIAL_LIMIT) {
      const hiddenCount = sourceGroups.length - SITE_SOURCE_GROUP_INITIAL_LIMIT;
      moreBtn = addLoadMoreButton(
        siteSection,
        expanded
          ? `收起，仅看前 ${SITE_SOURCE_GROUP_INITIAL_LIMIT} 个分区`
          : `展开其余 ${fmtNumber(hiddenCount)} 个分区`,
        () => {
          expanded = !expanded;
          renderSourceGroups();
        },
      );
    }
  };
  renderSourceGroups();
  return siteSection;
}

function renderLoadingNotice(label, count) {
  const loading = document.createElement("div");
  loading.className = "list-loading";
  loading.textContent = `正在整理 ${label} · ${fmtNumber(count)} 条`;
  newsListEl.appendChild(loading);
}

function currentFilterLabel(filtered) {
  if (state.authorFilter) return `${listTitleText()} · X 博主 ${state.authorFilter}`;
  if (state.siteFilter) {
    const item = filtered[0];
    const stat = currentSiteStats().find((s) => s.site_id === state.siteFilter);
    return `${listTitleText()} · ${item?.site_name || stat?.site_name || state.siteFilter}`;
  }
  return listTitleText();
}

function groupedSites(items) {
  const siteMap = new Map();
  items.forEach((item) => {
    if (!siteMap.has(item.site_id)) {
      siteMap.set(item.site_id, { siteName: itemSourceDisplayName(item) || item.site_name || item.site_id, rawItems: [] });
    }
    siteMap.get(item.site_id).rawItems.push(item);
  });

  return Array.from(siteMap.entries())
    .map(([siteId, site]) => {
      const sourceGroups = sourceGroupEntries(site.rawItems);
      return [siteId, {
        siteName: site.siteName,
        rawCount: site.rawItems.length,
        sourceGroups,
        items: sourceGroups.flatMap((group) => group.items),
      }];
    })
    .filter(([, site]) => site.items.length)
    .sort((a, b) => {
      const byGrantOrder = (GRANT_SOURCE_GROUP_ORDER[a[0]] ?? Number.POSITIVE_INFINITY)
        - (GRANT_SOURCE_GROUP_ORDER[b[0]] ?? Number.POSITIVE_INFINITY);
      if (byGrantOrder !== 0) return byGrantOrder;
      const byScore = subgroupSortValue(b[1].items) - subgroupSortValue(a[1].items);
      if (byScore !== 0) return byScore;
      const byCount = b[1].items.length - a[1].items.length;
      if (byCount !== 0) return byCount;
      return a[1].siteName.localeCompare(b[1].siteName, "zh-CN");
    });
}

function addLoadMoreButton(parent, label, onClick) {
  const moreBtn = document.createElement("button");
  moreBtn.type = "button";
  moreBtn.className = "list-more-btn";
  moreBtn.textContent = label;
  moreBtn.addEventListener("click", onClick);
  parent.appendChild(moreBtn);
  return moreBtn;
}

function renderSiteGroups(items) {
  const groups = groupedSites(items);
  const visibleGroups = state.siteGroupsExpanded
    ? groups
    : groups.slice(0, SITE_GROUP_INITIAL_LIMIT);
  visibleGroups.forEach(([, site]) => {
    newsListEl.appendChild(buildSiteGroupNode(site));
  });

  if (groups.length > SITE_GROUP_INITIAL_LIMIT) {
    const hiddenCount = groups.length - SITE_GROUP_INITIAL_LIMIT;
    addLoadMoreButton(
      newsListEl,
      state.siteGroupsExpanded
        ? `收起，仅看前 ${SITE_GROUP_INITIAL_LIMIT} 个来源`
        : `展开其余 ${fmtNumber(hiddenCount)} 个来源`,
      () => {
        state.siteGroupsExpanded = !state.siteGroupsExpanded;
        renderList();
      },
    );
  }
  document.dispatchEvent(new CustomEvent("aiRadar:listRendered"));
}

function renderList() {
  const filtered = getFilteredItems();
  renderListSortTools();
  resultCountEl.textContent = `${fmtNumber(filtered.length)} 条`;
  renderSectionSummary(filtered);

  newsListEl.innerHTML = "";
  _renderListToken += 1;           // invalidate any in-flight render
  const token = _renderListToken;

  if (!filtered.length) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = state.activeSection === "slow_professor"
      ? "暂无可核验的近一周公众号文章。请配置公网 WeWe/RSS 后自动呈现；当前不会用第三方转载页冒充公众号文章。"
      : "当前筛选条件下没有结果。";
    newsListEl.appendChild(empty);
    return;
  }

  renderLoadingNotice(currentFilterLabel(filtered), filtered.length);
  requestAnimationFrame(() => {
    if (token !== _renderListToken) return;   // stale render, abort
    const sorted = sortItemsForList(filtered);
    newsListEl.innerHTML = "";
    renderSiteGroups(sorted);
  });
}

function rerenderCurrentView() {
  state.boleExpanded = false;
  state.siteGroupsExpanded = false;
  renderSectionTabs();
  renderModeSwitch();
  renderSiteFilters();
  renderBolePicks();
  if (state.waytoagiData) renderWaytoagi(state.waytoagiData);
  renderGrantPolicy();
  renderList();
}

function waytoagiViews(waytoagi) {
  const updates7d = Array.isArray(waytoagi?.updates_7d) ? waytoagi.updates_7d : [];
  const latestDate = waytoagi?.latest_date || (updates7d.length ? updates7d[0].date : null);
  const updatesToday = Array.isArray(waytoagi?.updates_today) && waytoagi.updates_today.length
    ? waytoagi.updates_today
    : (latestDate ? updates7d.filter((u) => u.date === latestDate) : []);
  return { updates7d, updatesToday, latestDate };
}

function renderWaytoagi(waytoagi) {
  if (waytoagiWrapEl) {
    waytoagiWrapEl.hidden = state.activeSection !== "community";
  }
  if (state.activeSection !== "community") return;
  const { updates7d, updatesToday, latestDate } = waytoagiViews(waytoagi);
  if (waytoagiTodayBtnEl) waytoagiTodayBtnEl.classList.toggle("active", state.waytoagiMode === "today");
  if (waytoagi7dBtnEl) waytoagi7dBtnEl.classList.toggle("active", state.waytoagiMode === "7d");
  waytoagiUpdatedAtEl.textContent = `更新时间：${fmtTime(waytoagi.generated_at)}`;

  waytoagiMetaEl.innerHTML = "";
  const rootLink = document.createElement("a");
  rootLink.href = waytoagi.root_url || "#";
  rootLink.target = "_blank";
  rootLink.rel = "noopener noreferrer";
  rootLink.textContent = "主页面";
  const historyLink = document.createElement("a");
  historyLink.href = waytoagi.history_url || "#";
  historyLink.target = "_blank";
  historyLink.rel = "noopener noreferrer";
  historyLink.textContent = "历史更新页";
  const todayCount = document.createElement("span");
  todayCount.textContent = `最近更新日(${latestDate || "--"})：${fmtNumber(waytoagi.count_today || updatesToday.length)} 条`;
  const weekCount = document.createElement("span");
  weekCount.textContent = `近 7 日：${fmtNumber(waytoagi.count_7d || updates7d.length)} 条`;
  [rootLink, "·", historyLink, "·", todayCount, "·", weekCount].forEach((part) => {
    if (typeof part === "string") {
      const sep = document.createElement("span");
      sep.textContent = part;
      waytoagiMetaEl.appendChild(sep);
    } else {
      waytoagiMetaEl.appendChild(part);
    }
  });

  waytoagiListEl.innerHTML = "";
  if (waytoagi.has_error) {
    const div = document.createElement("div");
    div.className = "waytoagi-error";
    div.textContent = waytoagi.error || "WaytoAGI 数据加载失败";
    waytoagiListEl.appendChild(div);
    return;
  }

  const updates = state.waytoagiMode === "today" ? updatesToday : updates7d;
  if (!updates.length) {
    const div = document.createElement("div");
    div.className = "waytoagi-empty";
    div.textContent = state.waytoagiMode === "today"
      ? "最近更新日没有更新，可切换到近7日查看。"
      : (waytoagi.warning || "近 7 日没有更新");
    waytoagiListEl.appendChild(div);
    return;
  }

  updates.forEach((u) => {
    const row = document.createElement("a");
    row.className = "waytoagi-item";
    row.href = u.url || "#";
    row.target = "_blank";
    row.rel = "noopener noreferrer";
    const dateEl = document.createElement("span");
    dateEl.className = "d";
    dateEl.textContent = fmtDate(u.date);
    const titleEl = document.createElement("span");
    titleEl.className = "t";
    titleEl.textContent = u.title;
    row.append(dateEl, titleEl);
    waytoagiListEl.appendChild(row);
  });
}

function renderGrantPolicy(data = state.grantPolicyData) {
  if (grantPolicyWrapEl) {
    grantPolicyWrapEl.hidden = state.activeSection !== "grant_policy";
  }
  if (state.activeSection !== "grant_policy" || !grantPolicyWrapEl) return;

  const payload = data || {};
  const items = Array.isArray(payload.items) ? payload.items : [];
  const sources = Array.isArray(payload.sources) ? payload.sources : [];
  const refs = Array.isArray(payload.reference_sources) ? payload.reference_sources : [];
  const okSources = sources.filter((source) => source.ok).length;

  if (grantPolicyUpdatedAtEl) {
    grantPolicyUpdatedAtEl.textContent = payload.generated_at ? `更新时间：${fmtTime(payload.generated_at)}` : "专题数据待生成";
  }

  if (grantPolicyMetaEl) {
    grantPolicyMetaEl.innerHTML = "";
    const parts = [
      `公开源 ${fmtNumber(okSources)}/${fmtNumber(sources.length)}`,
      `专题条目 ${fmtNumber(items.length)}`,
      `国际入口 ${fmtNumber(refs.length)}`,
      "公众号已拆到慢教授专题",
    ];
    parts.forEach((text, index) => {
      if (index) {
        const sep = document.createElement("span");
        sep.textContent = "·";
        grantPolicyMetaEl.appendChild(sep);
      }
      const item = document.createElement("span");
      item.textContent = text;
      grantPolicyMetaEl.appendChild(item);
    });
  }

  if (grantPolicySourcesEl) {
    grantPolicySourcesEl.innerHTML = "";
    sources.forEach((source) => {
      const card = document.createElement("a");
      card.className = `grant-source-card ${source.ok ? "ok" : "warn"}`;
      card.href = source.url || "#";
      card.target = "_blank";
      card.rel = "noopener noreferrer";
      const title = document.createElement("strong");
      title.textContent = sourceDisplayName(source);
      const meta = document.createElement("span");
      meta.textContent = source.ok
        ? `${fmtNumber(source.item_count || 0)} 条 · 已接入`
        : `候选源 · ${source.error ? "需复核" : "暂无条目"}`;
      card.append(title, meta);
      grantPolicySourcesEl.appendChild(card);
    });
  }

  if (grantPolicyReferenceEl) {
    grantPolicyReferenceEl.innerHTML = "";
    refs.forEach((ref) => {
      const link = document.createElement("a");
      link.className = "grant-ref-card";
      link.href = ref.url || "#";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      const title = document.createElement("strong");
      title.textContent = sourceDisplayName(ref) || "国际对标";
      const desc = document.createElement("span");
      desc.textContent = ref.description || "国际项目检索入口";
      link.append(title, desc);
      grantPolicyReferenceEl.appendChild(link);
    });
  }
}

function renderMetric(label, value, tone = "", options = {}) {
  const interactive = typeof options.onClick === "function";
  const node = document.createElement(interactive ? "button" : "div");
  node.className = `health-metric ${interactive ? "health-metric-button" : ""} ${tone}`.trim();
  if (interactive) {
    node.type = "button";
    node.title = options.title || "查看详情";
    node.setAttribute("aria-expanded", String(Boolean(options.expanded)));
    node.addEventListener("click", options.onClick);
  }
  const labelEl = document.createElement("span");
  labelEl.className = "health-label";
  labelEl.textContent = label;
  const valueEl = document.createElement("strong");
  valueEl.textContent = value;
  node.append(labelEl, valueEl);
  return node;
}

function socialdataAuthors() {
  return Array.from(new Set(
    state.itemsAi
      .filter((item) => item.site_id === "socialdata_x")
      .map((item) => String(item.source || "").trim())
      .filter(Boolean),
  )).sort((a, b) => a.localeCompare(b, "en"));
}

function selectSocialdataAuthor(author) {
  state.authorFilter = author;
  state.siteFilter = "socialdata_x";
  state.activeSection = "hot";
  state.boleExpanded = false;
  state.siteGroupsExpanded = false;
  state.xAuthorsExpanded = false;
  renderSectionTabs();
  renderModeSwitch();
  renderSiteFilters();
  renderBolePicks();
  renderList();
  renderSourceHealth();
  document.querySelector(".list-wrap")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderSocialdataAuthorList(authors, itemCount) {
  const panel = document.createElement("section");
  panel.className = "health-author-list";
  const heading = document.createElement("div");
  heading.className = "health-author-list-title";
  heading.textContent = "本轮 X 扫到的博主";
  const meta = document.createElement("div");
  meta.className = "health-author-list-meta";
  meta.textContent = `${fmtNumber(authors.length)} 位博主 · ${fmtNumber(itemCount)} 条入池内容`;
  const list = document.createElement("div");
  list.className = "health-author-list-items";
  authors.forEach((author) => {
    const item = document.createElement("button");
    item.type = "button";
    item.textContent = author;
    item.title = `查看 ${author} 的 X 内容`;
    item.addEventListener("click", () => selectSocialdataAuthor(author));
    list.appendChild(item);
  });
  panel.append(heading, meta, list);
  return panel;
}

function renderIssueList(title, items) {
  const wrap = document.createElement("div");
  wrap.className = "health-issue";
  const titleEl = document.createElement("div");
  titleEl.className = "health-issue-title";
  titleEl.textContent = title;
  const list = document.createElement("ul");
  items.slice(0, 6).forEach((item) => {
    const li = document.createElement("li");
    li.textContent = typeof item === "string" ? item : JSON.stringify(item);
    list.appendChild(li);
  });
  if (items.length > 6) {
    const li = document.createElement("li");
    li.textContent = `另有 ${fmtNumber(items.length - 6)} 项`;
    list.appendChild(li);
  }
  wrap.append(titleEl, list);
  return wrap;
}

function renderSourceHealthSummaryNode(status, errorMessage = "") {
  const node = document.createElement("div");
  node.className = "source-health-summary";
  if (!status) {
    node.classList.add(errorMessage ? "bad" : "warn");
    node.innerHTML = `<strong>${errorMessage ? "源状态异常" : "源状态未生成"}</strong><span>${errorMessage || "等待 source-status.json"}</span>`;
    return node;
  }
  const sites = Array.isArray(status.sites) ? status.sites : [];
  const okSites = Number(status.successful_sites || 0);
  const failed = failedSourceCount(status);
  const fetched = Number(status.fetched_raw_items || state.totalRaw || status.items_before_topic_filter || 0);
  node.classList.toggle("warn", failed > 0);
  node.innerHTML = `<strong>${fmtNumber(okSites)}/${fmtNumber(sites.length)} 源正常</strong><span>今日采集 ${fmtNumber(fetched)} 条 · 失败 ${fmtNumber(failed)}</span>`;
  return node;
}

function renderSourceStatusTable(status) {
  if (!sourceStatusTableEl) return;
  sourceStatusTableEl.innerHTML = "";
  if (!status || !Array.isArray(status.sites) || !status.sites.length) return;

  const rows = status.sites
    .map((site) => {
      const ai = aiSiteStat(site.site_id);
      const aiCount = Number(ai?.count || 0);
      const rawCount = Number(ai?.raw_count ?? site.item_count ?? 0);
      const scanned = Number(site.item_count || rawCount || 0);
      const ratioBase = rawCount || scanned;
      const ratio = ratioBase ? Math.round((aiCount / ratioBase) * 100) : 0;
      return { ...site, aiCount, rawCount: ratioBase, ratio };
    })
    .sort((a, b) => b.aiCount - a.aiCount || b.rawCount - a.rawCount || String(a.site_name).localeCompare(String(b.site_name), "zh-CN"))
    .slice(0, 12);

  const table = document.createElement("div");
  table.className = "source-table";
  const header = document.createElement("div");
  header.className = "source-table-row source-table-head";
  header.innerHTML = "<span>来源</span><span>AI / 原始</span><span>AI占比</span><span>状态</span>";
  table.appendChild(header);
  rows.forEach((site) => {
    const row = document.createElement("div");
    row.className = "source-table-row";
    const statusText = site.ok ? "正常" : "异常";
    row.innerHTML = `
      <span>${site.site_name || site.site_id}</span>
      <span>${fmtNumber(site.aiCount)} / ${fmtNumber(site.rawCount)}</span>
      <span>${fmtNumber(site.ratio)}%</span>
      <span class="${site.ok ? "ok" : "bad"}">${statusText}</span>
    `;
    table.appendChild(row);
  });
  sourceStatusTableEl.appendChild(table);
}

function renderSourceHealth(errorMessage = "") {
  if (!sourceHealthEl) return;
  sourceHealthEl.innerHTML = "";
  if (sourceHealthDetailsEl) sourceHealthDetailsEl.innerHTML = "";
  if (sourceStatusTableEl) sourceStatusTableEl.innerHTML = "";

  const status = state.sourceStatus;
  if (!status) {
    sourceHealthEl.appendChild(renderSourceHealthSummaryNode(null, errorMessage));
    renderSourceStatusPill(errorMessage);
    renderAdvancedSummary();
    setStats();
    return;
  }

  const sites = Array.isArray(status.sites) ? status.sites : [];
  const failedSites = Array.isArray(status.failed_sites) ? status.failed_sites : [];
  const zeroSites = Array.isArray(status.zero_item_sites) ? status.zero_item_sites : [];
  const rss = status.rss_opml || {};
  const agentmail = status.agentmail || {};
  const xApi = status.x_api || {};
  const socialdata = status.socialdata || {};
  const emptyAdvanced = Array.isArray(status.empty_advanced_sources) ? status.empty_advanced_sources : [];
  const failedFeeds = Array.isArray(rss.failed_feeds) ? rss.failed_feeds : [];
  const skippedFeeds = Array.isArray(rss.skipped_feeds) ? rss.skipped_feeds : [];
  const replacedFeeds = Array.isArray(rss.replaced_feeds) ? rss.replaced_feeds : [];
  // Paid sources run on a protected interval. A skipped refresh can still have
  // usable records from the last successful run in today's data pool, so don't
  // hide them behind a misleading "待窗口" status.
  const socialdataLiveCount = Number(socialdata.item_count || 0);
  const socialdataPoolCount = siteAiPoolCount("socialdata_x");
  const socialdataDisplayCount = socialdataLiveCount || socialdataPoolCount;
  const xApiLiveCount = Number(xApi.item_count || 0);
  const xApiPoolCount = siteAiPoolCount("xapi");
  const xApiDisplayCount = xApiLiveCount || xApiPoolCount;
  const xDisplayCount = socialdataDisplayCount + xApiDisplayCount;
  const xAuthors = socialdataAuthors();

  const xMetricValue = xDisplayCount
    ? `已入池 ${fmtNumber(xDisplayCount)}条`
    : socialdata.enabled
    ? (socialdataDisplayCount
      ? "成功"
      : (socialdata.skipped ? "待窗口" : "已连接，暂无匹配"))
    : (xApi.enabled
      ? (xApiDisplayCount
        ? "成功"
        : (xApi.skipped ? "待窗口" : "已连接，暂无匹配"))
      : "未启用");
  const xMetricTone = socialdata.error || xApi.error ? "bad" : (xDisplayCount ? "ok" : (emptyAdvanced.length ? "warn" : ""));

  const metricGrid = document.createElement("div");
  metricGrid.className = "health-grid";
  metricGrid.append(
    renderMetric("内置源", `${fmtNumber(status.successful_sites || 0)}/${fmtNumber(sites.length)}`, failedSites.length ? "warn" : "ok"),
    renderMetric("RSS", rss.enabled ? `${fmtNumber(rss.ok_feeds || 0)}/${fmtNumber(rss.effective_feed_total || 0)}` : "未启用"),
    renderMetric("X数据源", xMetricValue, xMetricTone, xAuthors.length ? {
      expanded: state.xAuthorsExpanded,
      title: "查看本轮扫描到的 X 博主",
      onClick: () => {
        state.xAuthorsExpanded = !state.xAuthorsExpanded;
        renderSourceHealth();
      },
    } : {}),
    renderMetric("AgentMail", agentmail.enabled ? `${fmtNumber(agentmail.item_count || 0)}封` : "未启用", agentmail.error ? "bad" : ""),
    renderMetric("失败源", fmtNumber(failedSites.length + failedFeeds.length), failedSites.length || failedFeeds.length ? "bad" : "ok"),
    renderMetric("替换/跳过", `${fmtNumber(replacedFeeds.length)}/${fmtNumber(skippedFeeds.length)}`)
  );
  sourceHealthEl.appendChild(renderSourceHealthSummaryNode(status, errorMessage));
  const detailTarget = sourceHealthDetailsEl || sourceHealthEl;
  detailTarget.appendChild(metricGrid);
  if (state.xAuthorsExpanded && xAuthors.length) {
    detailTarget.appendChild(renderSocialdataAuthorList(xAuthors, socialdataDisplayCount));
  }

  const issues = document.createElement("div");
  issues.className = "health-issues";
  if (failedSites.length) issues.appendChild(renderIssueList("失败站点", failedSites));
  if (zeroSites.length) issues.appendChild(renderIssueList("零结果站点", zeroSites));
  if (emptyAdvanced.length) {
    issues.appendChild(renderIssueList("高级源暂无匹配", emptyAdvanced.map((item) => `${item.site_name || item.site_id} · 已连接，暂无匹配结果`)));
  }
  if (failedFeeds.length) issues.appendChild(renderIssueList("失败 RSS", failedFeeds));
  if (skippedFeeds.length) {
    issues.appendChild(renderIssueList("跳过 RSS", skippedFeeds.map((item) => `${item.feed_url} · ${item.reason || "skipped"}`)));
  }

  if (issues.childElementCount) {
    detailTarget.appendChild(issues);
  } else {
    const ok = document.createElement("div");
    ok.className = "health-ok";
    ok.textContent = "详细源状态正常";
    detailTarget.appendChild(ok);
  }
  renderSourceStatusTable(status);
  renderSourceStatusPill(errorMessage);
  renderAdvancedSummary();
  setStats();
}

async function loadNewsData() {
  const res = await fetch(`./data/latest-24h.json?t=${Date.now()}`);
  if (!res.ok) throw new Error(`加载 latest-24h.json 失败: ${res.status}`);
  return res.json();
}

async function loadAllModeData() {
  if (state.allDataLoaded) return;
  if (!state.allDataPromise) {
    state.allDataPromise = fetch(`./${state.allDataUrl}?t=${Date.now()}`)
      .then((res) => {
        if (!res.ok) throw new Error(`加载 latest-24h-all.json 失败: ${res.status}`);
        return res.json();
      })
      .then((payload) => {
        state.itemsAllRaw = payload.items_all_raw || payload.items_all || state.itemsAi;
        state.itemsAll = payload.items_all || state.itemsAi;
        state.totalRaw = payload.total_items_raw || state.itemsAllRaw.length;
        state.totalAllMode = payload.total_items_all_mode || state.itemsAll.length;
        state.allDataLoaded = true;
      })
      .catch((err) => {
        state.allDataPromise = null;
        throw err;
      });
  }
  return state.allDataPromise;
}

async function loadWaytoagiData() {
  const res = await fetch(`./data/waytoagi-7d.json?t=${Date.now()}`);
  if (!res.ok) throw new Error(`加载 waytoagi-7d.json 失败: ${res.status}`);
  return res.json();
}

async function loadSourceStatusData() {
  const res = await fetch(`./data/source-status.json?t=${Date.now()}`);
  if (!res.ok) throw new Error(`加载 source-status.json 失败: ${res.status}`);
  return res.json();
}

async function loadDailyBriefData() {
  const res = await fetch(`./data/daily-brief.json?t=${Date.now()}`);
  if (!res.ok) throw new Error(`加载 daily-brief.json 失败: ${res.status}`);
  return res.json();
}

async function loadStoriesData() {
  const res = await fetch(`./${state.storiesDataUrl}?t=${Date.now()}`);
  if (!res.ok) throw new Error(`加载 stories-merged.json 失败: ${res.status}`);
  return res.json();
}

async function loadGrantPolicyData() {
  const res = await fetch(`./data/latest-grants-24h.json?t=${Date.now()}`);
  if (!res.ok) throw new Error(`加载 latest-grants-24h.json 失败: ${res.status}`);
  return res.json();
}

async function loadSlowProfessorData() {
  let res = await fetch(`./data/latest-slow-professor-7d.json?t=${Date.now()}`);
  if (!res.ok) {
    res = await fetch(`./data/latest-slow-professor-3d.json?t=${Date.now()}`);
  }
  if (!res.ok) throw new Error(`加载 latest-slow-professor-7d.json 失败: ${res.status}`);
  return res.json();
}

async function loadGithubProjectData() {
  const res = await fetch(`./data/github-projects.json?t=${Date.now()}`);
  if (!res.ok) throw new Error(`加载 github-projects.json 失败: ${res.status}`);
  return res.json();
}

async function loadModelScoreData() {
  const res = await fetch(`./data/model-scores.json?t=${Date.now()}`);
  if (!res.ok) throw new Error(`加载 model-scores.json 失败: ${res.status}`);
  return res.json();
}

async function init() {
  const [newsResult, waytoagiResult, statusResult, briefResult, storiesResult, grantsResult, slowProfessorResult, githubProjectsResult, modelScoresResult] = await Promise.allSettled([
    loadNewsData(),
    loadWaytoagiData(),
    loadSourceStatusData(),
    loadDailyBriefData(),
    loadStoriesData(),
    loadGrantPolicyData(),
    loadSlowProfessorData(),
    loadGithubProjectData(),
    loadModelScoreData(),
  ]);

  if (briefResult.status === "fulfilled") {
    state.dailyBrief = briefResult.value;
  } else {
    state.dailyBrief = null;
  }

  if (storiesResult.status === "fulfilled") {
    state.storiesMerged = storiesResult.value;
  } else {
    state.storiesMerged = null;
  }

  if (grantsResult.status === "fulfilled") {
    state.grantPolicyData = grantsResult.value;
    state.grantPolicyItems = Array.isArray(grantsResult.value.items) ? grantsResult.value.items : [];
    state.grantPolicySources = Array.isArray(grantsResult.value.sources) ? grantsResult.value.sources : [];
    state.grantPolicyReferenceSources = Array.isArray(grantsResult.value.reference_sources) ? grantsResult.value.reference_sources : [];
  } else {
    state.grantPolicyData = null;
    state.grantPolicyItems = [];
    state.grantPolicySources = [];
    state.grantPolicyReferenceSources = [];
  }

  if (slowProfessorResult.status === "fulfilled") {
    state.slowProfessorData = slowProfessorResult.value;
    state.slowProfessorItems = Array.isArray(slowProfessorResult.value.items) ? slowProfessorResult.value.items : [];
    state.slowProfessorConfirmedEntries = Array.isArray(slowProfessorResult.value.confirmed_entries) ? slowProfessorResult.value.confirmed_entries : [];
    state.slowProfessorSources = Array.isArray(slowProfessorResult.value.sources) ? slowProfessorResult.value.sources : [];
  } else {
    state.slowProfessorData = null;
    state.slowProfessorItems = [];
    state.slowProfessorConfirmedEntries = [];
    state.slowProfessorSources = [];
  }

  if (githubProjectsResult.status === "fulfilled") {
    state.githubProjectData = githubProjectsResult.value;
    state.githubProjectItems = Array.isArray(githubProjectsResult.value.items) ? githubProjectsResult.value.items : [];
    state.githubProjectSources = Array.isArray(githubProjectsResult.value.sources) ? githubProjectsResult.value.sources : [];
  } else {
    state.githubProjectData = null;
    state.githubProjectItems = [];
    state.githubProjectSources = [];
  }

  if (modelScoresResult.status === "fulfilled") {
    state.modelScoreData = modelScoresResult.value;
    state.modelScoreItems = Array.isArray(modelScoresResult.value.items) ? modelScoresResult.value.items : [];
  } else {
    state.modelScoreData = null;
    state.modelScoreItems = [];
  }

  if (newsResult.status === "fulfilled") {
    const payload = newsResult.value;
    const loadedStoriesDataUrl = state.storiesDataUrl;
    state.itemsAi = payload.items_ai || payload.items || [];
    state.itemsAllRaw = payload.items_all_raw || payload.items_all || [];
    state.itemsAll = payload.items_all || [];
    state.creatorItemsAi = payload.creator_items_ai || [];
    state.creatorItemsAll = payload.creator_items_all || state.creatorItemsAi;
    state.creatorWindowDays = Number(payload.creator_window_days || 7);
    state.statsAi = payload.site_stats || [];
    state.totalAi = payload.total_items || state.itemsAi.length;
    state.totalRaw = payload.total_items_raw || state.itemsAllRaw.length;
    state.totalAllMode = payload.total_items_all_mode || state.itemsAll.length;
    state.allDataUrl = payload.all_mode_data_url || state.allDataUrl;
    state.storiesDataUrl = payload.stories_data_url || state.storiesDataUrl;
    if (state.storiesDataUrl !== loadedStoriesDataUrl) {
      try {
        state.storiesMerged = await loadStoriesData();
      } catch {
        state.storiesMerged = null;
      }
    }
    state.allDataLoaded = Boolean(payload.items_all || payload.items_all_raw);
    state.generatedAt = payload.generated_at;

    setStats();
    renderSectionTabs();
    renderModeSwitch();
    renderListSortTools();
    renderCoverageStrip();
    renderSiteFilters();
    renderBolePicks();
    renderGrantPolicy();
    renderList();
    updatedAtEl.textContent = fmtTime(state.generatedAt);
  } else {
    updatedAtEl.textContent = "新闻数据加载失败";
    newsListEl.innerHTML = `<div class="empty">${newsResult.reason.message}</div>`;
    renderCoverageStrip(newsResult.reason.message);
  }

  if (statusResult.status === "fulfilled") {
    state.sourceStatus = statusResult.value;
    renderSourceHealth();
    renderCoverageStrip();
  } else {
    renderSourceHealth(statusResult.reason.message);
    renderCoverageStrip(statusResult.reason.message);
  }

  if (waytoagiResult.status === "fulfilled") {
    state.waytoagiData = waytoagiResult.value;
    renderWaytoagi(state.waytoagiData);
  } else {
    if (waytoagiWrapEl) waytoagiWrapEl.hidden = state.activeSection !== "community";
    waytoagiUpdatedAtEl.textContent = "加载失败";
    waytoagiListEl.innerHTML = `<div class="waytoagi-error">${waytoagiResult.reason.message}</div>`;
  }

  document.dispatchEvent(new CustomEvent("aiRadar:ready"));
}

searchInputEl.addEventListener("input", (e) => {
  state.query = e.target.value;
  renderBolePicks();
  renderList();
});

siteSelectEl.addEventListener("change", (e) => {
  state.siteFilter = e.target.value;
  if (state.siteFilter !== "socialdata_x") state.authorFilter = "";
  state.siteGroupsExpanded = false;
  renderSiteFilters();
  renderBolePicks();
  renderList();
});

if (sectionSelectEl) {
  sectionSelectEl.addEventListener("change", (e) => {
    state.activeSection = e.target.value || "hot";
    rerenderCurrentView();
  });
}

if (sourceTypeSelectEl) {
  sourceTypeSelectEl.addEventListener("change", (e) => {
    state.sourceTypeFilter = e.target.value;
    state.siteFilter = "";
    state.authorFilter = "";
    rerenderCurrentView();
  });
}

if (signalLevelSelectEl) {
  signalLevelSelectEl.addEventListener("change", (e) => {
    state.signalLevelFilter = e.target.value;
    rerenderCurrentView();
  });
}

modeAiBtnEl.addEventListener("click", () => {
  state.mode = "ai";
  rerenderCurrentView();
});

modeAllBtnEl.addEventListener("click", async () => {
  state.mode = "all";
  renderModeSwitch();
  newsListEl.innerHTML = "";
  const loading = document.createElement("div");
  loading.className = "empty";
  loading.textContent = "正在加载全量更新...";
  newsListEl.appendChild(loading);
  try {
    await loadAllModeData();
    rerenderCurrentView();
  } catch (err) {
    newsListEl.innerHTML = "";
    const failed = document.createElement("div");
    failed.className = "empty";
    failed.textContent = err.message;
    newsListEl.appendChild(failed);
  }
});

if (allDedupeToggleEl) {
  allDedupeToggleEl.addEventListener("change", (e) => {
    state.allDedup = Boolean(e.target.checked);
    rerenderCurrentView();
  });
}

if (listSortToolsEl) {
  listSortToolsEl.addEventListener("click", (event) => {
    const target = event.target;
    const button = target instanceof Element ? target.closest("[data-sort]") : null;
    if (!button || !listSortToolsEl.contains(button)) return;
    const nextSort = button.dataset.sort;
    if (!LIST_SORT_DEFS.some((item) => item.id === nextSort) || nextSort === state.listSort) return;
    state.listSort = nextSort;
    renderListSortTools();
    renderList();
  });
}

if (waytoagiTodayBtnEl) {
  waytoagiTodayBtnEl.addEventListener("click", () => {
    state.waytoagiMode = "today";
    if (state.waytoagiData) renderWaytoagi(state.waytoagiData);
  });
}

if (waytoagi7dBtnEl) {
  waytoagi7dBtnEl.addEventListener("click", () => {
    state.waytoagiMode = "7d";
    if (state.waytoagiData) renderWaytoagi(state.waytoagiData);
  });
}

if (boleHotBtnEl) {
  boleHotBtnEl.addEventListener("click", () => {
    state.boleView = "hot";
    state.boleExpanded = false;
    renderBolePicks();
  });
}

if (boleTimelineBtnEl) {
  boleTimelineBtnEl.addEventListener("click", () => {
    state.boleView = "timeline";
    state.boleExpanded = false;
    renderBolePicks();
  });
}

init();
