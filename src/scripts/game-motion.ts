// Motion for the sports-game theme: smooth scroll, parallax, reveal-on-scroll, card tilt, count-ups, category filter.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(pointer: fine)').matches;

/* ---------- category filter (works with or without motion) ---------- */
function setupFilter() {
  const tabs = [...document.querySelectorAll<HTMLButtonElement>('[data-filter]')];
  const cards = [...document.querySelectorAll<HTMLElement>('[data-card]')];
  const count = document.querySelector<HTMLElement>('[data-count-label]');
  if (!tabs.length) return;
  let current = 'all';
  const apply = (f: string, push = true) => {
    current = f;
    tabs.forEach((t) => t.setAttribute('aria-pressed', String(t.dataset.filter === f)));
    let n = 0;
    cards.forEach((c) => { const show = f === 'all' || c.dataset.cats!.split(' ').includes(f); c.hidden = !show; if (show) n++; });
    if (count) count.textContent = `${n} ${n === 1 ? 'project' : 'projects'}`;
    document.querySelectorAll<HTMLElement>('[data-list]').forEach((list) => {
      const any = [...list.querySelectorAll<HTMLElement>('[data-card]')].some((c) => !c.hidden);
      list.hidden = !any;
      const head = list.previousElementSibling as HTMLElement | null;
      if (head?.matches('[data-group]')) head.hidden = !any;
    });
    if (push) { const u = new URL(location.href); f === 'all' ? u.searchParams.delete('cat') : u.searchParams.set('cat', f); history.replaceState(null, '', u); }
    if (!reduce) gsap.fromTo(cards.filter((c) => !c.hidden), { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'expo.out', stagger: 0.04, overwrite: true });
    ScrollTrigger.refresh();
  };
  tabs.forEach((t) => t.addEventListener('click', () => apply(t.dataset.filter!)));
  document.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey || (e.target as HTMLElement).closest('input, textarea, select')) return;
    const k = e.key.toLowerCase();
    if (k !== 'q' && k !== 'e') return;
    const i = tabs.findIndex((t) => t.dataset.filter === current);
    apply(tabs[(i + (k === 'e' ? 1 : tabs.length - 1)) % tabs.length].dataset.filter!);
  });
  const start = new URL(location.href).searchParams.get('cat');
  if (start && tabs.some((t) => t.dataset.filter === start)) apply(start, false);
}

/* ---------- count-ups ---------- */
function countUp(el: HTMLElement) {
  const m = (el.dataset.countTo || el.textContent || '').match(/^([^\d]*)([\d,.]+)(.*)$/);
  if (!m || m[3].includes('→')) return;
  const target = parseFloat(m[2].replace(/,/g, '')), dec = (m[2].split('.')[1] || '').length, comma = m[2].includes(',');
  const o = { v: 0 };
  gsap.to(o, {
    v: target, duration: 1.3, ease: 'expo.out',
    scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    onUpdate: () => { const v = o.v.toFixed(dec); el.textContent = m[1] + (comma ? Number(v).toLocaleString('en-US') : v) + m[3]; },
  });
}

function motion() {

  // parallax: data-parallax="0.3" moves at 30% extra speed through its section
  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    const s = parseFloat(el.dataset.parallax!);
    const root = el.closest<HTMLElement>('[data-parallax-root]') ?? el;
    gsap.to(el, { yPercent: -100 * s, ease: 'none', scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true } });
  });
  // field lines scroll toward the viewer
  document.querySelectorAll<HTMLElement>('[data-field]').forEach((el) => {
    gsap.to(el, { '--field-y': '420px', ease: 'none', scrollTrigger: { trigger: el.closest('[data-parallax-root]') ?? el, start: 'top top', end: 'bottom top', scrub: true } });
  });

  // reveal: only hide what starts below the fold, so nothing above it ever flashes
  const below = [...document.querySelectorAll<HTMLElement>('[data-reveal]')].filter((el) => el.getBoundingClientRect().top > innerHeight * 0.9);
  if (below.length) gsap.set(below, { opacity: 0, y: 34 });
  if (below.length) ScrollTrigger.batch(below, {
    start: 'top 90%', once: true, interval: 0.08, batchMax: 6,
    onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out', stagger: 0.07, overwrite: true }),
  });

  // hero entrance
  const heroIn = document.querySelectorAll('[data-hero-in]');
  if (heroIn.length) gsap.from(heroIn, { y: 40, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08, delay: 0.05 });

  document.querySelectorAll<HTMLElement>('[data-countup]').forEach(countUp);

  // card tilt + shine follow the pointer (quickTo reuses one tween per property)
  if (fine) {
    document.querySelectorAll<HTMLElement>('[data-card]').forEach((c) => {
      gsap.set(c, { transformPerspective: 900 });
      const rx = gsap.quickTo(c, 'rotationX', { duration: 0.45, ease: 'power3' });
      const ry = gsap.quickTo(c, 'rotationY', { duration: 0.45, ease: 'power3' });
      const lift = gsap.quickTo(c, 'z', { duration: 0.45, ease: 'power3' });
      c.addEventListener('pointermove', (e) => {
        const r = c.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        rx(-y * 6); ry(x * 8); lift(18);
        c.style.setProperty('--sx', `${(x + 0.5) * 100}%`);
      });
      c.addEventListener('pointerleave', () => { rx(0); ry(0); lift(0); c.style.setProperty('--sx', '-40%'); });
    });
  }
}

function setupTicker() {
  const b = document.querySelector<HTMLButtonElement>('[data-tick-toggle]');
  b?.addEventListener('click', () => {
    const paused = b.getAttribute('aria-pressed') !== 'true';
    b.setAttribute('aria-pressed', String(paused));
    b.setAttribute('aria-label', paused ? 'Play highlights' : 'Pause highlights');
  });
}

setupFilter();
setupTicker();
if (!reduce) motion();
window.addEventListener('load', () => ScrollTrigger.refresh());
