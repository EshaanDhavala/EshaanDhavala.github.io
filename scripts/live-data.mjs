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
    favorites: ['One Piece', 'Hunter x Hunter (2011)', 'Jujutsu Kaisen', 'Shingeki no Kyojin: The Final Season - Kanketsu-hen', 'Kaijuu 8-gou']
      .map((t) => rows.find((x) => x.anime_title === t)).filter(Boolean)
      .map((x) => ({ title: title(x).replace(/: (The )?Final Season.*/, ''), score: x.score, eps: x.num_watched_episodes, cover: x.anime_image_path.replace(/\/r\/\d+x\d+/, '').split('?')[0], url: `https://myanimelist.net/anime/${x.anime_id}` })),
    topGenre: Object.entries(genres).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null,
    lastUpdated: last ? { title: title(last), ep: last.num_watched_episodes, at: new Date(last.updated_at * 1000).toISOString() } : null,
  });
}

/* ---------- Xbox via OpenXBL (needs the OPENXBL_KEY secret) ---------- */
async function xbox() {
  const key = process.env.OPENXBL_KEY;
  if (!key) { console.log('xbox: no OPENXBL_KEY, skipped'); return false; }
  const get = (p) => fetch(`https://xbl.io/api/v2/${p}`, { headers: { 'X-Authorization': key, Accept: 'application/json' } })
    .then((r) => { if (!r.ok) throw new Error(`OpenXBL ${p} ${r.status}`); return r.json(); }).then((j) => j?.content ?? j);
  const me = (await get('player/summary')).people?.[0];
  if (process.env.DEBUG_SHAPE && me) {
    const shape = (o, d = 0) => d > 4 || o === null || typeof o !== 'object' ? typeof o : Array.isArray(o) ? [o.length ? shape(o[0], d + 1) : 'empty', o.length] : Object.fromEntries(Object.keys(o).slice(0, 30).map((k) => [k, shape(o[k], d + 1)]));
    for (const ep of ['achievements', 'player/titleHistory', `achievements/player/${me.xuid}`, `player/titleHistory/${me.xuid}`]) {
      const r = await fetch(`https://xbl.io/api/v2/${ep}`, { headers: { 'X-Authorization': key, Accept: 'application/json' } });
      const txt = await r.text(); let j = null; try { j = JSON.parse(txt); } catch {}
      if (typeof j?.content === 'string') { try { j = JSON.parse(j.content); } catch { j = { contentText: j.content.slice(0, 120) }; } }
      if (Array.isArray(j) && typeof j[0] === 'string') j = { text: j[0].slice(0, 200).replace(/\d{10,}/g, '<n>') };
      if (j?.text) { console.log(ep.replace(/\d{10,}/, '<xuid>'), '->', r.status, JSON.stringify(j.text)); continue; }
      console.log(ep.replace(/\d{10,}/, '<xuid>'), '->', r.status, j ? JSON.stringify(shape(j?.content ?? j)) : txt.slice(0, 160).replace(/\d{10,}/g, '<n>'));
    }
  }
  if (!me) throw new Error('OpenXBL: no profile');
  const th = me.titleHistory ?? {};
  await save('xbox', {
    gamertag: me.gamertag ?? null,
    gamerscore: me.gamerScore ? Number(me.gamerScore) : null,
    online: me.presenceState === 'Online',
    status: me.presenceText || null,
    lastGame: th.TitleName ?? null,
    lastPlayed: th.LastTimePlayed ?? null,
  });
}

/* ---------- Vikings standing (ESPN's team endpoint has no CORS) ---------- */
async function vikings() {
  const t = await fetch('https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/16').then((r) => r.json());
  await save('vikings', { standing: (t.team?.standingSummary ?? '').replace('National Football Conference', 'the NFC') || null });
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
for (const [name, fn] of [['anime', anime], ['xbox', xbox], ['vikings', vikings], ['music', music]]) {
  try { if ((await fn()) !== false) { available.push(name); console.log(`${name}: ok`); } } catch (e) { failed++; console.error(`${name}: ${e.message}`); }
}
// the site reads this first, so it only requests feeds that exist
await writeFile(`${OUT}/feeds.json`, JSON.stringify({ updated: now, available }));
process.exitCode = failed === 4 ? 1 : 0;
