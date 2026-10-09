"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { FloatingHearts } from "./FloatingHearts";
import { Particles } from "./Particles";
import { Sparkles } from "./Sparkles";

type Props = {
  variant?: "soft" | "deep" | "night";
  children?: React.ReactNode;
  className?: string;
};

export function RomanticBg({
  variant = "soft",
  children,
  className = "",
}: Props) {
  const reduced = useReducedMotion();

  const gradients =
    variant === "night"
      ? "from-[#0b1026] via-[#1a1035] to-[#2a0f2e]"
      : variant === "deep"
        ? "from-[#4c0519] via-[#7f1d1d] to-[#3b0764]"
        : "from-[#fff7fb] via-[#fce7f3] to-[#ede9fe]";

  return (
    <div
      className={`relative min-h-[100dvh] w-full overflow-x-hidden bg-gradient-to-br ${gradients} ${className}`}
    >
      {!reduced && (
        <motion.div
          className="pointer-events-none absolute -left-1/4 top-[-20%] h-[70vmax] w-[70vmax] rounded-full bg-rose-300/30 blur-3xl"
          animate={{ x: [0, 40, -20, 0], y: [0, 30, -10, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      {!reduced && variant !== "night" && (
        <motion.div
          className="pointer-events-none absolute -right-1/4 bottom-[-10%] h-[60vmax] w-[60vmax] rounded-full bg-violet-300/25 blur-3xl"
          animate={{ x: [0, -30, 20, 0], y: [0, -20, 25, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      {variant === "night" ? (
        <>
          <Particles count={40} tone="night" />
          <Sparkles count={36} />
        </>
      ) : (
        <>
          <Particles count={22} tone="pink" />
          <FloatingHearts count={10} />
          <Sparkles count={16} />
        </>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
