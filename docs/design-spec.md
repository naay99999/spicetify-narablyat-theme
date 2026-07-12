# narablyat Design System Spec

**Status:** Accepted — source of truth for the 2026-07 refactor
**Date:** 2026-07-12
**Owner docs:** This file defines the design system. `README.md`, `CLAUDE.md`, and `AGENTS.md` must *reference* this file instead of restating numbers. If a value here changes, it changes here first.

Companion: [`refactor-plan.md`](./refactor-plan.md) — the phased implementation plan.

---

## 1. Design Principles

1. **Liquid Glass layering.** Every elevated surface is built from three parts: `backdrop-filter` (blur + saturate), a translucent background so the blur reads, and a pseudo-element rim highlight. Glass is only visible when the layer behind it has variation — the ambient background system (§6) exists to guarantee that.
2. **Functional green.** The forest-green accent means *state*, never decoration: active/toggled controls, playback progress, focus rings, the primary play button. Default icons and tertiary controls stay neutral.
3. **Dual-hue ambient.** Lavender is the official *ambient* hue (background tints and blob-1); green is the official *functional* hue. No third hue may appear without a decision-log entry.
4. **Focus over hover — with a list-row exception.** Buttons, cards, chips, and surfaces have no hover styling; they respond to focus, active, selected, checked, and current. Dense list rows (sidebar library rows, nav items, context-menu items, search-result options) MAY have a hover background tint (`--row-hover`) because pointer tracking in long lists is a real usability need. Nothing else hovers.
5. **Scheme parity.** Every rule must render correctly in both `suudLorLight` and `suudLorDark`. Component rules may not contain raw hex/rgb literals — only tokens (§4) and `color-mix()` over tokens. Scheme-dependent primitives live in `color.ini` or in the `[data-scheme]` branches (§3).
6. **Traceability.** Every visible value traces to a token; every token traces to a rule in this spec.

## 2. Decision Log

| # | Decision | Status |
|---|----------|--------|
| D1 | Hover policy amended: hover background allowed on dense list rows only (via `--row-hover`); removed everywhere else. | Accepted |
| D2 | Lavender is the official ambient hue alongside functional green (dual-hue). | Accepted |
| D3 | The dark-red mix in the lyrics background (`rgba(120,24,24,.22)`) is an abandoned experiment — remove; lyrics use a neutral glass tone and keep Spotify's album-aware text colors. | Accepted |
| D4 | Accent is forest green `#16a34a` (`accent`/`button` in `color.ini`). The old electric mint `#00e676` is retired everywhere, including docs. | Accepted |
| D5 | Floating player bar radius snaps to the scale: `--radius-lg` (28px) instead of the off-scale 24px. | Accepted |
| D6 | Scheme detection is done by `theme.js` (luminance of `--spice-main`) stamping `data-scheme="light|dark"` on `<html>`; CSS branches on it. | Accepted |
| D7 | The global `.GenericModal__overlay { background: transparent }` is removed; only the search modal overlay (`.spice-glass-overlay`) is customized. All other modals keep their default scrim. | Accepted |
| D8 | Selected chip/tab/control borders use solid `--accent`, not `--accent-a40`: measured `--accent-a40` over `--surface-chip` is ~1.56:1 (light) / ~1.87:1 (dark), short of the 3:1 non-text target; solid `--accent` measures ~3.2:1 (light) / ~5.5:1 (dark). `--accent-a40` keeps its remaining role as the decorative search-modal accent-blob core. | Accepted |

To reverse a decision: edit this table, then update the affected tokens/rules in the same commit.

## 3. Scheme Detection Mechanism

CSS cannot know which Spicetify color scheme is active. `theme.js` computes the relative luminance of the resolved `--spice-main` at startup (and re-checks when it changes) and sets `data-scheme="dark"` or `data-scheme="light"` on `<html>`.

- Default token values in `:root` target the light scheme.
- Dark overrides live in one consolidated block: `html[data-scheme="dark"] { ... }` — tokens only, never component rules.
- This is the *only* sanctioned new DOM mutation in `theme.js`; the existing rule ("no new DOM mutations unless CSS cannot target it") stands.

## 4. Token Architecture

Three layers, defined in **one** `:root` block at the top of `user.css` (plus the single dark-override block). Layer boundaries are strict:

```
Layer 1  Primitives  — --spice-* injected by Spicetify from color.ini. The only place hex lives.
Layer 2  Semantic    — surfaces, ink, accent ramp, glass, elevation, radius, motion. Built from Layer 1.
Layer 3  Component   — only where a component needs a knob (e.g. --search-*). Built from Layer 2.
```

**Rule:** component CSS references Layer 2/3 tokens only. `color-mix()` in component rules may only mix tokens with `transparent`.

### 4.1 Accent ramp (Layer 2)

All derived from one source so the accent can be changed in one place:

| Token | Definition | Use |
|-------|------------|-----|
| `--accent` | `var(--spice-accent, #16a34a)` | Solid fills: play button, progress fill, active icons |
| `--accent-ink` | `var(--spice-alt-text, #ffffff)` | Text/icon on solid accent |
| `--accent-a08` | `color-mix(in srgb, var(--accent) 8%, transparent)` | Selected/current list-row bg, menu active bg |
| `--accent-a12` | `color-mix(in srgb, var(--accent) 12%, transparent)` | Selected chip/nav bg |
| `--accent-a28` | `color-mix(in srgb, var(--accent) 28%, transparent)` | Focus rings, accent blob core |
| `--accent-a40` | `color-mix(in srgb, var(--accent) 40%, transparent)` | Decorative search-modal accent-blob core (not used for borders — see D8) |
| `--accent-a75` | `color-mix(in srgb, var(--accent) 75%, transparent)` | Volume fill; non-color selection/current inset cue (list rows, menu, search results) |

Consolidation: legacy alphas `.06/.08/.10 → a08`, `.12/.14 → a12`, `.35/.40 → a40`. No other accent alphas are permitted.

### 4.2 Surfaces (Layer 2)

Glass surface opacity encodes prominence. All mix `--spice-card` with `transparent`:

| Token | Mix | Used by |
|-------|-----|---------|
| `--surface-input` | 52% | Resting search field |
| `--surface-chip` | 62% | Filter chips, category tabs |
| `--surface-modal` | 72% | Search dialog, topbar pill, floating player |
| `--surface-panel` | 78% | Right sidebar / queue |
| `--surface-popover` | 82% | Context menus, dropdowns |
| `--surface-solid` | `var(--spice-card)` | Focused search field, opaque needs |

Nav-bar tint: `--surface-nav` = `color-mix(in srgb, var(--ambient-lavender-tint) 24%, var(--spice-card))` (see §6).

### 4.3 Glass chrome (Layer 2, scheme-branched)

| Token | Light | Dark |
|-------|-------|------|
| `--glass-border` | `rgba(255,255,255,.40)` | `rgba(255,255,255,.12)` |
| `--glass-highlight` | `rgba(255,255,255,.60)` | `rgba(255,255,255,.10)` |
| `--glass-shadow` | `rgba(0,0,0,.10)` | `rgba(0,0,0,.45)` |
| `--edge-border` | `rgba(0,0,0,.08)` | `rgba(255,255,255,.08)` |
| `--row-hover` | `color-mix(in srgb, var(--spice-text) 5%, transparent)` | same formula (auto-adapts) |

(`--glass-ink*` tokens for the dark input pill inside the modal are kept; they already work in both schemes.)

### 4.4 Elevation scale

Blur/saturate pairs are tokens; a surface picks a level, never a raw px value:

| Level | Surfaces | Tokens (blur / saturate) |
|-------|----------|--------------------------|
| 0 | Ambient background + blobs | — (no backdrop-filter) |
| 1 | Nav bar, filter chips, category tabs | `--glass-blur-1: 12px` / `--glass-sat-1: 140%` |
| 2 | Cards, right sidebar, lyrics glass | `--glass-blur-2: 16px` / `--glass-sat-2: 160%` |
| 3 | Context menus, dropdowns | `--glass-blur-3: 20px` / `--glass-sat-3: 170%` |
| 4 | Topbar search, search modal | `--glass-blur-4: 24px` / `--glass-sat-4: 180%` |
| 5 | Floating player bar (signature element) | `--glass-blur-5: 30px` / `--glass-sat-5: 200%` |

Right sidebar and lyrics move from ad-hoc 18px to level 2 (16px). Nothing else changes level in the refactor.

### 4.5 Radius scale

`--radius-xs: 8px` (badge, kbd) · `--radius-sm: 12px` (list row, menu item, input) · `--radius-md: 20px` (card, panel, menu) · `--radius-lg: 28px` (modal, floating player — per D5) · `--radius-xl: 32px` (large container) · `--radius-full: 9999px` (pills, circular buttons).

Raw `9999px` and off-scale radii are not permitted in component rules.

### 4.6 Motion

`--transition-fast: 0.15s ease` (color, transform) · `--transition-medium: 0.25s ease` (background, shadow) · `--transition-slow: 0.4s ease` (large surfaces).

All decorative animation (ambient blob drift `glassBlob`) must be wrapped in `@media (prefers-reduced-motion: no-preference)`.

## 5. State Matrix

Universal rules:

- **Non-color signal rule:** selected/current must carry at least one non-color cue in list contexts — the `aria-current` inset bar (`inset 3px 0 0 var(--accent)`) is the canonical pattern.
- **Focus ring:** `box-shadow: 0 0 0 3px var(--accent-a28)` + `border-color: var(--accent)` where a border exists. Never `outline: none` without a replacement ring.
- **Hit areas:** interactive controls ≥ 36×36px (existing rule, keep).

| Component | Default | Hover | Focus | Active/Pressed | Selected/Checked | Current |
|---|---|---|---|---|---|---|
| List row (nav, library, results, menu item) | transparent | `--row-hover` | ring | `--accent-a08` | `--accent-a08` bg (+ accent text for menu/nav) | `--accent-a08` bg + inset accent bar |
| Chip / tab | `--surface-chip` + `--glass-border` | — | ring | — | `--accent-a12` bg + `--accent` border (D8) | — |
| Tertiary icon button | `--ui-subtext` | — | ring | scale 0.98 | `--accent` color | — |
| Primary play | `--accent` bg + `--accent-ink` | — | ring | scale 0.98 | — | — |
| Search field | `--surface-input` | — | `--surface-solid` bg + ring + lift −1px | — | — | — |
| Card | `--surface-*` glass | — | ring | scale 0.98 + reduced shadow | — | — |

Empty cell = no styling for that state (intentional). `/* Hover removed */` placeholder comments are banned; absence of a rule is the documentation.

## 6. Color & Ambient System

- **Primitives** live in `color.ini` (`suudLorLight`, `suudLorDark`). Accent: `16a34a`; active: `18b34a`.
- **Ambient background** (level 0): body gradient + two fixed blurred blobs injected by `theme.js`. Tokens, scheme-branched:

| Token | Light | Dark |
|-------|-------|------|
| `--ambient-gradient` | `linear-gradient(160deg, #f0edf8 0%, #eaf5ef 100%)` | `linear-gradient(160deg, #14121d 0%, #0d1512 100%)` |
| `--ambient-lavender-tint` | `rgb(230 225 248)` | `rgb(74 62 110)` |
| `--ambient-blob-lavender` | `rgba(180,155,230,.75)` | `rgba(120,95,190,.35)` |
| `--ambient-blob-green` | `rgba(22,163,74,.55)` | `rgba(22,163,74,.28)` |

(Dark values are starting points; tune visually, then update this table in the same commit.)

- **Lyrics route (per D3):** `--lyrics-color-background` overridden on `.lyrics-lyrics-container` to `color-mix(in srgb, var(--spice-card) 72%, transparent)`; keep Spotify's text colors for album-aware contrast; glass at elevation 2.

## 7. Accessibility Baseline

- Body/primary text ≥ 4.5:1 (WCAG AA); large text and UI components/icons ≥ 3:1 against their actual surface.
- Known check items: accent-on-white text usage (3.3:1 — acceptable for UI, not for body text).
- Checked: selected chip/tab/control border — `--accent-a40` measured ~1.56:1 (light) / ~1.87:1 (dark) against `--surface-chip`, failing the 3:1 non-text target; fixed by using solid `--accent` for the border instead (~3.2:1 light / ~5.5:1 dark) — see D8.
- Checked: `--text-subdued` remap in the right sidebar — the original 58% mix was raised to 60% (`user.css`), measured against `--surface-panel` at ~4.9:1 (light) / ~6.5:1 (dark), clearing the 4.5:1 AA target.
- Checked: search placeholder (`--search-subtext`) — raised opacity from 0.8 to 0.94. The topbar's resting background is `--surface-input` (52% card mix, the most transparent surface in the theme), so placeholder text has the least surface backing of any text in the file; the extra headroom keeps it clear of the 4.5:1 AA target across the ambient-blur range in both schemes.
- Selected states: color + non-color cue (§5).
- `prefers-reduced-motion` respected for all decorative animation (§4.6).
- Never remove focus visibility; the ring spec in §5 is the minimum.

## 8. Performance Budget

- `backdrop-filter` is the most expensive property in the theme. Budget: ≤ 8 glass surfaces composited in a typical view. New glass surfaces require removing or merging one, or a decision-log entry.
- Noise overlay (`--noise-svg` ::after) only on elevation ≥ 2 surfaces that are large and static (player, cards, panels, menus). Not on chips or inputs.
- `theme.js` MutationObserver work must be debounced (single rAF-coalesced pass) and idempotent.

## 9. Selector Policy

(Carried from `ui-fix-guidelines.md`, normative here.)

- **Prefer, in order:** Spicetify stable roots (`.Root__*`, `.main-*`, `.x-*`) → `data-testid` / `aria-*` / `role` → Encore ids (`data-encore-id`) → hashed classes (last resort).
- Hashed selectors and fragile hacks live only in the **Quarantine zone** (§10 section 5) with a comment stating what they target and why no stable selector exists.
- Spotify's local XPUI bundle (`/Applications/Spotify.app/Contents/Resources/Apps/xpui`) is the reference for discovering stable selectors.

## 10. `user.css` File Structure

Fixed section order; every rule belongs to exactly one section:

```
1. TOKENS        — single :root block (all layers) + single html[data-scheme="dark"] block
2. AMBIENT/BASE  — body gradient, blobs, top-container reset
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
