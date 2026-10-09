"use client";

import { motion } from "framer-motion";
import { SafeImage } from "@/components/ui/SafeImage";
import { useEffect } from "react";
import { HER_NAME } from "@/config/birthday";
import { FloatingHearts } from "@/components/effects/FloatingHearts";
import { Particles } from "@/components/effects/Particles";
import { Sparkles } from "@/components/effects/Sparkles";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Props = {
  photoUrl: string;
  onDone: () => void;
};

export function MagicalTransition({ photoUrl, onDone }: Props) {
  const reduced = useReducedMotion();

  useEffect(() => {
    const t = window.setTimeout(onDone, reduced ? 1600 : 4800);
    return () => window.clearTimeout(t);
  }, [onDone, reduced]);

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-gradient-to-b from-[#2a0a16] via-[#4c0519] to-[#1e1035] px-6">
      <Particles count={36} tone="gold" />
      <FloatingHearts count={18} color="text-rose-300/80" />
      <Sparkles count={40} />

      <motion.div
        className="relative z-10 flex flex-col items-center text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="relative aspect-[3/4] w-44 overflow-hidden rounded-2xl border border-white/30 shadow-[0_0_60px_rgba(251,113,133,0.55)] sm:w-56"
          initial={
            reduced
              ? { opacity: 1, scale: 1, filter: "blur(0px)" }
              : { opacity: 0.4, scale: 0.85, filter: "blur(12px)" }
          }
          animate={{ opacity: 1, scale: 1.08, filter: "blur(0px)" }}
          transition={{ duration: reduced ? 0.4 : 2.8, ease: "easeOut" }}
        >
          <SafeImage
            src={photoUrl}
            alt=""
            fill
            className="object-cover"
          />
          <motion.div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-rose-500/30 via-transparent to-white/20"
            animate={
              reduced
                ? undefined
                : { opacity: [0.2, 0.7, 0.3] }
            }
            transition={{ duration: 2.2, repeat: Infinity }}
          />
        </motion.div>

        <motion.h2
          className="mt-10 font-display text-3xl text-white sm:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduced ? 0.2 : 2.2, duration: 1 }}
        >
          Happy Birthday, {HER_NAME} ❤️
        </motion.h2>
      </motion.div>
    </div>
  );
}
