# eshaandhavala.github.io

My portfolio, built like a self-order kiosk: projects are menu items, categories are tabs, and you can add projects to an order and send the list to me.

**Live:** https://eshaandhavala.github.io

## Stack

- [Astro](https://astro.build) static site with view transitions
- [Observable Plot](https://observablehq.com/plot/) for the charts
- Archivo Variable (self-hosted via Fontsource)
- GitHub Actions → GitHub Pages on every push to `main`

## Run

```bash
npm install
npm run dev      # http://localhost:4321
npm run build
```

## Where things live

| Path | What |
|---|---|
| `src/data/entries.ts` | Every project: name, one-liner, "price" stat, bullets, links. Drives the menu and item pages. |
| `src/pages/index.astro` | Menu: category rail, live FG model promo, menu grid, combos, about. |
| `src/pages/entries/[slug].astro` | Item screen template for every project. |
| `src/components/` | `MenuTile`, `FgLive` (field-goal model demo), `Icon`. |
| `src/scripts/order.ts` | Order state (localStorage), order sheet, copy / email. |
| `src/scripts/charts.ts` | Item-page charts. |
| `scripts/make-thumbs.mjs` | Draws the menu pictures in `public/thumbs/` from each project's real data. |
| `public/data/fg_grid.json` | Predictions from the trained FG model (distance × gust × kicker tier). |

## Add a project

1. Add a record to `src/data/entries.ts`.
2. Add a picture: extend `scripts/make-thumbs.mjs` and run `node scripts/make-thumbs.mjs`, or drop an image in `public/thumbs/<slug>.jpg`.
3. `npm run build`.

The PlayScan picture is a duotone frame from the demo video:
`ffmpeg -ss 18 -i example_clip.mp4 -frames:v 1 -vf "crop=iw:ih*0.78:0:ih*0.12,scale=640:400:force_original_aspect_ratio=increase,crop=640:400,format=gray,format=rgb24,eq=contrast=1.15,lutrgb=r='15+val*240/255':g='107+val*148/255':b='62+val*193/255'" public/thumbs/playscan.jpg`
