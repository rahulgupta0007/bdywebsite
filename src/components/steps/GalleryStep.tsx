"use client";

import { motion } from "framer-motion";
import { SafeImage } from "@/components/ui/SafeImage";
import { useMemo, useState } from "react";
import { ADDITIONAL_PHOTOS } from "@/config/birthday";
import { RomanticBg } from "@/components/effects/RomanticBg";
import { GlassButton } from "@/components/ui/GlassButton";
import { Lightbox } from "@/components/ui/Lightbox";

type Props = {
  photoUrl: string;
  onContinue: () => void;
};

export function GalleryStep({ photoUrl, onContinue }: Props) {
  const items = useMemo(
    () => [
      { src: photoUrl, caption: "You — my favorite view", rotate: -3 },
      ...ADDITIONAL_PHOTOS.map((p, i) => ({
        ...p,
        rotate: i % 2 === 0 ? 4 : -5,
      })),
    ],
    [photoUrl],
  );

  const [lightbox, setLightbox] = useState<{
    src: string;
    caption: string;
  } | null>(null);

  return (
    <RomanticBg variant="soft">
      <div className="flex min-h-[100dvh] flex-col items-center px-4 py-14">
        <h2 className="font-display text-3xl text-burgundy sm:text-4xl">
          Our Little World ❤️
        </h2>
        <p className="mt-2 max-w-md text-center text-sm text-burgundy/70">
          Tap a polaroid to look closer.
        </p>

        <div className="mt-10 grid w-full max-w-3xl grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
          {items.map((item, i) => (
            <motion.button
              key={`${item.src}-${i}`}
              type="button"
              className="group relative mx-auto w-full max-w-[180px] bg-[#fffaf5] p-2 pb-8 shadow-xl"
              style={{ rotate: `${item.rotate}deg` }}
              whileHover={{ y: -6, rotate: 0 }}
              onClick={() =>
                setLightbox({ src: item.src, caption: item.caption })
              }
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-rose-50">
                <SafeImage
                  src={item.src}
                  alt={item.caption}
                  fill
                  className="object-cover transition group-hover:scale-105"
                />
              </div>
              <p className="mt-3 font-script text-lg text-burgundy/80">
                {item.caption}
              </p>
            </motion.button>
          ))}
        </div>

        <div className="mt-12">
          <GlassButton onClick={onContinue}>One more thing…</GlassButton>
        </div>
      </div>

      <Lightbox
        open={!!lightbox}
        src={lightbox?.src ?? null}
        caption={lightbox?.caption}
        onClose={() => setLightbox(null)}
      />
    </RomanticBg>
  );
}
