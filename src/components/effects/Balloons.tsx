"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const FILL = ["#fda4af", "#f9a8d4", "#c4b5fd", "#fb7185", "#fbcfe8"];

type Props = { count?: number };

export function Balloons({ count = 6 }: Props) {
  const reduced = useReducedMotion();
  const balloons = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${8 + ((i * 15) % 84)}%`,
        color: FILL[i % FILL.length],
        delay: i * 0.35,
        size: 28 + (i % 3) * 8,
      })),
    [count],
  );

  if (reduced) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {balloons.map((b) => (
        <motion.div
          key={b.id}
          className="absolute bottom-[-15%]"
          style={{ left: b.left }}
          animate={{ y: ["0%", "-130%"], x: [0, 12, -10, 0] }}
          transition={{
            duration: 14 + (b.id % 4),
            delay: b.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div
            className="relative mx-auto rounded-[50%_50%_50%_50%/60%_60%_40%_40%] shadow-md"
            style={{
              width: b.size,
              height: b.size * 1.25,
              background: b.color,
            }}
          >
            <span className="absolute bottom-[-14px] left-1/2 h-4 w-px -translate-x-1/2 bg-rose-300/60" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
