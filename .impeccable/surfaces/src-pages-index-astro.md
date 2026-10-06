---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: ["src/pages/entries"]
---

# Surface: home menu + item screens

Mode: Experience (portfolio). Code-led build: no image generation is available on this machine.

Audience: DS/ML recruiters, sports-analytics staff, ML engineers. Job: see what every project does and how good it was in seconds, open one, and leave with links or contact.

## Direction contract

THESIS: The portfolio is a self-order kiosk. Projects are menu items you scan by picture, name, one-line description and one "price" stat; tap one for its item screen and add it to an order. It refuses both the hero-plus-equal-card-grid personal site and the editorial notebook look it replaces.

OWN-WORLD: Kiosk touchscreen. Near-black hardware top bar; a cool light screen (#F2F1F6) with white item tiles (radius 14). Electric violet (#5B2EE0) owns the category rail and the order bar. Hot-sauce orange (#FF5A1F) is reserved for stat "price" chips and Add buttons. Type is Archivo Variable: expanded 800 for item names and headings, normal 400–500 for body, tabular numerals. Each item picture is drawn from that project's real data in one shared style, on a per-category colored plate.

STORY: The visitor lands on the menu, filters by category, reads each project's purpose and key number without clicking, opens an item screen for detail and figures, and leaves with an order: copyable links or an email to Eshaan. The About tab explains the theme through the newspaper feature about him.

FIRST VIEWPORT: Black top bar with the wordmark "Eshaan Dhavala", "Stats & Data Science · UCLA", Résumé, and an Order button with a count. A violet left rail lists Featured, Football, Tennis, AI & ML, Stats, Combos, About (it becomes a horizontal scroller on mobile). The main area is a featured promo panel, about 40% of the height: the field-goal model live, with a distance slider plus gust and kicker toggles driving a big P(make). The first row of menu tiles shows below it. Every tile has an Add button; a violet order bar is fixed at the bottom once anything is added.

FORM: User-pinned "full order kiosk" direction (position 1; pinned by the user, so concept-seed was not rolled; seed key: user-pinned-kiosk).

Signature interaction: the live FG model promo. Motion grammar: kiosk screen transitions (Astro view transitions between menu and item screen) and an add-to-order fly-to-bag pulse. Nothing else animates.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
