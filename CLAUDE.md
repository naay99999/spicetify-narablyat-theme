# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A Spicetify theme for Spotify called **narablyat**, built around a "Clean Pop" aesthetic: flat platinum surfaces with a soft violet gradient accent and gentle lavender glows at a few focal points. There is no build system — changes are applied directly via the Spicetify CLI.

## Applying Changes

For installing Spicetify, installing the theme on a new machine, or the full edit → apply → verify loop, use the `narablyat-theme` skill (`.claude/skills/narablyat-theme/SKILL.md`).

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

The theme currently targets **Spotify 1.3.6** (Spicetify 2.46.4). That build dropped most legacy class hooks:
- The `.Root__*` classes are gone (`.Root__nav-bar`, `.Root__right-sidebar`, `.Root__now-playing-bar`, …). Use `#main-view`, `[data-testid="right-sidebar"]`, and `[data-testid="now-playing-bar"]` instead. The old `.Root__*` rules stay in `user.css` only as fallbacks for older builds.
- The progress/volume bars lost `.playback-bar`/`.volume-bar`. Use `[data-testid="playback-progressbar"]` and `[data-testid="volume-bar"]` as ancestors.
- Lyrics classes are hashed. The container is matched by its inline vars (`[style*="--lyrics-color-active"]`), and the hashed line classes are listed in the Lyrics Route comment in `user.css`. The `.lyrics-lyrics-*` selectors stay only as fallbacks.
- Several areas only have hashed classes, for example the right sidebar grid item, the home/entity header artwork-color fills, the stuck tracklist column header, and the cinema frame, canvas overlay, and sticky headers in QUARANTINE. Run `grep -n hashed user.css` to list them all. After a Spotify update, check these first.

`docs/ui-fix-guidelines.md` is historical research from before 1.3.6. Its XPUI file notes are still useful, but its "stable selector" list is out of date.

## Architecture

**`user.css`** — All visual styling, in the five sections of spec §10:
1. **TOKENS** — a single `:root` block (accent ramp, gradient/glow tokens, surfaces, shadow scale, radii, transitions, search variables) plus dark-scheme overrides keyed on `html[data-scheme="dark"]`
2. **BASE** — flat ground for the top container
3. **LAYOUT ROOTS** — nav bar, right sidebar, the floating now-playing bar (solid card, 1px gradient top hairline, wide glow), and bottom clearance on `div:has(> #main-view)`
4. **COMPONENTS** — topbar search (`spice-glass-topbar`, a legacy class name), the search modal (selected via `:has([data-testid="search-modal-input"])`), the search dropdown, player controls and the play button, progress/volume bars (gradient playback fill, solid volume, plus the dancing alien gif on the progress bar), cards, list rows, chips/tabs (flat at rest, gradient + glow when selected), context menus, lyrics, and headers (artwork-color fills on the home/entity headers, the sticky action bar, and the stuck column row are flattened to the surface color)
5. **QUARANTINE** — overrides of Spotify-internal custom properties and Encore color sets, including the light-scheme fixes needed because Spotify always renders `.encore-dark-theme`

**`theme.js`** — Two IIFEs that run at Spotify startup:
1. **Class injector** — `MutationObserver` watches the DOM and adds `spice-glass-topbar` (legacy name from the glass era, kept for stability) to the topbar search. The search modal used to get `spice-glass-*` classes too, but React rewrites the dialog's `className` on re-render, so it is now styled purely via `:has()` in `user.css`.
2. **Scheme stamping** — computes `--spice-main` luminance and sets `data-scheme="light|dark"` on `<html>` so token overrides can branch.

**`color.ini`** — Two color schemes: `suudLorLight` (platinum) and `suudLorDark` (near-black). Variables here map to Spicetify's `--spice-*` CSS variables; the per-scheme solid accents live here.

**`manifest.json`** — Declares the theme name, which files it uses, and available schemes.

## Pop Elevation Pattern

`docs/design-spec.md` is the design system source of truth for tokens, elevation, states, and color — treat numeric values there as canonical. This section only summarizes; if it ever conflicts with the spec, the spec wins.

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

Spotify uses hashed class names (e.g. `Ckze8wMFNiDXk_f1IqjJ`) that can change after updates. Prefer IDs (`#main-view`), `data-testid`, `aria-label`, `role`, inline-style attribute matches, and Spicetify's stable class patterns (`main-*`, `x-*`) over hashed names. If you can't avoid a hashed name, put a `/* hashed: <what it targets> — update if … */` comment above the rule, so a grep for `hashed:` lists everything that needs rechecking after a Spotify update.

## Manual Testing Checklist

After `spicetify apply`, verify in both `suudLorLight` and `suudLorDark`:
- Search modal (open with Cmd+K) — solid card, float shadow, input pill focus ring
- Topbar inline search — flat pill; focus shows the accent ring + glow, icon turns accent
- Now-playing bar — floating solid card, 1px gradient top hairline, wide glow; inactive icons neutral, active/toggled ones accent
- Progress bar — gradient fill + handle glow; volume bar solid accent; rounded rails
- Play button — gradient fill with glow underneath
- Chips/filter tabs — flat at rest; selected shows gradient + white text + glow
- Sidebar and cards — flat/lift shadows only, border radius
- Home, playlist, and album headers — no artwork-color fill; the sticky action bar and the stuck tracklist column row stay flat while scrolling
- Lyrics route — flat opaque background, active line in text color (white on dark) with a text-shadow glow that follows the line length, lyrics readable

## Commit Style

Conventional Commits with component scopes: `fix(css): ...`, `feat(css): ...`, `fix(theme): ...`, `refactor(theme): ...`, `docs(readme): ...`. Subjects are imperative. The `glass` scope belongs to the retired glass era; don't use it for new commits.
