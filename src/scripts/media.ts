// Plays muted demo videos only while on screen, and never under reduced motion.
function setup() {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const vids = document.querySelectorAll<HTMLVideoElement>('video[data-autoplay]');
  if (reduce || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    const v = e.target as HTMLVideoElement;
    if (e.isIntersecting) { v.preload = 'auto'; v.play().catch(() => {}); } else v.pause();
  }), { threshold: 0.35 });
  vids.forEach((v) => { if (v.dataset.observed) return; v.dataset.observed = '1'; io.observe(v); });
}
document.addEventListener('astro:page-load', setup);
setup();
