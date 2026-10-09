"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
};

export function GlassButton({
  children,
  onClick,
  variant = "primary",
  disabled,
  className = "",
  type = "button",
}: Props) {
  const styles =
    variant === "primary"
      ? "bg-gradient-to-r from-rose-500 via-pink-500 to-burgundy text-white shadow-lg shadow-rose-300/40 border-transparent"
      : "bg-white/30 text-burgundy border-white/50 backdrop-blur-md hover:bg-white/45";

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.03 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-6 py-3 font-medium tracking-wide transition disabled:cursor-not-allowed disabled:opacity-50 ${styles} ${className}`}
    >
      {children}
    </motion.button>
  );
}
