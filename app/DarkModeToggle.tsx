"use client";
import { useContext } from "react";
import { DarkModeContext } from "./DarkModeProvider";

export default function DarkModeToggle() {
  const ctx = useContext(DarkModeContext);
  if (!ctx) return null;
  const { dark, toggleDark } = ctx;
  return (
    <button
      onClick={toggleDark}
      style={{
        position: 'fixed',
        top: 18,
        right: 24,
        background: 'none',
        border: 'none',
        color: dark ? '#fbbf24' : '#6366f1',
        fontSize: 22,
        cursor: 'pointer',
        zIndex: 100,
        transition: 'color 0.2s',
      }}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {dark ? '🌙' : '☀️'}
    </button>
  );
}
