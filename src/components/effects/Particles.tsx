"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Props = {
  count?: number;
  tone?: "pink" | "night" | "gold";
};

const TONES = {
  pink: "bg-rose-300/50",
  night: "bg-violet-200/40",
  gold: "bg-amber-100/50",
};

export function Particles({ count = 30, tone = "pink" }: Props) {
  const reduced = useReducedMotion();
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${(i * 29) % 100}%`,
        top: `${(i * 47) % 100}%`,
        size: 3 + (i % 5),
        duration: 6 + (i % 6),
        delay: (i % 9) * 0.3,
      })),
    [count],
  );

  if (reduced) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {items.map((p) => (
        <motion.span
          key={p.id}
          className={`absolute rounded-full ${TONES[tone]} blur-[0.5px]`}
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -20, 8, 0],
            x: [0, 10, -8, 0],
            opacity: [0.2, 0.75, 0.35, 0.2],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
