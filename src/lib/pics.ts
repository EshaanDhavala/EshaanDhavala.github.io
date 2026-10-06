// Inline SVG markup for the data-drawn pictures, so each theme can colour them with CSS (currentColor).
const svgs = import.meta.glob('../assets/thumbs/*.svg', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

export function svgFor(slug: string): string {
  const raw = svgs[`../assets/thumbs/${slug}.svg`];
  if (!raw) throw new Error(`No thumbnail svg for ${slug}`);
  return raw.replace('<svg', '<svg aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet"');
}
