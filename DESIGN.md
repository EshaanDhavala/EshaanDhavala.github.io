---
name: Eshaan Dhavala
description: Portfolio styled like a sports video game's menus. Title screen, project select, player profile.
colors:
  bg: "#06080e"
  bg-2: "#0a0e18"
  panel: "#0e1320"
  panel-2: "#151c2e"
  line: "rgba(255,255,255,0.09)"
  ink: "#eef2ff"
  ink-2: "#9aa4bd"
  lime: "#c6ff3d"
  on-lime: "#0b1200"
  cat-sports: "#e8c25a"
  cat-ai: "#a78bfa"
  cat-stats: "#ff7a59"
  turf: "#0f3a22"
typography:
  display:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "clamp(3.8rem, 11.5vw, 9.5rem)"
    fontWeight: 900
    lineHeight: 0.84
  headline:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "clamp(2.4rem, 5vw, 3.8rem)"
    fontWeight: 800
    lineHeight: 0.95
  title:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "clamp(1.35rem, 9cqi, 1.7rem)"
    fontWeight: 800
    lineHeight: 1
  body:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
    fontFeature: "'tnum' 1"
  label:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 600
    letterSpacing: "0.08em"
rounded:
  chip: "6px"
  button: "10px"
  tile: "14px"
  card: "16px"
  panel: "20px"
  avatar: "50%"
spacing:
  gutter: "clamp(16px, 4vw, 56px)"
  grid-gap: "clamp(12px, 2vw, 22px)"
  section: "clamp(56px, 10vh, 140px)"
components:
  button-primary:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.on-lime}"
    rounded: "{rounded.button}"
    height: "48px"
    padding: "0 20px"
  button-line:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.button}"
    height: "48px"
  project-card:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
  category-chip:
    rounded: "{rounded.chip}"
  hud:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink-2}"
    height: "64px"
  profile-tile:
    backgroundColor: "{colors.panel}"
    rounded: "{rounded.tile}"
---

# Design System: Eshaan Dhavala

## Overview

**Creative North Star: "Select Your Project"**

The site reads like the menus of a sports video game, at night in a stadium. A title screen with the name in huge italic broadcast type sits over parallax stadium lights and a football field receding into perspective. A scrolling highlight ticker sits under it like a broadcast crawl. Projects are cards on a "select a project" screen: the three strongest form the starting lineup as wide cards, then a playable field-goal model, then the rest of the roster. The About section is a player profile.

Every number is real and every picture is a real artifact (live tool, app screenshots, a tracking-data play, report figures), or is labeled as a graphic. The theme lives in layout, type and motion; the copy stays plain, short and first person.

**Key Characteristics:**
- Night-stadium ground, lime as the single "selected / primary" colour
- Barlow Condensed italic caps for anything a broadcast graphic would say; Barlow for reading
- Category colours (gold / violet / coral) only on stats and chips
- Motion: smooth scroll, parallax hero, field lines that scroll, batched card reveals, card tilt, count-ups

## Colors

Dark and committed, with one bright accent and three category colours.

### Primary
- **Turf Lime** (#c6ff3d): primary buttons, the selected tab underline, the portrait ring, focus rings, text selection, "selected" states. Text on it is #0b1200.

### Category
- **Sports Gold** (#e8c25a), **AI Violet** (#a78bfa), **Stats Coral** (#ff7a59): a card's headline stat, its chip, and its section heading on project pages. Never large fills.

### Neutral
- **Night** (#06080e) page ground; **Panel** (#0e1320) cards and tiles; **Panel 2** (#151c2e) chips and keycaps.
- **Ink** (#eef2ff) text; **Ink 2** (#9aa4bd) secondary text (≥ 6.3:1 on panels).
- **Line** (white at 9%) dividers and 1px insets.

### Named Rules
**The One Selected Colour Rule.** Lime means "this is the action / this is selected". Nothing else is lime.
**The Stat Colour Rule.** Category colours belong to numbers and chips, not to borders or backgrounds.

## Typography

**Display:** Barlow Condensed (700, 800 italic, 900 italic), self-hosted.
**Body and labels:** Barlow (400, 600), self-hosted.

**Character:** condensed italic caps read like sports broadcast lower-thirds; Barlow keeps the reading text calm.

### Hierarchy
- **Display** (900 italic, clamp(3.8rem, 11.5vw, 9.5rem), 0.84): the name in the hero.
- **Headline** (800 italic, clamp(2.4rem, 5vw, 3.8rem)): section titles.
- **Title** (800 italic, container-relative): card names and stats; stats scale with the card (`cqi`) so long values never collide.
- **Body** (400, 1.0625rem, 1.55): one-liners and bullets.
- **Label** (600, 0.72rem, +0.08em, uppercase): chips, tile labels. Never under 11px.

### Named Rules
**The No-Kicker Rule.** No small label above a heading.
**The Outcome Rule.** The big number on a card is a result (accuracy, AUC, R², a ranking), never a dataset size.

## Layout

Sticky 64px HUD. Hero capped so the starting lineup peeks above the fold. Content width min(100% − 2·gutter, 1320px). Starting lineup: one wide card, then two (horizontal cards ≥900px). Roster grid `repeat(auto-fill, minmax(272px, 1fr))`. On phones (≤600px) cards turn horizontal (picture 38% left) so all ten scan in about two screens. Project pages: picture + title split at 960px, then meta strip, video, built/results panels (top-aligned), charts, figures (non-wide max 860px), "Up next".

## Elevation & Depth

Flat panels separated by 1px insets and long soft drop shadows (`0 18px 36px -24px #000`). Depth in the hero comes from parallax layers, not shadows. No glow halos.

## Shapes

10px buttons, 16px cards, 14px tiles, 20px panels, circular portrait with a solid lime ring. No coloured side or bottom borders on rounded elements.

## Components

- **Project card:** picture (16:10), stat in category colour, name (2-line clamp), one-liner, chips + year. Whole card is one link. Tilt and shine follow the pointer.
- **Starter card:** the same card in a wide horizontal layout with larger type.
- **Tabs:** All / Sports / AI & ML / Stats, Q/E to switch, synced to `?cat=`.
- **Ticker:** broadcast crawl of highlights with a pause button; stops under reduced motion.
- **FG model:** live widget driven by precomputed predictions from the trained model.
- **Player profile:** four tiles (Studying, Graduating, Team, Looking for), career table, interests, one-line press mention, contact buttons.

## Do's and Don'ts

- **Do** use real artifacts for project pictures; label illustrations.
- **Do** keep every tap target ≥ 44px and every label ≥ 11px.
- **Don't** use coloured side/bottom borders, glow halos, cyan gradient rings, or gradient text.
- **Don't** put jokes or game puns in descriptions; the game lives in the UI.
- **Don't** use real game or league logos.
