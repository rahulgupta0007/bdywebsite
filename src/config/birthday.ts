/**
 * ═══════════════════════════════════════════════════════════
 *  Birthday Surprise — personalization config
 *  Edit these values, then rebuild / refresh.
 * ═══════════════════════════════════════════════════════════
 */

export const HER_NAME = "Her Name";
export const YOUR_NAME = "Your Name";

/** Shown line-by-line / typewriter in the message scene */
export const BIRTHDAY_MESSAGE = [
  "On this day, the world feels softer…",
  "because you are in it.",
  "Thank you for every laugh, every quiet moment,",
  "every way you make ordinary days feel like magic.",
  "I hope this little surprise makes you smile",
  "the same way you make me smile — always.",
];

/** Love letter body — use {HER_NAME} and {YOUR_NAME} placeholders */
export const LOVE_LETTER = `My dearest {HER_NAME},

If I could bottle every feeling I have for you, it still wouldn't be enough to hold how much you mean to me.

You are my calm, my spark, my favorite hello and my hardest goodbye. Today is yours — but every day with you feels like a gift I never want to unwrap too quickly.

Happy birthday, my love.
Forever yours,
{YOUR_NAME}`;

export const FINAL_MESSAGE =
  "Under this sky, and every sky after — my heart chooses you.";

/** Place an mp3 at public/music/birthday-song.mp3 */
export const MUSIC_FILE = "/music/birthday-song.mp3";

/**
 * Extra gallery photos (served from /public).
 * Replace the SVGs in public/photos/ with your own JPG/PNG/WEBP
 * and update the paths here.
 */
export const ADDITIONAL_PHOTOS: { src: string; caption: string }[] = [
  { src: "/photos/memory-1.svg", caption: "Our little world" },
  { src: "/photos/memory-2.svg", caption: "A soft memory" },
  { src: "/photos/memory-3.svg", caption: "Forever us" },
];

export type JourneyStep =
  | "opening"
  | "photo-upload"
  | "photo-ready"
  | "transition"
  | "hero"
  | "message"
  | "gallery"
  | "letter"
  | "surprise"
  | "final";
