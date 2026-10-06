// Generates the menu pictures in public/thumbs/ from each project's real data.
// One style: white linework on the category plate colour. Run: node scripts/make-thumbs.mjs
import { JSDOM } from 'jsdom';
import * as Plot from '@observablehq/plot';
import fs from 'node:fs';

const { window } = new JSDOM('');
const document = window.document;
const W = 640, H = 400;
// Theme-neutral: no background, linework in currentColor so each theme colours it with CSS.
const INK = 'currentColor';
const SOFT = 'currentColor';
const FAINT = 'currentColor';
const read = (p) => fs.readFileSync(new URL(p, import.meta.url), 'utf8');
const out = (name, svg) => fs.writeFileSync(new URL(`../src/assets/thumbs/${name}.svg`, import.meta.url), svg);

function plot(plate, opts) {
  const el = Plot.plot({
    document, width: W, height: H, marginTop: 40, marginRight: 40, marginBottom: 40, marginLeft: 40,
    style: { background: 'transparent', fontFamily: 'sans-serif', fontSize: '15px' },
    ...opts,
  });
  el.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  el.setAttribute('viewBox', `0 0 ${W} ${H}`);
  el.removeAttribute('width');
  el.removeAttribute('height');
  return el.outerHTML;
}
const frame = (plate, inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">${inner}</svg>`;

// 4th-down OT: FG make probability vs distance, three kicker tiers (model output)
{
  const g = JSON.parse(read('../public/data/fg_grid.json'));
  const rows = ['elite', 'average', 'struggling'].flatMap((k) => g.distances.map((d, i) => ({ k, d, p: g.grid[`${k}|0`][i] })));
  out('nfl-overtime-4th-down', plot('football', {
    x: { axis: null, domain: [18, 66] }, y: { axis: null, domain: [0.4, 1] },
    marks: [
      Plot.ruleY([0.5, 0.75, 1], { stroke: FAINT, strokeOpacity: 0.25 }),
      Plot.lineY(rows, { x: 'd', y: 'p', z: 'k', stroke: INK, strokeOpacity: (r) => (r.k === 'average' ? 1 : 0.45), strokeWidth: (r) => (r.k === 'average' ? 6 : 3), curve: 'monotone-x' }),
    ],
  }));
}

// QB clutch: diverging bars (real ratings)
{
  const [head, ...lines] = read('../public/data/qb_clutch_ratings.csv').trim().split('\n');
  const cols = head.split(',');
  const rows = lines.map((l) => Object.fromEntries(l.split(',').map((v, i) => [cols[i], v]))).map((r) => ({ n: r.passer_player_name, v: +r.clutch_rating }));
  out('qb-clutch-optimality', plot('football', {
    x: { axis: null, domain: [-0.6, 0.6] }, y: { axis: null, domain: rows.sort((a, b) => b.v - a.v).map((r) => r.n), padding: 0.25 },
    marks: [Plot.barX(rows, { x: 'v', y: 'n', fill: INK, fillOpacity: (r) => (r.v >= 0 ? 1 : 0.45) }), Plot.ruleX([0], { stroke: INK, strokeWidth: 2 })],
  }));
}

// Journal: weekly mood + sleep (real snapshot)
{
  const s = JSON.parse(read('../public/data/journal_snapshot.json'));
  const w = s.weeks.filter((x) => x.days_logged >= 5).map((x, i) => ({ i, mood: x.mood_1_10, sleep: x.sleep_hours }));
  out('journal-to-data', plot('ai', {
    x: { axis: null }, y: { axis: null, domain: [4, 10.5] },
    marks: [
      Plot.ruleY([6, 8, 10], { stroke: FAINT, strokeOpacity: 0.25 }),
      Plot.lineY(w, { x: 'i', y: 'sleep', stroke: SOFT, strokeOpacity: 0.45, strokeWidth: 3, curve: 'monotone-x' }),
      Plot.lineY(w, { x: 'i', y: 'mood', stroke: INK, strokeWidth: 6, curve: 'monotone-x' }),
      Plot.dot(w, { x: 'i', y: 'mood', fill: INK, r: 5 }),
    ],
  }));
}

// Tennis: one player's return bounces on a half court (real, anonymized)
{
  const r = JSON.parse(read('../public/data/returns.json')).filter((d) => d.Bounce_Side === 'far').map((d) => ({ x: -+d.Bounce_x, y: 23.77 - +d.Bounce_y, ok: d.Result === 'In' }));
  const Wd = 4.115, NET = 11.885, SVC = 6.4;
  const lines = [[-Wd, 0, -Wd, NET], [Wd, 0, Wd, NET], [-Wd, 0, Wd, 0], [-Wd, NET - SVC, Wd, NET - SVC], [0, NET - SVC, 0, NET]].map(([x1, y1, x2, y2]) => ({ x1, y1, x2, y2 }));
  out('tennis-scouting', plot('tennis', {
    x: { axis: null, domain: [-8.5, 8.5] }, y: { axis: null, domain: [-1, NET + 0.5], reverse: true },
    marks: [
      Plot.link(lines, { x1: 'x1', y1: 'y1', x2: 'x2', y2: 'y2', stroke: SOFT, strokeOpacity: 0.5, strokeWidth: 2.5 }),
      Plot.ruleY([NET], { stroke: INK, strokeWidth: 4 }),
      Plot.dot(r.filter((d) => d.ok && d.y > -1), { x: 'x', y: 'y', fill: INK, r: 9 }),
    ],
  }));
}

// House prices: price vs total sq ft (real training data), log-log
{
  const rows = read('./data/house.csv').trim().split('\n').slice(1).map((l) => l.split(',').map(Number)).filter(([sf, p]) => sf > 0 && p > 0).filter((_, i) => i % 10 === 0).map(([sf, p]) => ({ sf, p }));
  out('house-prices', plot('stats', {
    x: { axis: null, type: 'log' }, y: { axis: null, type: 'log' },
    marks: [Plot.dot(rows, { x: 'sf', y: 'p', fill: INK, fillOpacity: 0.3, r: 3 }), Plot.linearRegressionY(rows, { x: 'sf', y: 'p', stroke: INK, strokeWidth: 5, ci: 0 })],
  }));
}

// ADHD: severity share by income (numbers from the team's chart)
{
  const groups = ['<100%', '100–199%', '200–299%', '≥300%'];
  const vals = { Severe: [23.1, 19.0, 17.9, 12.2], Moderate: [47.1, 50.3, 48.8, 53.0], Mild: [29.8, 30.6, 33.2, 34.8] };
  const rows = Object.entries(vals).flatMap(([k, arr]) => arr.map((v, i) => ({ g: groups[i], k, v })));
  out('adhd-diagnosis', plot('stats', {
    x: { axis: null, domain: groups, padding: 0.28 }, y: { axis: null },
    marks: [Plot.barY(rows, { x: 'g', y: 'v', fill: INK, fillOpacity: (r) => ({ Severe: 1, Moderate: 0.5, Mild: 0.2 })[r.k], z: 'k', order: ['Severe', 'Moderate', 'Mild'] })],
  }));
}

// USAA: capture rate before / after (résumé numbers)
out('usaa-closure-reasons', frame('stats', `
  <rect x="150" y="${360 - 280 * 0.28}" width="130" height="${280 * 0.28}" fill="${SOFT}" fill-opacity="0.45"/>
  <rect x="360" y="${360 - 280 * 0.66}" width="130" height="${280 * 0.66}" fill="${INK}"/>
  <line x1="110" y1="360" x2="530" y2="360" stroke="${INK}" stroke-width="3"/>
  <line x1="110" y1="80" x2="530" y2="80" stroke="${FAINT}" stroke-opacity="0.25" stroke-width="2"/>`));

// PlayScan: duotone frame from the real demo is made with ffmpeg (see README), not here

// SousChef: cookbook pages → knowledge base → agent
out('souschef', frame('ai', `
  <g fill="none" stroke="${INK}" stroke-width="4" stroke-linejoin="round">
    <path d="M70 120h110v160H70z"/><path d="M90 160h70M90 190h70M90 220h50" stroke-opacity="0.5"/>
    <path d="M200 200h60" /><path d="M248 188l14 12-14 12"/>
    <ellipse cx="330" cy="140" rx="55" ry="18"/><path d="M275 140v120c0 10 25 18 55 18s55-8 55-18V140"/><path d="M275 200c0 10 25 18 55 18s55-8 55-18" stroke-opacity="0.5"/>
    <path d="M405 200h60" /><path d="M453 188l14 12-14 12"/>
    <rect x="480" y="150" width="100" height="100" rx="24"/>
  </g>
  <circle cx="515" cy="195" r="7" fill="${INK}"/><circle cx="545" cy="195" r="7" fill="${INK}"/>`));

console.log('thumbs written');
