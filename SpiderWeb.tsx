import { useEffect, useRef, useState } from 'react';
import { WebEngine } from '../web/engine';
import { drawWeb } from '../web/renderer';

/**
 * Interactive spider-web background (Canvas 2D, no extra dependencies).
 * - Mouse: nearby nodes lean toward the cursor and the whole web drifts gently with it.
 * - Click / tap: a ripple spreads outward and briefly lights nodes and edges.
 * - Touch: drag moves nearby nodes; every active touch point is tracked.
 * The canvas is fixed, pointer-events:none and aria-hidden, so it never blocks the page.
 * Listeners are attached to window, so clicks anywhere still create a ripple.
 */
export default function SpiderWeb() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [unsupported, setUnsupported] = useState(false);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas) return;
    if (!ctx) {
      setUnsupported(true);
      return;
    }
    const reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const phone = () => window.innerWidth < 700;
    const engine = new WebEngine({ ambient: !reduceMq.matches, maxNodes: phone() ? 34 : 64, areaPerNode: phone() ? 24000 : 30000 });
    let dpr = 1;
    let raf = 0;
    let last = 0;
    let visible = !document.hidden;

    const size = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, phone() ? 1.5 : 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      engine.cfg.maxNodes = phone() ? 34 : 64;
      engine.cfg.areaPerNode = phone() ? 24000 : 30000;
      engine.resize(w, h);
      if (reduceMq.matches) drawWeb(ctx, engine);
    };
    size();

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const dt = last ? now - last : 16.7;
      last = now;
      engine.step(dt, now);
      drawWeb(ctx, engine);
    };
    const start = () => {
      if (reduceMq.matches || raf) return;
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    start();

    // Debounced resize so rotating a phone or dragging a window does not rebuild every frame.
    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(size, 120);
    };
    const onVisibility = () => {
      visible = !document.hidden;
      last = 0;
    };

    const interactive = () => !reduceMq.matches;
    const onMove = (e: PointerEvent) => {
      if (!interactive()) return;
      // Touch pointers only exist while a finger is down; mouse hover is always tracked.
      const pressed = e.pointerType === 'mouse' ? e.buttons > 0 : true;
      engine.setPointer(e.pointerId, e.clientX, e.clientY, pressed);
    };
    const onDown = (e: PointerEvent) => {
      if (!interactive()) return;
      engine.setPointer(e.pointerId, e.clientX, e.clientY, true);
      engine.ripple(e.clientX, e.clientY, performance.now());
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') engine.setPointer(e.pointerId, e.clientX, e.clientY, false);
      else engine.removePointer(e.pointerId);
    };
    const onCancel = (e: PointerEvent) => engine.removePointer(e.pointerId);
    const onLeave = (e: MouseEvent) => {
      if (!e.relatedTarget) engine.pointers.clear();
    };
    const onMotionChange = () => {
      engine.cfg.ambient = !reduceMq.matches;
      if (reduceMq.matches) {
        stop();
        engine.pointers.clear();
        engine.waves = [];
        size();
      } else {
        start();
      }
    };

    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    window.addEventListener('pointercancel', onCancel, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    reduceMq.addEventListener('change', onMotionChange);

    return () => {
      stop();
      window.clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onCancel);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      reduceMq.removeEventListener('change', onMotionChange);
    };
  }, []);

  if (unsupported) {
    // Canvas unavailable: fall back to a static CSS grid so the page still has a texture.
    return <div aria-hidden className="web-fallback" />;
  }
  return <canvas ref={ref} aria-hidden className="web-canvas" />;
}
