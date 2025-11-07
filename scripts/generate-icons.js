// Simple script to generate PWA icons
// Run with: node scripts/generate-icons.js

const fs = require('fs');
const path = require('path');

// Create a simple SVG and save as PNG placeholders
const createIcon = (size) => {
  const svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#2563eb"/>
  <circle cx="${size/2}" cy="${size*0.35}" r="${size*0.15}" fill="white"/>
  <text x="${size/2}" y="${size*0.68}" font-family="Arial, sans-serif" font-size="${size*0.15}" font-weight="bold" text-anchor="middle" fill="white">JP</text>
  <text x="${size/2}" y="${size*0.82}" font-family="Arial, sans-serif" font-size="${size*0.09}" text-anchor="middle" fill="white">Learn</text>
</svg>`;

  return svg;
};

// Create icon files
const publicDir = path.join(__dirname, '..', 'public');

// Create 192x192 icon
fs.writeFileSync(
  path.join(publicDir, 'icon-192x192.svg'),
  createIcon(192)
);

// Create 512x512 icon
fs.writeFileSync(
  path.join(publicDir, 'icon-512x512.svg'),
  createIcon(512)
);

console.log('✅ SVG icons generated successfully!');
console.log('📝 Note: For production, convert these SVG files to PNG format.');
console.log('   You can use online tools like https://cloudconvert.com/svg-to-png');
console.log('   or install ImageMagick and run:');
console.log('   convert icon-192x192.svg icon-192x192.png');
console.log('   convert icon-512x512.svg icon-512x512.png');
