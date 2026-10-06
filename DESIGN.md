---
name: Eshaan Dhavala
description: Portfolio built as a self-order kiosk. Projects are menu items.
colors:
  bezel: "#0e0d12"
  bezel-ink: "#f3f2f8"
  screen: "#f2f1f6"
  tile: "#ffffff"
  ink: "#16141f"
  ink-2: "#4b4858"
  line: "#e1dfe9"
  violet: "#5b2ee0"
  violet-2: "#4320c2"
  sauce: "#ff5a1f"
  sauce-ink: "#16141f"
  plate-football: "#0f6b3e"
  plate-tennis: "#2160c4"
  plate-ai: "#4b22d6"
  plate-stats: "#b8391a"
  screen-dark: "#111016"
  tile-dark: "#1b1a22"
  ink-dark: "#f3f2f8"
  ink-2-dark: "#aeaabd"
  violet-dark: "#6d45ff"
typography:
  display:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "clamp(2.2rem, 5vw, 3.6rem)"
    fontWeight: 800
    lineHeight: 1.04
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 125"
  headline:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.7rem, 3.2vw, 2.4rem)"
    fontWeight: 800
    lineHeight: 1.04
    fontVariation: "'wdth' 125"
  title:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "1.12rem"
    fontWeight: 800
    fontVariation: "'wdth' 112"
  body:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "'tnum' 1"
  label:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "0.82rem"
    fontWeight: 700
rounded:
  tag: "999px"
  tile: "14px"
  panel: "18px"
  promo: "22px"
spacing:
  grid-gap: "16px"
  gutter: "clamp(16px, 2.5vw, 32px)"
  section: "3.5rem"
components:
  button-sauce:
    backgroundColor: "{colors.sauce}"
    textColor: "{colors.sauce-ink}"
    rounded: "{rounded.tag}"
    height: "48px"
    padding: "0 20px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.tag}"
    height: "48px"
  chip-price:
    backgroundColor: "{colors.sauce}"
    textColor: "{colors.sauce-ink}"
    rounded: "{rounded.tag}"
  menu-tile:
    backgroundColor: "{colors.tile}"
    textColor: "{colors.ink}"
    rounded: "{rounded.tile}"
  add-button:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.tile}"
    rounded: "{rounded.tag}"
    size: "44px"
  add-button-active:
    backgroundColor: "{colors.violet}"
    textColor: "#ffffff"
  category-rail:
    backgroundColor: "{colors.violet}"
    textColor: "#ffffff"
  order-bar:
    backgroundColor: "{colors.violet}"
    textColor: "#ffffff"
    rounded: "{rounded.tag}"
    height: "60px"
  top-bar:
    backgroundColor: "{colors.bezel}"
    textColor: "{colors.bezel-ink}"
    height: "68px"
---

# Design System: Eshaan Dhavala

## Overview

**Creative North Star: "The Order Kiosk"**

The site is a self-order touchscreen. A black hardware bar frames a bright screen; a violet rail holds the categories; projects are menu tiles with a picture, a name, one line, and a "price" that is the project's headline number. Tapping a tile opens an item screen; anything can be added to an order and sent as a list. The kiosk lives in the interface, never in the copy: text is short, plain, first person, mostly bullets.

Density is high but calm: big touch targets, one heavy display face, flat white tiles on a cool grey screen. The theme nods to a high-school newspaper feature about Eshaan's Taco Bell order, but the kiosk is original. No Taco Bell name, logo, bell, or trade dress in the chrome.

**Key Characteristics:**
- Bezel black / screen light / violet navigation / sauce-orange prices
- One family (Archivo Variable), expanded and heavy for anything you'd read on a menu board
- Item pictures drawn from each project's real data on category-colored plates
- Verbs are kiosk verbs: Add to Order, Review Order, Add Combo

## Colors

A neutral kiosk screen with two committed brand colors that each own one job.

### Primary
- **Kiosk Violet** (#5b2ee0; dark #6d45ff): navigation and the order. Category rail, Order button, order bar, active add state, chart "positive" series.

### Secondary
- **Hot Sauce** (#ff5a1f): prices and the main buy action only. Stat chips, Add to Order buttons, selection highlight, focus ring. Always with dark ink (#16141f) on top.

### Tertiary: category plates
- **Turf Green** (#0f6b3e): football items and the live FG promo.
- **Hard-Court Blue** (#2160c4): tennis.
- **Deep Violet** (#4b22d6): AI & ML.
- **Brick** (#b8391a): stats.

### Neutral
- **Bezel** (#0e0d12): top bar.
- **Screen** (#f2f1f6 / dark #111016): page ground.
- **Tile** (#ffffff / dark #1b1a22): tiles, panels, sheet.
- **Ink** (#16141f) and **Ink 2** (#4b4858): text and secondary text.
- **Line** (#e1dfe9): dividers and tag outlines.

### Named Rules
**The One Job Rule.** Violet means navigate or order; orange means price or buy. Neither is used as decoration.
**The Plate Rule.** Category colors appear only as the ground of item pictures and the promo, never as text or UI chrome.

## Typography

**Display, body and labels:** Archivo Variable (width axis 62–125%), self-hosted.

**Character:** a single grotesque pushed wide and heavy for headings reads like a menu board; normal width for reading.

### Hierarchy
- **Display** (800, wdth 125, clamp(2.2rem, 5vw, 3.6rem), 1.04): item-screen names, promo title, About heading.
- **Headline** (800, wdth 125, clamp(1.7rem, 3.2vw, 2.4rem)): section heads (Everything, Combos).
- **Title** (800, wdth 112, 1.12rem): tile names, panel heads.
- **Body** (400, 1rem, 1.5, tabular numerals): bullets and one-liners.
- **Label** (700, 0.8–0.85rem): metadata terms, control labels.

### Named Rules
**The No-Kicker Rule.** No small label above a heading. Metadata goes in the dl below the title.
**The Short Copy Rule.** One-liners are 8–12 words and never truncated; details go in bullets.

## Layout

Sticky 68px bezel. Desktop (≥1000px): 216px violet rail + content column. Mobile: the rail becomes a horizontal sticky tab strip under the bezel. Menu grid `repeat(auto-fill, minmax(248px, 1fr))`, 16px gap; under 640px tiles turn horizontal (picture 38% left). Item screen max 1120px: picture + info split at 880px, then bullet panels, chart, figures, related tiles. Content gutter clamp(16px, 2.5vw, 32px); 3.5rem between sections.

## Elevation & Depth

Flat tiles lifted by one soft shadow; no borders on elevated surfaces.

### Shadow Vocabulary
- **Rest** (`0 1px 2px rgba(22,20,31,.06), 0 8px 24px -12px rgba(22,20,31,.22)`): tiles, panels, back button.
- **Hover** (`0 2px 4px rgba(22,20,31,.06), 0 18px 36px -16px rgba(22,20,31,.35)` + translateY(-3px)): tiles.
- **Order bar** (`0 12px 32px -12px rgba(67,32,194,.7)`).

## Shapes

Pills (999px) for every control, chip, and tag. Tiles 14px, panels 18px, promo and About 22px. Item pictures are 16:10.

## Components

- **Menu tile:** picture on plate, title link stretched over the tile, one-liner, price chip, 44px round add button (ink → violet with a check when added).
- **Price chip:** orange pill, bold value + smaller label.
- **Add to Order button:** orange pill, 48px; becomes ink "In Your Order" when added.
- **Category rail:** violet; active item is a white pill with violet text.
- **Order sheet:** right-side dialog with order list, Email This List to Eshaan, Copy Links, Clear Order (5s undo).
- **Order bar:** fixed violet pill with item count and an orange Review Order segment; appears once the order has an item.
- **FG Live:** big percentage, distance slider, gust and kicker segmented pills, curve; driven by precomputed model predictions.

## Do's and Don'ts

- **Do** pull every number from data, code, or git history.
- **Do** keep the kiosk in the UI vocabulary; keep descriptions straight.
- **Don't** use jokes, puns, or "derpy" tone in copy.
- **Don't** add kickers or eyebrow labels.
- **Don't** use Taco Bell branding.
- **Don't** truncate tile one-liners; rewrite them shorter.
