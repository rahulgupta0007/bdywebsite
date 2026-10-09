"use client";

import { motion } from "framer-motion";
import { SafeImage } from "@/components/ui/SafeImage";
import { Balloons } from "@/components/effects/Balloons";
import { Confetti } from "@/components/effects/Confetti";
import { FloatingHearts } from "@/components/effects/FloatingHearts";
import { RomanticBg } from "@/components/effects/RomanticBg";
import { Sparkles } from "@/components/effects/Sparkles";
import { GlassButton } from "@/components/ui/GlassButton";

type Props = {
  photoUrl: string;
  onContinue: () => void;
};

export function BirthdayHero({ photoUrl, onContinue }: Props) {
  return (
    <RomanticBg variant="soft">
      <Confetti count={28} />
      <Balloons count={5} />
      <FloatingHearts count={8} />
      <Sparkles count={18} />

      <div className="flex min-h-[100dvh] flex-col items-center justify-center px-6 py-14 text-center">
        <motion.h1
          className="font-display text-3xl text-burgundy sm:text-5xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Happy Birthday, My Love ❤️
        </motion.h1>
        <p className="mt-3 max-w-md text-burgundy/75">Today is all about you.</p>

        <motion.div
          className="relative mt-8 aspect-[3/4] w-52 overflow-hidden rounded-[1.75rem] border-[3px] border-white/70 shadow-[0_0_50px_rgba(244,63,94,0.45)] sm:w-64"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <SafeImage
            src={photoUrl}
            alt="Birthday portrait"
            fill
            className="object-cover"
          />
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-rose-200/50" />
        </motion.div>

        <motion.div
          className="glass-panel mt-8 max-w-sm px-6 py-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <p className="font-script text-2xl text-rose-600">
            Another beautiful year of you ✨
          </p>
        </motion.div>

        <div className="mt-10">
          <GlassButton onClick={onContinue}>Keep going</GlassButton>
        </div>
      </div>
    </RomanticBg>
  );
}
