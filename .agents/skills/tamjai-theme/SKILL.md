---
name: tamjai-theme
description: Install Spicetify and the tamjai theme, and modify the theme (user.css, theme.js, color.ini) with a safe edit → apply → verify loop. Use when the user wants to set up Spicetify, install/enable/switch this theme or its color schemes, fix theme breakage after a Spotify update, or change how any part of Spotify looks under this theme.
---

# tamjai theme: install & modify

The repo is the theme folder itself. There is no build step: Spicetify reads `user.css`, `theme.js` and `color.ini` directly from `<userdata>/Themes/tamjai`.

Before changing anything visual, read `CLAUDE.md` (architecture, selectors, conventions) and `docs/design-spec.md` (canonical tokens and rules).

## 0. Check what's already there

Run these read-only checks first. They are safe on any machine.

```bash
spicetify -v                     # CLI installed? (2.46.4 is the version this theme is tested on)
spicetify path userdata          # where Themes/ lives
spicetify config current_theme   # read ONE field
spicetify config color_scheme
ls -la "$(spicetify path userdata)/Themes"
```

**Gotcha:** `spicetify config <a> <b>` **sets** field `a` to value `b`. It is not a read of two fields. Read fields one at a time, or run bare `spicetify config` to print everything.

Then jump to the first step that isn't done.

## 1. Install Spicetify

Installing software runs a remote script or a package manager, so confirm with the user before running it. For per-OS commands (Linux permissions, Flatpak, Scoop, PATH fixes) see [references/install.md](references/install.md). The short version:

- macOS: `brew install spicetify-cli`, then `spicetify config spotify_path "/Applications/Spotify.app/Contents/Resources"`
- Linux/macOS (script): `curl -fsSL https://raw.githubusercontent.com/spicetify/cli/main/install.sh | sh`
- Windows (PowerShell): `iwr -useb https://raw.githubusercontent.com/spicetify/cli/main/install.ps1 | iex`

Spotify must already be installed, and must have been opened and logged in for at least 60 seconds so it has generated its files. Then run:

```bash
spicetify backup apply
```

## 2. Install the theme

The folder name must be `tamjai`, because `current_theme` matches the folder name.

**For development (recommended, if the repo is already checked out):** symlink the checkout so edits apply without copying.

```bash
ln -s "$(pwd)" "$(spicetify path userdata)/Themes/tamjai"          # macOS/Linux, run from repo root
```
```powershell
# Windows: a junction needs no admin rights
cmd /c mklink /J "$env:APPDATA\spicetify\Themes\tamjai" "$PWD"
```

**For using the theme only:** clone straight into the Themes folder.

```bash
git clone https://github.com/naay99999/spicetify-tamjai-theme.git "$(spicetify path userdata)/Themes/tamjai"
```

Look at the target first. If `Themes/tamjai` already exists, check whether it is already a link to this repo before replacing anything.

Enable it:

```bash
spicetify config current_theme tamjai color_scheme suudLorDark
spicetify config inject_css 1 replace_colors 1 inject_theme_js 1   # theme.js needs inject_theme_js
spicetify apply
```

## 3. Modify the theme

### Find the selector
- Turn on DevTools with `spicetify enable-devtools`. In Spotify, press Cmd+Opt+I (macOS) or Ctrl+Shift+I.
- Read Spotify's own source: `<spotify_path>/Apps/xpui` (on macOS: `/Applications/Spotify.app/Contents/Resources/Apps/xpui`). Grep `xpui-snapshot.css`, `dwp-now-playing-bar.css` and `xpui-modules.js`.
- Selector priority: IDs/`data-testid`/`aria-*`/`role` → `main-*`/`x-*` → hashed classes. A hashed class needs a `/* hashed: <what it targets> — update if … */` comment.

### Edit by the rules (details in `CLAUDE.md`)
- Put each rule in the right `user.css` section: TOKENS / BASE / LAYOUT ROOTS / COMPONENTS / QUARANTINE.
- New colors, radii and shadows become `:root` tokens. Build surfaces with `color-mix()` over `--spice-*` so both schemes work from one rule.
- Never use `backdrop-filter`. Gradients and glows only appear at the five pop points. No hover effects, except on dense list rows.
- Prefer CSS over new DOM mutations in `theme.js`.
- Scheme-specific colors go in `color.ini` (`[suudLorLight]` / `[suudLorDark]`). Light/dark token branches use `html[data-scheme="dark"]`.

### Apply and iterate
```bash
spicetify watch -s        # live-reload theme files while editing (Ctrl+C to stop)
spicetify refresh         # one-shot reload of theme CSS/JS/colors
spicetify apply           # full apply; needed after config changes
spicetify restore backup apply   # if Spotify looks broken or unchanged
```

### Verify
Check both schemes:

```bash
spicetify config color_scheme suudLorLight && spicetify apply
spicetify config color_scheme suudLorDark && spicetify apply
```

Then walk the **Manual Testing Checklist** in `CLAUDE.md`. If you can't see Spotify yourself, ask the user to check it, and say plainly that the change is unverified.

## 4. After a Spotify update

1. `spicetify backup apply`. If that fails, run `spicetify update`, then `spicetify restore backup apply`.
2. If parts of the theme stopped working, run `grep -n hashed user.css` and recheck each of those selectors in DevTools or xpui first.
3. Record the new tested Spotify version in the README screenshot caption and in the `CLAUDE.md` selector notes.

## Commit

Use Conventional Commits with component scopes, e.g. `fix(css): …`, `fix(theme): …`, `docs(readme): …`, with an imperative subject. Commit only when the user asks.
