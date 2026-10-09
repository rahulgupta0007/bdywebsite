"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MUSIC_FILE } from "@/config/birthday";

export function useMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [available, setAvailable] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0.45;
    audio.src = MUSIC_FILE;

    const onCanPlay = () => setAvailable(true);
    const onError = () => {
      setAvailable(false);
      setPlaying(false);
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    audio.addEventListener("canplaythrough", onCanPlay);
    audio.addEventListener("error", onError);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    // Probe availability without autoplay
    audio.load();
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.removeEventListener("canplaythrough", onCanPlay);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audioRef.current = null;
    };
  }, []);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !available) return;
    setUnlocked(true);
    try {
      await audio.play();
    } catch {
      setPlaying(false);
    }
  }, [available]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const toggle = useCallback(async () => {
    if (playing) pause();
    else await play();
  }, [playing, play, pause]);

  return { playing, available, unlocked, play, pause, toggle };
}
