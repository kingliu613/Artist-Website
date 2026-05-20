import { useEffect, useState } from "react";

const LOCAL_STATE_EVENT = "yiji:local-storage";
const memoryStore = {};

function readStoredValue(key, fallback) {
  if (typeof window === "undefined") return fallback;

  try {
    const stored = window.localStorage?.getItem(key);
    if (stored) return JSON.parse(stored);
  } catch {
    // Some preview browsers disable localStorage. Keep the demo state in memory.
  }

  return Object.prototype.hasOwnProperty.call(memoryStore, key) ? memoryStore[key] : fallback;
}

function writeStoredValue(key, value) {
  if (typeof window === "undefined") return;

  memoryStore[key] = value;
  try {
    window.localStorage?.setItem(key, JSON.stringify(value));
  } catch {
    // In-memory state is enough for the current single-page demo session.
  }
}

export default function useLocalStorageState(key, fallback) {
  const [value, setValue] = useState(fallback);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setValue(readStoredValue(key, fallback));
    setReady(true);
  }, [key]);

  useEffect(() => {
    if (!ready) return;
    try {
      writeStoredValue(key, value);
      window.dispatchEvent(new CustomEvent(LOCAL_STATE_EVENT, { detail: { key, value } }));
    } catch {
      // Local-only demo state can safely fail without breaking the UI.
    }
  }, [key, ready, value]);

  useEffect(() => {
    function syncFromStorage(event) {
      if (event.key && event.key !== key) return;
      setValue(readStoredValue(key, fallback));
    }

    function syncFromLocalEvent(event) {
      if (event.detail?.key === key) setValue(event.detail.value);
    }

    window.addEventListener("storage", syncFromStorage);
    window.addEventListener(LOCAL_STATE_EVENT, syncFromLocalEvent);
    return () => {
      window.removeEventListener("storage", syncFromStorage);
      window.removeEventListener(LOCAL_STATE_EVENT, syncFromLocalEvent);
    };
  }, [fallback, key]);

  return [value, setValue];
}
