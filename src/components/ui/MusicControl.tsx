"use client";

import { Music, Pause, VolumeX } from "lucide-react";
import { motion } from "framer-motion";

type Props = {
  playing: boolean;
  available: boolean;
  onToggle: () => void;
};

export function MusicControl({ playing, available, onToggle }: Props) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      disabled={!available}
      title={
        available
          ? playing
            ? "Pause music"
            : "Play music"
          : "Add an mp3 at public/music/birthday-song.mp3"
      }
      className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-white/25 text-burgundy shadow-lg backdrop-blur-md transition hover:bg-white/40 disabled:cursor-not-allowed disabled:opacity-45"
      whileTap={available ? { scale: 0.92 } : undefined}
      aria-label={playing ? "Pause music" : "Play music"}
    >
      {!available ? (
        <VolumeX className="h-5 w-5" />
      ) : playing ? (
        <Pause className="h-5 w-5" />
      ) : (
        <Music className="h-5 w-5" />
      )}
    </motion.button>
  );
}
