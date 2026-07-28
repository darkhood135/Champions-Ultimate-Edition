# Champion Themes

Drop each Champion's theme audio here, named by the Champion's slug:

- `spider-man.mp3`
- `miles-morales.mp3`
- `batman.mp3`
- ...etc.

The theme player on each Champion sheet references `../audio/champion-themes/<slug>.mp3`.
MP3 is the safe format (universally supported). A ~30–60s seamless loop keeps file
size and repo weight down while playing continuously as the reader browses the sheet.

Until a file is present, the player renders but simply won't play (no error).
