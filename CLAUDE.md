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

## Architecture

**`user.css`** — All visual styling. Structured in sections:
- CSS custom properties at `:root` (colors, radii, transitions, glass variables)
- Topbar search (`spice-glass-topbar`) — pill-shaped glass container
- Modal search dialog (`spice-glass-dialog`) — frosted glass card with animated blob
- Progress/volume bars — accent-colored with rounded rails
- Now-playing bar — blurred backdrop

**`theme.js`** — Runtime DOM patching via `MutationObserver`. Adds CSS classes (`spice-glass-overlay`, `spice-glass-dialog`, `spice-glass-inputWrap`, `spice-glass-topbar`) to Spotify's dynamically rendered elements that can't be targeted by static selectors alone.

**`color.ini`** — Two color schemes: `suudLorLight` (platinum) and `suudLorDark` (deep green). Variables here map to Spicetify's `--spice-*` CSS variables.

**`manifest.json`** — Declares the theme name, which files it uses, and available schemes.

## Glass Effect Pattern

The Liquid Glass effect requires three layers working together:
1. `backdrop-filter: blur(Xpx) saturate(120%)` on the element
2. Semi-transparent `background: rgba(...)` so the blur shows through
3. `::before` / `::after` pseudo-elements for the highlight streak and accent blob

Hover states are intentionally removed throughout — the design uses focus and active states only.

## Targeting Spotify's Obfuscated Classes

Spotify uses hashed class names (e.g. `Ckze8wMFNiDXk_f1IqjJ`) that can change after updates. Prefer `data-testid`, `aria-label`, `role`, and Spicetify's stable class patterns (`main-*`, `x-*`) over hashed names. When a hashed name is unavoidable, note it in a comment.
