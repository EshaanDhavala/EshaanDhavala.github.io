// Fetches the "Right now" feeds that browsers can't read directly (no CORS, or need a secret key)
// and writes small public summaries to live/*.json. A GitHub Action runs this on a schedule and
// pushes the folder to the `live-data` branch; the site reads it from raw.githubusercontent.com.
// Only aggregates are written: no keys, no tokens, nothing private.
import { mkdir, writeFile } from 'node:fs/promises';

const OUT = 'live';
await mkdir(OUT, { recursive: true });
const now = new Date().toISOString();
const save = (name, data) => writeFile(`${OUT}/${name}.json`, JSON.stringify({ updated: now, ...data }, null, 2));

/* ---------- MyAnimeList: dhaesh04 ---------- */
async function anime() {
  const user = 'dhaesh04', rows = [];
  for (let offset = 0; ; offset += 300) {
    const r = await fetch(`https://myanimelist.net/animelist/${user}/load.json?status=7&offset=${offset}`, { headers: { 'User-Agent': 'eshaandhavala.github.io live stats' } });
    if (!r.ok) throw new Error(`MAL ${r.status}`);
    const page = await r.json();
    rows.push(...page);
    if (page.length < 300) break;
  }
  const by = (s) => rows.filter((x) => x.status === s); // 1 watching, 2 completed, 3 on hold, 4 dropped, 6 plan to watch
  const title = (x) => x.anime_title_eng || x.anime_title;
  const genres = {};
  for (const x of by(2)) for (const g of x.genres ?? []) genres[g.name] = (genres[g.name] ?? 0) + 1;
  const last = [...rows].sort((a, b) => b.updated_at - a.updated_at)[0];
  await save('anime', {
    profile: `https://myanimelist.net/animelist/${user}`,
    entries: rows.length,
    completed: by(2).length,
    episodes: rows.reduce((s, x) => s + (x.num_watched_episodes || 0), 0),
    planToWatch: by(6).length,
    watching: by(1).map((x) => ({ title: title(x), ep: x.num_watched_episodes, of: x.anime_num_episodes || null })),
    tens: rows.filter((x) => x.score === 10).map(title),
    topGenre: Object.entries(genres).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null,
    lastUpdated: last ? { title: title(last), ep: last.num_watched_episodes, at: new Date(last.updated_at * 1000).toISOString() } : null,
  });
}

/* ---------- Xbox via OpenXBL (needs the OPENXBL_KEY secret) ---------- */
async function xbox() {
  const key = process.env.OPENXBL_KEY;
  if (!key) { console.log('xbox: no OPENXBL_KEY, skipped'); return false; }
  const get = (p) => fetch(`https://xbl.io/api/v2/${p}`, { headers: { 'X-Authorization': key, Accept: 'application/json' } }).then((r) => { if (!r.ok) throw new Error(`OpenXBL ${p} ${r.status}`); return r.json(); });
  const acct = await get('account');
  if (process.env.DEBUG_SHAPE) { const shape = (o, d = 0) => d > 3 || o === null || typeof o !== 'object' ? typeof o : Array.isArray(o) ? [o.length ? shape(o[0], d + 1) : 'empty'] : Object.fromEntries(Object.keys(o).slice(0, 25).map((k) => [k, shape(o[k], d + 1)])); console.log('account shape', JSON.stringify(shape(acct))); }
  const settings = Object.fromEntries((acct.profileUsers?.[0]?.settings ?? []).map((s) => [s.id, s.value]));
  const hist = await get('achievements').catch(() => null);
  const titles = (hist?.titles ?? []).filter((t) => t.achievement?.currentGamerscore > 0 || t.titleHistory?.lastTimePlayed);
  titles.sort((a, b) => new Date(b.titleHistory?.lastTimePlayed ?? 0) - new Date(a.titleHistory?.lastTimePlayed ?? 0));
  await save('xbox', {
    gamertag: settings.Gamertag ?? null,
    gamerscore: settings.Gamerscore ? Number(settings.Gamerscore) : null,
    recent: titles.slice(0, 3).map((t) => ({ name: t.name, lastPlayed: t.titleHistory?.lastTimePlayed ?? null, progress: t.achievement?.progressPercentage ?? null })),
  });
}

/* ---------- Last.fm (needs LASTFM_USER + LASTFM_KEY secrets) ---------- */
async function music() {
  const user = process.env.LASTFM_USER, key = process.env.LASTFM_KEY;
  if (!user || !key) { console.log('music: no Last.fm secrets, skipped'); return false; }
  const get = (m, extra = '') => fetch(`https://ws.audioscrobbler.com/2.0/?method=${m}&user=${encodeURIComponent(user)}&api_key=${key}&format=json${extra}`).then((r) => r.json());
  const [info, recent, artists] = await Promise.all([get('user.getinfo'), get('user.getrecenttracks', '&limit=1'), get('user.gettopartists', '&period=1month&limit=5')]);
  const t = recent.recenttracks?.track?.[0];
  await save('music', {
    scrobbles: Number(info.user?.playcount ?? 0),
    latest: t ? { track: t.name, artist: t.artist?.['#text'], nowPlaying: t['@attr']?.nowplaying === 'true', at: t.date?.uts ? new Date(Number(t.date.uts) * 1000).toISOString() : now } : null,
    topArtistsMonth: (artists.topartists?.artist ?? []).map((a) => a.name),
  });
}

let failed = 0;
const available = [];
for (const [name, fn] of [['anime', anime], ['xbox', xbox], ['music', music]]) {
  try { if ((await fn()) !== false) { available.push(name); console.log(`${name}: ok`); } } catch (e) { failed++; console.error(`${name}: ${e.message}`); }
}
// the site reads this first, so it only requests feeds that exist
await writeFile(`${OUT}/feeds.json`, JSON.stringify({ updated: now, available }));
process.exitCode = failed === 3 ? 1 : 0;
