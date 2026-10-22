"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  X, ChevronLeft, ArrowUpRight, Play, Sun, Moon, Briefcase, FileText, Download,
  Github, Linkedin, Mail, MapPin, User, Hammer, Quote,
} from 'lucide-react';
import { SiLeetcode } from 'react-icons/si';
import { PROJECTS, StatusChip, CardArt, ProjectMedia, ProjectLinks } from './projects-gallery';
import SkillsIcons, { SKILL_GROUPS } from './skills-icons';
import ResumePreview from './resume-preview';
import { NAME, ROLE, EMAIL, PHONE, RESUME, LINKS, TAGLINE } from '../../data/profile';

const SOCIALS = [
  { href: LINKS.linkedin, label: 'LinkedIn', Icon: Linkedin },
  { href: LINKS.github, label: 'GitHub', Icon: Github },
  { href: LINKS.leetcode, label: 'LeetCode', Icon: SiLeetcode },
];

const ALL_SKILLS = SKILL_GROUPS.flatMap((g) => g.items);
const TILE_SKILLS = ['Python', 'React', 'TensorFlow', 'LangChain']
  .map((name) => ALL_SKILLS.find((s) => s.name === name))
  .filter(Boolean);

const SHEET_TITLES = {
  about: 'About',
  projects: 'Projects',
  experience: 'Experience',
  skills: 'Skills',
  resume: 'Resume',
  contact: 'Contact',
};

// Sheets are mirrored into browser history so the phone's back button (and
// iOS edge-swipe) closes the sheet instead of leaving the site. `depth` lets
// the X button unwind a nested sheet (Projects → a project) in one step.
export function useMobileSheet() {
  const [sheet, setSheet] = useState(null);

  useEffect(() => {
    const onPop = () => setSheet(window.history.state?.mobileSheet ?? null);
    const desktop = window.matchMedia('(min-width: 768px)');
    const onViewport = () => desktop.matches && setSheet(null);
    window.addEventListener('popstate', onPop);
    desktop.addEventListener('change', onViewport);
    return () => {
      window.removeEventListener('popstate', onPop);
      desktop.removeEventListener('change', onViewport);
    };
  }, []);

  const open = useCallback((id) => {
    const depth = (window.history.state?.mobileSheet ? window.history.state.depth : 0) + 1;
    window.history.pushState({ mobileSheet: id, depth }, '');
    setSheet(id);
  }, []);

  const back = useCallback(() => window.history.back(), []);

  const close = useCallback(() => {
    const depth = window.history.state?.depth;
    if (depth) window.history.go(-depth);
    else setSheet(null);
  }, []);

  return { sheet, open, back, close };
}

function SheetFrame({ open, title, contentKey, onClose, onBack, isDarkMode, children }) {
  const [rendered, setRendered] = useState(false);
  const [shown, setShown] = useState(false);
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startY = useRef(null);
  const rootRef = useRef(null);

  useEffect(() => {
    if (open) {
      setDrag(0);
      setRendered(true);
      let inner;
      const outer = requestAnimationFrame(() => {
        inner = requestAnimationFrame(() => setShown(true));
      });
      return () => {
        cancelAnimationFrame(outer);
        cancelAnimationFrame(inner);
      };
    }
    setShown(false);
    const timer = setTimeout(() => setRendered(false), 380);
    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // A dialog opened on top (the request form) owns Escape; otherwise one
    // key press would close both it and the sheet beneath.
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      const dialogs = document.querySelectorAll('[role="dialog"][aria-modal="true"]');
      if (dialogs[dialogs.length - 1] === rootRef.current) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!rendered) return null;

  // Drag only from the header, and never from its buttons: pointer capture
  // would retarget their click to the header.
  const onPointerDown = (e) => {
    if (e.target.closest('button')) return;
    startY.current = e.clientY;
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (startY.current === null) return;
    setDrag(Math.max(0, e.clientY - startY.current));
  };
  const onPointerUp = () => {
    if (startY.current === null) return;
    startY.current = null;
    setDragging(false);
    // Past the threshold, leave `drag` where it is so the panel continues
    // down from the finger instead of snapping up before it closes.
    if (drag > 110) onClose();
    else setDrag(0);
  };

  const hairline = isDarkMode ? 'border-white/10' : 'border-neutral-200';

  return (
    <div ref={rootRef} className="fixed inset-0 z-[55]" role="dialog" aria-modal="true" aria-label={title}>
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/60 backdrop-blur-[2px] touch-none transition-opacity duration-300 ${shown ? 'opacity-100' : 'opacity-0'}`}
      />
      <div
        style={{
          transform: shown ? `translate3d(0, ${drag}px, 0)` : 'translate3d(0, 100%, 0)',
          transition: dragging ? 'none' : 'transform 0.42s cubic-bezier(0.32, 0.72, 0, 1)',
        }}
        className={`absolute inset-x-0 bottom-0 top-[max(0.75rem,env(safe-area-inset-top))] flex flex-col rounded-t-[2rem] border-t overflow-hidden shadow-[0_-24px_60px_rgba(0,0,0,0.55)] ${hairline} ${isDarkMode ? 'bg-[#0c0c0c] text-white' : 'bg-neutral-50 text-neutral-900'}`}
      >
        <header
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className={`shrink-0 px-3 pt-2 pb-2 touch-none select-none border-b ${hairline}`}
        >
          <div className={`mx-auto mb-1.5 h-1.5 w-11 rounded-full ${isDarkMode ? 'bg-white/20' : 'bg-neutral-300'}`} />
          <div className="flex items-center justify-between gap-2">
            {onBack ? (
              <button
                onClick={onBack}
                aria-label="Back"
                className={`w-11 h-11 inline-flex items-center justify-center rounded-full ${isDarkMode ? 'bg-white/5 active:bg-white/15' : 'bg-neutral-900/5 active:bg-neutral-900/10'}`}
              >
                <ChevronLeft size={20} />
              </button>
            ) : (
              <span className="w-11" />
            )}
            <h2 className="flex-1 text-center text-[11px] font-black uppercase tracking-[0.25em] truncate">{title}</h2>
            <button
              onClick={onClose}
              aria-label="Close"
              className={`w-11 h-11 inline-flex items-center justify-center rounded-full ${isDarkMode ? 'bg-white/5 active:bg-white/15' : 'bg-neutral-900/5 active:bg-neutral-900/10'}`}
            >
              <X size={18} />
            </button>
          </div>
        </header>
        <div key={contentKey} className="flex-1 overflow-y-auto overscroll-contain px-4 pt-5 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
          {children}
        </div>
      </div>
    </div>
  );
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function Tile({ index, ready, span, className = '', onClick, label, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      style={{ '--i': index }}
      className={`group relative overflow-hidden rounded-[1.75rem] text-left transition-transform duration-200 active:scale-[0.97] ${span ? 'col-span-2' : ''} ${ready ? 'tile-in' : 'opacity-0'} ${className}`}
    >
      {children}
    </button>
  );
}

function Eyebrow({ children, className = '' }) {
  return <p className={`text-[9px] font-black uppercase tracking-[0.28em] ${className}`}>{children}</p>;
}

function Corner({ tone = 'light' }) {
  return (
    <span className={`absolute top-3.5 right-3.5 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur ${tone === 'light' ? 'bg-black/35 text-white' : 'bg-emerald-500/10 text-emerald-400'}`}>
      <ArrowUpRight size={15} />
    </span>
  );
}

export default function MobileApp({
  className = '',
  ready,
  isDarkMode,
  onToggleTheme,
  themeClasses,
  photo,
  mindsetShot,
  experiences,
  accentColor,
  sheetNav,
  onOpenChat,
}) {
  const { sheet, open, back, close } = sheetNav;
  const strong = isDarkMode ? 'text-white' : 'text-neutral-900';
  const soft = isDarkMode ? 'text-gray-400' : 'text-neutral-600';

  // Keep rendering the last sheet while it animates out; `sheet` is already
  // null by then and the panel would slide down empty.
  const lastSheet = useRef(null);
  const lastDepth = useRef(0);
  if (sheet) {
    lastSheet.current = sheet;
    lastDepth.current = window.history.state?.depth ?? 1;
  }
  const shownSheet = sheet ?? lastSheet.current;

  // Projects tile cycles through the gallery like a photo widget. Only the
  // outgoing, current and next images are mounted, so it never loads the lot.
  const [projectIndex, setProjectIndex] = useState(0);
  const cycled = useRef(false);
  useEffect(() => {
    if (!ready || sheet || prefersReducedMotion()) return undefined;
    const timer = window.setInterval(() => {
      cycled.current = true;
      setProjectIndex((i) => (i + 1) % PROJECTS.length);
    }, 3600);
    return () => window.clearInterval(timer);
  }, [ready, sheet]);
  // Layers keep gallery order so React never moves a node (a moved node drops
  // its opacity transition); z-index decides which one is on top instead.
  const count = PROJECTS.length;
  const projectLayers = PROJECTS.map((project, i) => ({
    project,
    current: i === projectIndex,
    previous: cycled.current && i === (projectIndex - 1 + count) % count,
    next: i === (projectIndex + 1) % count,
  })).filter((layer) => layer.current || layer.previous || layer.next);

  const project = shownSheet?.startsWith('project:') ? PROJECTS.find((p) => `project:${p.id}` === shownSheet) : null;
  const current = experiences[0];

  const renderSheet = () => {
    if (project) {
      return (
        <article>
          <ProjectMedia project={project} className="aspect-video -mx-4 -mt-5 mb-6" />
          <Eyebrow className="text-emerald-400 mb-2">{project.category}</Eyebrow>
          <h3 className={`text-3xl font-black leading-[1.05] mb-4 ${strong}`}>{project.title}</h3>
          <p className={`${soft} leading-relaxed mb-6`}>{project.description}</p>
          <div className="flex flex-wrap gap-2 mb-8">
            {project.tags.map((tag) => (
              <span key={tag} className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${themeClasses.subCard} ${soft}`}>{tag}</span>
            ))}
          </div>
          <ProjectLinks project={project} compact />
        </article>
      );
    }

    switch (shownSheet) {
      case 'about':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-2">
              <img src={photo} alt={NAME} className="w-16 h-16 rounded-2xl object-cover object-top" />
              <div>
                <p className={`text-xl font-black uppercase tracking-tight leading-none ${strong}`}>{NAME}</p>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-400 mt-2">{ROLE}</p>
              </div>
            </div>
            <section className={`rounded-[1.75rem] p-5 ${themeClasses.card}`}>
              <h3 className={`text-base font-black uppercase tracking-tight mb-3 flex items-center gap-2.5 ${strong}`}>
                <User size={18} className="text-emerald-400" /> About me
              </h3>
              <p className={`${soft} text-sm leading-relaxed mb-5`}>
                I&apos;m a <span className={`${strong} font-medium`}>third-year B.Tech CSE student</span> specialising in AI/ML, with a keen interest in machine learning. My expertise is in <span className={`${strong} font-medium`}>generative AI, RAG and LLMs</span>, and I interned for two months at <span className={`${strong} font-medium`}>DRDO&apos;s CAIR in Bangalore</span>.
              </p>
              <div className="flex flex-wrap gap-2">
                {['GenAI', 'RAG', 'LLMs', 'Python'].map((t) => (
                  <span key={t} className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase ${themeClasses.subCard} ${soft}`}>{t}</span>
                ))}
              </div>
            </section>
            <section className={`rounded-[1.75rem] p-5 ${themeClasses.card}`}>
              <h3 className={`text-base font-black uppercase tracking-tight mb-3 flex items-center gap-2.5 ${strong}`}>
                <Hammer size={18} className="text-emerald-400" /> Mindset
              </h3>
              <p className={`${soft} text-sm leading-relaxed mb-4`}>
                {TAGLINE}
              </p>
              <div className="relative h-52 rounded-2xl overflow-hidden bg-black">
                <img src={mindsetShot.src} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover scale-125 blur-2xl opacity-60" />
                <img key={mindsetShot.src} src={mindsetShot.src} alt={`${mindsetShot.alt} screenshot`} className="absolute inset-x-0 top-1/2 -translate-y-1/2 w-full h-auto animate-photo-settle" />
              </div>
            </section>
            <section className={`relative overflow-hidden rounded-[1.75rem] p-5 ${themeClasses.card}`}>
              <img src="/spidy.jpg" alt="" aria-hidden="true" loading="lazy" className={`absolute inset-0 w-full h-full object-cover ${isDarkMode ? 'opacity-25' : 'opacity-20'}`} />
              <Quote size={22} className="relative text-emerald-400 mb-3" />
              <p className={`relative text-xl font-black leading-tight ${strong}`}>“With great code comes great debugging.”</p>
            </section>
            <section className={`relative overflow-hidden rounded-[1.75rem] p-5 ${themeClasses.card}`}>
              <img src="/delhi-map.jpg" alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-25" />
              <div className="relative">
                <p className={`flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] mb-3 ${soft}`}>
                  <MapPin size={14} className="text-emerald-400" /> Location
                </p>
                <p className={`text-2xl font-black uppercase tracking-tight ${strong}`}>New Delhi, India</p>
              </div>
            </section>
          </div>
        );

      case 'projects':
        return (
          <div className="grid grid-cols-2 gap-3">
            {PROJECTS.map((p) => (
              <button
                key={p.id}
                onClick={() => open(`project:${p.id}`)}
                className="relative aspect-[4/5] rounded-[1.5rem] overflow-hidden text-left active:scale-[0.97] transition-transform"
              >
                <CardArt project={p} />
                <span className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                {p.badge && <StatusChip className="absolute top-3 left-3 !px-2 !py-1 !text-[8px]">{p.badge}</StatusChip>}
                <span className="absolute inset-x-0 bottom-0 p-3.5">
                  <span className="block text-[8px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-1">{p.category.replace(/^\d+\s*—\s*/, '')}</span>
                  <span className="block text-sm font-black text-white leading-tight">{p.title}</span>
                </span>
              </button>
            ))}
          </div>
        );

      case 'experience':
        return (
          <ol className={`relative ml-2 border-l ${isDarkMode ? 'border-white/10' : 'border-neutral-200'}`}>
            {experiences.map((exp, i) => (
              <li key={exp.title} className="relative pl-6 pb-8 last:pb-0">
                <span className={`absolute -left-[7px] top-1 w-3.5 h-3.5 rounded-full border-2 ${i === 0 ? 'bg-emerald-400 border-emerald-400 shadow-[0_0_14px_rgba(16,185,129,0.7)]' : isDarkMode ? 'bg-[#0c0c0c] border-white/30' : 'bg-neutral-50 border-neutral-300'}`} />
                <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1.5 ${i === 0 ? 'text-emerald-400' : soft}`}>{exp.period}</p>
                <h3 className={`text-lg font-black leading-tight ${strong}`}>{exp.title}</h3>
                <p className={`text-sm font-semibold mb-3 ${soft}`}>{exp.company}</p>
                {exp.highlights.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {exp.highlights.map((h) => (
                      <span key={h} className={`px-2.5 py-1 rounded-lg text-[11px] ${themeClasses.subCard} ${soft}`}>{h}</span>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ol>
        );

      case 'skills':
        return <SkillsIcons isDarkMode={isDarkMode} themeClasses={themeClasses} />;

      case 'resume':
        return (
          <ResumePreview isDarkMode={isDarkMode} themeClasses={themeClasses} frameClassName="h-[60svh]" />
        );

      case 'contact':
        return (
          <div>
            <h3 className={`text-3xl font-black uppercase tracking-tight leading-[0.95] mb-3 ${strong}`}>Let&apos;s work<br />together</h3>
            <p className={`${soft} leading-relaxed mb-7`}>I&apos;m always open to discussing new projects, freelance opportunities or creative ideas. If you have something in mind, feel free to reach out.</p>
            <a href={`mailto:${EMAIL}`} className="flex items-center justify-between w-full px-5 py-4 rounded-2xl bg-emerald-500 text-black mb-3 active:scale-[0.98] transition-transform">
              <span className="flex items-center gap-3 font-black"><Mail size={20} /> Email me</span>
              <ArrowUpRight size={18} />
            </a>
            <div className="mb-7" />
            <div className={`rounded-[1.75rem] overflow-hidden ${themeClasses.card}`}>
              {SOCIALS.map(({ href, label, Icon }, i) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-between px-5 py-4 active:bg-white/5 ${i ? `border-t ${isDarkMode ? 'border-white/10' : 'border-neutral-200'}` : ''}`}
                >
                  <span className={`flex items-center gap-3 font-bold ${strong}`}><Icon size={19} className="text-emerald-400" /> {label}</span>
                  <ArrowUpRight size={16} className={soft} />
                </a>
              ))}
            </div>
            <p className={`text-center text-xs mt-6 ${soft}`}>{EMAIL} · {PHONE}</p>
          </div>
        );

      default:
        return null;
    }
  };

  const tileGlass = themeClasses.card;
  let i = 0;

  return (
    <div className={`relative z-10 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-10 ${className}`}>
      <header className={`flex items-center justify-between h-16 mb-2 ${ready ? 'tile-in' : 'opacity-0'}`} style={{ '--i': 0 }}>
        <span className={`text-sm font-black uppercase tracking-[0.2em] ${strong}`}>{NAME}</span>
        <button
          onClick={onToggleTheme}
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          className={`w-11 h-11 rounded-full inline-flex items-center justify-center ${themeClasses.accentButton}`}
        >
          {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </header>

      <div className="grid grid-cols-2 gap-3">
        {/* Identity */}
        <Tile index={++i} ready={ready} span label={`About ${NAME}`} onClick={() => open('about')} className="h-[35svh] min-h-[280px] max-h-[360px]">
          <img
            src={photo}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-top animate-photo-settle"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/10" />
          <Corner />
          <span className="absolute inset-x-0 bottom-0 p-5">
            <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.28em] text-emerald-400 mb-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> {ROLE}
            </span>
            <span className="block text-[2.1rem] font-black uppercase tracking-tighter leading-[0.9] text-white">
              Vishwaswarup<br /><span className="text-gray-400">Rath</span>
            </span>
            <span className="block mt-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-300">
              AI · Machine Learning · Full Stack
            </span>
          </span>
        </Tile>

        {/* Projects — cycles through the gallery like a photo widget */}
        <Tile index={++i} ready={ready} label="Projects" onClick={() => open('projects')} className="aspect-square bg-black">
          <span className="absolute inset-0 isolate">
            {projectLayers.map(({ project: p, current, previous }) => (
              <CardArt
                key={p.id}
                project={p}
                className={`transition-opacity duration-700 ${current ? 'opacity-100 z-[2]' : previous ? 'opacity-100 z-[1]' : 'opacity-0 z-0'}`}
              />
            ))}
          </span>
          <span className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <span className="absolute inset-x-0 bottom-0 p-4">
            <span className="block text-5xl font-black leading-none text-white">{PROJECTS.length}</span>
            <span className="block text-[10px] font-black uppercase tracking-[0.25em] text-white/80 mt-1.5">Projects</span>
            <span key={projectIndex} className="block text-[11px] font-semibold text-white/60 mt-1 truncate animate-photo-settle">
              {PROJECTS[projectIndex].title}
            </span>
          </span>
        </Tile>

        {/* Experience */}
        <Tile index={++i} ready={ready} label="Experience" onClick={() => open('experience')} className={`aspect-square p-4 flex flex-col ${tileGlass}`}>
          <span className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-auto">
            <Briefcase size={17} />
          </span>
          <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.22em] text-emerald-400 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Latest
          </span>
          <span className={`block text-[15px] font-black leading-tight ${strong}`}>{current.title}</span>
          <span className={`block text-[11px] font-semibold mt-1 ${soft}`}>{current.company}</span>
        </Tile>

        {/* Resume */}
        <Tile index={++i} ready={ready} span label="Resume" onClick={() => open('resume')} className="h-[76px] bg-gradient-to-r from-emerald-500 to-emerald-400 text-black">
          <span className="absolute inset-0 flex items-center gap-4 px-5">
            <span className="w-11 h-11 rounded-2xl bg-black/15 flex items-center justify-center"><FileText size={20} /></span>
            <span className="flex-1">
              <span className="block text-base font-black leading-none">Resume</span>
              <span className="block text-[11px] font-bold opacity-70 mt-1">Scroll through it or download</span>
            </span>
            <ArrowUpRight size={20} />
          </span>
        </Tile>

        {/* Skills */}
        <Tile index={++i} ready={ready} label="Skills" onClick={() => open('skills')} className={`h-[146px] p-4 flex flex-col ${tileGlass}`}>
          <span className="flex -space-x-2 mb-auto">
            {TILE_SKILLS.map(({ name, Icon }) => (
              <span key={name} className={`w-9 h-9 rounded-full border flex items-center justify-center ${isDarkMode ? 'bg-[#1a1a1a] border-white/15 text-gray-200' : 'bg-white border-neutral-200 text-neutral-700'}`}>
                <Icon size={15} />
              </span>
            ))}
          </span>
          <span className={`block text-3xl font-black leading-none ${strong}`}>{ALL_SKILLS.length}</span>
          <span className={`block text-[10px] font-black uppercase tracking-[0.22em] mt-1.5 ${soft}`}>Skills</span>
        </Tile>

        {/* Ask AI */}
        <Tile index={++i} ready={ready} label="Ask my AI assistant" onClick={onOpenChat} className={`h-[146px] p-4 flex flex-col ${tileGlass}`}>
          <span style={{ '--orb-color': accentColor }} className="ai-orb relative w-11 h-11 rounded-full mb-auto">
            <span className="ai-orb-shine" aria-hidden="true" />
          </span>
          <span className={`block text-base font-black leading-tight ${strong}`}>Ask my AI</span>
          <span className={`block text-[10px] font-black uppercase tracking-[0.22em] mt-1.5 ${soft}`}>Instant answers</span>
        </Tile>

        {/* Contact — a container, not one button, so its icon links stay real links */}
        <div style={{ '--i': ++i }} className={`col-span-2 rounded-[1.75rem] p-4 ${tileGlass} ${ready ? 'tile-in' : 'opacity-0'}`}>
          <button onClick={() => open('contact')} className="flex w-full items-center justify-between mb-3 text-left">
            <span>
              <Eyebrow className="text-emerald-400 mb-1">Contact</Eyebrow>
              <span className={`block text-lg font-black leading-tight ${strong}`}>Let&apos;s work together</span>
            </span>
            <span className="w-10 h-10 rounded-full bg-emerald-500 text-black flex items-center justify-center"><ArrowUpRight size={18} /></span>
          </button>
          <div className="grid grid-cols-5 gap-2">
            {[...SOCIALS, { href: `mailto:${EMAIL}`, label: 'Email', Icon: Mail }, { href: RESUME, label: 'Resume', Icon: FileText }].map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('mailto:') ? undefined : '_blank'}
                rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                aria-label={label}
                className={`h-12 rounded-2xl flex items-center justify-center active:scale-95 transition-transform ${isDarkMode ? 'bg-white/5 text-gray-200' : 'bg-neutral-900/5 text-neutral-700'}`}
              >
                <Icon size={19} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <p className={`text-center text-[10px] font-black uppercase tracking-[0.25em] mt-8 ${soft}`}>© 2026 {NAME}</p>

      <SheetFrame
        open={!!sheet}
        title={project ? project.category.replace(/^\d+\s*—\s*/, '') : SHEET_TITLES[shownSheet] ?? ''}
        contentKey={shownSheet ?? 'none'}
        onClose={close}
        onBack={project && lastDepth.current > 1 ? back : undefined}
        isDarkMode={isDarkMode}
      >
        {renderSheet()}
      </SheetFrame>
    </div>
  );
}
