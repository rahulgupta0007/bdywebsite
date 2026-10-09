"use client";

import { Camera } from "lucide-react";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { RomanticBg } from "@/components/effects/RomanticBg";
import { PhotoCrop } from "@/components/ui/PhotoCrop";

type Props = {
  onSaved: (blob: Blob) => Promise<void>;
};

const ACCEPT = "image/jpeg,image/png,image/webp";

export function PhotoUploadStep({ onSaved }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [rawUrl, setRawUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onFile = (file: File | undefined) => {
    if (!file) return;
    if (!ACCEPT.split(",").includes(file.type)) {
      setError("Please choose a JPG, PNG, or WEBP photo.");
      return;
    }
    setError(null);
    setRawUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  };

  return (
    <RomanticBg variant="soft">
      <div className="flex min-h-[100dvh] flex-col items-center justify-center px-6 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel w-full max-w-md px-6 py-8"
        >
          <p className="font-script text-2xl text-rose-500">Before we begin…</p>
          <h2 className="mt-2 font-display text-2xl text-burgundy sm:text-3xl">
            I need one beautiful thing from you.
          </h2>
          <p className="mt-3 text-sm text-burgundy/70">
            Your photo stays on this device only — nothing is uploaded to a server.
          </p>

          {!rawUrl ? (
            <div className="mt-8 flex flex-col items-center gap-4">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="flex w-full flex-col items-center gap-3 rounded-2xl border border-dashed border-rose-300/70 bg-white/35 px-4 py-10 text-burgundy transition hover:bg-white/50"
              >
                <Camera className="h-8 w-8 text-rose-500" />
                <span className="font-medium">Add your favorite photo 📸</span>
                <span className="text-xs text-burgundy/60">JPG · PNG · WEBP</span>
              </button>
              {error && <p className="text-sm text-rose-700">{error}</p>}
            </div>
          ) : (
            <div className="mt-8">
              <PhotoCrop
                sourceUrl={rawUrl}
                onCancel={() => {
                  setRawUrl((prev) => {
                    if (prev) URL.revokeObjectURL(prev);
                    return null;
                  });
                }}
                onConfirm={async (blob) => {
                  await onSaved(blob);
                }}
              />
            </div>
          )}

          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
        </motion.div>
      </div>
    </RomanticBg>
  );
}
