"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Props = { count?: number };

export function Sparkles({ count = 24 }: Props) {
  const reduced = useReducedMotion();
  const dots = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${(i * 37) % 100}%`,
        top: `${(i * 53) % 100}%`,
        delay: (i % 10) * 0.25,
        size: 2 + (i % 4),
      })),
    [count],
  );

  if (reduced) {
    return (
      <div className="pointer-events-none absolute inset-0 opacity-30" aria-hidden>
        {dots.slice(0, 8).map((d) => (
          <span
            key={d.id}
            className="absolute rounded-full bg-white/80"
            style={{
              left: d.left,
              top: d.top,
              width: d.size,
              height: d.size,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {dots.map((d) => (
        <motion.span
          key={d.id}
          className="absolute rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
          style={{
            left: d.left,
            top: d.top,
            width: d.size,
            height: d.size,
          }}
          animate={{ opacity: [0.15, 1, 0.15], scale: [0.6, 1.3, 0.6] }}
          transition={{
            duration: 2.4 + (d.id % 3) * 0.4,
            delay: d.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
