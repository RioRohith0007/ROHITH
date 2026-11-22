import { useEffect, useRef, useState } from 'react';

/**
 * Project preview image with a reserved 16:10 box (no layout shift), a loading skeleton,
 * and a visible error state, so a project never shows a blank frame.
 */
export default function ProjectImage({ src, alt, title, priority = false, className = '' }: { src: string; alt: string; title: string; priority?: boolean; className?: string }) {
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const img = useRef<HTMLImageElement>(null);

  // Handles images that finished loading before React attached the listeners (cached or fast).
  useEffect(() => {
    setState('loading');
    const el = img.current;
    if (el?.complete) setState(el.naturalWidth > 0 ? 'ready' : 'error');
  }, [src]);

  return (
    <div className={`media ${state === 'loading' ? 'skeleton' : ''} ${className}`}>
      {state !== 'error' && (
        <img
          ref={img}
          src={src}
          alt={alt}
          width={1280}
          height={800}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setState('ready')}
          onError={() => setState('error')}
          style={{ opacity: state === 'ready' ? 1 : 0 }}
        />
      )}
      {state === 'error' && (
        <div role="img" aria-label={`${alt} (image unavailable)`} className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-ink-3 p-6 text-center">
          <span className="font-display text-2xl text-bone">{title}</span>
          <span className="text-xs tracking-[0.2em] text-smoke">PREVIEW UNAVAILABLE</span>
        </div>
      )}
    </div>
  );
}
