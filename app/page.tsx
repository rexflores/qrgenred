"use client";
import { useContext } from "react";
import { DarkModeContext } from "./DarkModeProvider";

export default function Home() {
  const ctx = useContext(DarkModeContext);
  const dark = ctx?.dark ?? false;
  return (
    <div style={{
      minHeight: '100vh',
      background: dark
        ? 'linear-gradient(135deg, #18181b 0%, #312e81 100%)'
        : 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
      transition: 'background 0.3s',
    }}>
      <main style={{
        background: dark ? '#23272f' : '#fff',
        borderRadius: 16,
        boxShadow: dark ? '0 4px 32px #0008' : '0 4px 32px #b6b6e633',
        padding: 48,
        minWidth: 340,
        maxWidth: 420,
        width: '100%',
        textAlign: 'center',
        color: dark ? '#f3f4f6' : '#222',
        transition: 'background 0.3s, color 0.3s',
      }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8, letterSpacing: -1, color: dark ? '#f3f4f6' : '#222' }}>QR Code Toolkit</h1>
        <p style={{ color: dark ? '#a3a3a3' : '#666', marginBottom: 32 }}>Generate, read, and scan QR codes easily in your browser.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
          <a href="/qr-generator" style={{ padding: '14px 0', borderRadius: 8, background: 'linear-gradient(90deg, #6366f1 0%, #818cf8 100%)', color: '#fff', fontWeight: 600, textDecoration: 'none', fontSize: 18, transition: 'background 0.2s', boxShadow: '0 2px 8px #6366f122' }}>QR Code Generator</a>
          <a href="/qr-reader" style={{ padding: '14px 0', borderRadius: 8, background: 'linear-gradient(90deg, #0ea5e9 0%, #38bdf8 100%)', color: '#fff', fontWeight: 600, textDecoration: 'none', fontSize: 18, transition: 'background 0.2s', boxShadow: '0 2px 8px #0ea5e922' }}>QR Code Reader</a>
          <a href="/qr-scan" style={{ padding: '14px 0', borderRadius: 8, background: 'linear-gradient(90deg, #22c55e 0%, #4ade80 100%)', color: '#fff', fontWeight: 600, textDecoration: 'none', fontSize: 18, transition: 'background 0.2s', boxShadow: '0 2px 8px #22c55e22' }}>QR Code Scanner</a>
        </div>
        {/* Footer removed as requested */}
      </main>
    </div>
  );
}
