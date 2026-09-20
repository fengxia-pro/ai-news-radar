// Dependency-free regression checks: node --test tests/frontend.test.cjs
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../assets/app.js'), 'utf8');
function extract(start, end) {
  return source.slice(source.indexOf(start), source.indexOf(end, source.indexOf(start)));
}
function element() {
  return {children: [], style: {}, append(...nodes) {this.children.push(...nodes);},
    appendChild(node) {this.children.push(node);}, set innerHTML(_) {this.children = [];}};
}
function context(extra = {}) {
  return vm.createContext({state: {query: '', activeSection: 'hot', creatorItemsAll: []},
    document: {createElement: element, dispatchEvent() {}}, CustomEvent: class {},
    resultCountEl: element(), newsListEl: element(), fmtNumber: String,
    renderSectionSummary() {}, renderListSortTools() {}, ...extra});
}

for (const section of ['model_scores', 'grant_books']) {
  test(`pending news frame cannot overwrite ${section}`, () => {
    const frames = [];
    let displayed = '';
    const ctx = context({requestAnimationFrame: fn => frames.push(fn), getFilteredItems: () => [{}],
      currentFilterLabel: () => '', renderLoadingNotice() {}, sortItemsForList: x => x,
      renderSiteGroups() {displayed = 'news';}, renderModelScoreEmbed() {displayed = 'model_scores';},
      renderGrantBookList() {displayed = 'grant_books';}});
    vm.runInContext('let _renderListToken=0;\n' + extract('function renderList()', 'function rerenderCurrentView()'), ctx);
    vm.runInContext('renderList()', ctx);
    ctx.state.activeSection = section;
    vm.runInContext('renderList()', ctx);
    frames.forEach(fn => fn());
    assert.equal(displayed, section);
  });
}

test('model search filters charts by model or benchmark and handles no match', () => {
  const charts = [];
  const ctx = context({MODEL_SCORE_LEADERBOARD_URL: 'https://example.com', MODEL_SCORE_RESEARCH_IMAGE: '',
    modelScoreTimeText: () => '', renderModelScoreChart: metric => {charts.push(metric.id); return element();}});
  ctx.state.modelScoreData = {research_metrics: [
    {id: 'gpqa', label: 'GPQA', items: [{model: 'Model A'}]},
    {id: 'aime', label: 'AIME 2025', items: [{model: 'Model B'}]},
  ]};
  vm.runInContext(extract('function renderModelScoreEmbed()', 'function renderModelScoreChart('), ctx);
  for (const [query, expected] of [['model a', ['gpqa']], ['aime', ['aime']], ['missing', []], ['', ['gpqa', 'aime']]]) {
    charts.length = 0;
    ctx.state.query = query;
    vm.runInContext('renderModelScoreEmbed()', ctx);
    assert.deepEqual(charts, expected);
    assert.equal(ctx.resultCountEl.textContent, `${expected.length} 个科研指标`);
  }
});

test('failed main news request still initializes independent topic views', async () => {
  let rendered = false;
  const ctx = context({updatedAtEl: element(), waytoagiUpdatedAtEl: element(), waytoagiListEl: element(),
    waytoagiWrapEl: element(), renderSourceHealth() {}, renderCoverageStrip() {}, setStats() {},
    renderWaytoagi() {}, rerenderCurrentView() {rendered = true;}});
  for (const name of ['loadNewsData', 'loadWaytoagiData', 'loadSourceStatusData', 'loadDailyBriefData',
    'loadStoriesData', 'loadGrantPolicyData', 'loadGrantBookData', 'loadSlowProfessorData',
    'loadGithubProjectData', 'loadModelScoreData']) ctx[name] = async () => ({items: [{id: 'available'}]});
  ctx.loadNewsData = async () => {throw new Error('HTTP 503');};
  vm.runInContext(extract('async function init()', 'searchInputEl.addEventListener'), ctx);
  await vm.runInContext('init()', ctx);
  assert.equal(rendered, true);
  assert.equal(ctx.state.newsLoadError, true);
  assert.equal(ctx.state.grantPolicyItems[0].id, 'available');
  assert.equal(ctx.state.slowProfessorItems[0].id, 'available');
});
