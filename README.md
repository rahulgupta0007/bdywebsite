# Ishika's Birthday Invitation 💗

A responsive, mobile-friendly birthday invite built with Next.js, TypeScript, and CSS. The party venue is revealed only after a guest wins the **Catch the Hearts** challenge.

## Main game: Catch the Hearts

- Tap moving pink hearts for **+1**.
- Catch golden hearts for **+3**.
- Avoid broken hearts — they cost **2 points**.
- Catch five positive hearts in a row for a **+2 streak bonus**.
- Reach **18 points in 20 seconds** to unlock the invitation.

After winning, guests get a centered animated invitation modal and can reopen the invitation from the page. Two bonus games (memory match and birthday quiz) are available only after the main challenge is won.

## Party details

- **Venue:** Meekos Rooftop Cafe & Taverna
- **Date:** Wednesday, 14 October 2026
- **Time:** 4:00 PM

Update the event details in `src/components/BirthdayInvite.tsx` if needed.

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

The repository includes `render.yaml`. Create a Blueprint in Render and connect this repository, or create a Node Web Service manually with:

- **Build command:** `npm install && npm run build`
- **Start command:** `npm start`
- **Runtime:** Node
- **Node version:** 22

The app listens on Render's `PORT` environment variable (fallback port 4321).

## Responsive and accessibility features

- Responsive layout for phones, tablets, and desktops
- Large touch targets and an adaptive game arena
- Floating heart animations and reduced-motion support
- Invitation details remain available after the modal is dismissed
- Google Maps directions and share/copy invitation action
