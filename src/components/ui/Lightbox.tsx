"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";

type Props = {
  open: boolean;
  src: string | null;
  caption?: string;
  onClose: () => void;
};

export function Lightbox({ open, src, caption, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && src && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[#2a0a16]/75 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.figure
            className="relative max-h-[85dvh] w-full max-w-lg overflow-hidden rounded-2xl bg-white/10 p-3 shadow-2xl"
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-10 rounded-full bg-black/40 p-2 text-white"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="relative mx-auto aspect-[3/4] w-full max-h-[70dvh]">
              <SafeImage
                src={src}
                alt={caption || "Photo"}
                fill
                className="object-cover"
              />
            </div>
            {caption && (
              <figcaption className="mt-3 text-center font-display text-lg text-white">
                {caption}
              </figcaption>
            )}
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
