
# QR Code Toolkit

A modern, production-ready Next.js app for generating, reading, and scanning QR codes. Features a beautiful UI, global dark mode, accessibility, and is optimized for Vercel deployment.

## Features

- **QR Code Generator:** Create QR codes from any text or URL. Download as PNG or JPG.
- **QR Code Reader:** Decode QR codes from uploaded images. Supports drag-and-drop, file preview, copy-to-clipboard, and session history.
- **QR Code Scanner:** Scan QR codes live using your device camera.
- **Global Dark Mode:** Toggle dark mode from any page. Preference is saved and synced across all pages.
- **Modern UI:** Responsive, accessible, and mobile-friendly design.
- **Production Ready:** Built with Next.js App Router, TypeScript, and deployable to Vercel.

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/rexflores/qrgenred.git
cd qrgenred
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run locally
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for production
```bash
npm run build
npm start
```

## Vercel Deployment
1. Push your code to GitHub, GitLab, or Bitbucket.
2. Go to [vercel.com](https://vercel.com), import your repo, and deploy.
3. Vercel will auto-detect Next.js and handle everything for you.

## Tech Stack
- [Next.js](https://nextjs.org/) (App Router, TypeScript)
- [qrcode.react](https://github.com/zpao/qrcode.react) (QR code generation)
- [@zxing/browser](https://github.com/zxing-js/library) (QR code reading/scanning)
- [react-icons](https://react-icons.github.io/react-icons/) (icons)

## Accessibility & UX
- Keyboard navigation and ARIA labels
- Focus rings and accessible file input
- Responsive and mobile-friendly

## License
MIT

---

**Made with ❤️ for modern QR workflows.**
