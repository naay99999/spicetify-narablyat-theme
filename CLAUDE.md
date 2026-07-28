# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A Spicetify theme for Spotify called **narablyat**, built around a "Clean Pop" aesthetic: flat platinum surfaces with a soft violet gradient accent and gentle lavender glows at a few focal points. There is no build system — changes are applied directly via the Spicetify CLI.

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
spicetify config color_scheme suudLorDark   # near-black scheme
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

Known-stable root selectors: `.Root__nav-bar`, `.Root__right-sidebar`, `.Root__main-view`, and the `.lyrics-lyrics-*` classes. The now-playing bar dropped its `.Root__now-playing-bar` class in a recent Spotify build — target it via `[data-testid="now-playing-bar"]` instead. Its internal progress/volume bars similarly lost the `.playback-bar`/`.volume-bar` classes; use `[data-testid="playback-progressbar"]` and `[data-testid="volume-bar"]` as ancestors.

See `docs/ui-fix-guidelines.md` for detailed selector research and per-area fix guidance.

## Architecture

**`user.css`** — All visual styling. Structured in sections (spec §10):
- CSS custom properties at `:root` (accent ramp, gradient/glow tokens, surfaces, shadow scale, radii, transitions, search variables)
- Topbar search (`spice-glass-topbar` — legacy class name) — flat pill with accent focus ring
- Modal search dialog (`spice-glass-dialog` — legacy class name) — solid card with soft float shadow
- Progress/volume bars — gradient playback fill, solid volume, rounded rails
- Now-playing bar — floating solid card with a 1px gradient top hairline and wide glow
- Chips/tabs — flat at rest; selected state carries the gradient + glow

**`theme.js`** — Two IIFEs that run at Spotify startup:
1. **Class injector** — `MutationObserver` watches the DOM and adds `spice-glass-overlay`, `spice-glass-dialog`, `spice-glass-inputWrap`, `spice-glass-topbar` (legacy names from the glass era, kept for stability) to Spotify's dynamically rendered elements.
2. **Scheme stamping** — computes `--spice-main` luminance and sets `data-scheme="light|dark"` on `<html>` so token overrides can branch.

**`color.ini`** — Two color schemes: `suudLorLight` (platinum) and `suudLorDark` (near-black). Variables here map to Spicetify's `--spice-*` CSS variables; the per-scheme solid accents live here.

**`manifest.json`** — Declares the theme name, which files it uses, and available schemes.

## Pop Elevation Pattern

`docs/design-spec.md` is the design system source of truth for tokens, elevation, states, and color — treat numeric values there as canonical. `docs/redesign-plan.md` documents the glass → Clean Pop migration. This section only summarizes; if it ever conflicts with the spec, the spec wins.

Every surface is opaque and quiet — solid fill, hairline border, no `backdrop-filter` anywhere (spec D9). Elevation is a three-level shadow scale (spec §4.3):
- **Flat** — hairline border only: nav bar, right sidebar, resting chips, search pill at rest
- **Lift** — `--shadow-lift` soft neutral shadow: cards, context menus, dropdowns
- **Pop** — accent glow (`--glow-pop`, `--glow-pop-wide`, `--glow-ring`): reserved for the five pop points

**Five pop points** (spec §1.3) are the only places the `--grad-pop` gradient and glows may appear: the primary play button, the floating player bar (top hairline + wide glow), the playback progress fill/handle, selected chips/tabs, and focus rings. The lyrics active-line glow is a sanctioned bonus. Adding a pop point requires a spec decision-log entry.

Hover is removed everywhere except dense list rows (nav, library rows, context-menu items, search-result options), which get a `--row-hover` background tint for pointer tracking in long lists (D1). Everything else — buttons, cards, chips, surfaces — responds to focus, active, selected, checked, and current states only, never hover.

**Accent is functional only** — the Soft Orchid accent (gradient `#7c3aed → #a855f7`, solid `#7c3aed` light / `#a78bfa` dark, glow core `#a78bfa`) is reserved for active/toggled states, playback progress, and the primary play button. Default tertiary controls and icons stay neutral; do not apply accent color, gradient, or glow broadly. Glows always use `--glow-core` — `box-shadow` cannot render a gradient.

## CSS Conventions

- 2-space indentation
- CSS custom properties in `:root` for all design tokens (colors, gradient/glow values, radii, transitions) — no hardcoded repeated values
- Prefer `color-mix()` with `--spice-*` variables for surfaces so both color schemes stay correct from one rule
- Sections separated by short comments matching the existing style (e.g. `/* Topbar Search: clean pill */`)
- Classes added by `theme.js` use the `spice-glass-*` prefix (legacy names from the glass era; kept for stability, per spec D12)
- No broad global rules for bare `button`, `a`, `input`, or `svg`
- Do not add new DOM mutations in `theme.js` unless CSS selectors cannot target the element reliably

## Targeting Spotify's Obfuscated Classes

Spotify uses hashed class names (e.g. `Ckze8wMFNiDXk_f1IqjJ`) that can change after updates. Prefer `data-testid`, `aria-label`, `role`, and Spicetify's stable class patterns (`main-*`, `x-*`) over hashed names. When a hashed name is unavoidable, note it in a comment.

## Manual Testing Checklist

After `spicetify apply`, verify in both `suudLorLight` and `suudLorDark`:
- Search modal (open with Cmd+K) — solid card, float shadow, input pill focus ring
- Topbar inline search — flat pill; focus shows the accent ring + glow, icon turns accent
- Now-playing bar — floating solid card, 1px gradient top hairline, wide glow; inactive icons neutral, active/toggled ones accent
- Progress bar — gradient fill + handle glow; volume bar solid accent; rounded rails
- Play button — gradient fill with glow underneath
- Chips/filter tabs — flat at rest; selected shows gradient + white text + glow
- Sidebar and cards — flat/lift shadows only, border radius
- Lyrics route — flat opaque background, active line accent with soft glow, lyrics readable

## Commit Style

Conventional Commits with component scopes: `fix(glass): ...`, `feat(css): ...`, `refactor(theme): ...`, `docs(readme): ...`. Subjects are imperative.
