# Birthday Surprise Website ❤️

A personalized, mobile-first romantic birthday journey built with **Next.js**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**. Continuous story experience — no navbar, soft pink/rose/lavender/cream palette, glassmorphism, and rich animations (with `prefers-reduced-motion` support).

Photos stay **local in the browser** (IndexedDB + object URLs). Nothing is uploaded to a server.

## Quick start

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:4321](http://127.0.0.1:4321)

```bash
npm run build
npm start
```

## Customize the surprise

Edit the single config file:

**[`src/config/birthday.ts`](src/config/birthday.ts)**

| Key | Purpose |
| --- | --- |
| `HER_NAME` | Recipient name |
| `YOUR_NAME` | Your name (love letter signature) |
| `BIRTHDAY_MESSAGE` | Line-by-line message scene |
| `LOVE_LETTER` | Letter body (`{HER_NAME}` / `{YOUR_NAME}` placeholders) |
| `FINAL_MESSAGE` | Night-sky closing line |
| `MUSIC_FILE` | Path under `public/` for background music |
| `ADDITIONAL_PHOTOS` | Gallery extras (`src` + `caption`) |

## Add photos

1. Drop JPG/PNG/WEBP files into `public/photos/`
2. Update `ADDITIONAL_PHOTOS` in `src/config/birthday.ts`

The first gallery card is always the photo she uploads in the browser.

## Add music

1. Place an mp3 at `public/music/birthday-song.mp3` (or change `MUSIC_FILE`)
2. Music starts only after a user tap (no blocked autoplay)
3. If the file is missing, the play button stays disabled gracefully

See `public/music/README.txt`.

## Journey flow

1. Opening → Open Your Surprise  
2. Photo upload + portrait crop (local only)  
3. Magical transition → Happy Birthday reveal  
4. Birthday hero  
5. Typewriter message  
6. Polaroid gallery + lightbox  
7. Love letter envelope  
8. Interactive surprise  
9. Night sky final scene + secret multi-click heart  

## Deploy (Render)

Prefer a **Node Web Service**:

- Build: `npm install && npm run build`
- Start: `npm start` (serves on port `4321`, or set `PORT` / Render’s `$PORT`)

If you need Render’s `$PORT`, start with `next start -p $PORT` or adjust the `start` script.

See also deploy notes if provided under the project docs.

## Stack

- Next.js App Router + React + TypeScript  
- Tailwind CSS 4  
- Framer Motion  
- Lucide icons  
- Google fonts via `next/font` (Cormorant Garamond, Great Vibes, Patrick Hand, Outfit)
