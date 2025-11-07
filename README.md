# Japanese Study Web Application

A modern, mobile-friendly web application for learning Japanese vocabulary with audio pronunciation and interactive flashcards.

## Live Demo

🌐 **Production**: https://n5n4.solanalink.jp/

## Features

- **Course Listing**: Browse through 11 Japanese language courses (Course あ: Hiragana/Katakana + Courses 1-10: Vocabulary)
- **Kana Course**: Special foundational course for learning Hiragana and Katakana (104 characters)
- **Interactive Vocabulary**: View vocabulary with Japanese text, romaji, translations, and example sentences
- **Audio Player**: Listen to high-quality TTS audio for each course (supports multi-part audio files)
- **Progress Tracking**: Minimal, compact animated progress bar fixed at the top of footer showing real-time vocabulary progress
- **Vocabulary Auto-Scroll**: Automatically highlights and scrolls to words during audio playback (2.3 seconds for kana, 10 seconds for vocabulary)
- **Manual/Auto Mode**: Toggle between manual navigation and automatic word progression
- **Course Navigation**: Quick Previous/Next Course buttons for seamless learning progression
- **Anki-Style Flashcards**: Professional flashcard images with front/back designs for immersive learning
- **Image Preloading**: Smart preloading of adjacent cards for instant, smooth transitions
- **3D Flip Animation**: Interactive flashcard flip effect for engaging learning
- **Mobile Responsive**: Optimized for desktop, tablet, and mobile devices
- **Progressive Web App (PWA)**: Install on any device, works offline, fast loading
- **Social Sharing**: Share courses on social media platforms
- **Social Integration**: Quick links to Discord, Telegram, LINE, and X (Twitter) communities

## Technology Stack

- **Framework**: Next.js 16 with App Router and Turbopack
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom React components
- **Data**: JSON-based vocabulary and flashcard data
- **Audio**: HTML5 audio with custom controls
- **PWA**: @ducanh2912/next-pwa with Workbox

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. Navigate to the project directory:
   ```bash
   cd japanese-study-web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit:
   ```
   http://localhost:3000
   ```

### Building for Production

```bash
# Build the application
npm run build

# Start the production server
npm start
```

### Docker Deployment

The application can be easily containerized and deployed using Docker and Docker Compose.

#### Prerequisites
- Docker installed (version 20.10 or later)
- Docker Compose installed (version 2.0 or later)

#### Quick Start with Docker Compose

```bash
# Build and start the container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

The application will be available at **http://localhost:3000**

#### Manual Docker Commands

```bash
# Build the Docker image
docker build -t japanese-study-web .

# Run the container
docker run -d -p 3000:3000 --name japanese-study-web japanese-study-web

# View logs
docker logs -f japanese-study-web

# Stop and remove container
docker stop japanese-study-web
docker rm japanese-study-web
```

#### Docker Features
- **Multi-stage build** for optimized image size
- **Non-root user** for security
- **Health checks** for container monitoring
- **Production-ready** configuration
- **Automatic restart** on failure

#### Managing the Container

```bash
# Check container status
docker-compose ps

# View container logs
docker-compose logs -f japanese-study-web

# Restart the container
docker-compose restart

# Rebuild and restart after code changes
docker-compose up -d --build

# Stop all containers
docker-compose down

# Remove containers and volumes
docker-compose down -v
```

**Note:** The application will be available at **http://localhost:8080** when using Docker Compose (port 8080 is mapped to avoid conflicts). You can change this in `docker-compose.yml`.

For comprehensive Docker documentation, see **[DOCKER.md](DOCKER.md)**.

## Project Structure

```
japanese-study-web/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Home page (course listing)
│   ├── course/[id]/       # Dynamic course pages
│   │   └── page.tsx       # Individual course page
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── AudioPlayer.tsx    # Audio playback component
│   ├── CourseCard.tsx     # Course card for listing
│   ├── FlashcardViewer.tsx # Interactive flashcard viewer
│   ├── VocabularyItem.tsx # Vocabulary display component
│   └── VocabularyProgressBar.tsx # Progress tracking component
├── lib/                   # Utilities and types
│   ├── types.ts          # TypeScript type definitions
│   └── courseData.ts     # Data fetching utilities
├── public/               # Static assets
│   ├── data/            # Course JSON files
│   ├── audio/           # Audio WAV files
│   ├── flashcards/      # Flashcard JSON files
│   └── flashcard-images/ # Anki-style flashcard images (front/back PNG)
└── package.json         # Dependencies
```

## Features in Detail

### Course Listing Page
- Shows all 11 available courses (Course あ: Hiragana/Katakana + Courses 1-10: Vocabulary)
- Displays course statistics (total courses, vocabulary count, audio availability)
- Features section highlighting key learning benefits
- Social media links in header and footer
- Share button for social media sharing

### Course Detail Page
- **Fixed Footer Navigation**: Previous/Next Course buttons always visible at bottom of screen
  - Mobile-responsive: Shows "Prev/Next" on mobile, "Previous Course/Next Course" on desktop
  - Always accessible without scrolling
  - Compact progress bar at top of footer for minimal, non-intrusive tracking
- **Vocabulary Progress Bar**: Ultra-compact animated gradient bar fixed at footer top
  - Minimal design: Just a thin gradient line (1.5px height)
  - No text labels for clean, distraction-free UI
  - Full-width display spanning entire screen
  - Real-time updates as you scroll through vocabulary
  - Only visible in Vocabulary tab
- **Vocabulary Tab**: List view of all vocabulary items with auto-scroll and highlighting
  - Auto-scroll: Automatically advances words every 10 seconds (2.3 seconds for kana course)
  - Manual navigation: Click any word to jump to it and temporarily pause auto-scroll
  - Smart behavior: Returns to auto-scroll mode after 3 seconds
- **Flashcards Tab**: Interactive study mode with Anki-style professional images
  - High-quality front/back flashcard designs (1,014 images total across 10 courses)
  - Smart image preloading for adjacent cards ensures instant navigation
  - Click to flip between front and back sides
  - 3D flip animation for engaging learning experience
  - Fallback to text display if images unavailable
- **Audio Player**: Custom controls with multi-part audio support
  - Play/Pause controls
  - Previous/Next track buttons for multi-part courses
  - Progress bar and time display
  - Sticky player that stays visible while scrolling

### Kana Course (Course あ)
- **Special Foundation Course**: Learn all Hiragana and Katakana characters
- **104 Characters**: Covers Gojūon (basic 50 sounds), Dakuon/Handakuon (voiced sounds), and Yōon (contracted sounds)
- **Fast Paced**: 2.3-second intervals for efficient memorization
- **Bilingual Format**: Each character shows both Hiragana / Katakana forms
- **Chinese Explanations**: Helps Chinese-speaking students understand pronunciation

## Mobile Optimization

The application is fully responsive and optimized for:
- **Desktop**: Full-width layouts with multi-column grids
- **Tablet**: Adaptive layouts with 2-column grids
- **Mobile**: Single-column layouts, touch-friendly buttons

## Customization

### Styling
Edit `app/globals.css` to customize colors, typography, and animations.

### Course Data
Update JSON files in `public/data/` and `public/flashcards/` to modify content.

### Audio Files
Place WAV files in `public/audio/` and update `audioMap` in `lib/courseData.ts`.

## Progressive Web App (PWA)

The application is configured as a **Progressive Web App (PWA)**, transforming it into an installable, offline-capable application that works across all devices and platforms.

### What is a PWA?

A Progressive Web App combines the best of web and native apps. It runs in a browser but can be installed on your device like a native app, works offline, and provides a fast, app-like experience.

### PWA Features

#### Core Capabilities
- **📱 Installable**: Add to home screen on mobile (iOS/Android) and desktop (Windows/Mac/Linux)
- **⚡ Lightning Fast**: Aggressive caching for instant page loads (pages load in <1 second after first visit)
- **🔌 Offline Access**: Study courses without internet connection after initial download
- **💾 Smart Caching**: Resources downloaded once and cached locally (saves bandwidth)
- **🚀 App-Like Experience**: Runs in full-screen standalone mode without browser UI
- **🔄 Auto-Updates**: Automatically updates when new content is available
- **📊 Reduced Data Usage**: Only downloads new/changed content

#### What Gets Cached?

When you use the PWA, these resources are automatically cached for offline access:
- ✅ All course pages (Course あ-10)
- ✅ Course data (JSON files with vocabulary)
- ✅ Audio files (pronunciation audio for all courses)
- ✅ Static assets (JavaScript, CSS, images)
- ✅ Navigation and UI components

### How It Works

#### 1. Service Worker
The PWA uses a **Service Worker** - a script that runs in the background and manages caching:
- Intercepts network requests
- Serves cached content when offline
- Updates cache when online
- Ensures fast loading times

#### 2. Caching Strategy
The app uses **Workbox** with intelligent caching strategies:
- **Cache First**: Static assets load from cache immediately
- **Network First**: Dynamic content tries network first, falls back to cache
- **Stale While Revalidate**: Shows cached content while updating in background

#### 3. Manifest File
The `manifest.json` file defines the app's:
- Name: "Japanese Learn"
- Theme colors: Blue (#2563eb)
- Icons: 192x192 and 512x512 SVG icons
- Display mode: Standalone (full-screen)
- Start URL: Home page

### Installation Guide

#### On Mobile Devices

**Android (Chrome, Edge, Samsung Internet)**:
1. Open https://your-app-url.com in your browser
2. Tap the **menu icon** (⋮) in the top-right corner
3. Select **"Add to Home screen"** or **"Install app"**
4. Confirm the installation
5. The app icon will appear on your home screen

**iOS (Safari)**:
1. Open the app in Safari browser
2. Tap the **Share button** (square with arrow)
3. Scroll down and tap **"Add to Home Screen"**
4. Name the app and tap **"Add"**
5. The app icon will appear on your home screen

#### On Desktop

**Chrome/Edge (Windows, Mac, Linux)**:
1. Open the app in your browser
2. Look for the **install icon** (⊕ or 🖥️) in the address bar
3. Click the icon
4. Click **"Install"** in the popup dialog
5. The app will open in its own window

**Alternative method**:
1. Click the browser menu (⋮ or •••)
2. Select **"Install Japanese Learn..."**
3. Confirm installation

### Using the PWA

#### First Time Setup
1. **Visit the website**: Open the app URL in your browser
2. **Install the app**: Follow installation steps above
3. **Browse content**: Visit all courses you want to use offline
4. **Audio caching**: Play audio files to cache them for offline use

#### Offline Usage
Once installed and content is cached:
1. **Open the app**: Tap the home screen icon (mobile) or app icon (desktop)
2. **Browse offline**: Navigate through cached courses
3. **Play audio**: Listen to cached pronunciation audio
4. **Practice vocabulary**: Review flashcards and vocabulary
5. **Auto-sync**: When online, the app automatically updates with new content

#### Managing Storage
The PWA caches content locally. To check storage:

**Chrome/Edge**:
1. Open DevTools (F12)
2. Go to **Application** tab
3. Click **Storage** in left sidebar
4. View **Cache Storage** and **Service Workers**

**To clear cache**:
1. Browser Settings > Privacy & Security
2. Clear browsing data > Cached images and files
3. Or uninstall and reinstall the app

### Benefits for Students

#### Learning Anywhere
- **Commute**: Study on trains, buses, planes
- **No WiFi**: Learn in areas without internet
- **Save Data**: Reduce mobile data usage by 90%+
- **Faster**: Instant loading, no waiting

#### Better Experience
- **Full Screen**: More space for content
- **No Distractions**: No browser tabs or address bar
- **Native Feel**: Feels like a real app
- **Push Notifications**: (Future) Get study reminders

#### Performance
- **Load Speed**: Pages load in <1 second (after initial visit)
- **Smooth Scrolling**: No network delays
- **Audio Playback**: Instant audio playback
- **Battery Efficient**: Less network usage = longer battery

### Testing PWA Features

#### For Developers

1. **Build for production** (PWA disabled in dev mode):
```bash
npm run build
npm start
```

2. **Test in Chrome DevTools**:
   - Open DevTools (F12)
   - **Application** tab:
     - **Service Workers**: Verify worker is registered and active
     - **Manifest**: Check app configuration and icons
     - **Cache Storage**: View cached resources
   - **Lighthouse** tab:
     - Select "Progressive Web App" category
     - Run audit (should score 90+)
     - Review recommendations

3. **Test offline mode**:
   - Visit pages while online
   - Open DevTools > Network tab
   - Select "Offline" throttling
   - Refresh page - should work offline

#### For Users

1. **Installation test**:
   - Visit the app
   - Check for install prompt or icon
   - Install and verify home screen icon

2. **Offline test**:
   - Use the app normally while online
   - Turn off WiFi/mobile data
   - Open app and browse cached content
   - Should work without internet

3. **Update test**:
   - Clear cache or use old version
   - Go online
   - App should automatically update to latest version

### Browser Compatibility

| Browser | Installation | Offline | Service Worker | Score |
|---------|-------------|---------|----------------|-------|
| Chrome (Desktop) | ✅ Full | ✅ Yes | ✅ Yes | ⭐⭐⭐⭐⭐ |
| Chrome (Android) | ✅ Full | ✅ Yes | ✅ Yes | ⭐⭐⭐⭐⭐ |
| Edge (Desktop) | ✅ Full | ✅ Yes | ✅ Yes | ⭐⭐⭐⭐⭐ |
| Safari (iOS) | ✅ Limited | ✅ Yes | ✅ Yes | ⭐⭐⭐⭐ |
| Safari (Mac) | ⚠️ Manual | ✅ Yes | ✅ Yes | ⭐⭐⭐ |
| Firefox | ⚠️ Manual | ✅ Yes | ✅ Yes | ⭐⭐⭐ |

**Note**: All modern browsers support PWA core features (offline, caching). Installation prompts vary by browser.

### Troubleshooting

#### App not installing?
- **Check browser**: Use Chrome or Edge for best support
- **Visit twice**: Some browsers require 2+ visits before showing install
- **Check HTTPS**: PWAs require secure connection (HTTPS or localhost)
- **Clear cache**: Try clearing browser cache and revisiting

#### Offline mode not working?
- **Visit pages first**: Content must be cached by visiting while online
- **Check service worker**: Open DevTools > Application > Service Workers
- **Wait for cache**: Large audio files take time to cache
- **Reinstall**: Uninstall and reinstall the app

#### App not updating?
- **Close and reopen**: Service worker updates on app restart
- **Clear cache**: Force update by clearing cache
- **Check console**: Look for errors in browser console

### Technical Details

#### Stack
- **Framework**: Next.js 16 with App Router
- **PWA Library**: @ducanh2912/next-pwa (Next.js 14+ compatible fork)
- **Service Worker**: Workbox 7.0+
- **Caching**: Workbox strategies (CacheFirst, NetworkFirst)

#### Configuration
```typescript
// next.config.ts
const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development"
});
```

#### Files Generated
After building:
- `public/sw.js` - Service worker
- `public/workbox-*.js` - Workbox runtime
- `public/manifest.json` - App manifest

See **[PWA.md](PWA.md)** for complete technical documentation, advanced configuration, and troubleshooting guide.

## Recent Updates

### Latest Features
- 🎴 **Anki-Style Flashcard Images**: Integrated professional flashcard images (1,014 images) with front/back designs replacing text-based flashcards for immersive visual learning
- ⚡ **Smart Image Preloading**: Adjacent cards preload automatically for instant, seamless navigation between flashcards
- 📊 **Compact Progress Bar**: Ultra-minimal progress bar (1.5px height) fixed at footer top with no text labels for distraction-free learning
- 🎯 **Optimized UI Layout**: Relocated progress bar from sticky section to footer for cleaner interface
- 🏠 **Concise Navigation**: Updated header "Back to Courses" button to "Home" for better mobile screen fit
- ✨ **Kana Course Added**: New Course あ featuring all 104 Hiragana and Katakana characters
- 🚀 **Fixed Navigation Bar**: Previous/Next Course buttons always visible at bottom of screen
- 📱 **Mobile-Optimized UI**: Responsive button labels (Prev/Next on mobile, full text on desktop)
- 🎨 **Cleaner Interface**: Streamlined header design for better focus on learning content
- ⚡ **Smart Timing**: 2.3-second intervals for kana course, 10-second intervals for vocabulary courses
- 🔄 **Vocabulary Auto-Scroll**: Words automatically highlight and scroll during audio playback
- 📲 **Progressive Web App**: Install on any device, offline support, fast caching
- 📤 **Social Sharing**: Share your learning progress on social media

### Course Structure
- **Course あ**: Hiragana and Katakana - The ABCs of Japanese (104 characters)
- **Course 1**: Personal pronouns and nationalities
- **Course 2**: Common objects and demonstratives
- **Course 3**: Places and locations
- **Course 4**: Home and family
- **Course 5**: Time expressions and activities
- **Course 6**: Transportation and dates
- **Course 7**: Food and daily activities
- **Course 8**: Giving/receiving and communication
- **Course 9**: Food preferences and adjectives
- **Course 10**: Seasons, weather, and descriptions

## Support & Community

Join our learning community:
- **Discord**: https://discord.gg/9KSTNCD6u
- **Telegram**: https://t.me/takadanobabajapanesebeginers
- **LINE**: https://line.me/R/ti/g/jcjwLGnaFK
- **X (Twitter)**: https://x.com/TonyIronTokyo

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

Built with ❤️ for Japanese language learners
