"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { HER_NAME, LOVE_LETTER, YOUR_NAME } from "@/config/birthday";
import { Particles } from "@/components/effects/Particles";
import { RomanticBg } from "@/components/effects/RomanticBg";
import { GlassButton } from "@/components/ui/GlassButton";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Props = { onContinue: () => void };

export function LoveLetterStep({ onContinue }: Props) {
  const [opened, setOpened] = useState(false);
  const reduced = useReducedMotion();

  const letter = useMemo(
    () =>
      LOVE_LETTER.replaceAll("{HER_NAME}", HER_NAME).replaceAll(
        "{YOUR_NAME}",
        YOUR_NAME,
      ),
    [],
  );

  return (
    <RomanticBg variant={opened ? "deep" : "soft"}>
      {opened && <Particles count={28} tone="gold" />}
      <div className="flex min-h-[100dvh] flex-col items-center justify-center px-6 py-14 text-center">
        <AnimatePresence mode="wait">
          {!opened ? (
            <motion.div
              key="closed"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center"
            >
              <p className="mb-6 max-w-sm font-display text-2xl text-burgundy">
                You have one more thing waiting for you 💌
              </p>
              <button
                type="button"
                onClick={() => setOpened(true)}
                className="group relative h-36 w-52"
                aria-label="Open letter"
              >
                <span className="absolute inset-0 rounded-md bg-rose-400 shadow-xl" />
                <motion.span
                  className="absolute inset-x-0 top-0 origin-top rounded-t-md border-b border-rose-200/40 bg-rose-300"
                  style={{
                    height: "50%",
                    clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  }}
                  whileHover={reduced ? undefined : { rotateX: -12 }}
                />
                <span className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-burgundy px-3 py-1 font-script text-white">
                  Open me
                </span>
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={
                reduced
                  ? { opacity: 1 }
                  : { opacity: 0, y: 80, rotate: -4 }
              }
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 16 }}
              className="relative w-full max-w-lg"
            >
              <div className="rounded-sm bg-[#fff8ef] px-6 py-8 text-left shadow-2xl">
                <p className="mb-4 font-script text-3xl text-rose-600">
                  For {HER_NAME}
                </p>
                <div className="whitespace-pre-wrap font-hand text-lg leading-relaxed text-[#4a1d2a]">
                  {letter}
                </div>
              </div>
              <div className="mt-8 flex justify-center">
                <GlassButton onClick={onContinue}>Wait… there&apos;s more</GlassButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </RomanticBg>
  );
}
