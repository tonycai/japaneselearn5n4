# Progressive Web App (PWA) Implementation

This document explains the PWA features implemented in the Japanese Study Web Application.

## Overview

The application has been configured as a Progressive Web App, allowing users to:
- Install the app on their devices (mobile, tablet, desktop)
- Access content offline
- Enjoy faster load times through caching
- Receive app-like experience with full-screen mode

## Implementation Details

### 1. PWA Package

We use `@ducanh2912/next-pwa` which is the maintained fork of `next-pwa` that works with Next.js 14+.

### 2. Configuration Files

#### next.config.ts
```typescript
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
  },
});
```

**Key Features**:
- `dest: "public"` - Service worker files are generated in the public directory
- `disable: process.env.NODE_ENV === "development"` - PWA is disabled in development mode
- `cacheOnFrontEndNav: true` - Caches pages on client-side navigation
- `aggressiveFrontEndNavCaching: true` - More aggressive caching for better performance
- `reloadOnOnline: true` - Reloads the page when connection is restored

#### public/manifest.json
Defines app metadata including:
- App name and short name
- Theme colors
- Display mode (standalone)
- Icons for different sizes
- App categories

### 3. Icons

SVG icons are generated at:
- `/icon-192x192.svg` (192x192 pixels)
- `/icon-512x512.svg` (512x512 pixels)

**To generate PNG icons** (recommended for better compatibility):
```bash
# Using online tools
Visit https://cloudconvert.com/svg-to-png

# Or using ImageMagick (if installed)
convert icon-192x192.svg icon-192x192.png
convert icon-512x512.svg icon-512x512.png
```

### 4. Layout Configuration

The `app/layout.tsx` includes:
- Manifest link
- Apple Web App meta tags
- App icons for different platforms
- Viewport configuration (exported separately per Next.js 16 requirements)

## Testing PWA Features

### Method 1: Production Build

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

3. Open the app in a browser (Chrome, Edge, Safari)

4. Check for PWA features:
   - Look for an "Install" button in the browser address bar
   - Open DevTools > Application tab > Service Workers (should show registered worker)
   - Check Application tab > Manifest (should show manifest details)

### Method 2: Using Chrome DevTools

1. Open Chrome DevTools (F12)
2. Go to "Application" tab
3. Check:
   - **Manifest**: Should display app information
   - **Service Workers**: Should show registered worker (in production)
   - **Cache Storage**: Should show cached resources

### Method 3: Lighthouse Audit

1. Open Chrome DevTools
2. Go to "Lighthouse" tab
3. Select "Progressive Web App" category
4. Run audit
5. Check PWA score and recommendations

## Installing the App

### On Desktop (Chrome/Edge):
1. Visit the application URL
2. Click the install icon in the address bar (+ icon or computer icon)
3. Click "Install" in the dialog

### On Mobile (Chrome/Safari):
1. Visit the application URL
2. Tap the browser menu (three dots)
3. Tap "Add to Home Screen" or "Install App"
4. Follow the prompts

## Offline Functionality

The PWA automatically caches:
- All pages visited
- Static assets (CSS, JavaScript)
- Course data (JSON files)
- Audio files (WAV files)

**Note**: First visit requires internet connection to cache resources.

## Caching Strategy

The app uses Workbox with the following strategies:
- **Network First**: For API calls and dynamic content
- **Cache First**: For static assets
- **Stale While Revalidate**: For course data

## Service Worker Files

After building for production, these files are generated in `public/`:
- `sw.js` - Service worker main file
- `workbox-*.js` - Workbox runtime files
- `worker-*.js` - Additional worker files

**Note**: These files are automatically excluded from git via `.gitignore`

## Troubleshooting

### Service Worker Not Registering
- Ensure you're testing in production mode (`npm run build && npm start`)
- Check browser console for errors
- Verify HTTPS is being used (or localhost for development)

### Install Button Not Appearing
- PWA criteria must be met (manifest, service worker, HTTPS)
- Some browsers require visiting the site multiple times
- Check Lighthouse audit for missing requirements

### Offline Mode Not Working
- Visit pages while online first to cache them
- Check Service Workers in DevTools to ensure worker is active
- Clear cache and re-visit if issues persist

## Browser Support

PWA features are supported in:
- ✅ Chrome 40+
- ✅ Edge 17+
- ✅ Firefox 44+
- ✅ Safari 11.1+ (limited support)
- ✅ Opera 27+

## Future Enhancements

Potential improvements:
- Push notifications for study reminders
- Background sync for progress tracking
- Advanced offline capabilities
- App shortcuts for quick access to courses
- Screenshot metadata for app stores

## Resources

- [Next PWA Documentation](https://ducanh-next-pwa.vercel.app/)
- [MDN PWA Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Google PWA Checklist](https://web.dev/pwa-checklist/)
- [Workbox Documentation](https://developer.chrome.com/docs/workbox/)
