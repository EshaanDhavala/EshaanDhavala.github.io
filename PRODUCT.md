# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Data science / ML recruiters and hiring managers** skimming between other candidates. They want to know in seconds what each project does, how good the result was, and what tools were used.
- **Sports analytics staff** (NFL / college teams) looking for football and tennis modeling work.
- **ML / AI engineers** checking whether the agent and model work is real.
- Friends, family, and the BSA team, occasionally.

## Product Purpose

Eshaan Dhavala's personal portfolio. It shows every project quickly and lets a visitor open one for the detail. Success: a recruiter can tell what each project does without opening it, and finds the résumé and contact in one tap.

## Positioning

Eshaan is a UCLA Statistics & Data Science student (Dec 2027) who does sports analytics (football, tennis) plus applied ML and AI agents. The site is themed like a sports video game's menus (Madden / 2K / FUT): a title screen, a "select a project" card screen, and a "player profile". It fits a sports analytics person and lets visitors see every project at once.

## Capabilities and Constraints

- Static Astro site on GitHub Pages (https://eshaandhavala.github.io). No server; any "ordering" happens client-side.
- Project data lives in `src/data/entries.ts`; one detail page per project in `src/pages/entries/`.
- Interactive charts use Observable Plot and data in `public/data/`.
- No real game, league, or team branding (no EA/2K/NFL marks or logos) as site chrome. Mentioning Taco Bell in the newspaper context is fine.
- Every number shown must trace to source data, code, or git history. Verified so far: FG model held-out ROC-AUC 0.777 (Brier 0.104 vs 0.122 baseline, 8,742 kicks); QB model 7,088 dropbacks, LOWO RMSE 1.57; PlayScan 89% on validation clips, 1,174 labeled clips; JournalToData 131 of 132 nights logged; Kaggle test R² 0.888; USAA 72% / 28%→66% (from résumé, not checkable).

## Brand Commitments

- **Voice: casual but not corny.** It reads like Eshaan talking: short, plain, first person, confident. No jokes, puns, or quips, no "derpy" or millennial-internet tone, no forced personality, no "notebook" or "entry" metaphors, nothing that sounds like marketing or AI. The theme lives in the UI, not in wordplay in the copy. Labels stay plain ("Projects", "About me", "Interests"); descriptions stay straight.
- **Minimal words.** Bullets, labels, numbers. One-line descriptions. Prose only where it's genuinely needed; no explanatory paragraphs.
- **No theme copy** (Oct 6 2026): plain labels (Projects, Featured, More projects, About me, Interests). Look: navy, blue numbers, gold actions. Flair comes from real data (hero replays a real tracking-data play), plus parallax and scroll reveals. No order bag, combos, or game/menu wording.
- Sleek and modern, with a few human touches.
- Contact: email, LinkedIn, GitHub. The résumé PDF is public and includes a phone number (his call).

## Evidence on Hand

- Project figures: `public/img/fg-explainer.png`, `fg-heatmap.png`, `adhd-income.png`, `ucla-dashboard.jpg` (synthetic data); `public/media/playscan.mp4`.
- Chart data: `public/data/journal_snapshot.json` (weekly aggregates only), `qb_clutch_ratings.csv`, `returns.json` (tennis, anonymized).
- Press: "Study hard, crunch harder," The Wave (Prior Lake HS), Apr 23 2024, by Ryan Gegenheimer. It's a feature about Eshaan. Must say clearly that it's written about him.
- Photo: professional headshot supplied by Eshaan (Oct 2026). Use the tie-up circular crop `public/img/eshaan-circle.jpg`; don't show the full tall portrait.
- Project pictures are real wherever possible (screenshots of the live tool, the AI tab, Streamlit app, travel dashboard, a real tracking-data play, report figures). USAA and SousChef pictures are labeled graphics/illustrations because no screenshots can exist.
- No screenshots exist for USAA (confidential) or SousChef. Don't present illustrations as screenshots.

## Product Principles

1. Scannable first: what it does, the result, and the stack are visible without clicking.
2. True over impressive: no claim the data or git history doesn't back.
3. The theme serves browsing. If a game gimmick slows down finding a project, cut it.
4. Sounds like a person, not a template.

## Accessibility & Inclusion

Keyboard-operable menu and item screens, visible focus, WCAG AA contrast, reduced-motion respected, works at 390px.
