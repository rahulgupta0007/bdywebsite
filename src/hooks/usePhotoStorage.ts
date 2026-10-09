"use client";

import { useCallback, useEffect, useState } from "react";

const DB_NAME = "birthday-surprise";
const STORE = "photos";
const KEY = "favorite";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbSet(blob: Blob) {
  const db = await openDb();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(blob, KEY);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function idbGet(): Promise<Blob | null> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).get(KEY);
    req.onsuccess = () => resolve((req.result as Blob) ?? null);
    req.onerror = () => reject(req.error);
  });
}

async function idbClear() {
  const db = await openDb();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(KEY);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export type PhotoState = {
  /** Object URL for preview / display */
  url: string | null;
  ready: boolean;
  savePhoto: (file: File | Blob) => Promise<void>;
  clearPhoto: () => Promise<void>;
};

export function usePhotoStorage(): PhotoState {
  const [url, setUrl] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let current: string | null = null;
    let cancelled = false;

    (async () => {
      try {
        const blob = await idbGet();
        if (cancelled) return;
        if (blob) {
          current = URL.createObjectURL(blob);
          setUrl(current);
        }
      } catch {
        // IndexedDB unavailable — stay on upload step
      } finally {
        if (!cancelled) setReady(true);
      }
    })();

    return () => {
      cancelled = true;
      if (current) URL.revokeObjectURL(current);
    };
  }, []);

  const savePhoto = useCallback(async (file: File | Blob) => {
    await idbSet(file);
    setUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  }, []);

  const clearPhoto = useCallback(async () => {
    try {
      await idbClear();
    } catch {
      /* ignore */
    }
    setUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  }, []);

  return { url, ready, savePhoto, clearPhoto };
}
