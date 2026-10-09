"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BIRTHDAY_MESSAGE } from "@/config/birthday";
import { FloatingHearts } from "@/components/effects/FloatingHearts";
import { RomanticBg } from "@/components/effects/RomanticBg";
import { GlassButton } from "@/components/ui/GlassButton";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Props = { onContinue: () => void };

export function MessageStep({ onContinue }: Props) {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(reduced ? BIRTHDAY_MESSAGE.length : 0);

  useEffect(() => {
    if (reduced) return;
    if (visible >= BIRTHDAY_MESSAGE.length) return;
    const t = window.setTimeout(() => setVisible((v) => v + 1), 900);
    return () => window.clearTimeout(t);
  }, [visible, reduced]);

  const done = visible >= BIRTHDAY_MESSAGE.length;

  return (
    <RomanticBg variant="soft">
      <FloatingHearts count={8} color="text-rose-300/50" />
      <div className="flex min-h-[100dvh] flex-col items-center justify-center px-6 py-14">
        <div className="glass-panel w-full max-w-lg px-6 py-10 text-center">
          <p className="mb-6 font-script text-2xl text-rose-500">A few words for you</p>
          <div className="space-y-4">
            <AnimatePresence>
              {BIRTHDAY_MESSAGE.slice(0, visible).map((line, i) => (
                <motion.p
                  key={line}
                  className="font-display text-xl leading-relaxed text-burgundy sm:text-2xl"
                  initial={reduced ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                >
                  {line}
                  {i === visible - 1 && !done && !reduced && (
                    <motion.span
                      className="ml-1 inline-block text-rose-400"
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 0.9, repeat: Infinity }}
                    >
                      |
                    </motion.span>
                  )}
                </motion.p>
              ))}
            </AnimatePresence>
          </div>
          {(done || reduced) && (
            <motion.div
              className="mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <GlassButton onClick={onContinue}>Our little world</GlassButton>
            </motion.div>
          )}
        </div>
      </div>
    </RomanticBg>
  );
}
