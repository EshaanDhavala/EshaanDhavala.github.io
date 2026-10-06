---
name: Eshaan Dhavala
description: Portfolio styled like a sports video game's menus. Title screen, project select, player profile.
colors:
  bg: "#0f1724"
  bg-2: "#132034"
  panel: "#16233a"
  panel-2: "#1d2d48"
  line: "#2a3b58"
  ink: "#f3efe6"
  ink-2: "#a9b4c6"
  accent: "#f2b33d"
  on-accent: "#14110a"
  blue: "#7fb2e5"
typography:
  display:
    fontFamily: "Big Shoulders Display, Arial Narrow, sans-serif"
    fontSize: "clamp(3.8rem, 11.5vw, 9.5rem)"
    fontWeight: 900
    lineHeight: 0.84
  headline:
    fontFamily: "Big Shoulders Display, Arial Narrow, sans-serif"
    fontSize: "clamp(2.4rem, 5vw, 3.8rem)"
    fontWeight: 800
    lineHeight: 0.95
  title:
    fontFamily: "Big Shoulders Display, Arial Narrow, sans-serif"
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
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
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

A sports game's menu system (title screen, project select with a starting lineup and roster, player profile), drawn with restraint: night-navy ground, warm off-white type, upright stadium-signage display face, gold for actions and blue for numbers. Real artifacts carry the color; the chrome does not. No glows, gradients, neon, or per-category colour coding (removed Oct 2026 at Eshaan's request: they read as generic AI design).

## Colors
Muted team palette: night navy with two roles, never more.
- **Night** #0f1724 ground; **Panel** #16233a; **Line** #2a3b58.
- **Ink** #f3efe6 text; **Ink 2** #a9b4c6 secondary.
- **Gold** #f2b33d: actions and the selected tab only.
- **Blue** #7fb2e5: big numbers, the second word of the name, section highlights, chart bars, field lines.

**The Two Roles Rule.** Gold = do something. Blue = look at this number. No per-category colours, no glow, no gradients.

## Typography
- **Display:** Big Shoulders Display 700–900, upright, uppercase. Name, section heads, card names, big numbers.
- **Body:** Barlow 400/600.
- No italic display, no letter-spaced gamer caps on body text.

## Layout, depth, shapes
Same structure as before (sticky HUD, hero capped so the lineup peeks, 3 starters then the roster, project pages with picture + title then detail). Depth is flat: 1px insets only, no drop-shadow halos. Radii: 10px buttons, 16px cards, 4px chips, circular portrait with no ring.

## Motion
Native scrolling (no smooth-scroll library). Hero name and faint field lines parallax with scroll; cards reveal in batches; card tilt on hover; stat count-ups; view transitions into project pages. Reduced motion turns all of it off.

## Do's and Don'ts
- **Do** let project pictures be the only saturated colour on the page.
- **Don't** add glows, gradients, neon accents, colour-coded categories, or italic display type.
- **Don't** use jokes in copy; keep labels short.
