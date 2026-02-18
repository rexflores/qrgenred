"use client";

import { useEffect, useRef, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { FiChevronLeft } from "react-icons/fi";
import { BrowserQRCodeReader } from "@zxing/browser";
import { DarkModeContext } from "./DarkModeProvider";

export default function QRScan() {

  const videoRef = useRef<HTMLVideoElement>(null);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [scanning, setScanning] = useState(false);
  const codeReaderRef = useRef<BrowserQRCodeReader | null>(null);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
  const darkModeCtx = useContext(DarkModeContext);
  const dark = darkModeCtx?.dark ?? false;

  useEffect(() => {
    // List cameras on mount, handle unsupported browsers
    let isMounted = true;
    BrowserQRCodeReader.listVideoInputDevices()
      .then(devices => {
        if (!isMounted) return;
        setVideoDevices(devices);
        if (devices.length > 0) {
          setSelectedDeviceId(devices[0].deviceId);
        }
      })
      .catch(() => {
        // Fallback: no camera enumeration support
        setVideoDevices([]);
        setSelectedDeviceId("");
      });
    const videoEl = videoRef.current;
    return () => {
      isMounted = false;
      // Cleanup on unmount
      if (videoEl && videoEl.srcObject) {
        (videoEl.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  const startScan = async () => {
    setResult(null);
    setError(null);
    setScanning(true);
    try {
      const codeReader = new BrowserQRCodeReader();
      codeReaderRef.current = codeReader;
      // If device enumeration not supported, let library pick default
      const deviceIdToUse = selectedDeviceId || undefined;
      const result = await codeReader.decodeOnceFromVideoDevice(
        deviceIdToUse,
        videoRef.current!
      );
      setResult(result.getText());
    } catch {
      setError("No QR code found or camera error.");
    } finally {
      setScanning(false);
      // No stop/reset method on BrowserQRCodeReader; just stop video tracks
    }
  };

  const stopScan = () => {
    setScanning(false);
    // No stop/reset method on BrowserQRCodeReader; just stop video tracks
    if (videoRef.current && videoRef.current.srcObject) {
      (videoRef.current.srcObject as MediaStream)
        .getTracks()
        .forEach((track) => track.stop());
    }
  };

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
        <h1 style={{ marginBottom: 18, fontSize: 28, fontWeight: 700, letterSpacing: -1, color: dark ? '#f3f4f6' : '#222' }}>QR Code Scanner</h1>
        {/* Camera switcher (only if supported) */}
        {videoDevices.length > 1 && (
          <div style={{ marginBottom: 16, textAlign: 'left' }}>
            <label htmlFor="camera-select" style={{ fontWeight: 500, color: dark ? '#a5b4fc' : '#6366f1', fontSize: 15, marginRight: 8 }}>Camera:</label>
            <select
              id="camera-select"
              value={selectedDeviceId}
              onChange={e => setSelectedDeviceId(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                border: `1.5px solid ${dark ? '#312e81' : '#e0e7ff'}`,
                background: dark ? '#18181b' : '#fff',
                color: dark ? '#a5b4fc' : '#222',
                fontWeight: 500,
                fontSize: 15,
                outline: 'none',
                marginLeft: 4,
                marginBottom: 0,
              }}
              disabled={scanning}
            >
              {videoDevices.map(device => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Camera ${device.deviceId.slice(-4)}`}
                </option>
              ))}
            </select>
          </div>
        )}
        {videoDevices.length === 0 && (
          <div style={{ marginBottom: 16, color: dark ? '#a5b4fc' : '#6366f1', fontWeight: 500, fontSize: 15 }}>
            Camera switch not supported on this device/browser. Default camera will be used.
          </div>
        )}
        <div style={{ margin: '1.5rem 0' }}>
          <video
            ref={videoRef}
            style={{
              width: '100%',
              maxWidth: 340,
              borderRadius: 12,
              border: dark ? '2px solid #312e81' : '2px solid #e0e7ff',
              boxShadow: dark ? '0 2px 12px #18181b' : '0 2px 12px #e0e7ff55',
              background: dark ? '#18181b' : '#f3f4f6',
              minHeight: 180,
            }}
            autoPlay
            muted
          />
        </div>
        <div style={{ marginBottom: 24 }}>
          {!scanning ? (
            <button
              onClick={startScan}
              style={{
                padding: '12px 32px',
                fontSize: 18,
                borderRadius: 8,
                background: dark
                  ? 'linear-gradient(90deg, #6366f1 0%, #818cf8 100%)'
                  : 'linear-gradient(90deg, #6366f1 0%, #818cf8 100%)',
                color: '#fff',
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: dark ? '0 2px 8px #312e81' : '0 2px 8px #6366f122',
                transition: 'background 0.2s',
              }}
              aria-label="Start scanning QR code"
            >
              Start Scan
            </button>
          ) : (
            <button
              onClick={stopScan}
              style={{
                padding: '12px 32px',
                fontSize: 18,
                borderRadius: 8,
                background: 'linear-gradient(90deg, #ef4444 0%, #f87171 100%)',
                color: '#fff',
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: dark ? '0 2px 8px #18181b' : '0 2px 8px #ef444422',
                transition: 'background 0.2s',
              }}
              aria-label="Stop scanning QR code"
            >
              Stop Scan
            </button>
          )}
        </div>
        <div style={{ marginTop: 24 }}>
          {result && (
            <div style={{ color: dark ? '#38bdf8' : '#059669', marginBottom: 8, fontWeight: 500, fontSize: 16 }}>
              <strong>Decoded Text:</strong>
              <div style={{ wordBreak: 'break-all', marginTop: 8 }}>{result}</div>
            </div>
          )}
          {error && <div style={{ color: '#ef4444', marginTop: 8, fontWeight: 500 }}>{error}</div>}
        </div>
      </div>
    </div>
  );
}
