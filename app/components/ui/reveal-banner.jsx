"use client";
import { useEffect, useRef } from 'react';

// Time constant (ms) of the smoothing: the reveal closes ~63% of the gap to
// the scroll position in this long. Higher = floatier, lower = tighter.
const SMOOTHING_MS = 140;

// Full-width image band that wipes open from top to bottom in step with the
// scroll, so scrolling back up closes it again. Scroll position only sets a
// target; the visible reveal eases toward it every frame, which hides the
// coarse steps wheel scrolling arrives in. The frame loop sleeps once it has
// caught up, and the style is written directly to avoid React re-renders.
export default function RevealBanner({ src, caption, position = 'center', className = '' }) {
  const wrapRef = useRef(null);
  const clipRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const clip = clipRef.current;
    if (!wrap || !clip) return undefined;

    const paint = (p) => {
      clip.style.clipPath = `inset(0 0 ${(1 - p) * 100}% 0)`;
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      paint(1);
      return undefined;
    }

    let target = 0;
    let current = 0;
    let frame = 0;
    let last = 0;

    // 0 while the band's top edge is at the bottom of the screen, 1 once it
    // has travelled half the viewport up.
    const readTarget = () => {
      const { top } = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      return Math.min(1, Math.max(0, (vh - top) / (vh * 0.5)));
    };

    const tick = (now) => {
      const dt = Math.min(now - last, 64); // clamp so a tab switch can't jump
      last = now;
      // Frame-rate independent exponential ease toward the target.
      current += (target - current) * (1 - Math.exp(-dt / SMOOTHING_MS));
      if (Math.abs(target - current) < 0.001) current = target;
      paint(current);
      frame = current === target ? 0 : requestAnimationFrame(tick);
    };

    const wake = () => {
      target = readTarget();
      if (!frame && target !== current) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };

    target = readTarget();
    current = target; // start in the right state if the page loads mid-scroll
    paint(current);

    window.addEventListener('scroll', wake, { passive: true });
    window.addEventListener('resize', wake);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', wake);
      window.removeEventListener('resize', wake);
    };
  }, []);

  return (
    // w-screen + left-1/2 breaks out of the centred max-width column.
    <div ref={wrapRef} className={`relative left-1/2 w-screen -translate-x-1/2 h-[260px] md:h-[340px] lg:h-[420px] ${className}`}>
      <div
        ref={clipRef}
        style={{ clipPath: 'inset(0 0 100% 0)', willChange: 'clip-path' }}
        className="absolute inset-0 overflow-hidden bg-black"
      >
        <img
          src={src}
          alt=""
          aria-hidden="true"
          loading="lazy"
          style={{ objectPosition: position }}
          className="w-full h-full object-cover opacity-90 brightness-[85%]"
        />
        {caption && (
          <>
            {/* Dark fade under the caption so it stays readable on any frame */}
            <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />
            <p className="absolute inset-x-0 bottom-[8%] px-6 text-center text-[clamp(0.95rem,1.6vw,1.4rem)] font-semibold tracking-[0.08em] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              {caption}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
