"use client";

import { motion } from "framer-motion";
import { RomanticBg } from "@/components/effects/RomanticBg";
import { GlassButton } from "@/components/ui/GlassButton";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Props = { onOpen: () => void };

export function OpeningStep({ onOpen }: Props) {
  const reduced = useReducedMotion();

  return (
    <RomanticBg variant="soft">
      <div className="flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center">
        <motion.p
          className="mb-4 font-script text-3xl text-rose-500/90 sm:text-4xl"
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1 }}
        >
          A little magic awaits
        </motion.p>
        <motion.h1
          className="max-w-xl font-display text-3xl leading-tight text-burgundy sm:text-5xl"
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.25 }}
        >
          Someone made something special for you…
        </motion.h1>
        <motion.div
          className="mt-10"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <GlassButton onClick={onOpen}>Open Your Surprise ❤️</GlassButton>
        </motion.div>
      </div>
    </RomanticBg>
  );
}
