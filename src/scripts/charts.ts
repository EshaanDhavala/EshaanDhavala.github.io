import * as Plot from '@observablehq/plot';

const css = (v: string) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
const style = () => ({ background: 'transparent', color: css('--ink'), fontFamily: getComputedStyle(document.body).fontFamily, fontSize: '12px' });
const width = (el: HTMLElement, max = 860) => Math.min(el.clientWidth || 640, max);
const cache = new Map<string, Promise<any>>();
const get = (url: string, text = false) => {
  if (!cache.has(url)) cache.set(url, fetch(url).then((r) => (text ? r.text() : r.json())));
  return cache.get(url)!;
};

const charts: Record<string, (el: HTMLElement) => Promise<Element>> = {
  async qb(el) {
    const t: string = await get('/data/qb_clutch_ratings.csv', true);
    const [head, ...lines] = t.trim().split('\n');
    const cols = head.split(',');
    const rows = lines.map((l) => Object.fromEntries(l.split(',').map((v, i) => [cols[i], v]))).map((r: any) => ({ qb: r.passer_player_name, v: +r.clutch_rating, n: +r.n_clutch_plays }));
    return Plot.plot({
      width: width(el), height: 440, marginLeft: 96, marginRight: 48, style: style(),
      x: { label: null, grid: true, domain: [-0.6, 0.6] },
      y: { label: null, domain: [...rows].sort((a, b) => b.v - a.v).map((d) => d.qb) },
      marks: [
        Plot.barX(rows, { x: 'v', y: 'qb', fill: (d) => (d.v >= 0 ? css('--violet') : css('--sauce')), rx: 3 }),
        Plot.ruleX([0], { stroke: css('--ink') }),
        Plot.text(rows, { x: () => 0.6, y: 'qb', text: (d) => `n=${d.n}`, textAnchor: 'end', fill: css('--ink-2') }),
        Plot.tip(rows, Plot.pointerY({ x: 'v', y: 'qb', title: (d) => `${d.qb}\n${d.v.toFixed(2)} clutch rating\n${d.n} clutch dropbacks` })),
      ],
    });
  },
  async journal(el) {
    const s = await get('/data/journal_snapshot.json');
    const w = s.weeks.filter((x: any) => x.days_logged >= 5).map((x: any) => ({ ...x, date: new Date(x.week + 'T12:00') }));
    return Plot.plot({
      width: width(el), height: 280, marginRight: 64, style: style(),
      y: { domain: [4, 10.5], grid: true, label: null }, x: { label: null, type: 'utc' },
      marks: [
        Plot.lineY(w, { x: 'date', y: 'sleep_hours', stroke: css('--ink-2'), strokeWidth: 2, strokeDasharray: '4 3', curve: 'monotone-x' }),
        Plot.lineY(w, { x: 'date', y: 'mood_1_10', stroke: css('--violet'), strokeWidth: 3, curve: 'monotone-x' }),
        Plot.text(w.slice(-1), { x: 'date', y: 'mood_1_10', text: () => 'mood', dx: 8, dy: -6, fill: css('--violet'), textAnchor: 'start', fontWeight: 700 }),
        Plot.text(w.slice(-1), { x: 'date', y: 'sleep_hours', text: () => 'sleep (h)', dx: 8, dy: 8, fill: css('--ink-2'), textAnchor: 'start' }),
        Plot.tip(w, Plot.pointerX({ x: 'date', y: 'mood_1_10', title: (d: any) => `week of ${d.week}\nmood ${d.mood_1_10?.toFixed(1)} · sleep ${d.sleep_hours?.toFixed(1)} h · gym ${d.gym_days}` })),
      ],
    });
  },
  async 'journal-dow'(el) {
    const s = await get('/data/journal_snapshot.json');
    const rows = s.insights.by_dow as { dow: string; mood: number; gym_rate: number }[];
    const days = rows.map((r) => r.dow);
    const w = Math.min(width(el), 760);
    const narrow = w < 560;
    const half = narrow ? w : (w - 24) / 2;
    const common = { height: 220, style: style(), x: { domain: days, label: null, padding: 0.25, tickFormat: (d: string) => (narrow ? d[0] : d) } };
    const mood = Plot.plot({
      ...common, width: half, marginLeft: 32,
      y: { domain: [7, 8.5], label: 'mood', grid: true },
      marks: [Plot.barY(rows, { x: 'dow', y1: 7, y2: 'mood', fill: (d) => (d.mood === Math.max(...rows.map((r) => r.mood)) ? css('--sauce') : css('--violet')), rx: 3 }),
        Plot.text(rows, { x: 'dow', y: 'mood', text: (d) => d.mood.toFixed(1), dy: -8, fill: css('--ink'), fontWeight: 700, fontSize: narrow ? 10 : 12 })],
    });
    const gym = Plot.plot({
      ...common, width: half, marginLeft: 36,
      y: { domain: [0, 1], label: 'gym days', tickFormat: '%', grid: true },
      marks: [Plot.barY(rows, { x: 'dow', y: 'gym_rate', fill: css('--violet'), rx: 3 }),
        Plot.text(rows, { x: 'dow', y: 'gym_rate', text: (d) => `${Math.round(d.gym_rate * 100)}%`, dy: -8, fill: css('--ink'), fontWeight: 700, fontSize: narrow ? 10 : 12 })],
    });
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-wrap:wrap;gap:24px;justify-content:center';
    wrap.append(mood, gym);
    return wrap;
  },
  async tennis(el) {
    const raw = await get('/data/returns.json');
    const f = (window as any).__tennisFilter || 'all';
    const pts = raw.filter((d: any) => d.Bounce_Side === 'far' && (f === 'all' || d.Type === f || d.Stroke === f)).map((d: any) => ({ ...d, x: -+d.Bounce_x, y: 23.77 - +d.Bounce_y }));
    const W = 4.115, WD = 5.485, NET = 11.885, SVC = 6.4;
    const lines = [[-W, 0, -W, NET], [W, 0, W, NET], [-WD, 0, -WD, NET], [WD, 0, WD, NET], [-WD, 0, WD, 0], [-W, NET - SVC, W, NET - SVC], [0, NET - SVC, 0, NET]].map(([x1, y1, x2, y2]) => ({ x1, y1, x2, y2 }));
    const w = Math.min(width(el), 420);
    return Plot.plot({
      width: w, height: w * 1.35, style: style(),
      x: { domain: [-6.5, 6.5], axis: null }, y: { domain: [-4.8, NET + 0.6], axis: null, reverse: true },
      color: { domain: ['In', 'Out', 'Net'], range: [css('--violet'), css('--sauce'), css('--ink-2')], legend: true },
      marks: [
        Plot.link(lines, { x1: 'x1', y1: 'y1', x2: 'x2', y2: 'y2', stroke: css('--ink-2'), strokeOpacity: 0.6 }),
        Plot.ruleY([NET], { stroke: css('--ink'), strokeWidth: 3 }),
        Plot.dot(pts.filter((d: any) => d.Result === 'In'), { x: 'x', y: 'y', fill: 'Result', r: 6 }),
        Plot.dot(pts.filter((d: any) => d.Result !== 'In'), { x: 'x', y: 'y', stroke: 'Result', symbol: 'times', r: 6, strokeWidth: 2.5 }),
        Plot.tip(pts, Plot.pointer({ x: 'x', y: 'y', title: (d: any) => `${d.Type.replace('_', ' ')} · ${d.Stroke.toLowerCase()}\n${d.Direction} · ${d.Result}` })),
      ],
    });
  },
};

function drawAll() {
  document.querySelectorAll<HTMLElement>('[data-chart]').forEach(async (el) => {
    const fn = charts[el.dataset.chart!];
    if (!fn) return;
    try {
      el.replaceChildren(await fn(el));
    } catch {
      el.textContent = 'Chart failed to load.';
    }
  });
}

let t: number | undefined;
document.addEventListener('astro:page-load', drawAll);
drawAll();
window.addEventListener('themechange', drawAll);
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', drawAll);
window.addEventListener('resize', () => { clearTimeout(t); t = window.setTimeout(drawAll, 160); });
