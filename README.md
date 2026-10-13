# Ishika's Birthday Invitation 💗

A responsive birthday invitation for Ishika, built with Next.js, TypeScript, and CSS. Guests match three pairs in a memory game to reveal the party venue and time.

## Party details
- **Venue:** Meekos Rooftop Cafe & Taverna
- **Date:** Wednesday, 14 October 2026
- **Time:** 4:00 PM

Update the copy in `src/components/BirthdayInvite.tsx` if the event details change.

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
- Shuffled 3-pair memory matching game
- Live move and pair counters, restart button, and surprise reveal
- Google Maps directions and share/copy invitation action
