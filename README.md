# narablyat Theme

A Spotify theme for Spicetify with a Clean Pop design — flat platinum surfaces, rounded corners, and a vivid purple-to-pink gradient accent with neon glows at a few focal points. Ships two color schemes: `suudLorLight` (soft platinum) and `suudLorDark` (near-black).

## Install

You need [Spicetify](https://spicetify.app/) installed first.

1. Clone this theme into your Spicetify themes folder:
   ```bash
   cd ~/.config/spicetify/Themes
   git clone <repository-url> narablyat
   ```

2. Turn it on:
   ```bash
   spicetify config current_theme narablyat
   spicetify config color_scheme suudLorDark
   spicetify apply
   ```

3. Open Spotify — the theme loads automatically.

## Use

Switch color scheme:
```bash
spicetify config color_scheme suudLorLight && spicetify apply   # frost white
spicetify config color_scheme suudLorDark && spicetify apply    # dark neutral
```

After editing `user.css`, `theme.js`, or `color.ini`:
```bash
spicetify apply
```
If that doesn't pick up the change:
```bash
spicetify restore backup apply
```
