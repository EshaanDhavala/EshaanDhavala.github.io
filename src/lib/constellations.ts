// Each project's constellation: its stars come from that project's own data (build time).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const pub = (p: string) => join(process.cwd(), 'public', p);
const json = (p: string) => JSON.parse(readFileSync(pub(p), 'utf8'));

const weeks: { mood_1_10: number | null }[] = json('data/journal_snapshot.json').weeks;
const fg: number[] = json('data/fg_grid.json').grid['average|0'];
const qb = readFileSync(pub('data/qb_clutch_ratings.csv'), 'utf8').trim().split('\n').slice(1).map((l) => Number(l.split(',')[3]));
const returns: { Bounce_x: string; Bounce_y: string }[] = json('data/returns.json');
const adhd: { severe: { p: number } }[] = json('data/adhd-diagnosis/adhd.json').severity.income;
const ladder: { adjr2: number }[] = json('data/house-prices/model.json').ladder;
const ps = json('data/playscan/demo.json').plays[0].steps as number[][];

/** what each constellation is drawn from (also listed in the footer) */
export const series: Record<string, { v: number[] | [number, number][]; from: string }> = {
  'ucla-football-ai-assistant': { v: [7, 17, 32, 60], from: '7 data feeds, 17 tools, 32 eval questions, 60+ metrics' },
  'nfl-overtime-4th-down': { v: fg.filter((_, i) => i % 6 === 0), from: 'field-goal make probability from 18 to 66 yards' },
  'qb-clutch-optimality': { v: [...qb].sort((a, b) => b - a), from: 'clutch ratings of all 15 QBs, best to worst' },
  'usaa-closure-reasons': { v: [72, 28, 66], from: '72% logged as “no longer needed”; capture 28% → 66%' },
  playscan: { v: ps.map((s) => Math.max(...s)), from: 'model confidence over the 16 frames of a demo play' },
  'journal-to-data': { v: weeks.map((w) => w.mood_1_10 ?? 7.5).filter((_, i) => i % 2 === 0), from: 'weekly mood, every other week' },
  'tennis-scouting': { v: returns.slice(0, 9).map((r) => [Number(r.Bounce_x), Number(r.Bounce_y)] as [number, number]), from: 'where 9 real returns bounced' },
  'house-prices': { v: ladder.map((l) => l.adjr2), from: 'adjusted R² of the 3 candidate models' },
  'adhd-diagnosis': { v: adhd.map((a) => a.severe.p), from: 'severe ADHD share by household income' },
  souschef: { v: [1, 1.4, 1.1], from: 'no data: three stars' },
};

export type Star = { x: number; y: number; r: number; sx: number; sy: number };

let seed = 21;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

/** A project's data as stars in a w×h box; sx/sy is where each star starts before the constellation forms. */
export function constellation(slug: string, w: number, h: number, pad: number): Star[] {
  const v = series[slug]?.v ?? [1, 2, 1];
  const scatter = () => ({ sx: (rnd() - 0.5) * w * 1.6, sy: (rnd() - 0.5) * h * 1.6 });
  if (Array.isArray(v[0])) {
    const p = v as [number, number][];
    const xs = p.map((q) => q[0]), ys = p.map((q) => q[1]);
    const nx = (x: number) => pad + ((x - Math.min(...xs)) / (Math.max(...xs) - Math.min(...xs) || 1)) * (w - 2 * pad);
    const ny = (y: number) => pad + ((y - Math.min(...ys)) / (Math.max(...ys) - Math.min(...ys) || 1)) * (h - 2 * pad);
    return p.map((q, i) => ({ x: nx(q[0]), y: ny(q[1]), r: 2 + ((i * 7) % 5) * 0.7, ...scatter() })).sort((a, b) => a.x - b.x);
  }
  let s = v as number[];
  if (s.length > 9) s = Array.from({ length: 9 }, (_, i) => s[Math.round((i / 8) * (s.length - 1))]);
  const lo = Math.min(...s), hi = Math.max(...s);
  return s.map((y, i) => {
    const t = (y - lo) / (hi - lo || 1);
    return { x: pad + (i / Math.max(1, s.length - 1)) * (w - 2 * pad), y: h - pad - t * (h - 2 * pad), r: 1.8 + t * 3.2, ...scatter() };
  });
}

export const linePath = (st: Star[]) => st.map((s, i) => `${i ? 'L' : 'M'}${s.x.toFixed(1)},${s.y.toFixed(1)}`).join(' ');
export const brightest = (st: Star[]) => st.reduce((a, b) => (b.r > a.r ? b : a));
