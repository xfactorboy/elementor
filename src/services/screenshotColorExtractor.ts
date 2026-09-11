/**
 * Extracts dominant brand colors from an uploaded screenshot using HTML5 Canvas.
 */

export interface ExtractedPalette {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  background: string;
  palette: string[];
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (c: number) => {
    const hex = Math.max(0, Math.min(255, Math.round(c))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function getRgbHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h: h * 360, s, l };
}

export function extractColorsFromImage(imageElement: HTMLImageElement): ExtractedPalette {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Downsample image for fast analysis
  const width = Math.min(128, imageElement.naturalWidth || 128);
  const height = Math.min(128, imageElement.naturalHeight || 128);
  canvas.width = width;
  canvas.height = height;

  if (!ctx) {
    return {
      primary: '#1A56DB',
      secondary: '#0F172A',
      accent: '#EC4899',
      text: '#1E293B',
      background: '#F8FAFC',
      palette: ['#1A56DB', '#0F172A', '#EC4899', '#F8FAFC'],
    };
  }

  ctx.drawImage(imageElement, 0, 0, width, height);
  const imageData = ctx.getImageData(0, 0, width, height).data;

  // Bucket colors by quantized HSL
  const colorBuckets: Array<{ r: number; g: number; b: number; s: number; l: number; count: number; hex: string }> = [];

  for (let i = 0; i < imageData.length; i += 16) {
    // sample every 4th pixel
    const r = imageData[i];
    const g = imageData[i + 1];
    const b = imageData[i + 2];
    const a = imageData[i + 3];

    if (a < 128) continue; // skip transparent

    const { s, l } = getRgbHsl(r, g, b);

    // Quantize to avoid slight variations
    const qr = Math.round(r / 24) * 24;
    const qg = Math.round(g / 24) * 24;
    const qb = Math.round(b / 24) * 24;
    const hex = rgbToHex(qr, qg, qb);

    const existing = colorBuckets.find((item) => item.hex === hex);
    if (existing) {
      existing.count += 1;
    } else {
      colorBuckets.push({ r: qr, g: qg, b: qb, s, l, count: 1, hex });
    }
  }

  colorBuckets.sort((a, b) => b.count - a.count);

  // Background: usually the most frequent very light (or very dark) color
  const bgCandidates = colorBuckets.filter((c) => c.l > 0.85 || c.l < 0.12);
  const background = bgCandidates[0]?.hex || '#FFFFFF';

  // Text: high contrast against background
  const textCandidates = colorBuckets.filter((c) => c.l < 0.25 && c.hex !== background);
  const text = textCandidates[0]?.hex || '#0F172A';

  // Vibrant / Chromatic colors for Primary & Accent (saturation > 0.35)
  const vibrant = colorBuckets.filter((c) => c.s > 0.3 && c.l > 0.2 && c.l < 0.8);

  const primary = vibrant[0]?.hex || '#1A56DB';
  const accent = vibrant[1]?.hex || vibrant[0]?.hex !== '#EC4899' ? (vibrant[1]?.hex || '#F59E0B') : '#EC4899';
  const secondary = vibrant[2]?.hex || colorBuckets.find(c => c.hex !== primary && c.hex !== text && c.l < 0.45)?.hex || '#334155';

  const palette = Array.from(new Set([primary, secondary, accent, text, background, ...colorBuckets.slice(0, 8).map(c => c.hex)])).slice(0, 6);

  return {
    primary,
    secondary,
    accent,
    text,
    background,
    palette,
  };
}
