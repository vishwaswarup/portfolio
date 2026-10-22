import { useEffect } from 'react';

// Scales and dims carousel children by their distance from the container's
// centre, so the card under the thumb reads as "current". Only runs while
// `media` matches; outside it the inline values are cleared so grid layouts
// are untouched.
export default function useCarouselFocus(ref, media) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const mq = window.matchMedia(media);
    let frame = 0;

    const clear = () => {
      for (const child of el.children) {
        child.style.removeProperty('--focus-scale');
        child.style.removeProperty('opacity');
      }
    };

    const update = () => {
      frame = 0;
      if (!mq.matches) return clear();
      const box = el.getBoundingClientRect();
      if (!box.width) return;
      const centre = box.left + box.width / 2;
      for (const child of el.children) {
        const r = child.getBoundingClientRect();
        const d = Math.min(Math.abs(r.left + r.width / 2 - centre) / box.width, 1);
        child.style.setProperty('--focus-scale', (1 - d * 0.09).toFixed(3));
        child.style.opacity = (1 - d * 0.4).toFixed(3);
      }
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    el.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    mq.addEventListener('change', schedule);
    update();

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      el.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      mq.removeEventListener('change', schedule);
      clear();
    };
  }, [ref, media]);
}
