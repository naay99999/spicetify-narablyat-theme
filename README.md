# narablyat Theme

A Spotify theme for Spicetify with a Clean Pop design — flat platinum surfaces, rounded corners, and a soft violet gradient accent with gentle glows at a few focal points. Ships two color schemes: `suudLorLight` (soft platinum) and `suudLorDark` (near-black).

## Screenshots

| `suudLorLight` | `suudLorDark` |
| --- | --- |
| ![Home, light](docs/screenshots/light-home.webp) | ![Home, dark](docs/screenshots/dark-home.webp) |
| ![Playlist, light](docs/screenshots/light-album.webp) | ![Playlist, dark](docs/screenshots/dark-album.webp) |
| ![Lyrics, light](docs/screenshots/light-lyrics.webp) | ![Lyrics, dark](docs/screenshots/dark-lyrics.webp) |
| ![Search (Cmd+K), light](docs/screenshots/light-search.webp) | ![Search (Cmd+K), dark](docs/screenshots/dark-search.webp) |

Home with the Now Playing view, a playlist page, lyrics, and the Cmd+K search modal. Captured on Spotify 1.3.6 with Spicetify 2.46.4.

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
