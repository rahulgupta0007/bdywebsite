"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FINAL_MESSAGE } from "@/config/birthday";
import { FloatingHearts } from "@/components/effects/FloatingHearts";
import { Particles } from "@/components/effects/Particles";
import { Sparkles } from "@/components/effects/Sparkles";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function FinalScene() {
  const [clicks, setClicks] = useState(0);
  const [secret, setSecret] = useState(false);
  const reduced = useReducedMotion();

  const onSecretClick = () => {
    const next = clicks + 1;
    setClicks(next);
    if (next >= 5) setSecret(true);
  };

  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#070b1c] via-[#14102b] to-[#1a0b22] px-6 py-16 text-center">
      <Sparkles count={48} />
      <Particles count={30} tone="night" />
      <FloatingHearts count={10} color="text-rose-300/40" />

      {/* Moon */}
      <motion.div
        className="absolute right-[12%] top-[12%] h-20 w-20 rounded-full bg-[#fff8e7] shadow-[0_0_40px_rgba(255,248,231,0.55)] sm:h-28 sm:w-28"
        animate={reduced ? undefined : { y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />

      {/* Soft clouds */}
      {!reduced &&
        [0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="pointer-events-none absolute h-10 w-36 rounded-full bg-white/10 blur-md"
            style={{ top: `${28 + i * 14}%`, left: `${-10 + i * 20}%` }}
            animate={{ x: ["0%", "120%"] }}
            transition={{
              duration: 40 + i * 10,
              repeat: Infinity,
              ease: "linear",
              delay: i * 4,
            }}
            aria-hidden
          />
        ))}

      <motion.p
        className="relative z-10 max-w-lg font-display text-2xl leading-relaxed text-rose-50 sm:text-3xl"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
      >
        {FINAL_MESSAGE}
      </motion.p>

      <motion.p
        className="relative z-10 mt-8 font-script text-4xl text-rose-200 sm:text-5xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        I love you{" "}
        <motion.button
          type="button"
          onClick={onSecretClick}
          className="inline-block align-middle text-rose-400"
          animate={
            reduced
              ? undefined
              : { scale: [1, 1.18, 1] }
          }
          transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
          aria-label="Secret heart"
        >
          ❤️
        </motion.button>
      </motion.p>

      <AnimatePresence>
        {secret && (
          <motion.div
            className="glass-panel relative z-10 mt-10 max-w-sm px-6 py-5 text-burgundy"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="font-display text-xl">Okay… you found the secret ❤️</p>
            <p className="mt-2 text-burgundy/80">
              You&apos;re stuck with me now. 😌❤️
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
