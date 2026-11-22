/** Design tokens used from TypeScript (canvas drawing). Keep in sync with @theme in index.css. */
export const colors = {
  bg: '#030712',
  bg2: '#071426',
  navy: '#0B1F3A',
  blue: '#1769FF',
  blue2: '#368BFF',
  cyan: '#56D8FF',
  text: '#F5F7FF',
  muted: '#9BAAC2',
} as const;

/** Stacking order. Mirrors the --z-* custom properties in index.css. */
export const z = { bg: 0, web: 1, ambient: 2, content: 5, card: 10, nav: 20, overlay: 30, modal: 40, loader: 50 } as const;
