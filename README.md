# Hacktoberfest Hack Day Lahore 2026 — Countdown

Full-screen, projector-first (1920×1080) countdown for **Hacktoberfest Hack Day Lahore 2026**,
organized by **Cloud Native Security Pakistan** with hackathon partner **Major League Hacking (MLH)**.
Tagline: **AI FOR EVERYONE** · October 24, 2026 • Lahore, Pakistan.

Built with Vite + React + TypeScript + Tailwind CSS + Motion + lucide-react. No backend — timer state
and organizer settings live in `localStorage`.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173/hacktoberfest-lahore-2026-countdown/
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build
```

## Deploy (GitHub Pages)

1. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Push to `main`. `.github/workflows/deploy.yml` builds and deploys automatically
   (you can also run it manually from the **Actions** tab).
3. Open `https://<user>.github.io/hacktoberfest-lahore-2026-countdown/`.

The Vite `base` is set to `/hacktoberfest-lahore-2026-countdown/` in `vite.config.ts` — change it if
you rename the repo.

## Logos

No logos are bundled. Drop the **official, authorized** files into `public/logos/`:

| File                | Organization                   |
| ------------------- | ------------------------------ |
| `hacktoberfest.svg` | Hacktoberfest                  |
| `cnsp.svg`          | Cloud Native Security Pakistan |
| `mlh.svg`           | Major League Hacking (MLH)     |

If a file is missing the app shows a plain-text wordmark with the organization name instead.

## Using it at the event

1. Open the site on the projector laptop, press **F** for fullscreen.
2. Press **O** (or move the mouse and click the faint gear bottom-right) to open the organizer panel.
3. Set the duration (default 6h) or an exact end time, then press **Space** to start.

The timer is timestamp-based, so refreshing, closing the tab, or the laptop sleeping won't lose time.
Cursor and gear icon hide automatically when the mouse is idle.

### Keyboard shortcuts

| Key   | Action                               |
| ----- | ------------------------------------ |
| Space | Start / pause / resume               |
| F     | Toggle fullscreen                    |
| O     | Toggle organizer panel               |
| Esc   | Close panel / test celebration       |
| D     | Demo screen (press again to go back) |
| B     | Break screen (press again to go back)|
| H     | Back to hacking (auto) mode          |
| R     | Reset timer (asks for confirmation)  |

Shortcuts are ignored while typing in inputs.

### Behaviour

- **Warnings** at 30, 15, 10 and 5 minutes: a soft pulse + toast, and a chime if sound is on
  (audio unlocks after the first click/keypress).
- **≤ 30 min:** "FINAL PUSH, LAHORE." with warm orange accents. **≤ 5 min:** "ONE LAST COMMIT."
- **0:** "THAT'S A WRAP, LAHORE!" celebration with confetti (in *Auto* mode).
- **Modes:** Auto · Hacking (always countdown) · Demo · Break (configurable return time + message) · Complete.
- **Status pill** is derived automatically, or can be overridden in the panel.
- Organizer panel also edits the rotating messages (one per line, wrap text in backticks for code
  style), challenge ticker, attendee hub URL (shows a QR code; hidden when empty), event schedule,
  sound/animation toggles, test celebration and restore defaults.
- `prefers-reduced-motion` and the *Animations off* toggle disable background motion and confetti.

## Structure

```
src/
  components/  Header, Countdown, StatusPill, MessageRotator, Ticker, Background, LahoreMotifs,
               Logo, OrganizerPanel, Celebration, DemoScreen, BreakScreen
  hooks/       useTimer, usePersistentState, useIdle, useKeyboard
  lib/         defaults (copy, palette, settings), time, sound
```

Brand colors live in the `@theme` block in `src/index.css` — adjust them to match the official
[Hacktoberfest brand kit](https://hacktoberfest.com/brand) if needed.
