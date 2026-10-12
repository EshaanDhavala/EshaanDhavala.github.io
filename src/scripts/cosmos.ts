// The sky behind every page, plus the shared interactions of the space theme.
// One fixed canvas: three depths of twinkling stars, nebulas anchored to [data-nebula] sections that drift
// slower than the page, shooting stars (more when you scroll fast), supernovas, a warp-speed intro once per
// visit, cursor stardust and a comet that shows scroll position. Native scrolling, eased lightly by Lenis.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);
export { gsap, ScrollTrigger };

export const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(pointer: fine)').matches;
export const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
export const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => [...r.querySelectorAll<T>(s)];
let s = 5;
const R = () => ((s = (s * 16807) % 2147483647) / 2147483647);
const store = {
  get: (k: string) => { try { return sessionStorage.getItem(k); } catch { return null; } },
  set: (k: string) => { try { sessionStorage.setItem(k, '1'); } catch { /* storage blocked: effects just repeat */ } },
};

/* ================= smooth scroll ================= */
export let velocity = 0;
let lenis: Lenis | null = null;
if (!reduce) {
  lenis = new Lenis({ lerp: 0.22, smoothWheel: true });
  lenis.on('scroll', (e: Lenis) => { velocity = e.velocity ?? 0; ScrollTrigger.update(); });
  gsap.ticker.add((t) => lenis!.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
} else {
  let last = scrollY;
  addEventListener('scroll', () => { velocity = scrollY - last; last = scrollY; }, { passive: true });
}
export function scrollToTarget(target: string | number) {
  if (lenis) lenis.scrollTo(target as any, { offset: typeof target === 'number' ? 0 : -90 });
  else if (typeof target === 'number') scrollTo({ top: target });
  else document.querySelector(target)?.scrollIntoView();
}
// in-page links glide (including /#id links while on the home page)
document.addEventListener('click', (e) => {
  const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href*="#"]');
  if (!a || a.target) return;
  const url = new URL(a.href, location.href);
  if (url.pathname !== location.pathname || !url.hash) return;
  const el = url.hash === '#top' ? null : document.querySelector(url.hash);
  if (url.hash !== '#top' && !el) return;
  e.preventDefault();
  scrollToTarget(url.hash === '#top' ? 0 : url.hash);
  history.replaceState(null, '', url.hash);
});

/* ================= the sky ================= */
const cv = $<HTMLCanvasElement>('[data-cosmos]')!;
const c = cv.getContext('2d')!;
let W = 0, H = 0;
type Dot = { x: number; y: number; r: number; a: number; tw: number; ph: number; col: string };
let layers: { depth: number; dots: Dot[] }[] = [];
const tints = ['#ffffff', '#ffffff', '#ffffff', '#d8e4ff', '#ffe9cf'];
function seedStars() {
  const area = (W * H) / 1e6;
  layers = [0.06, 0.16, 0.34].map((depth, k) => ({
    depth,
    dots: Array.from({ length: Math.round([380, 160, 50][k] * Math.max(0.5, area)) }, () => ({
      x: R() * W, y: R() * H, r: [0.5, 0.8, 1.25][k] * (0.6 + R() * 0.8), a: [0.45, 0.65, 0.9][k] * (0.5 + R() * 0.5),
      tw: 0.6 + R() * 2.2, ph: R() * 6.28, col: tints[Math.floor(R() * tints.length)],
    })),
  }));
}

const NEB: Record<string, string[]> = {
  violet: ['#5b3cff', '#20c5c1', '#a23cff'],
  magenta: ['#d0369a', '#6b3cff', '#ff7a59'],
  teal: ['#1fb5c9', '#3c64ff'],
  aurora: ['#7b3cff', '#22c7a9'],
  amber: ['#ff8a3c', '#c23cff', '#3c7bff'],
};
function nebulaSprite(size: number, cols: string[], n: number) {
  const o = document.createElement('canvas'); o.width = o.height = size;
  const g = o.getContext('2d')!;
  g.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) {
    const x = size * (0.25 + R() * 0.5), y = size * (0.25 + R() * 0.5), r = size * (0.08 + R() * 0.28);
    const col = cols[i % cols.length];
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, col + '26'); gr.addColorStop(0.5, col + '0c'); gr.addColorStop(1, col + '00');
    g.fillStyle = gr; g.fillRect(0, 0, size, size);
  }
  return o;
}
// <section data-nebula="violet" data-nebula-x="0.8" data-nebula-y="0.3">
const nebulas = $$('[data-nebula]').map((el) => ({
  el, fx: Number(el.dataset.nebulaX ?? 0.75), fy: Number(el.dataset.nebulaY ?? 0.4),
  img: nebulaSprite(900, NEB[el.dataset.nebula!] ?? NEB.violet, 22), scale: Number(el.dataset.nebulaScale ?? 1.1),
}));

type Shoot = { x: number; y: number; vx: number; vy: number; life: number; max: number };
const shoots: Shoot[] = [];
function spawnShoot(fast = false) {
  const ang = (Math.PI / 180) * (20 + R() * 25) * (R() < 0.5 ? 1 : -1) + (R() < 0.5 ? 0 : Math.PI);
  const sp = (fast ? 1500 : 1000) + R() * 700;
  shoots.push({ x: R() * W, y: R() * H * 0.6, vx: Math.cos(ang) * sp, vy: Math.abs(Math.sin(ang)) * sp, life: 0, max: 0.6 + R() * 0.5 });
}
export function meteorShower() { if (reduce) return; for (let i = 0; i < 22; i++) setTimeout(() => spawnShoot(true), i * 110 + R() * 120); }

type Nova = { x: number; y: number; t: number; col: string; parts: { a: number; v: number; r: number }[]; big: boolean };
const novas: Nova[] = [];
const novaCols = ['#ffb35c', '#ff5ca8', '#5cd8ff', '#b07bff', '#7dffcf'];
/** supernova at page coordinates (it scrolls with the page) */
export function supernova(pageX: number, pageY: number, big = false) {
  if (reduce) return;
  const col = novaCols[Math.floor(R() * novaCols.length)];
  novas.push({ x: pageX, y: pageY, t: 0, col, big, parts: Array.from({ length: big ? 70 : 38 }, () => ({ a: R() * 6.283, v: (big ? 160 : 90) + R() * (big ? 260 : 150), r: 0.6 + R() * 1.6 })) });
}
/** supernova at an element's on-screen point, given as fractions of its box */
export function supernovaAt(el: Element, fx = 0.5, fy = 0.5, big = false) {
  const r = el.getBoundingClientRect();
  supernova(r.left + fx * r.width, scrollY + r.top + fy * r.height, big);
}

// warp-speed intro: every fresh load of the home page, starting from the top
let warp = 0;
if (!reduce && document.querySelector('[data-hero]') && scrollY < 40) warp = 1;
export const runWarp = () => { if (!reduce) warp = 1; };

// cursor stardust
type Dust = { x: number; y: number; vx: number; vy: number; life: number; r: number };
const dust: Dust[] = [];
let lastDust = 0;
if (fine && !reduce) addEventListener('pointermove', (e) => {
  const now = performance.now(); if (now - lastDust < 22) return; lastDust = now;
  dust.push({ x: e.clientX, y: e.clientY, vx: (R() - 0.5) * 30, vy: (R() - 0.5) * 30 + 12, life: 0, r: 0.6 + R() * 1.2 });
  if (dust.length > 60) dust.shift();
});

function size() {
  const dpr = Math.min(2, devicePixelRatio || 1);
  W = innerWidth; H = innerHeight;
  cv.width = W * dpr; cv.height = H * dpr; c.setTransform(dpr, 0, 0, dpr, 0, 0);
  seedStars();
}
size();
addEventListener('resize', size);

let nextShoot = 2, last = performance.now();
function frame() {
  const now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now;
  const t = now / 1000, sy = scrollY;
  c.clearRect(0, 0, W, H);

  // nebulas drift at half the page's speed
  c.globalCompositeOperation = 'screen';
  for (const n of nebulas) {
    const r = n.el.getBoundingClientRect();
    const anchor = r.top + r.height * n.fy;
    const y = H / 2 + (anchor - H / 2) * (reduce ? 1 : 0.5);
    const sz = Math.max(W, 900) * 0.75 * n.scale;
    if (y < -sz || y > H + sz) continue;
    c.globalAlpha = 0.5;
    c.drawImage(n.img, W * n.fx - sz / 2, y - sz / 2, sz, sz);
  }
  c.globalAlpha = 1;
  c.globalCompositeOperation = 'source-over';

  // stars: three depths, twinkling; streaking during the warp intro
  if (warp > 0) warp = Math.max(0, warp - dt / 2.4);
  const wk = warp * warp, cx0 = W / 2, cy0 = H / 2;
  if (wk > 0.01) {
    // gentle streaks, one path per depth so the intro stays smooth
    c.lineCap = 'round'; c.strokeStyle = '#ffffff';
    for (const { depth, dots } of layers) {
      const off = reduce ? 0 : sy * depth, k = 1 - 0.24 * wk * (0.5 + depth * 1.6);
      c.globalAlpha = (0.32 + depth * 1.1) * (0.55 + 0.45 * wk); c.lineWidth = 0.6 + depth * 1.9;
      c.beginPath();
      for (const d of dots) {
        const y = (((d.y - off) % H) + H) % H;
        c.moveTo(cx0 + (d.x - cx0) * k, cy0 + (y - cy0) * k); c.lineTo(d.x, y);
      }
      c.stroke();
    }
    c.globalAlpha = 1;
  }
  for (const { depth, dots } of layers) {
    if (wk > 0.01) break;
    const off = reduce ? 0 : sy * depth;
    for (const d of dots) {
      const y = (((d.y - off) % H) + H) % H;
      const a = reduce ? d.a : d.a * (0.65 + 0.35 * Math.sin(t * d.tw + d.ph));
      {
        c.globalAlpha = a; c.fillStyle = d.col;
        c.beginPath(); c.arc(d.x, y, d.r, 0, 6.283); c.fill();
      }
    }
  }
  c.globalAlpha = 1;
  if (reduce) return;

  // cursor stardust
  for (let i = dust.length - 1; i >= 0; i--) {
    const p = dust[i]; p.life += dt; if (p.life > 1.1) { dust.splice(i, 1); continue; }
    p.x += p.vx * dt; p.y += p.vy * dt;
    c.globalAlpha = (1 - p.life / 1.1) * 0.8; c.fillStyle = '#ffffff';
    c.beginPath(); c.arc(p.x, p.y, p.r * (1 - p.life / 1.4), 0, 6.283); c.fill();
  }
  c.globalAlpha = 1;

  // comet on the right edge = how far down the page you are; tail grows with scroll speed
  const maxS = Math.max(1, document.documentElement.scrollHeight - H), prog = Math.min(1, sy / maxS);
  const cxm = W - 12, cym = 80 + prog * (H - 160), tail = Math.min(140, 18 + Math.abs(velocity) * 3) * (velocity < 0 ? 1 : -1);
  const cg = c.createLinearGradient(cxm, cym, cxm, cym + tail);
  cg.addColorStop(0, 'rgba(255,255,255,0.9)'); cg.addColorStop(1, 'rgba(255,255,255,0)');
  c.strokeStyle = cg; c.lineWidth = 2; c.lineCap = 'round';
  c.beginPath(); c.moveTo(cxm, cym); c.lineTo(cxm, cym + tail); c.stroke();
  c.shadowColor = '#fff'; c.shadowBlur = 10; c.fillStyle = '#fff';
  c.beginPath(); c.arc(cxm, cym, 2.4, 0, 6.283); c.fill(); c.shadowBlur = 0;

  // shooting stars: now and then, more when you scroll fast
  nextShoot -= dt;
  if (nextShoot <= 0) { spawnShoot(); nextShoot = 3 + R() * 5; }
  if (Math.abs(velocity) > 28 && R() < 0.12 && shoots.length < 5) spawnShoot(true);
  for (let i = shoots.length - 1; i >= 0; i--) {
    const sh = shoots[i]; sh.life += dt; sh.x += sh.vx * dt; sh.y += sh.vy * dt;
    const k = sh.life / sh.max; if (k >= 1) { shoots.splice(i, 1); continue; }
    const fade = Math.sin(Math.PI * k), len = 0.11;
    const g = c.createLinearGradient(sh.x, sh.y, sh.x - sh.vx * len, sh.y - sh.vy * len);
    g.addColorStop(0, `rgba(255,255,255,${0.95 * fade})`); g.addColorStop(1, 'rgba(255,255,255,0)');
    c.strokeStyle = g; c.lineWidth = 1.6; c.lineCap = 'round';
    c.beginPath(); c.moveTo(sh.x, sh.y); c.lineTo(sh.x - sh.vx * len, sh.y - sh.vy * len); c.stroke();
    c.fillStyle = `rgba(255,255,255,${fade})`; c.beginPath(); c.arc(sh.x, sh.y, 1.4, 0, 6.283); c.fill();
  }

  // supernovas: flash, shock ring, debris
  c.globalCompositeOperation = 'lighter';
  for (let i = novas.length - 1; i >= 0; i--) {
    const n = novas[i]; n.t += dt;
    const dur = n.big ? 3 : 2.1, k = n.t / dur;
    if (k >= 1) { novas.splice(i, 1); continue; }
    const x = n.x, y = n.y - sy, sc = n.big ? 1.6 : 1;
    const flash = Math.max(0, 1 - k * 3.2);
    const core = c.createRadialGradient(x, y, 0, x, y, 70 * sc * (0.4 + k));
    core.addColorStop(0, `rgba(255,255,255,${flash})`); core.addColorStop(0.25, n.col + Math.round(flash * 200).toString(16).padStart(2, '0')); core.addColorStop(1, n.col + '00');
    c.fillStyle = core; c.beginPath(); c.arc(x, y, 70 * sc * (0.4 + k), 0, 6.283); c.fill();
    const ringR = 12 + (1 - Math.pow(1 - k, 3)) * 190 * sc, ringA = (1 - k) * 0.85;
    c.strokeStyle = n.col; c.globalAlpha = ringA; c.lineWidth = 2.2 * (1 - k) + 0.4;
    c.beginPath(); c.arc(x, y, ringR, 0, 6.283); c.stroke();
    c.globalAlpha = ringA * 0.5; c.lineWidth = 8 * (1 - k);
    c.beginPath(); c.arc(x, y, ringR * 0.92, 0, 6.283); c.stroke();
    for (const p of n.parts) {
      const d = p.v * (1 - Math.pow(1 - k, 2)) * sc;
      c.globalAlpha = 1 - k; c.fillStyle = k < 0.3 ? '#ffffff' : n.col;
      c.beginPath(); c.arc(x + Math.cos(p.a) * d, y + Math.sin(p.a) * d, p.r, 0, 6.283); c.fill();
    }
    c.globalAlpha = 1;
  }
  c.globalCompositeOperation = 'source-over';
}
gsap.ticker.add(frame);

/* ================= constellations: assemble, then go supernova once per visit ================= */
// <svg data-assemble data-nova-id="..." data-nova-x data-nova-y data-mode="scroll|load" data-big>
export function initConstellations(root: ParentNode = document) {
  $$<SVGSVGElement>('svg[data-assemble]', root).forEach((svg) => {
    const id = svg.dataset.novaId!, big = svg.hasAttribute('data-big'), mode = svg.dataset.mode ?? 'scroll';
    const stars = $$<SVGCircleElement>('.cstar', svg), line = svg.querySelector<SVGPathElement>('.con-line')!;
    const finish = () => { svg.classList.add('lit'); gsap.set(stars, { x: 0, y: 0, opacity: 1, scale: 1 }); gsap.set(line, { strokeDashoffset: 0 }); };
    if (reduce || store.get(`nova:${id}`)) { finish(); return; }
    const vb = svg.viewBox.baseVal;
    const boom = () => supernovaAt(svg, Number(svg.dataset.novaX) / vb.width, Number(svg.dataset.novaY) / vb.height, big);
    // stars fly in and line up; the line then draws from the left-most star to the right-most and is
    // the last tween on the timeline, so it reaches the end exactly when the scroll does
    const tl = gsap.timeline({ paused: true });
    tl.fromTo(stars, { x: (i) => Number(stars[i].dataset.sx), y: (i) => Number(stars[i].dataset.sy), opacity: 0.15, scale: 0.5, transformOrigin: 'center' },
      { x: 0, y: 0, opacity: 1, scale: 1, ease: 'power2.inOut', duration: 1, stagger: 0.03 })
      .fromTo(line, { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: 'none', duration: 1.2 }, 0.55);
    let done = false;
    const lock = () => { if (done) return; done = true; store.set(`nova:${id}`); st?.kill(); tl.progress(1).kill(); finish(); boom(); };
    let st: ScrollTrigger | null = null;
    if (mode === 'load') {
      tl.eventCallback('onComplete', lock); tl.duration(2.2); gsap.delayedCall(0.5, () => tl.play());
    } else {
      const trigger = svg.closest('[data-assemble-trigger]') ?? svg;
      st = ScrollTrigger.create({
        trigger, start: 'top 85%', end: svg.dataset.end ?? 'top 22%', scrub: true, animation: tl,
        onUpdate: (self) => { if (self.progress >= 0.995) lock(); }, onLeave: lock,
      });
    }
    svg.addEventListener('click', (e) => supernova(e.clientX, scrollY + e.clientY));
  });
}

/* ================= count-ups, tilt, reveals ================= */
export function initCountUps(root: ParentNode = document) {
  $$('[data-count]', root).forEach((el) => {
    const raw = el.dataset.count!, m = raw.match(/^(\d+(?:\.\d+)?)(.*)$/);
    if (!m || reduce || raw.includes('→')) return;
    const end = parseFloat(m[1]), dec = (m[1].split('.')[1] || '').length, rest = m[2], o = { v: 0 };
    el.textContent = (0).toFixed(dec) + rest;
    ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => gsap.to(o, { v: end, duration: 1.4, ease: 'expo.out', onUpdate: () => (el.textContent = o.v.toFixed(dec) + rest) }) });
  });
}
export function initTilt(root: ParentNode = document) {
  if (!fine || reduce) return;
  $$('[data-tilt]', root).forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty('--mx', `${(x + 0.5) * 100}%`); el.style.setProperty('--my', `${(y + 0.5) * 100}%`);
      gsap.to(el, { rotateY: x * 6, rotateX: -y * 6, transformPerspective: 1100, duration: 0.4, ease: 'power2.out' });
    });
    el.addEventListener('pointerleave', () => gsap.to(el, { rotateY: 0, rotateX: 0, duration: 0.7, ease: 'power3.out' }));
  });
}
export function initRises(root: ParentNode = document) {
  if (reduce) return;
  $$('[data-rise]', root).forEach((el) => gsap.from(el, { y: 36, opacity: 0, filter: 'blur(6px)', duration: 1, ease: 'expo.out', clearProps: 'filter', scrollTrigger: { trigger: el, start: 'top 92%', once: true } }));
}

/* ================= toast ================= */
const toastEl = $('[data-toast]');
let toastT = 0;
export function toast(msg: string) {
  if (!toastEl) return;
  toastEl.textContent = msg; toastEl.classList.add('on'); clearTimeout(toastT);
  toastT = window.setTimeout(() => toastEl.classList.remove('on'), 2200);
}

/* ================= meteor shower: type “meteor”, or the Konami code ================= */
{
  let typed = '', keys: string[] = [];
  const konami = 'ArrowUp,ArrowUp,ArrowDown,ArrowDown,ArrowLeft,ArrowRight,ArrowLeft,ArrowRight,b,a';
  addEventListener('keydown', (e) => {
    if ((e.target as HTMLElement).closest('input, textarea, select')) return;
    keys = [...keys, e.key].slice(-10);
    if (keys.join(',') === konami) meteorShower();
    typed = (typed + (e.key.length === 1 ? e.key.toLowerCase() : '')).slice(-6);
    if (typed === 'meteor') meteorShower();
  });
}

/* ================= ⌘K palette ================= */
{
  const pal = $<HTMLDialogElement>('[data-palette]'), pin = $<HTMLInputElement>('[data-pal-input]'), plist = $('[data-pal-list]');
  const data: { projects: { slug: string; name: string }[] } = JSON.parse($('#pal-data')?.textContent || '{"projects":[]}');
  if (pal && pin && plist) {
    const goTo = (hash: string, href: string) => { pal.close(); if (document.querySelector(hash)) scrollToTarget(hash); else location.href = href; };
    const cmds: { label: string; hint: string; run: () => void }[] = [
      ...data.projects.map((p) => ({ label: p.name, hint: 'Project', run: () => { pal.close(); location.href = `/entries/${p.slug}/`; } })),
      { label: 'Copy my email', hint: 'eshaandhavala@gmail.com', run: () => { pal.close(); navigator.clipboard?.writeText('eshaandhavala@gmail.com').then(() => toast('Email copied')).catch(() => toast('eshaandhavala@gmail.com')); } },
      { label: 'Open my résumé', hint: 'PDF', run: () => { pal.close(); open('/resume.pdf', '_blank'); } },
      { label: 'LinkedIn', hint: 'Link', run: () => { pal.close(); open('https://www.linkedin.com/in/eDhavala', '_blank'); } },
      { label: 'GitHub', hint: 'Link', run: () => { pal.close(); open('https://github.com/EshaanDhavala', '_blank'); } },
      { label: 'All projects', hint: 'Home', run: () => goTo('#projects', '/#projects') },
      { label: 'Explore in 3D', hint: 'Home', run: () => goTo('#orrery', '/#orrery') },
      { label: 'Try the field-goal model', hint: 'Home', run: () => goTo('#fg', '/#fg') },
      { label: 'Tools I built with Claude', hint: 'Page', run: () => { pal.close(); location.href = '/tools/'; } },
      { label: 'About me', hint: 'Home', run: () => goTo('#about', '/#about') },
      { label: 'Meteor shower', hint: 'Just for fun', run: () => { pal.close(); meteorShower(); } },
      { label: 'Warp to the top', hint: 'Just for fun', run: () => { pal.close(); scrollToTarget(0); runWarp(); } },
    ];
    let sel = 0, shown = cmds;
    const render = () => {
      const q = pin.value.trim().toLowerCase();
      shown = cmds.filter((x) => !q || x.label.toLowerCase().includes(q) || x.hint.toLowerCase().includes(q));
      sel = Math.min(sel, Math.max(0, shown.length - 1));
      plist.innerHTML = '';
      shown.forEach((x, i) => {
        const li = document.createElement('li');
        li.setAttribute('role', 'option'); li.setAttribute('aria-selected', String(i === sel));
        const a = document.createElement('span'), b = document.createElement('small');
        a.textContent = x.label; b.textContent = x.hint; li.append(a, b);
        li.addEventListener('click', () => x.run());
        li.addEventListener('pointermove', () => { if (sel !== i) { sel = i; render(); } });
        plist.append(li);
      });
      if (!shown.length) plist.innerHTML = '<li class="empty">Nothing matches. Try a project name.</li>';
    };
    const openPal = () => { pin.value = ''; sel = 0; render(); pal.showModal(); pin.focus(); };
    $$('[data-pal-open]').forEach((b) => b.addEventListener('click', openPal));
    addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); pal.open ? pal.close() : openPal(); }
      else if (e.key === '/' && !pal.open && !(e.target as HTMLElement).closest('input, textarea, select')) { e.preventDefault(); openPal(); }
    });
    pin.addEventListener('input', () => { sel = 0; render(); });
    pin.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); sel = (sel + 1) % Math.max(1, shown.length); render(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); sel = (sel - 1 + shown.length) % Math.max(1, shown.length); render(); }
      else if (e.key === 'Enter') { e.preventDefault(); shown[sel]?.run(); }
    });
    pal.addEventListener('click', (e) => { if (e.target === pal) pal.close(); });
  }
}

addEventListener('load', () => ScrollTrigger.refresh());
