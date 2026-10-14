---
name: Eshaan Dhavala
description: Space-themed portfolio. Black sky, white type; projects are constellations drawn from their own data and planets in a 3D system.
colors:
  bg: "#000000"
  ink: "#f5f7fb"
  ink-2: "#8b93a7"
  line: "rgba(255,255,255,0.12)"
  glass: "rgba(255,255,255,0.035)"
  blue: "#cfdcff"
  amber: "#ffcf8a"
  nebula-violet: "#5b3cff"
  nebula-magenta: "#d0369a"
  nebula-teal: "#1fb5c9"
typography:
  display:
    fontFamily: "Archivo Variable (font-stretch 118–125%)"
    fontWeight: 300
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Archivo Variable"
    fontSize: "1.02rem"
    fontWeight: 400
    lineHeight: 1.6
  demo-display:
    fontFamily: "Archivo Cond (Archivo at font-stretch 72%)"
    note: "stands in for the old condensed face inside the shared project demos"
rounded:
  pill: "999px"
  card: "24px"
---

# Design System: Eshaan Dhavala

## Overview

**Creative North Star: "The data is the sky."** A black sky with white type. Every project is a constellation whose stars come from that project's own data (QB ratings, the FG curve, real tennis bounces, weekly mood…), and the same projects orbit as planets in a 3D system. The hero replays a real NFL dropback from tracking data as moving stars. Colour appears only where the cosmos makes it: nebulas and supernovas.

## Colors
- **Black** #000 ground, **white** #f5f7fb text and actions, **grey** #8b93a7 secondary.
- **Starlight** #cfdcff for data in the shared demos; **amber** #ffcf8a, the single warm star colour (ball, rusher line, hover stats).
- Nebulas (violet, magenta, teal, amber) are drawn on the sky canvas at low opacity, anchored to sections via `data-nebula`. They never sit behind body text at full strength.

## Typography
- Archivo Variable throughout. Display at weight 300 and wide (font-stretch 118–125%), tight tracking; the name is uppercase, with the surname as an outline.
- Body Archivo 400. No italics, no monospace labels.
- Inside the shared demos, `--display` maps to a condensed cut of Archivo so their layouts (built for a condensed face) hold.

## Components
- **Glass card:** 3.5% white fill, 1px white-10% hairline, 24px radius, a soft light that follows the pointer, slight 3D tilt.
- **Buttons:** white pill (primary), hairline pill (secondary).
- **Constellations:** white stars with an SVG glow, 1px white line drawn left to right.
- **Nav:** two floating black-glass pills; ⌘K palette.

## Motion
- Native scrolling eased lightly by Lenis (lerp 0.22). Nothing pins; scrolling always moves the page.
- Sky canvas (src/scripts/cosmos.ts): three depths of twinkling stars (parallax), nebulas at half page speed, shooting stars (more when scrolling fast), an intro where the sky fades in and settles (CSS only), cursor stardust, a comet on the right edge showing scroll position.
- Constellations assemble as they scroll in (stars fly in, the line draws to the last star), then go supernova once per visit (sessionStorage). On project pages they assemble on load.
- The original site's background data animations (Ambient.astro) still loop faintly, recoloured white.
- The 3D solar system (Three.js) loads only when near; drag turns it; it never captures the wheel.
- Reduced motion: static sky, constellations shown formed, no intro, shooting stars, novas or orbits.

## Do's and Don'ts
- **Do** draw anything decorative from real project data where possible, and say what it is in the footer note.
- **Don't** add scroll-jacking (pinned sections, scroll-scrubbed takeovers, sideways rails).
- **Don't** let supernovas repeat on every scroll pass, or nebulas wash the page in colour.
- **Don't** use space puns in copy; labels stay plain.
