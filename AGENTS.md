# Repository Guidelines

## Project Structure & Module Organization

This repository is a Spicetify theme with no build system. Core files live at the root:

- `user.css` contains all visual styling, in the five sections of spec §10: TOKENS, BASE, LAYOUT ROOTS, COMPONENTS, QUARANTINE.
- `theme.js` adds the `spice-glass-topbar` hook class to the topbar search and stamps `data-scheme="light|dark"` on `<html>` from the `--spice-main` luminance.
- `color.ini` defines Spicetify color schemes, currently `suudLorLight` and `suudLorDark`.
- `manifest.json` declares theme metadata and included files.
- `docs/design-spec.md` is the source of truth for the Clean Pop visual system (tokens, shadow scale, pop points, state matrix, decision log). Read it before changing UI behavior.
- `docs/ui-fix-guidelines.md` holds historical XPUI research. Its source-file notes are still useful, but its selector-stability list predates Spotify 1.3.6.
- `docs/screenshots/` holds the README screenshots.
- `.claude/skills/narablyat-theme/SKILL.md` is the step-by-step workflow for installing Spicetify, installing and applying this theme, and the edit → apply → verify loop. Per-OS install details are in `references/install.md` next to it. Follow it whenever a user asks to set up, apply, or modify the theme, even if your agent doesn't load skills automatically.

There is no dedicated test directory. Validation is manual through Spotify and Spicetify.

## Build, Test, and Development Commands

Use Spicetify directly after edits:

```bash
spicetify apply
spicetify config color_scheme suudLorDark && spicetify apply
spicetify config color_scheme suudLorLight && spicetify apply
spicetify restore backup apply
```

`spicetify apply` reloads the theme. The two color-scheme commands let you test both palettes. Run `restore backup apply` when Spotify needs a clean Spicetify reapply.

## Coding Style & Naming Conventions

Use 2-space indentation in CSS and JavaScript. Keep CSS inside its spec §10 section, grouped by component, with short section comments that match the existing style. Put colors, radii, transitions, and shadow/glow tokens in `:root` as CSS custom properties rather than repeating hardcoded values.

Class names added by `theme.js` use the `spice-glass-*` prefix. These are legacy names kept for stability (spec D12). Don't add new DOM mutations in `theme.js` when a CSS selector can reach the element.

The theme targets Spotify 1.3.6, which dropped the `.Root__*` classes and hashed the lyrics classes. Prefer IDs (`#main-view`), `data-testid`, `aria-label`, `role`, and Spicetify `main-*` or `x-*` classes. If you can't avoid a hashed Spotify class, add a `/* hashed: … */` comment saying what it targets, so these rules can be found again after a Spotify update.

Follow `docs/design-spec.md`:
- Surfaces are flat and opaque. Use the three-level shadow scale (§4.3) and no `backdrop-filter` (D9).
- The Soft Orchid accent (gradient and glow) is functional only, limited to the five pop points (§1.3).
- Avoid hover states; use focus and active states instead. Dense list rows are the only exception (D1).

## Testing Guidelines

Test changes manually in Spotify after running `spicetify apply`. Check both `suudLorLight` and `suudLorDark`, and cover:
- the search modal (Cmd+K) and topbar search
- the now-playing bar and progress/volume controls
- chips, context menus, and sidebar/card states
- the lyrics route
- home/playlist headers while scrolling

Use Spotify DevTools to confirm that the `hashed:` selectors still match after a Spotify update.

## Commit & Pull Request Guidelines

Use Conventional Commits with component scopes, for example `fix(css): ...`, `fix(theme): ...`, `refactor(css): ...`, and `docs(readme): ...`. Keep subjects imperative. The `glass` scope is from the retired glass era; don't use it for new work.

Pull requests should:
- describe the visual or behavior change
- list the color schemes and the Spotify version tested
- point out any new hashed selectors
- include screenshots or screen recordings for UI changes
