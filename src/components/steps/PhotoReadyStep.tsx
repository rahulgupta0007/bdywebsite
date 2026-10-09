"use client";

import { motion } from "framer-motion";
import { SafeImage } from "@/components/ui/SafeImage";
import { RomanticBg } from "@/components/effects/RomanticBg";
import { GlassButton } from "@/components/ui/GlassButton";

type Props = {
  photoUrl: string;
  onContinue: () => void;
  onChangePhoto: () => void;
};

export function PhotoReadyStep({ photoUrl, onContinue, onChangePhoto }: Props) {
  return (
    <RomanticBg variant="soft">
      <div className="flex min-h-[100dvh] flex-col items-center justify-center px-6 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel w-full max-w-md px-6 py-8"
        >
          <p className="font-script text-3xl text-rose-500">Perfect.</p>
          <h2 className="mt-2 font-display text-2xl text-burgundy sm:text-3xl">
            Now let the magic begin… ✨
          </h2>
          <div className="relative mx-auto mt-8 aspect-[3/4] w-48 overflow-hidden rounded-2xl border border-white/60 shadow-xl shadow-rose-200/50">
            <SafeImage
              src={photoUrl}
              alt="Your photo"
              fill
              className="object-cover"
            />
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <GlassButton variant="ghost" onClick={onChangePhoto}>
              Change photo
            </GlassButton>
            <GlassButton onClick={onContinue}>Continue</GlassButton>
          </div>
        </motion.div>
      </div>
    </RomanticBg>
  );
}
