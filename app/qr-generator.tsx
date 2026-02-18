"use client";
import { useRef, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { FiChevronLeft } from "react-icons/fi";
import { QRCodeSVG } from "qrcode.react";
import { DarkModeContext } from "./DarkModeProvider";
function QRGenerator() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [qrValue, setQrValue] = useState("");
  const svgRef = useRef<SVGSVGElement | null>(null);
  const darkModeCtx = useContext(DarkModeContext);
  const dark = darkModeCtx?.dark ?? false;

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
      <div style={{
        maxWidth: 420,
        width: '100%',
        background: dark ? '#23272f' : '#fff',
        borderRadius: 16,
        boxShadow: dark ? '0 4px 32px #0008' : '0 4px 32px #b6b6e633',
        padding: 40,
        textAlign: 'center',
        margin: 24,
        position: 'relative',
        color: dark ? '#f3f4f6' : '#222',
        transition: 'background 0.3s, color 0.3s',
      }}>
        {/* Dark mode toggle is now global */}
        <button
          onClick={() => router.back()}
          style={{
            position: 'absolute',
            left: 24,
            top: 24,
            background: 'none',
            border: 'none',
            color: dark ? '#818cf8' : '#6366f1',
            fontSize: 36,
            fontWeight: 700,
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            lineHeight: 1,
          }}
          aria-label="Back"
        >
          <FiChevronLeft size={36} />
        </button>
        <h1 style={{ marginBottom: 18, fontSize: 28, fontWeight: 700, letterSpacing: -1, color: dark ? '#f3f4f6' : '#222' }}>QR Code Generator</h1>
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && text.trim()) {
              setQrValue(text);
            }
          }}
          placeholder="Enter text..."
          aria-label="Text to encode"
          style={{
            width: '80%',
            padding: 10,
            fontSize: 17,
            borderRadius: 6,
            border: dark ? '1.5px solid #312e81' : '1.5px solid #e0e7ff',
            marginBottom: 18,
            background: dark ? '#18181b' : '#f3f4f6',
            color: dark ? '#f3f4f6' : '#222',
            fontWeight: 500,
            transition: 'background 0.2s, color 0.2s, border 0.2s',
          }}
        />
        <br />
        <button
          style={{
            margin: '1rem 0',
            padding: '12px 32px',
            fontSize: 18,
            borderRadius: 8,
            background: dark
              ? 'linear-gradient(90deg, #6366f1 0%, #818cf8 100%)'
              : 'linear-gradient(90deg, #6366f1 0%, #818cf8 100%)',
            color: '#fff',
            border: 'none',
            fontWeight: 600,
            cursor: text.trim() ? 'pointer' : 'not-allowed',
            boxShadow: dark ? '0 2px 8px #312e81' : '0 2px 8px #6366f122',
            transition: 'background 0.2s',
          }}
          onClick={() => setQrValue(text)}
          disabled={!text.trim()}
          aria-label="Generate QR code"
        >
          Generate QR
        </button>
        <div style={{ marginTop: 32 }}>
          {qrValue && (
            <>
              <QRCodeSVG
                value={qrValue}
                size={200}
                ref={svgRef}
                style={{ background: dark ? '#18181b' : '#fff', borderRadius: 8 }}
              />
              <br />
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 16 }}>
                <button
                  style={{
                    padding: '10px 28px',
                    fontSize: 16,
                    borderRadius: 8,
                    background: 'linear-gradient(90deg, #6366f1 0%, #818cf8 100%)',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: dark ? '0 2px 8px #312e81' : '0 2px 8px #6366f122',
                    transition: 'background 0.2s',
                  }}
                  onClick={async () => {
                    if (!svgRef.current) return;
                    const svg = svgRef.current;
                    const serializer = new XMLSerializer();
                    const svgString = serializer.serializeToString(svg);
                    const canvas = document.createElement('canvas');
                    const img = new window.Image();
                    const size = 1200; // Ultra high-res export
                    canvas.width = size;
                    canvas.height = size;
                    img.onload = async function () {
                      const ctx = canvas.getContext('2d');
                      if (ctx) {
                        ctx.fillStyle = '#fff';
                        ctx.fillRect(0, 0, size, size);
                        ctx.drawImage(img, 0, 0, size, size);
                        const url = canvas.toDataURL('image/png');
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'qr-code.png';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                      }
                    };
                    img.src = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svgString)));
                  }}
                  aria-label="Download QR code as PNG"
                >
                  Download as PNG
                </button>
                <button
                  style={{
                    padding: '10px 28px',
                    fontSize: 16,
                    borderRadius: 8,
                    background: 'linear-gradient(90deg, #f59e42 0%, #fbbf24 100%)',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: dark ? '0 2px 8px #18181b' : '0 2px 8px #f59e4222',
                    transition: 'background 0.2s',
                  }}
                  onClick={async () => {
                    if (!svgRef.current) return;
                    const svg = svgRef.current;
                    const serializer = new XMLSerializer();
                    const svgString = serializer.serializeToString(svg);
                    const canvas = document.createElement('canvas');
                    const img = new window.Image();
                    const size = 1200; // Ultra high-res export
                    canvas.width = size;
                    canvas.height = size;
                    img.onload = async function () {
                      const ctx = canvas.getContext('2d');
                      if (ctx) {
                        ctx.fillStyle = '#fff';
                        ctx.fillRect(0, 0, size, size);
                        ctx.drawImage(img, 0, 0, size, size);
                        const url = canvas.toDataURL('image/jpeg', 0.95);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'qr-code.jpg';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                      }
                    };
                    img.src = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svgString)));
                  }}
                  aria-label="Download QR code as JPG"
                >
                  Download as JPG
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


export default QRGenerator;

