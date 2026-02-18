
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QR Code Toolkit",
  description: "Modern QR code generator, reader, and scanner.",
  icons: {
    icon: "/favicon.ico",
  },
};


import { DarkModeProvider } from "./DarkModeProvider";
import DarkModeToggle from "./DarkModeToggle";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`} style={{ minHeight: '100vh' }}>
        <DarkModeProvider>
          <DarkModeToggle />
          {children}
        </DarkModeProvider>
      </body>
    </html>
  );
}
