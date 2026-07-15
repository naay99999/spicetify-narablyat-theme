# Repository Guidelines

## Project Structure & Module Organization

This repository is a Spicetify theme with no build system. Core files live at the root:

- `user.css` contains all visual styling, design tokens, shadow/glow effects, and Spotify selector overrides.
- `theme.js` adds runtime classes to Spotify DOM nodes that static CSS cannot target reliably.
- `color.ini` defines Spicetify color schemes, currently `suudLorLight` and `suudLorDark`.
- `manifest.json` declares theme metadata and included files.
- `docs/design-spec.md` documents the Clean Pop visual system (tokens, shadow scale, pop points, state matrix); consult it before changing UI behavior.
- `docs/superpowers/` stores implementation specs and plans.

There is no dedicated test directory. Validation is manual through Spotify and Spicetify.

## Build, Test, and Development Commands

Use Spicetify directly after edits:

```bash
spicetify apply
spicetify config color_scheme suudLorDark && spicetify apply
spicetify config color_scheme suudLorLight && spicetify apply
spicetify restore backup apply
```

`spicetify apply` reloads the theme. The color-scheme commands test both supported palettes. Use `restore backup apply` when Spotify needs a clean Spicetify reapply.

## Coding Style & Naming Conventions

Use 2-space indentation in CSS and JavaScript. Keep CSS grouped by component or behavior, with short section comments matching the existing style. Prefer CSS custom properties in `:root` for colors, radii, transitions, and shadow/glow tokens instead of hardcoded repeated values.

Class names added by `theme.js` use the `spice-glass-*` prefix (legacy names kept for stability; see spec D12). Prefer stable selectors such as `data-testid`, `aria-label`, `role`, and Spicetify `main-*` or `x-*` classes. Avoid hashed Spotify class names unless unavoidable, and comment why they are needed.

Follow `docs/design-spec.md`: surfaces are flat and opaque with the three-level shadow scale (§4.3) and no `backdrop-filter` (D9), the Neon Orchid accent (gradient + glow) is functional only and limited to the five pop points (§1.3), and hover states are intentionally avoided in favor of focus and active states (list rows are the sole exception, per D1).

## Testing Guidelines

Test changes manually in Spotify after running `spicetify apply`. Check both `suudLorLight` and `suudLorDark`, search modal behavior, topbar search, now-playing bar, context menus, progress/volume controls, and sidebar/card states. Use Spotify DevTools to confirm selectors still match after Spotify updates.

## Commit & Pull Request Guidelines

Recent history uses Conventional Commits, for example `fix(css): ...`, `feat(glass): ...`, `refactor(css): ...`, and `docs(readme): ...`. Keep subjects imperative and scoped to the changed area.

Pull requests should describe the visual or behavior change, list tested color schemes, mention any new fragile selectors, and include screenshots or screen recordings for UI changes.
