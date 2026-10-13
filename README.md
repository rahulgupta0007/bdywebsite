# Ishika's Birthday Invitation 💗

A responsive birthday invitation for Ishika, built with Next.js, TypeScript, and CSS. Guests unlock the venue by completing a memory-match game, then can enjoy two bonus mini-games.

## Party details
- **Venue:** Meekos Rooftop Cafe & Taverna
- **Date:** Wednesday, 14 October 2026
- **Time:** 4:00 PM

Update the invitation copy in `src/components/BirthdayInvite.tsx` if any event details change.

## Games
1. **Memory match:** match three pairs; completing the game immediately opens the animated invitation modal.
2. **Catch the hearts:** tap the moving heart to catch ten within ten seconds.
3. **Birthday bestie quiz:** answer three lighthearted multiple-choice questions to get your score.

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:4321.

## Build and test
```bash
npm run typecheck
npm run build
npm start
```

## Deploy on Render
This repository includes `render.yaml`. Create a new Blueprint in Render and connect this repository, or create a Node Web Service manually with:
- **Build command:** `npm install && npm run build`
- **Start command:** `npm start`
- **Runtime:** Node
- **Node version:** 22

The app listens on Render's `PORT` environment variable (fallback port 4321).

## Features
- Responsive layout for phones, tablets, and desktop
- Floating heart animations and reduced-motion support
- Centred animated party invitation that opens immediately after the main game
- Venue, date/time, Google Maps directions, and share/copy invitation action
- Two optional bonus games after the reveal
