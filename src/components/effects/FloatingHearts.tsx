"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Props = {
  count?: number;
  className?: string;
  color?: string;
};

export function FloatingHearts({
  count = 12,
  className = "",
  color = "text-rose-400/70",
}: Props) {
  const reduced = useReducedMotion();
  const hearts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${(i * 83) % 100}%`,
        size: 10 + ((i * 7) % 18),
        delay: (i % 8) * 0.45,
        duration: 8 + (i % 5) * 1.4,
        xDrift: ((i % 5) - 2) * 18,
      })),
    [count],
  );

  if (reduced) return null;

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      {hearts.map((h) => (
        <motion.span
          key={h.id}
          className={`absolute bottom-[-10%] ${color}`}
          style={{ left: h.left, fontSize: h.size }}
          initial={{ opacity: 0, y: 0, x: 0 }}
          animate={{
            opacity: [0, 0.85, 0],
            y: ["0%", "-110%"],
            x: [0, h.xDrift, h.xDrift * -0.5],
          }}
          transition={{
            duration: h.duration,
            delay: h.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        >
          ♥
        </motion.span>
      ))}
    </div>
  );
}
