"use client";
import React, { useEffect, useRef } from 'react';

const randomColors = (count) => {
  return new Array(count)
    .fill(0)
    .map(() => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'));
};

export default function TubesCursorBackground({ onColorChange }) {
  const canvasRef = useRef(null);
  const appRef = useRef(null);

  useEffect(() => {
    // Delaying init lets the canvas settle to its final size first —
    // initializing immediately produces "Computed radius is NaN" from the lib.
    const initTimer = setTimeout(() => {
      // Self-hosted copy of threejs-components@0.0.19 tubes1 (was loaded from
      // jsdelivr; vendored locally so no third-party code runs on the page).
      import(/* webpackIgnore: true */ '/vendor/tubes1.min.js')
        .then((module) => {
          const TubesCursor = module.default;
          if (canvasRef.current) {
            const initialColors = ['#8f7cff', '#4b3bb8', '#b9adff'];
            appRef.current = TubesCursor(canvasRef.current, {
              tubes: {
                colors: initialColors,
                lights: {
                  intensity: 200,
                  colors: ['#8f7cff', '#b9adff', '#d9d2ff', '#4b3bb8'],
                },
              },
            });
            onColorChange?.(initialColors[0]);
          }
        })
        .catch((err) => console.error('Failed to load TubesCursor module:', err));
    }, 100);

    return () => {
      clearTimeout(initTimer);
      if (appRef.current && typeof appRef.current.dispose === 'function') {
        appRef.current.dispose();
      }
    };
  }, [onColorChange]);

  const handleClick = () => {
    if (appRef.current) {
      const newTubeColors = randomColors(3);
      appRef.current.tubes.setColors(newTubeColors);
      appRef.current.tubes.setLightsColors(randomColors(4));
      onColorChange?.(newTubeColors[0]);
    }
  };

  return (
    <div onClick={handleClick} className="fixed inset-0 z-0 bg-black cursor-pointer">
      <canvas ref={canvasRef} className="fixed inset-0" />
    </div>
  );
}
