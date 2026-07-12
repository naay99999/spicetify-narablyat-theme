# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A Spicetify theme for Spotify called **narablyat**, built around a "Liquid Glass" aesthetic with soft platinum colors. There is no build system — changes are applied directly via the Spicetify CLI.

## Applying Changes

After editing any file, apply to Spotify:

```bash
spicetify apply
```

If that doesn't work:

```bash
spicetify restore backup apply
```

To switch color schemes:

```bash
spicetify config color_scheme suudLorDark   # dark green-tinted scheme
spicetify config color_scheme suudLorLight  # soft platinum scheme
spicetify apply
```

## Finding Spotify Class Names

Open Spotify DevTools (Cmd+Opt+I on Mac, Ctrl+Shift+I on Windows) to inspect elements and find the class names to target in `user.css`.

Spotify's XPUI source is bundled locally and can be read directly to find selectors and understand component behavior:

```text
/Applications/Spotify.app/Contents/Resources/Apps/xpui
```

Key files: `xpui-snapshot.css` (root layout, sidebars, player bar, Encore base styles), `dwp-now-playing-bar.css` (player bar controls, progress, volume), `xpui-modules.js` (lyrics component implementation — `xpui-routes-lyrics.js` is only a thin wrapper).

Known-stable root selectors: `.Root__now-playing-bar`, `.Root__nav-bar`, `.Root__right-sidebar`, `.Root__main-view`, and the `.lyrics-lyrics-*` classes.

See `docs/ui-fix-guidelines.md` for detailed selector research and per-area fix guidance.

## Architecture

**`user.css`** — All visual styling. Structured in sections:
- CSS custom properties at `:root` (colors, radii, transitions, glass variables, search variables)
- Topbar search (`spice-glass-topbar`) — pill-shaped glass container
- Modal search dialog (`spice-glass-dialog`) — frosted glass card with animated accent blob
- Progress/volume bars — accent-colored with rounded rails
- Now-playing bar — blurred backdrop
- Ambient background blobs (`spice-ambient-blob-1/2`) — fixed positioned blurs behind all content

**`theme.js`** — Two IIFEs that run at Spotify startup:
1. **Glass class injector** — `MutationObserver` watches the DOM and adds `spice-glass-overlay`, `spice-glass-dialog`, `spice-glass-inputWrap`, `spice-glass-topbar` to Spotify's dynamically rendered elements.
2. **Ambient blob injector** — One-time, idempotent injection of `<div class="spice-ambient-blob-1">` and `<div class="spice-ambient-blob-2">` into `<body>`. These provide the background layer that glass surfaces blur against.

**`color.ini`** — Two color schemes: `suudLorLight` (platinum) and `suudLorDark` (deep green). Variables here map to Spicetify's `--spice-*` CSS variables.

**`manifest.json`** — Declares the theme name, which files it uses, and available schemes.

## Glass Effect Pattern

`docs/design-spec.md` is the design system source of truth for tokens, elevation, states, and color — treat numeric values there as canonical. `docs/refactor-plan.md` documents the refactor that implemented it. This section only summarizes; if it ever conflicts with the spec, the spec wins.

The Liquid Glass effect requires three layers working together:
1. `backdrop-filter: blur(Xpx) saturate(Y%)` on the element
2. Semi-transparent `background: rgba(...)` so the blur shows through
3. `::before` / `::after` pseudo-elements for the highlight streak and accent blob

**Blur depth hierarchy** — five elevation levels (spec §4.4), each a `--glass-blur-N` / `--glass-sat-N` token pair, never a raw px value:
- Level 0 — Ambient background + blobs: no backdrop-filter
- Level 1 — Nav bar, filter chips, category tabs: `blur(12px)` / `saturate(140%)`
- Level 2 — Cards, right sidebar, lyrics glass: `blur(16px)` / `saturate(160%)`
- Level 3 — Context menus, dropdowns: `blur(20px)` / `saturate(170%)`
- Level 4 — Topbar search, search modal: `blur(24px)` / `saturate(180%)`
- Level 5 — Floating player bar (signature element): `blur(30px)` / `saturate(200%)`

Hover is removed everywhere except dense list rows (nav, library rows, context-menu items, search-result options), which get a `--row-hover` background tint for pointer tracking in long lists (D1). Everything else — buttons, cards, chips, surfaces — responds to focus, active, selected, checked, and current states only, never hover.

**Accent is functional only** — the forest-green accent (`#16a34a`, `--color-accent`) is reserved for active/toggled states, playback progress, and the primary play button. Default tertiary controls and icons stay neutral; do not apply accent color broadly.

## CSS Conventions

- 2-space indentation
- CSS custom properties in `:root` for all design tokens (colors, radii, transitions, glass values) — no hardcoded repeated values
- Prefer `color-mix()` with `--spice-*` variables for surfaces so both color schemes stay correct from one rule
- Sections separated by short comments matching the existing style (e.g. `/* Topbar Search: Liquid Glass pill */`)
- Classes added by `theme.js` use the `spice-glass-*` prefix; ambient background elements use `spice-ambient-blob-*`
- No broad global rules for bare `button`, `a`, `input`, or `svg`
- Do not add new DOM mutations in `theme.js` unless CSS selectors cannot target the element reliably

## Targeting Spotify's Obfuscated Classes

Spotify uses hashed class names (e.g. `Ckze8wMFNiDXk_f1IqjJ`) that can change after updates. Prefer `data-testid`, `aria-label`, `role`, and Spicetify's stable class patterns (`main-*`, `x-*`) over hashed names. When a hashed name is unavoidable, note it in a comment.

## Manual Testing Checklist

After `spicetify apply`, verify in both `suudLorLight` and `suudLorDark`:
- Search modal (open with Cmd+K) — glass card, animated accent blob, input wrap
- Topbar inline search — pill shape, focus ring, icon color change
- Now-playing bar — blur and controls; inactive icons neutral, active/toggled ones accent
- Progress and volume bars — accent color, rounded rails
- Sidebar and cards — blur depth, border radius
- Context menus and filter chips — glass treatment
- Lyrics route — background not an opaque color block, lyrics readable

## Commit Style

Conventional Commits with component scopes: `fix(glass): ...`, `feat(css): ...`, `refactor(theme): ...`, `docs(readme): ...`. Subjects are imperative.
