"use client";
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ArrowUpRight, ExternalLink, Trophy, ChevronLeft, ChevronRight, Github, Youtube } from 'lucide-react';
import useCarouselFocus from './use-carousel-focus';

// `cardPosition` is the focus point (CSS object-position) for the zoomed card
// crop: cards are portrait and the screenshots landscape, so each shows only a
// slice, and this picks which one. A project with no `image` shows a placeholder.
export const PROJECTS = [
  {
    id: 'nocodeml',
    category: '01 — No-Code Machine Learning',
    title: 'NoCodeML',
    badge: 'Live Project',
    image: '/images/nocodeml-landing.jpg',
    cardPosition: '50% center',
    description: 'A no-code machine learning experimentation platform with a Next.js 16 + React 19 + TypeScript frontend and a FastAPI backend, guiding users through an 8-step workflow — profiling, preprocessing, feature engineering, train/test split, model selection, training and results. A leakage-safe scikit-learn pipeline trains and compares up to 9 model types (Logistic/Linear/Ridge/Lasso Regression, KNN, Decision Tree, Random Forest, Gradient Boosting, XGBoost, SVM) with grid/random search, ReportLab PDF reports, Supabase row-level security and 170+ pytest tests. Deployed via Docker and Vercel.',
    tags: ['Next.js 16', 'React 19', 'TypeScript', 'FastAPI', 'scikit-learn', 'XGBoost', 'Supabase', 'Docker'],
    liveUrl: 'https://nocodeml.vercel.app/',
    github: 'https://github.com/vishwaswarup/Nocodeml',
  },
  {
    id: 'happenmuj',
    category: '02 — Campus Event Platform',
    title: 'HappenMUJ',
    badge: 'Live Project',
    image: '/images/happenmuj-landing.jpg',
    cardPosition: '20% center',
    description: 'A campus event discovery and community platform for MUJ, with a FastAPI + async PyMongo backend on a MongoDB replica set and a React + TypeScript frontend, supporting event browsing, personal calendars, community discussions and club/admin workflows. Built on a 9-collection document model using embedding, extended-reference and subset patterns, with 21 indexes (compound, partial, multikey, weighted text, TTL), $jsonSchema validation, aggregation pipelines ($facet, $lookup, $setWindowFields) for weighted Top-10 and faceted filters, multi-document transactions and GridFS for poster storage.',
    tags: ['FastAPI', 'MongoDB', 'PyMongo', 'React', 'TypeScript', 'GridFS'],
    liveUrl: 'https://happenmuj.vercel.app/#/',
    github: 'https://github.com/vishwaswarup/HappenMUJ',
  },
  {
    id: 'logistics-orchestrator',
    category: '03 — Agentic AI',
    title: 'AI-Logistic-Orchestrator',
    badge: 'Upcoming',
    description: 'Autonomous AI dispatch console: building a ReAct (Reason and Act) agent using frameworks like LangGraph that integrates spatial SQL telemetry and live weather data to actively resolve logistics and supply-chain risks. Currently in early development.',
    tags: ['Python', 'LangGraph', 'ReAct Agents', 'SQL', 'Weather API'],
    github: 'https://github.com/vishwaswarup/AI-Logistics-Orchestrator',
  },
  {
    id: 'intellirag',
    category: '04 — Retrieval-Augmented Generation',
    title: 'IntelliRAG',
    badge: 'GitHub Project',
    image: '/images/intellirag-landing.webp',
    cardPosition: '38% center',
    description: 'Incident-centric RAG for terrorism analysis. A multi-modal platform ingesting 5 document/media types (PDFs, news articles, scanned documents, images, reports) into structured, searchable intelligence records via a 6-stage pipeline — OCR, information extraction, entity/relationship mapping, semantic retrieval, layered summarization and analyst-oriented querying — to support threat assessment and intelligence-driven decision making.',
    tags: ['Python', 'RAG', 'Vector Search', 'SQLite', 'OCR', 'Local LLMs'],
    github: 'https://github.com/vishwaswarup/IntelliRAG',
  },
  {
    id: 'biterate',
    category: '05 — NLP & Machine Learning',
    title: 'BiteRate',
    badge: 'Live Project',
    image: '/images/biterate-landing.webp',
    cardPosition: '50% center',
    description: 'Restaurant review sentiment analyzer. An end-to-end NLP pipeline with emoji-aware preprocessing, tokenization, lemmatization, negation handling and TF-IDF vectorization. Trained and benchmarked 5 models — Logistic Regression, Naive Bayes, Linear SVC, XGBoost and a Soft Voting Ensemble — reaching up to 88% accuracy, deployed through an interactive Flask dashboard for real-time predictions.',
    tags: ['Python', 'NLP', 'TF-IDF', 'XGBoost', 'Flask'],
    liveUrl: 'https://biterateai.vercel.app/',
    github: 'https://github.com/vishwaswarup/BiteRate',
  },
  {
    id: 'artefax',
    category: '06 — Generative AI Platform',
    title: 'Artefax',
    badge: 'Live Project',
    image: '/images/artefax-landing.webp',
    cardPosition: '37% center',
    description: 'An AI platform that analyzes a source document once, then transforms that single understanding into audience-specific outputs (Executive Summary, LinkedIn Post, Advisory, Presentation), each exported as a real PDF/PPTX/TXT file — built with FastAPI, Gemini structured outputs and Next.js, with no re-prompting drift between outputs.',
    tags: ['Next.js', 'FastAPI', 'Gemini', 'Python'],
    liveUrl: 'https://artefax.onrender.com/',
    github: 'https://github.com/vishwaswarup/Artefax',
  },
  {
    id: 'stock-recommender',
    category: '07 — Full-Stack Recommender',
    title: 'Personal Stock Recommender System',
    badge: 'GitHub Project',
    image: '/images/stock-recommender-landing.webp',
    cardPosition: '32% center',
    description: 'A full-stack stock recommendation system that generates personalized stock suggestions based on user risk profiles, with a clean REST API and scalable backend architecture.',
    tags: ['FastAPI', 'React', 'PostgreSQL', 'SQLAlchemy', 'JWT', 'Alembic'],
    github: 'https://github.com/vishwaswarup/stock-recommendersystem',
  },
  {
    id: 'visionai',
    category: '08 — Voice Assistant',
    title: 'VisionAI',
    badge: 'GitHub Project',
    image: '/video/VisionAI_poster.jpg',
    cardPosition: 'center',
    video: '/video/VisionAI_demo.mp4',
    description: 'A Python-based voice assistant that performs web searches, plays Spotify music, retrieves time/date and answers natural language queries using Google Gemini AI, remembering previous actions for context-aware follow-ups.',
    tags: ['Python', 'Gemini AI', 'Voice Assistant'],
    github: 'https://github.com/vishwaswarup/VisionAI',
    youtubeUrl: 'https://youtube.com/shorts/ll4xwz3JRe4?feature=share',
  },
];

// Swipeable photo strip. Each photo is shown whole (object-contain) over a
// blurred copy of itself, so mixed aspect ratios never crop a face.
export function PhotoGallery({ photos, alt, className = '' }) {
  const ref = useRef(null);
  const [index, setIndex] = useState(0);
  const go = (i) => {
    const el = ref.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  };
  return (
    <div className={`relative bg-black ${className}`}>
      <div
        ref={ref}
        onScroll={(e) => setIndex(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
        className="flex h-full overflow-x-auto snap-x snap-mandatory overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {photos.map((src, i) => (
          <div key={src} className="relative h-full w-full shrink-0 snap-center overflow-hidden">
            <img src={src} alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-60" />
            <img src={src} alt={`${alt}, photo ${i + 1} of ${photos.length}`} loading={i ? 'lazy' : undefined} className="relative w-full h-full object-contain" />
          </div>
        ))}
      </div>
      {photos.length > 1 && (
        <>
          <button
            onClick={() => go(Math.max(index - 1, 0))}
            disabled={index === 0}
            aria-label="Previous photo"
            className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/55 backdrop-blur text-white items-center justify-center disabled:opacity-0 transition-opacity"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => go(Math.min(index + 1, photos.length - 1))}
            disabled={index === photos.length - 1}
            aria-label="Next photo"
            className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/55 backdrop-blur text-white items-center justify-center disabled:opacity-0 transition-opacity"
          >
            <ChevronRight size={20} />
          </button>
          <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 pointer-events-none" aria-hidden="true">
            {photos.map((src, i) => (
              <span key={src} className={`h-1.5 rounded-full bg-white transition-all ${i === index ? 'w-5 opacity-100' : 'w-1.5 opacity-50'}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function AwardBanner({ award, isDarkMode, className = '' }) {
  return (
    <div className={`flex items-center gap-3.5 rounded-2xl p-3.5 border ${isDarkMode ? 'bg-white/[0.04] border-white/10' : 'bg-neutral-900/[0.03] border-neutral-200'} ${className}`}>
      <span className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center bg-emerald-500/10 ring-1 ring-inset ring-emerald-400/20 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
        <Trophy size={20} strokeWidth={1.75} />
      </span>
      <div>
        <p className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>{award.title}</p>
        {award.event && <p className={`text-xs leading-snug mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-neutral-600'}`}>{award.event}</p>}
      </div>
    </div>
  );
}

export function AwardChip({ award, className = '' }) {
  return (
    <span className={`flex items-center gap-1.5 pl-1 pr-3 py-1 rounded-full bg-black/55 backdrop-blur-md border border-white/15 text-white text-[9px] font-black uppercase tracking-[0.18em] shadow-lg shadow-black/30 ${className}`}>
      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
        <Trophy size={11} strokeWidth={2} />
      </span>
      {award.badge}
    </span>
  );
}

export function StatusChip({ children, className = '' }) {
  return (
    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/55 backdrop-blur-md border border-white/15 text-white text-[9px] font-black uppercase tracking-[0.18em] shadow-lg shadow-black/30 ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
      {children}
    </span>
  );
}

// Card art for a portrait tile. The screenshot is zoomed to fill the card
// (cropped to the project's focus point); a project with no image yet gets an
// initial on a gradient instead.
export function CardArt({ project, className = '' }) {
  const src = project.card ?? project.thumb ?? project.image;
  if (!src) {
    return (
      <span aria-hidden="true" className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-900 via-[#14102b] to-black ${className}`}>
        <span className="text-[9rem] font-black leading-none text-white/10">{project.title.charAt(0)}</span>
      </span>
    );
  }
  return (
    <span className={`absolute inset-0 block overflow-hidden bg-black ${className}`}>
      <img
        src={src}
        alt={project.title}
        loading="lazy"
        style={{ objectPosition: project.cardPosition ?? 'center' }}
        className="absolute inset-0 w-full h-full object-cover"
      />
    </span>
  );
}

// Source / live / video buttons shown in the detail views.
export function ProjectLinks({ project, compact = false }) {
  const pad = compact ? 'py-4 rounded-2xl w-full justify-center' : 'px-6 py-3 rounded-xl';
  const base = `inline-flex items-center gap-2 font-bold transition-all ${pad}`;
  return (
    <div className={compact ? 'flex flex-col gap-3' : 'flex flex-wrap gap-3'}>
      {project.liveUrl && (
        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={`${base} bg-emerald-500 hover:bg-emerald-400 text-black`}>
          <ExternalLink size={18} /> Live Demo
        </a>
      )}
      {project.github && (
        <a href={project.github} target="_blank" rel="noopener noreferrer" className={`${base} bg-white/10 hover:bg-white/20 border border-white/10`}>
          <Github size={18} /> Source Code
        </a>
      )}
      {project.youtubeUrl && (
        <a href={project.youtubeUrl} target="_blank" rel="noopener noreferrer" className={`${base} bg-white/10 hover:bg-white/20 border border-white/10`}>
          <Youtube size={18} /> Watch on YouTube
        </a>
      )}
    </div>
  );
}

// Hero media for a project detail view: photo strip, video, screenshot, or a
// placeholder when the project has none yet.
export function ProjectMedia({ project, className = '' }) {
  if (project.gallery) return <PhotoGallery photos={project.gallery} alt={project.title} className={className} />;
  if (project.video) {
    return (
      <div className={`bg-black ${className}`}>
        <video src={project.video} controls playsInline preload="metadata" poster={project.image} className="w-full h-full object-contain" />
      </div>
    );
  }
  if (project.image) {
    return (
      <div className={`bg-black ${className}`}>
        <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
      </div>
    );
  }
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <CardArt project={project} />
    </div>
  );
}

export default function ProjectsGallery({ isDarkMode, themeClasses }) {
  const [active, setActive] = useState(null);
  const railRef = useRef(null);
  useCarouselFocus(railRef, '(max-width: 639px)');

  useEffect(() => {
    if (!active) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActive(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [active]);

  return (
    <>
      <div ref={railRef} className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 overflow-x-auto sm:overflow-visible snap-x snap-mandatory scroll-px-4 -mx-4 px-4 pb-4 sm:mx-0 sm:px-0 sm:pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {PROJECTS.map((project) => (
          <button
            key={project.id}
            onClick={() => setActive(project)}
            className="group relative overflow-hidden rounded-[2rem] text-left aspect-[4/5] shrink-0 w-[78vw] max-w-[330px] snap-center sm:w-auto sm:max-w-none sm:shrink transition-[transform,opacity] duration-200 [transform:scale(var(--focus-scale,1))] active:[transform:scale(calc(var(--focus-scale,1)*0.97))]"
          >
            <CardArt project={project} className="transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/5" />
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-2">{project.category}</p>
              <h3 className="text-xl md:text-2xl font-black text-white leading-tight">{project.title}</h3>
            </div>
            {project.award ? (
              <AwardChip award={project.award} className="absolute top-5 left-5" />
            ) : project.badge && (
              <StatusChip className="absolute top-5 left-5">{project.badge}</StatusChip>
            )}
            <div className="absolute top-5 right-5 w-9 h-9 rounded-full bg-black/40 backdrop-blur flex items-center justify-center text-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
              <ArrowUpRight size={16} />
            </div>
          </button>
        ))}
      </div>

      <p className={`sm:hidden mt-1 text-center text-[10px] font-bold uppercase tracking-[0.25em] ${themeClasses.mutedText}`}>
        Swipe · {PROJECTS.length} projects
      </p>

      {active && createPortal(
        <div role="dialog" aria-modal="true" aria-label={active.title} className="fixed inset-0 z-[70] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setActive(null)} />
          <div className={`relative z-10 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden rounded-[2rem] shadow-2xl ${themeClasses.card}`}>
            <button
              onClick={() => setActive(null)}
              aria-label="Close"
              className="absolute top-5 right-5 z-10 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
            >
              <X size={18} />
            </button>
            <div className="overflow-y-auto overscroll-contain">
            <ProjectMedia project={active} className="aspect-[16/9]" />
            <div className="p-8">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-2">{active.category}</p>
              <h3 className={`text-2xl md:text-3xl font-black mb-4 ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>{active.title}</h3>
              {active.award?.title && <AwardBanner award={active.award} isDarkMode={isDarkMode} className="mb-5" />}
              <p className={`${themeClasses.mutedText} leading-relaxed mb-6`}>{active.description}</p>
              {active.team && (
                <p className={`text-sm leading-relaxed mb-6 ${themeClasses.mutedText}`}>
                  <span className={`font-black uppercase tracking-[0.2em] text-[10px] mr-2 ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>Team</span>
                  {active.team.join(' · ')}
                </p>
              )}
              <div className="flex flex-wrap gap-2 mb-6">
                {active.tags.map((tag) => (
                  <span key={tag} className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wide ${themeClasses.subCard} ${themeClasses.mutedText}`}>
                    {tag}
                  </span>
                ))}
              </div>
              <ProjectLinks project={active} />
            </div>
            </div>
          </div>
        </div>
      , document.body)}
    </>
  );
}
