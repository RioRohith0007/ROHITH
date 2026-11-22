// Builds optimized portrait assets from portrait-source.jpg (project root).
// Crops around the subject and writes responsive WebP sizes plus a 1200x630 share image.
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const OUT = 'public/assets';
mkdirSync(OUT, { recursive: true });

const meta = await sharp('portrait-source.jpg').metadata();
// crop to the frame's 4:5 ratio, keeping the head and shoulders
const width = meta.width;
const height = Math.min(Math.round(meta.width * 1.25), meta.height);
const crop = await sharp('portrait-source.jpg').extract({ left: 0, top: 0, width, height }).png().toBuffer();

for (const w of [1100, 720, 420]) {
  await sharp(crop).resize({ width: w }).webp({ quality: 84 }).toFile(`${OUT}/portrait-${w}.webp`);
}

const portrait = await sharp(crop).resize({ height: 630 }).jpeg({ quality: 88 }).toBuffer();
const pw = (await sharp(portrait).metadata()).width;
await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#03050d' } })
  .composite([
    { input: portrait, left: 1200 - pw, top: 0 },
    {
      input: Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#03050d"/><stop offset="0.55" stop-color="#03050d" stop-opacity="0.92"/><stop offset="1" stop-color="#03050d" stop-opacity="0"/></linearGradient></defs>
        <rect width="1200" height="630" fill="url(#g)"/>
        <text x="72" y="300" font-family="Impact, 'Arial Narrow', sans-serif" font-size="128" fill="#eaf1ff" letter-spacing="4">ROHITH</text>
        <text x="78" y="352" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="26" fill="#6ea8ff" letter-spacing="16">THE SERIES</text>
        <text x="78" y="420" font-family="Helvetica, Arial, sans-serif" font-weight="600" font-size="18" fill="#9fb2dc" letter-spacing="5">AI / ML ENGINEER • COMPUTER VISION • FULL-STACK</text>
      </svg>`),
    },
  ])
  .jpeg({ quality: 85 })
  .toFile(`${OUT}/og-image.jpg`);
console.log('images built');
