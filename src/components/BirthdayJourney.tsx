"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import type { JourneyStep } from "@/config/birthday";
import { MusicControl } from "@/components/ui/MusicControl";
import { BirthdayHero } from "@/components/steps/BirthdayHero";
import { FinalScene } from "@/components/steps/FinalScene";
import { GalleryStep } from "@/components/steps/GalleryStep";
import { InteractiveSurprise } from "@/components/steps/InteractiveSurprise";
import { LoveLetterStep } from "@/components/steps/LoveLetterStep";
import { MagicalTransition } from "@/components/steps/MagicalTransition";
import { MessageStep } from "@/components/steps/MessageStep";
import { OpeningStep } from "@/components/steps/OpeningStep";
import { PhotoReadyStep } from "@/components/steps/PhotoReadyStep";
import { PhotoUploadStep } from "@/components/steps/PhotoUploadStep";
import { useMusic } from "@/hooks/useMusic";
import { usePhotoStorage } from "@/hooks/usePhotoStorage";

function readInitialStep(hasPhoto: boolean): JourneyStep {
  if (typeof window === "undefined") return "opening";
  try {
    const saved = sessionStorage.getItem("birthday-step") as JourneyStep | null;
    if (!saved || saved === "opening") return "opening";
    if (!hasPhoto) return "photo-upload";
    if (saved === "photo-upload") return "photo-ready";
    return saved;
  } catch {
    return "opening";
  }
}

export function BirthdayJourney() {
  const { url: photoUrl, ready, savePhoto, clearPhoto } = usePhotoStorage();
  const music = useMusic();
  const [step, setStep] = useState<JourneyStep>("opening");
  const [hydrated, setHydrated] = useState(false);

  // Restore journey after IndexedDB photo load completes (refresh resilience)
  useEffect(() => {
    if (!ready || hydrated) return;
    queueMicrotask(() => {
      setStep(readInitialStep(!!photoUrl));
      setHydrated(true);
    });
  }, [ready, photoUrl, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem("birthday-step", step);
    } catch {
      /* private mode */
    }
  }, [step, hydrated]);

  const go = useCallback((next: JourneyStep) => setStep(next), []);

  const beginMagic = useCallback(async () => {
    await music.play();
    go("transition");
  }, [music, go]);

  if (!ready || !hydrated) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-gradient-to-br from-[#fff7fb] via-[#fce7f3] to-[#ede9fe]">
        <p className="font-script text-2xl text-rose-500">Loading your surprise…</p>
      </div>
    );
  }

  const needsPhoto = !["opening", "photo-upload"].includes(step);
  if (needsPhoto && !photoUrl) {
    return (
      <>
        <PhotoUploadStep
          onSaved={async (blob) => {
            await savePhoto(blob);
            go("photo-ready");
          }}
        />
        <MusicControl
          playing={music.playing}
          available={music.available}
          onToggle={music.toggle}
        />
      </>
    );
  }

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
        >
          {step === "opening" && (
            <OpeningStep
              onOpen={() => {
                void music.play();
                go("photo-upload");
              }}
            />
          )}
          {step === "photo-upload" && (
            <PhotoUploadStep
              onSaved={async (blob) => {
                await savePhoto(blob);
                go("photo-ready");
              }}
            />
          )}
          {step === "photo-ready" && photoUrl && (
            <PhotoReadyStep
              photoUrl={photoUrl}
              onContinue={() => void beginMagic()}
              onChangePhoto={async () => {
                await clearPhoto();
                go("photo-upload");
              }}
            />
          )}
          {step === "transition" && photoUrl && (
            <MagicalTransition
              photoUrl={photoUrl}
              onDone={() => go("hero")}
            />
          )}
          {step === "hero" && photoUrl && (
            <BirthdayHero photoUrl={photoUrl} onContinue={() => go("message")} />
          )}
          {step === "message" && (
            <MessageStep onContinue={() => go("gallery")} />
          )}
          {step === "gallery" && photoUrl && (
            <GalleryStep photoUrl={photoUrl} onContinue={() => go("letter")} />
          )}
          {step === "letter" && (
            <LoveLetterStep onContinue={() => go("surprise")} />
          )}
          {step === "surprise" && photoUrl && (
            <InteractiveSurprise
              photoUrl={photoUrl}
              onContinue={() => go("final")}
            />
          )}
          {step === "final" && <FinalScene />}
        </motion.div>
      </AnimatePresence>

      {step !== "opening" && (
        <MusicControl
          playing={music.playing}
          available={music.available}
          onToggle={music.toggle}
        />
      )}
    </>
  );
}
