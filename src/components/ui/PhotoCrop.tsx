"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GlassButton } from "./GlassButton";

type Props = {
  sourceUrl: string;
  onConfirm: (blob: Blob) => void;
  onCancel: () => void;
};

/**
 * Simple portrait crop: draws the image into a fixed 3:4 canvas centered
 * with optional vertical offset via a range slider (mobile-friendly).
 */
export function PhotoCrop({ sourceUrl, onConfirm, onCancel }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [offsetY, setOffsetY] = useState(0.5);
  const [ready, setReady] = useState(false);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !img.naturalWidth) return;

    const W = 540;
    const H = 720;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scale = Math.max(W / img.naturalWidth, H / img.naturalHeight);
    const sw = W / scale;
    const sh = H / scale;
    const maxOx = Math.max(0, img.naturalWidth - sw);
    const maxOy = Math.max(0, img.naturalHeight - sh);
    const sx = maxOx / 2;
    const sy = maxOy * offsetY;

    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, W, H);
  }, [offsetY]);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      setReady(true);
      draw();
    };
    img.src = sourceUrl;
  }, [sourceUrl, draw]);

  useEffect(() => {
    if (ready) draw();
  }, [offsetY, ready, draw]);

  const confirm = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob(
      (blob) => {
        if (blob) onConfirm(blob);
      },
      "image/jpeg",
      0.92,
    );
  };

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-4">
      <div className="overflow-hidden rounded-2xl border border-white/50 bg-white/20 p-2 shadow-xl backdrop-blur-md">
        <canvas
          ref={canvasRef}
          className="h-auto w-full max-w-[260px] rounded-xl"
          style={{ aspectRatio: "3 / 4" }}
        />
      </div>
      <label className="flex w-full flex-col gap-2 text-sm text-burgundy/80">
        <span>Adjust crop</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={offsetY}
          onChange={(e) => setOffsetY(Number(e.target.value))}
          className="w-full accent-rose-500"
        />
      </label>
      <div className="flex w-full flex-wrap justify-center gap-3">
        <GlassButton variant="ghost" onClick={onCancel}>
          Change photo
        </GlassButton>
        <GlassButton onClick={confirm} disabled={!ready}>
          Use this photo
        </GlassButton>
      </div>
    </div>
  );
}
