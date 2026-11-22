import { useEffect, useRef } from 'react';
import { profile } from '../data/portfolio';

/**
 * Glass picture frame: a frosted rim, soft blue glow, inner photo and a caption plate.
 * Works with a full (non-cutout) photo, so the background stays part of the picture.
 */
export default function PortraitFrame({
  className = '',
  sizes = '(max-width: 1024px) 80vw, 32vw',
  eager = false,
}: {
  className?: string;
  sizes?: string;
  eager?: boolean;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const sharp = useRef<HTMLImageElement>(null);
  const hideTimer = useRef(0);

  useEffect(() => () => window.clearTimeout(hideTimer.current), []);

  // Moves the clear "window" to the touched / hovered point.
  const aim = (e: React.PointerEvent, radius: number) => {
    const box = wrap.current?.getBoundingClientRect();
    const img = sharp.current;
    if (!box || !img) return;
    const x = ((e.clientX - box.left) / box.width) * 100;
    const y = ((e.clientY - box.top) / box.height) * 100;
    const r = (radius / 100) * Math.max(box.width, 1);
    const mask = `radial-gradient(circle ${r}px at ${x}% ${y}%, #000 0%, #000 55%, transparent 100%)`;
    img.style.webkitMaskImage = mask;
    img.style.maskImage = mask;
    img.style.opacity = '1';
  };
  const hide = (delay = 0) => {
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => {
      if (sharp.current) sharp.current.style.opacity = '0';
    }, delay);
  };
  const onDown = (e: React.PointerEvent) => {
    window.clearTimeout(hideTimer.current);
    aim(e, 42); // click / tap: bigger clear spot
  };
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' || e.buttons) aim(e, e.buttons ? 42 : 30);
  };

  return (
    <div className={`relative ${className}`}>
      <div aria-hidden className="absolute -inset-3 rounded-[3rem] bg-[radial-gradient(closest-side,rgba(23,105,255,0.4),transparent)] lg:-inset-8 blur-2xl" />
      <div className="glass relative rounded-[2rem] p-2.5 shadow-[0_30px_80px_rgba(0,10,60,0.65),inset_0_1px_0_rgba(255,255,255,0.28)]">
        <div
          ref={wrap}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={(e) => hide(e.pointerType === 'mouse' ? 0 : 1400)}
          onPointerLeave={() => hide(0)}
          onPointerCancel={() => hide(300)}
          className="relative cursor-pointer select-none overflow-hidden rounded-[1.5rem] ring-1 ring-white/10 [touch-action:pan-y]"
        >
          {/* blurred by default */}
          <img
            src={profile.portrait.src}
            srcSet={profile.portrait.srcSet}
            sizes={sizes}
            alt={profile.portrait.alt}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            draggable={false}
            className="block aspect-[4/5] w-full scale-110 object-cover object-[50%_20%] blur-[14px]"
          />
          {/* sharp copy, only visible inside the touched / hovered spot */}
          <img
            ref={sharp}
            src={profile.portrait.src}
            srcSet={profile.portrait.srcSet}
            sizes={sizes}
            alt=""
            aria-hidden
            decoding="async"
            draggable={false}
            style={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[50%_20%] transition-opacity duration-500 will-change-[mask-image]"
          />
          <p aria-hidden className="pointer-events-none absolute inset-x-0 top-3 text-center text-[10px] font-semibold tracking-[0.25em] text-bone/70">
            TOUCH TO REVEAL
          </p>
          <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,5,13,0)_52%,rgba(3,5,13,0.82)_100%)]" />
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(70%_45%_at_15%_0%,rgba(110,168,255,0.28),transparent)] mix-blend-screen" />
          <div className="glass absolute inset-x-3 bottom-3 flex items-center justify-between rounded-2xl px-4 py-2.5">
            <div>
              <p className="text-[9px] font-bold tracking-[0.3em] text-azure-2">AI / ML ENGINEER</p>
              <p className="font-display text-2xl leading-none tracking-wide text-bone">{profile.displayName}</p>
            </div>
            <span className="rounded-full border border-white/25 px-2 py-0.5 text-[10px] font-semibold text-bone/90">Bangalore</span>
          </div>
        </div>
      </div>
    </div>
  );
}
