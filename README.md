# eshaandhavala.github.io

My personal site, built as a field notebook: every project is a numbered entry with
the question, what I built, and what happened.

**Live:** https://eshaandhavala.github.io

## Stack

- [Astro](https://astro.build) (static output, no client framework)
- [Observable Plot](https://observablehq.com/plot/) for the interactive charts
- Self-hosted fonts via Fontsource: Fraunces, Source Serif 4, IBM Plex Mono, Kalam
- Deployed by GitHub Actions to GitHub Pages on every push to `main`

## Run locally

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to dist/
```

## Where things live

| Path | What |
|---|---|
| `src/data/entries.ts` | One record per project: title, blurb, hook number, tags. Drives the table of contents. |
| `src/pages/entries/*.astro` | One page per project. |
| `src/pages/index.astro` | Cover, contents, experience, clippings, off the clock. |
| `src/components/` | `Note` (margin notes), `Plate` (taped-in figures), `Specimen` (fact card). |
| `src/styles/global.css` | Design tokens (paper, ink, pen, highlighter) for light and dark. |
| `public/data/` | Chart data. `journal_snapshot.json` is exported by `scripts/export_snapshot.py` in the [JournalToData repo](https://github.com/EshaanDhavala/Journal-to-Data-Base) and holds weekly aggregates only. |

## Adding a project

1. Add a record to `src/data/entries.ts`.
2. Create `src/pages/entries/<slug>.astro` using the `Entry` layout (copy an existing one).
3. Put images in `public/img/` and reference them as `/img/<file>`.
