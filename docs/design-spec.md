# narablyat Design System Spec

**Status:** Accepted — source of truth for the 2026-07 "Clean Pop" redesign
**Date:** 2026-07-16 (supersedes the 2026-07-12 Liquid Glass spec)
**Owner docs:** This file defines the design system. `README.md`, `CLAUDE.md`, and `AGENTS.md` must *reference* this file instead of restating numbers. If a value here changes, it changes here first.

Companions: [`redesign-plan.md`](./redesign-plan.md) — the glass → Clean Pop migration plan. [`refactor-plan.md`](./refactor-plan.md) — historical (glass era).

---

## 1. Design Principles

1. **Flat ground, pop accents.** Every surface is opaque and quiet: solid fills, hairline borders, at most a soft neutral shadow. All color energy is concentrated in a small set of **pop points** that carry the accent gradient and its glow. No `backdrop-filter` anywhere.
2. **Functional accent.** The Neon Orchid accent means *state*, never decoration: active/toggled controls, playback progress, focus rings, the primary play button. Default icons and tertiary controls stay neutral. The gradient and glow are extensions of the accent and obey the same rule.
3. **Five pop points.** Gradient + glow appear only on: (1) the primary play button, (2) the floating player bar (top hairline + wide under-glow), (3) the playback progress fill/handle, (4) selected chips/tabs, (5) focus rings. The lyrics active-line glow is a sanctioned bonus. Adding a pop point requires a decision-log entry.
4. **Focus over hover — with a list-row exception.** Buttons, cards, chips, and surfaces have no hover styling; they respond to focus, active, selected, checked, and current. Dense list rows (sidebar library rows, nav items, context-menu items, search-result options) MAY have a hover background tint (`--row-hover`) because pointer tracking in long lists is a real usability need. Nothing else hovers.
5. **Scheme parity.** Every rule must render correctly in both `suudLorLight` and `suudLorDark`. Component rules may not contain raw hex/rgb literals — only tokens (§4) and `color-mix()` over tokens. Scheme-dependent primitives live in `color.ini` or in the `[data-scheme]` branches (§3).
6. **Traceability.** Every visible value traces to a token; every token traces to a rule in this spec.

## 2. Decision Log

| # | Decision | Status |
|---|----------|--------|
| D1 | Hover policy: hover background allowed on dense list rows only (via `--row-hover`); removed everywhere else. | Accepted |
| D5 | Floating player bar radius snaps to the scale: `--radius-lg` (28px). | Accepted |
| D6 | Scheme detection is done by `theme.js` (luminance of `--spice-main`) stamping `data-scheme="light|dark"` on `<html>`; CSS branches on it. | Accepted |
| D7 | Only the search modal overlay (`.spice-glass-overlay`) is customized (thin `rgba(0,0,0,.3)` scrim). All other modals keep their default scrim. | Accepted |
| D9 | Liquid Glass retired: no `backdrop-filter`, no translucent surfaces, no ambient blobs/gradient, no noise overlays. Elevation is expressed with the 3-level shadow scale (§4.4). | Accepted |
| D10 | Accent is the "Neon Orchid" gradient `#a855f7 → #ec4899`; glows use the midpoint `--glow-core: #d946ef` (box-shadow cannot render a gradient). Solid accent per scheme: `#c026d3` light / `#e879f9` dark. Forest green `#16a34a` is retired everywhere. Sunset variant = swap `--pop-a: #f97316`, `--glow-core: #f43f5e`. | Accepted |
| D11 | `--pop-b` pink (`#ec4899`) is never used as text/icon color on a light ground (fails contrast); single-color accent contexts always use `--accent` (from `color.ini`). | Accepted |
| D12 | `spice-glass-*` class names in `theme.js`/`user.css` are legacy hooks kept for stability; renaming to `spice-pop-*` is a separate follow-up, not part of the redesign commits. | Accepted |

Glass-era decisions D2–D4, D8 are retired with the system they governed. To reverse a decision: edit this table, then update the affected tokens/rules in the same commit.

## 3. Scheme Detection Mechanism

CSS cannot know which Spicetify color scheme is active. `theme.js` computes the relative luminance of the resolved `--spice-main` at startup (and re-checks when it changes) and sets `data-scheme="dark"` or `data-scheme="light"` on `<html>`.

- Default token values in `:root` target the light scheme.
- Dark overrides live in one consolidated block: `html[data-scheme="dark"] { ... }` — tokens only, never component rules. (Currently just the two neutral shadows; glow tokens need no branch, and per-scheme solid accents come from `color.ini`.)
- This is the *only* sanctioned DOM mutation in `theme.js` beyond the class injector; the existing rule ("no new DOM mutations unless CSS cannot target it") stands.

## 4. Token Architecture

Three layers, defined in **one** `:root` block at the top of `user.css` (plus the single dark-override block). Layer boundaries are strict:

```
Layer 1  Primitives  — --spice-* injected by Spicetify from color.ini. The only place hex lives.
Layer 2  Semantic    — surfaces, accent ramp, pop gradient/glow, elevation, radius, motion.
Layer 3  Component   — only where a component needs a knob (e.g. --search-*). Built from Layer 2.
```

**Rule:** component CSS references Layer 2/3 tokens only. `color-mix()` in component rules may only mix tokens with `transparent`.

### 4.1 Accent ramp + pop tokens (Layer 2)

| Token | Definition | Use |
|-------|------------|-----|
| `--accent` | `var(--spice-accent, #c026d3)` | Solid single-color accent: toggled icons, volume fill, borders, text states |
| `--accent-ink` | `var(--spice-alt-text, #ffffff)` | Text/icon on solid accent or gradient |
| `--accent-a08` | `color-mix(in srgb, var(--accent) 8%, transparent)` | Selected/current list-row bg, menu active bg |
| `--accent-a12` | `color-mix(in srgb, var(--accent) 12%, transparent)` | Selected nav-chip bg |
| `--accent-a28` | `color-mix(in srgb, var(--accent) 28%, transparent)` | (reserved; ring glow now comes from `--glow-ring`) |
| `--accent-a75` | `color-mix(in srgb, var(--accent) 75%, transparent)` | Non-color selection/current inset cue (list rows, menu, search results) |
| `--pop-a` / `--pop-b` | `#a855f7` / `#ec4899` | Gradient endpoints only — never used alone |
| `--grad-pop` | `linear-gradient(135deg, var(--pop-a), var(--pop-b))` | Fills at pop points (§1.3) |
| `--glow-core` | `#d946ef` | The only color glows may use |

No other accent alphas are permitted.

### 4.2 Surfaces (Layer 2)

All opaque; planes are separated by hairlines, not translucency:

| Token | Definition | Used by |
|-------|------------|---------|
| `--surface` | `var(--spice-card)` | Cards, dialogs, menus, dropdowns, chips, right sidebar, player bar, search pill |
| `--surface-bg` | `var(--spice-main)` | Body ground, nav bar |
| `--hairline` | `var(--spice-contour)` | All 1px borders |
| `--row-hover` | `color-mix(in srgb, var(--spice-text) 5%, transparent)` | Dense list-row hover (D1) |

### 4.3 Elevation scale — 3 levels

A surface picks a level; shadow values are tokens, never raw in rules:

| Level | Token(s) | Surfaces |
|-------|----------|----------|
| **Flat** | none (hairline only) | Nav bar, right sidebar, resting chips/tabs, search pill at rest |
| **Lift** | `--shadow-lift` (`0 2px 12px` neutral; dark scheme deeper) | Cards, context menus, dropdowns |
| **Pop** | `--glow-pop` (`0 6px 20px` @ 45% `--glow-core`), `--glow-pop-wide` (`0 12px 44px` @ 28%), `--glow-ring` (2px ring + 16px glow), `--shadow-float` (`0 10px 32px` neutral, pairs with `--glow-pop-wide` on the player bar) | Pop points only (§1.3) |

### 4.4 Radius scale

`--radius-xs: 8px` (badge, kbd) · `--radius-sm: 12px` (list row, menu item, input) · `--radius-md: 20px` (card, panel, menu) · `--radius-lg: 28px` (modal, floating player — per D5) · `--radius-xl: 32px` (large container) · `--radius-full: 9999px` (pills, circular buttons).

Raw `9999px` and off-scale radii are not permitted in component rules.

### 4.5 Motion

`--transition-fast: 0.15s ease` (color, transform) · `--transition-medium: 0.25s ease` (background, shadow) · `--transition-slow: 0.4s ease` (large surfaces).

All decorative animation must be wrapped in `@media (prefers-reduced-motion: no-preference)` (currently only the lyrics scroll-driven focus effect).

## 5. State Matrix

Universal rules:

- **Non-color signal rule:** selected/current must carry at least one non-color cue in list contexts — the `aria-current` inset bar (`inset 3px 0 0 var(--accent)`) is the canonical pattern.
- **Focus ring:** `box-shadow: var(--glow-ring)` + `border-color: var(--accent)` where a border exists. Never `outline: none` without a replacement ring.
- **Hit areas:** interactive controls ≥ 36×36px.

| Component | Default | Hover | Focus | Active/Pressed | Selected/Checked | Current |
|---|---|---|---|---|---|---|
| List row (nav, library, results, menu item) | transparent | `--row-hover` | ring | `--accent-a08` | `--accent-a08` bg (+ accent text for menu/nav) | `--accent-a08` bg + inset accent bar |
| Chip / tab | `--surface` + `--hairline`, flat | — | ring | — | `--grad-pop` bg + `--accent-ink` text + `--glow-pop` | — |
| Tertiary icon button | `--ui-subtext` | — | ring | scale 0.98 | `--accent` color | — |
| Primary play | `--grad-pop` bg + `--accent-ink` + `--glow-pop` | — | ring | scale 0.96 | — | — |
| Search field | `--surface` + `--hairline`, flat | — | accent border + `--glow-ring` | — | — | — |
| Card | `--surface` + `--hairline` + `--shadow-lift` | — | ring | scale 0.98, shadow removed | — | — |

Empty cell = no styling for that state (intentional). `/* Hover removed */` placeholder comments are banned; absence of a rule is the documentation.

## 6. Color System

- **Primitives** live in `color.ini` (`suudLorLight`, `suudLorDark`). Neutral base is unchanged platinum/near-black. Accent rows: light `accent`/`button` = `c026d3`, `button-active` = `d946ef`; dark `accent`/`button` = `e879f9`, `button-active` = `f0a5fb`; both schemes `player-bar-bg` = `d946ef`.
- **Ground** is flat: `body { background: var(--surface-bg) }`. No gradients, blobs, or noise (D9) — a clean field is what makes the glows read.
- **Lyrics route:** `--lyrics-color-background` overridden to `var(--surface)` (flat, opaque); active line = `--accent`; the active-line radial glow uses `--glow-core` at 24%.

## 7. Accessibility Baseline

- Body/primary text ≥ 4.5:1 (WCAG AA); large text and UI components/icons ≥ 3:1 against their actual surface.
- Solid accent on light ground: `#c026d3` on `#fafafa` ≈ 4.6:1 — passes AA for UI and normal text; never substitute `--pop-b` pink (D11).
- White (`--accent-ink`) on `--grad-pop`: worst case is over `#ec4899` ≈ 3.4:1 — acceptable for large/bold chip text and icons; do not put small body text on the gradient.
- Selected states: color + non-color cue (§5).
- `prefers-reduced-motion` respected for all decorative animation (§4.5).
- Never remove focus visibility; the ring spec in §5 is the minimum.

## 8. Performance Budget

- **Zero `backdrop-filter`** — the retirement of glass removes the theme's entire compositing budget problem. Reintroducing any backdrop-filter requires a decision-log entry.
- Glows are plain `box-shadow`s; they are cheap but not free — they exist only at pop points (§1.3).
- `theme.js` MutationObserver work must be debounced (single rAF-coalesced pass) and idempotent.

## 9. Selector Policy

- **Prefer, in order:** Spicetify stable roots (`.Root__*`, `.main-*`, `.x-*`) → `data-testid` / `aria-*` / `role` → Encore ids (`data-encore-id`) → hashed classes (last resort).
- Hashed selectors and fragile hacks live only in the **Quarantine zone** (§10 section 5) with a comment stating what they target and why no stable selector exists.
- Spotify's local XPUI bundle (`/Applications/Spotify.app/Contents/Resources/Apps/xpui`) is the reference for discovering stable selectors.

## 10. `user.css` File Structure

Fixed section order; every rule belongs to exactly one section:

```
1. TOKENS        — single :root block (all layers) + single html[data-scheme="dark"] block
2. BASE          — flat body ground, top-container reset
3. LAYOUT ROOTS  — .Root__nav-bar, .Root__main-view, .Root__right-sidebar, .Root__now-playing-bar
4. COMPONENTS    — search (topbar + modal + dropdown), player controls, progress/volume,
                   cards, list rows, chips/tabs, context menus, lyrics, headers
5. QUARANTINE    — hashed selectors, Spotify-internal variable overrides, hacks (each commented)
```

Section headers use the existing short-comment style. No `:root` blocks outside section 1.

## 11. Definition of Done (any UI change)

1. `spicetify apply` and verify in **both** schemes (checklist in `CLAUDE.md`).
2. No new raw hex/rgb in component rules; new values become tokens.
3. Contrast spot-check for any text/surface pairing touched.
4. If a principle, token value, or decision changed → this spec updated in the same commit.
5. Conventional Commit with proper scope.
