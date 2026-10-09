"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const COLORS = ["#fb7185", "#f9a8d4", "#c4b5fd", "#fda4af", "#fde68a", "#fff1f2"];

type Props = { active?: boolean; count?: number };

export function Confetti({ active = true, count = 40 }: Props) {
  const reduced = useReducedMotion();
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${(i * 17) % 100}%`,
        color: COLORS[i % COLORS.length],
        delay: (i % 12) * 0.08,
        rotate: (i * 40) % 360,
        size: 6 + (i % 8),
      })),
    [count],
  );

  if (!active || reduced) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute top-[-8%] rounded-sm"
          style={{
            left: p.left,
            width: p.size,
            height: p.size * 0.55,
            background: p.color,
          }}
          initial={{ y: 0, opacity: 0, rotate: 0 }}
          animate={{
            y: ["0vh", "110vh"],
            opacity: [0, 1, 1, 0],
            rotate: [0, p.rotate, p.rotate + 180],
          }}
          transition={{
            duration: 3.2 + (p.id % 4) * 0.35,
            delay: p.delay,
            ease: "easeIn",
            repeat: Infinity,
            repeatDelay: 1.2,
          }}
        />
      ))}
    </div>
  );
}
