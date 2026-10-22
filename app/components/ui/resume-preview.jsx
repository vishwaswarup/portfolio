"use client";
import React from 'react';
import { FileText, Download } from 'lucide-react';
import { RESUME } from '../../data/profile';

// Scrollable inline PDF viewer with view / download buttons, as on the old site.
// The toolbar is hidden so only the resume itself scrolls inside the frame.
const PREVIEW_SRC = `${RESUME}#toolbar=0&navpanes=0&statusbar=0&view=FitH`;

export default function ResumePreview({ isDarkMode, themeClasses, frameClassName = 'h-[420px] sm:h-[640px]' }) {
  return (
    <div>
      <div className={`mx-auto w-full max-w-[560px] overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.35)] ${frameClassName}`}>
        <iframe src={PREVIEW_SRC} title="Resume preview" className="w-full h-full border-0" />
      </div>
      <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center">
        <a
          href={RESUME}
          target="_blank"
          rel="noopener noreferrer"
          className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${themeClasses.accentButton} border ${isDarkMode ? 'border-white/10' : 'border-neutral-300'}`}
        >
          <FileText size={18} /> View Full Resume
        </a>
        <a
          href={RESUME}
          download
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
        >
          <Download size={18} /> Download Resume
        </a>
      </div>
    </div>
  );
}
