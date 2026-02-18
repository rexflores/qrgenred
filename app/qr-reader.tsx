"use client";


import { useState, useRef, useContext } from "react";
import { useRouter } from "next/navigation";
import { DarkModeContext } from "./DarkModeProvider";
import Image from "next/image";
import { FiChevronLeft } from "react-icons/fi";
import { BrowserQRCodeReader } from "@zxing/browser";

export default function QRReader() {

  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const [fileUrl, setFileUrl] = useState<string>("");
  const [imgAspect, setImgAspect] = useState<string | undefined>(undefined);
  const [copied, setCopied] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [history, setHistory] = useState<Array<{ value: string, time: number }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();
  const darkModeCtx = useContext(DarkModeContext);
  const dark = darkModeCtx?.dark ?? false;

  // Allowed image types for QR decoding
  const allowedTypes = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
    'image/gif',
    'image/bmp',
    'image/svg+xml',
    'image/heic',
    'image/heif',
  ];

  // Helper to check file type
  function isValidImageType(file: File) {
    return allowedTypes.includes(file.type);
  }

  const handleFileInput = (file: File | undefined | null) => {
    if (!file) {
      setFileName("");
      setFileUrl("");
      setImgAspect(undefined);
      setError(null);
      setSelectedFile(null);
      return;
    }
    if (!isValidImageType(file)) {
      setFileName("");
      setFileUrl("");
      setImgAspect(undefined);
      setError("Unsupported file type. Please upload a PNG, JPG, WEBP, GIF, BMP, SVG, or HEIC/HEIF image.");
      setSelectedFile(null);
      return;
    }
    setError(null);
    setFileName(file.name);
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setFileUrl(url);
    // Dynamically get aspect ratio
    const img = new window.Image();
    img.onload = () => {
      if (img.naturalWidth && img.naturalHeight) {
        setImgAspect(`${img.naturalWidth} / ${img.naturalHeight}`);
      } else {
        setImgAspect(undefined);
      }
    };
    img.src = url;
  };

  const handleDecode = async () => {
    setResult(null);
    setError(null);
    setLoading(true);
    const file = selectedFile;
    if (!file) {
      setError("Please select or capture an image file.");
      setLoading(false);
      return;
    }
    if (!isValidImageType(file)) {
      setError("Unsupported file type. Please upload a PNG, JPG, WEBP, GIF, BMP, SVG, or HEIC/HEIF image.");
      setLoading(false);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("The image file is too large (max 5MB). Please choose a smaller file.");
      setLoading(false);
      return;
    }
    try {
      const imageUrl = URL.createObjectURL(file);
      const img = new window.Image();
      img.src = imageUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error("Image could not be loaded. The file may be corrupted or unsupported."));
      });
      const codeReader = new BrowserQRCodeReader();
      const result = await codeReader.decodeFromImageElement(img);
      setResult(result.getText());
      setHistory(h => [{ value: result.getText(), time: Date.now() }, ...h].slice(0, 10));
    } catch (err) {
      let message = "No QR code found or could not decode image.";
      if (err instanceof Error && typeof err.message === "string") {
        if (err.message && err.message.includes("Image could not be loaded")) {
          message = err.message;
        } else if (err.message && err.message.includes("NotFoundException")) {
          message = "No QR code found in the image.";
        } else if (err.message && err.message.includes("FormatException")) {
          message = "The QR code format is not supported or the image is too blurry.";
        } else if (err.message && err.message.includes("ChecksumException")) {
          message = "The QR code is corrupted or unreadable.";
        }
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: dark
          ? 'linear-gradient(135deg, #18181b 0%, #312e81 100%)'
          : 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
        transition: 'background 0.3s',
      }}
    >
      <div
        style={{
          maxWidth: 420,
          width: '100%',
          background: dark ? '#23272f' : '#fff',
          borderRadius: 16,
          boxShadow: dark
            ? '0 4px 32px #0008'
            : '0 4px 32px #b6b6e633',
          padding: 40,
          textAlign: 'center',
          margin: 24,
          color: dark ? '#f3f4f6' : '#222',
          transition: 'background 0.3s, color 0.3s',
        }}
      >
        {/* Dark mode toggle is now global */}
        <button
          onClick={() => router.back()}
          style={{
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
            marginBottom: 16,
          }}
          aria-label="Back"
        >
          <FiChevronLeft size={36} />
        </button>
        <h1 style={{ marginBottom: 18, fontSize: 28, fontWeight: 700, letterSpacing: -1, color: dark ? '#f3f4f6' : '#222' }}>QR Code Reader</h1>
        <div
          style={{
            margin: '1rem 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          {/* File input for file picker */}
          <input
            id="qr-upload"
            type="file"
            accept="image/*"
            ref={fileInputRef}
            aria-label="Upload QR code image"
            style={{ display: 'none' }}
            tabIndex={-1}
            onChange={e => {
              const file = e.target.files?.[0];
              handleFileInput(file);
            }}
          />
          {/* File input for camera capture */}
          <input
            id="qr-upload-camera"
            type="file"
            accept="image/*"
            capture="environment"
            ref={cameraInputRef}
            style={{ display: 'none' }}
            onChange={e => {
              const file = e.target.files?.[0];
              handleFileInput(file);
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
            <div
              role="button"
              tabIndex={0}
              aria-label="Upload or drag image file."
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              onDragOver={e => {
                e.preventDefault();
                e.stopPropagation();
                setDragActive(true);
              }}
              onDragEnter={e => {
                e.preventDefault();
                e.stopPropagation();
                setDragActive(true);
              }}
              onDragLeave={e => {
                e.preventDefault();
                e.stopPropagation();
                setDragActive(false);
              }}
              onDrop={e => {
                e.preventDefault();
                e.stopPropagation();
                setDragActive(false);
                const file = e.dataTransfer.files?.[0];
                if (!file) return;
                if (!isValidImageType(file)) {
                  setFileName("");
                  setFileUrl("");
                  setImgAspect(undefined);
                  setError("Unsupported file type. Please upload a PNG, JPG, WEBP, GIF, BMP, SVG, or HEIC/HEIF image.");
                  return;
                }
                handleFileInput(file);
                // Set the file input's files property so handleDecode works
                if (fileInputRef.current) {
                  const dataTransfer = new DataTransfer();
                  dataTransfer.items.add(file);
                  fileInputRef.current.files = dataTransfer.files;
                }
              }}
              style={{
                width: 320,
                height: 60,
                border: dragActive
                  ? `2.5px solid ${dark ? '#818cf8' : '#6366f1'}`
                  : `2px dashed ${dark ? '#a5b4fc' : '#818cf8'}`,
                borderRadius: 12,
                background: dragActive
                  ? (dark ? '#312e81' : '#e0e7ff')
                  : (dark ? '#23272f' : '#f3f4f6'),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: dark ? '#a5b4fc' : '#6366f1',
                fontWeight: 600,
                fontSize: 18,
                cursor: 'pointer',
                transition: 'border 0.2s, background 0.2s',
                boxShadow: dragActive
                  ? (dark ? '0 0 0 3px #818cf8' : '0 0 0 3px #818cf8')
                  : (dark ? '0 2px 8px #0008' : '0 2px 8px #e0e7ff22'),
                margin: '0 auto',
                textAlign: 'center',
                userSelect: 'none',
                position: 'relative',
                outline: 'none',
              }}
              onFocus={e => e.currentTarget.style.boxShadow = '0 0 0 3px #818cf8'}
              onBlur={e => e.currentTarget.style.boxShadow = '0 2px 8px #818cf822'}
            >
              <span>Upload from device or drag file</span>
            </div>
            <button
              type="button"
              style={{
                width: 320,
                height: 48,
                borderRadius: 12,
                background: dark ? '#312e81' : '#e0e7ff',
                color: dark ? '#a5b4fc' : '#6366f1',
                fontWeight: 600,
                fontSize: 18,
                border: `2px solid ${dark ? '#818cf8' : '#6366f1'}`,
                margin: '0 auto',
                cursor: 'pointer',
                marginTop: 4,
                boxShadow: dark ? '0 2px 8px #0008' : '0 2px 8px #e0e7ff22',
                transition: 'border 0.2s, background 0.2s',
              }}
              aria-label="Use camera to capture image"
              onClick={() => {
                cameraInputRef.current?.click();
              }}
            >
              Use Camera
            </button>
          </div>
        </div>
        {fileName && (
          <div style={{ margin: '8px 0 0 0', textAlign: 'left' }}>
            <span style={{ fontSize: 15, color: dark ? '#a5b4fc' : '#6366f1', fontWeight: 500, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
              {fileName}
            </span>
            {fileUrl && (
              <div style={{
                marginTop: 8,
                width: '100%',
                aspectRatio: imgAspect || undefined,
                borderRadius: 8,
                border: `1.5px solid ${dark ? '#312e81' : '#e0e7ff'}`,
                background: dark ? '#18181b' : '#f3f4f6',
                boxShadow: dark ? '0 2px 8px #0008' : '0 2px 8px #e0e7ff33',
                display: 'block',
                overflow: 'hidden',
                position: 'relative',
                minHeight: 120,
                maxHeight: 220,
              }}>
                <Image
                  src={fileUrl}
                  alt="Selected file preview"
                  fill
                  style={{
                    objectFit: 'contain',
                    borderRadius: 8,
                  }}
                  unoptimized
                />
              </div>
            )}
          </div>
        )}
        <br />
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 8 }}>
          <button
            onClick={handleDecode}
            style={{
              padding: '12px 32px',
              fontSize: 18,
              borderRadius: 8,
              background: dark
                ? 'linear-gradient(90deg, #6366f1 0%, #0ea5e9 100%)'
                : 'linear-gradient(90deg, #0ea5e9 0%, #38bdf8 100%)',
              color: '#fff',
              border: 'none',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: dark ? '0 2px 8px #312e81' : '0 2px 8px #0ea5e922',
              transition: 'background 0.2s',
            }}
            disabled={loading}
            aria-label="Decode QR code from image"
          >
            {loading ? 'Decoding...' : 'Decode QR'}
          </button>
          <button
            onClick={() => {
              setFileName("");
              setFileUrl("");
              setImgAspect(undefined);
              setResult(null);
              setError(null);
              setCopied(false);
              setHistory([]);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
            style={{
              padding: '12px 32px',
              fontSize: 18,
              borderRadius: 8,
              background: dark ? '#23272f' : '#f3f4f6',
              color: dark ? '#a5b4fc' : '#6366f1',
              border: `1.5px solid ${dark ? '#312e81' : '#e0e7ff'}`,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: dark ? '0 2px 8px #18181b' : '0 2px 8px #e0e7ff22',
              transition: 'background 0.2s',
            }}
            aria-label="Clear/reset all"
          >
            Clear
          </button>
        </div>
        <div style={{ marginTop: 32 }}>
          {result && (
            <div style={{ color: dark ? '#38bdf8' : '#0ea5e9', marginBottom: 8, fontWeight: 500, fontSize: 16 }}>
              <strong>Decoded Text:</strong>
              <div style={{ wordBreak: 'break-all', marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ flex: 1 }}>
                  {/^https?:\/\//i.test(result) ? (
                    <a
                      href={result}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: dark ? '#60a5fa' : '#2563eb', textDecoration: 'underline', wordBreak: 'break-all' }}
                    >
                      {result}
                    </a>
                  ) : (
                    result
                  )}
                </span>
                <button
                  onClick={async () => {
                    if (result) {
                      await navigator.clipboard.writeText(result);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 1200);
                    }
                  }}
                  style={{
                    background: dark ? '#312e81' : '#e0e7ff',
                    color: dark ? '#a5b4fc' : '#6366f1',
                    border: 'none',
                    borderRadius: 6,
                    padding: '4px 12px',
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  aria-label="Copy decoded text"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          )}
          {error && <div style={{ color: '#ef4444', marginTop: 8, fontWeight: 500 }}>{error}</div>}
          {history.length > 0 && (
            <div style={{ marginTop: 32, textAlign: 'left' }}>
              <div style={{ fontWeight: 600, color: dark ? '#a5b4fc' : '#6366f1', marginBottom: 8, fontSize: 15 }}>Session History</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {history.map((h, i) => (
                  <li key={h.time + h.value} style={{ marginBottom: 10, background: dark ? '#23272f' : '#f3f4f6', borderRadius: 8, padding: '10px 12px', boxShadow: dark ? '0 1px 4px #18181b' : '0 1px 4px #e0e7ff33', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ flex: 1, wordBreak: 'break-all', color: dark ? '#f3f4f6' : '#222' }}>
                      {/^https?:\/\//i.test(h.value) ? (
                        <a href={h.value} target="_blank" rel="noopener noreferrer" style={{ color: dark ? '#60a5fa' : '#2563eb', textDecoration: 'underline', wordBreak: 'break-all' }}>{h.value}</a>
                      ) : (
                        h.value
                      )}
                    </span>
                    <span style={{ fontSize: 12, color: dark ? '#818cf8' : '#818cf8', minWidth: 80, textAlign: 'right' }}>{new Date(h.time).toLocaleTimeString()}</span>
                    <button
                      onClick={async () => {
                        await navigator.clipboard.writeText(h.value);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 1200);
                      }}
                      style={{
                        background: dark ? '#312e81' : '#e0e7ff',
                        color: dark ? '#a5b4fc' : '#6366f1',
                        border: 'none',
                        borderRadius: 6,
                        padding: '2px 10px',
                        fontWeight: 600,
                        fontSize: 13,
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                      }}
                      aria-label={`Copy history result ${i+1}`}
                    >
                      Copy
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
