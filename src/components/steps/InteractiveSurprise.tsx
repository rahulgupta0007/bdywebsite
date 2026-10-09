"use client";

import { AnimatePresence, motion } from "framer-motion";
import { SafeImage } from "@/components/ui/SafeImage";
import { useEffect, useState } from "react";
import { Confetti } from "@/components/effects/Confetti";
import { FloatingHearts } from "@/components/effects/FloatingHearts";
import { GlassButton } from "@/components/ui/GlassButton";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Props = {
  photoUrl: string;
  onContinue: () => void;
};

type Phase = "prompt" | "dark" | "reveal";

export function InteractiveSurprise({ photoUrl, onContinue }: Props) {
  const [phase, setPhase] = useState<Phase>("prompt");
  const reduced = useReducedMotion();

  useEffect(() => {
    if (phase !== "dark") return;
    const t = window.setTimeout(() => setPhase("reveal"), reduced ? 600 : 1800);
    return () => window.clearTimeout(t);
  }, [phase, reduced]);

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-gradient-to-b from-[#1a0a14] to-[#0b0612] px-6 py-14 text-center">
      <AnimatePresence mode="wait">
        {phase === "prompt" && (
          <motion.div
            key="prompt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="z-10"
          >
            <h2 className="font-display text-3xl text-white sm:text-4xl">
              Wait… there&apos;s one last surprise 👀
            </h2>
            <div className="mt-10">
              <GlassButton onClick={() => setPhase("dark")}>Show Me ❤️</GlassButton>
            </div>
          </motion.div>
        )}

        {phase === "dark" && (
          <motion.div
            key="dark"
            className="absolute inset-0 z-10 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <FloatingHearts count={20} color="text-rose-400" />
          </motion.div>
        )}

        {phase === "reveal" && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 flex flex-col items-center"
          >
            <Confetti active count={48} />
            <FloatingHearts count={14} color="text-rose-300" />
            <div className="relative h-52 w-52 overflow-hidden rounded-full border-4 border-rose-300/80 shadow-[0_0_50px_rgba(251,113,133,0.6)] sm:h-64 sm:w-64">
              <SafeImage
                src={photoUrl}
                alt=""
                fill
                className="object-cover"
              />
            </div>
            <h3 className="mt-8 font-display text-2xl text-white sm:text-4xl">
              You&apos;re my favorite person. ❤️
            </h3>
            <div className="mt-10">
              <GlassButton onClick={onContinue}>To the stars</GlassButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
