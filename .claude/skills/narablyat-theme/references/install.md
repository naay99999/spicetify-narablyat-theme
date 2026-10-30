# Spicetify install: per-OS details

Source: https://spicetify.app/docs/getting-started (checked 2026-10-30, Spicetify 2.46.4).

## macOS

```bash
brew install spicetify-cli
spicetify config spotify_path "/Applications/Spotify.app/Contents/Resources"
# or
curl -fsSL https://raw.githubusercontent.com/spicetify/cli/main/install.sh | sh
```

## Windows (PowerShell, not as admin)

Pick one:

```powershell
iwr -useb https://raw.githubusercontent.com/spicetify/cli/main/install.ps1 | iex
winget install Spicetify.Spicetify
scoop install spicetify-cli
choco install spicetify-cli
```

If Spotify was installed with Scoop:

```powershell
scoop prefix spotify
spicetify config spotify_path "C:\Users\<username>\scoop\apps\spotify\current"
```

The Themes folder is `%APPDATA%\spicetify\Themes`.

## Linux

Pick one:

```bash
curl -fsSL https://raw.githubusercontent.com/spicetify/cli/main/install.sh | sh
brew install spicetify-cli
yay -S spicetify-cli
```

If `spicetify` isn't found, add it to PATH. Run `echo $SHELL` first to see which shell you use.

```bash
echo 'export PATH=$PATH:~/.spicetify' >> ~/.zshrc && source ~/.zshrc    # zsh
echo 'export PATH=$PATH:~/.spicetify' >> ~/.bashrc && source ~/.bashrc  # bash
fish_add_path ~/.spicetify                                              # fish
```

Spotify's files must be writable. Which commands you need depends on how Spotify was installed:

- **AUR:** `sudo chmod a+wr /opt/spotify && sudo chmod a+wr /opt/spotify/Apps -R`
- **APT:** `sudo chmod a+wr /usr/share/spotify && sudo chmod a+wr /usr/share/spotify/Apps -R`
- **Flatpak:** find the install location with `flatpak --installations`. Use absolute paths, not `~`.
  ```bash
  spicetify config spotify_path "/var/lib/flatpak/app/com.spotify.Client/x86_64/stable/active/files/extra/share/spotify"
  spicetify config prefs_path /home/<username>/.var/app/com.spotify.Client/config/spotify/prefs
  sudo chmod a+wr /var/lib/flatpak/app/com.spotify.Client/x86_64/stable/active/files/extra/share/spotify
  sudo chmod a+wr -R /var/lib/flatpak/app/com.spotify.Client/x86_64/stable/active/files/extra/share/spotify/Apps
  ```
  The prefs file is either `~/.config/spotify/prefs` or `~/.var/app/com.spotify.Client/config/spotify/prefs`. Check which one exists.
- **spotify-launcher (Arch):** `spicetify config spotify_path "/home/<username>/.local/share/spotify-launcher/install/usr/share/spotify"`. Use the full path; `$HOME` isn't expanded in config.
- **Snap:** Spicetify can't modify Snap apps. Run `snap remove spotify`, install the APT version, then apply the APT permissions above.

The Themes folder is `~/.config/spicetify/Themes`. Confirm it with `spicetify path userdata`.

## Optional: Marketplace

```bash
curl -fsSL https://raw.githubusercontent.com/spicetify/marketplace/main/resources/install.sh | sh    # macOS/Linux
```
```powershell
iwr -useb https://raw.githubusercontent.com/spicetify/marketplace/main/resources/install.ps1 | iex   # Windows
```

## First run and updates

- Open Spotify and log in for at least 60 seconds before running Spicetify the first time.
- Run `spicetify backup apply` for the first setup, and again after every Spotify update.
- If that doesn't work, run `spicetify update`, then `spicetify restore backup apply`.
- If there is no new Spicetify release yet, support for the new Spotify version may still be in progress. To stop Spotify from updating itself, run `spicetify spotify-updates block`.
