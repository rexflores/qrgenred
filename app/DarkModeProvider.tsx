"use client";
import React, { useState, useEffect, createContext } from "react";

export const DarkModeContext = createContext<{
  dark: boolean;
  toggleDark: () => void;
} | undefined>(undefined);

export function DarkModeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // On mount, sync with localStorage or system
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("darkMode");
      if (stored !== null) {
        setDark(stored === "true");
      } else {
        setDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
      }
      setMounted(true);
    }
  }, []);

  useEffect(() => {
    // Listen for system changes only if user hasn't set a preference
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("darkMode");
      if (stored === null) {
        const mq = window.matchMedia("(prefers-color-scheme: dark)");
        const handler = (e: MediaQueryListEvent) => setDark(e.matches);
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("darkMode", String(dark));
    }
  }, [dark]);

  const toggleDark = () => setDark((d) => !d);

  if (!mounted) return null;

  return (
    <DarkModeContext.Provider value={{ dark, toggleDark }}>
      {children}
    </DarkModeContext.Provider>
  );
}
