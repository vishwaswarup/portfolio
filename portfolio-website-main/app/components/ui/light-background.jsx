"use client";
import React from 'react';

export default function LightBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-32 -left-24 w-[32rem] h-[32rem] rounded-full bg-emerald-200/50 blur-3xl animate-gentle-float" />
      <div
        className="absolute top-1/3 -right-32 w-[36rem] h-[36rem] rounded-full bg-emerald-100/60 blur-3xl animate-gentle-float"
        style={{ animationDuration: '9s', animationDelay: '1.5s' }}
      />
      <div
        className="absolute bottom-0 left-1/4 w-[28rem] h-[28rem] rounded-full bg-neutral-200/60 blur-3xl animate-gentle-float"
        style={{ animationDuration: '11s', animationDelay: '3s' }}
      />
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{ backgroundImage: 'radial-gradient(#17171733 1px, transparent 1px)', backgroundSize: '30px 30px' }}
      />
    </div>
  );
}
