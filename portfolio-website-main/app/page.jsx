"use client";
import React, { useEffect, useState } from 'react';
import {
  Github, Linkedin, Mail, MapPin,
  User, Hammer,
  ChevronRight, FileText, Quote, Sun, Moon
} from 'lucide-react';
import { SiLeetcode } from 'react-icons/si';
import TubesCursorBackground from './components/ui/tubes-cursor-background';
import LightBackground from './components/ui/light-background';
import ProjectsGallery from './components/ui/projects-gallery';
import SkillsIcons from './components/ui/skills-icons';
import ChatAgent from './components/ui/chat-agent';
import RevealBanner from './components/ui/reveal-banner';
import ResumePreview from './components/ui/resume-preview';
import MobileApp, { useMobileSheet } from './components/ui/mobile-app';
import { NAME, ROLE, EMAIL, PHONE, RESUME, LINKS, EXPERIENCES, TAGLINE, BUILD_SHOTS } from './data/profile';

const profilePhoto = '/profile.webp';
const sectionIds = {
  Home: 'home',
  Projects: 'projects',
  Skills: 'skills',
  Resume: 'resume',
  Experience: 'experience',
  Contact: 'contact',
};

const socialLinks = [
  { href: LINKS.linkedin, label: 'LinkedIn profile', Icon: Linkedin },
  { href: LINKS.github, label: 'GitHub profile', Icon: Github },
  { href: LINKS.leetcode, label: 'LeetCode profile', Icon: SiLeetcode },
  { href: `mailto:${EMAIL}`, label: 'Send email', Icon: Mail, internal: true },
  { href: RESUME, label: 'Resume (PDF)', Icon: FileText },
];

const Portfolio = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const [mindsetIndex, setMindsetIndex] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [bgAccentColor, setBgAccentColor] = useState('#8f7cff');
  const mobileSheet = useMobileSheet();

  const scrollToSection = (id) => {
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const mindsetInterval = window.setInterval(() => {
      setMindsetIndex((current) => (current + 1) % BUILD_SHOTS.length);
    }, 3000);
    return () => window.clearInterval(mindsetInterval);
  }, []);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem('portfolio-theme');
    if (storedTheme) {
      setIsDarkMode(storedTheme === 'dark');
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem('portfolio-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    const sections = Object.entries(sectionIds);
    const handleScroll = () => {
      const entries = sections
        .map(([tab, id]) => {
          const el = document.getElementById(id);
          if (!el) return null;
          return { tab, top: el.getBoundingClientRect().top };
        })
        .filter(Boolean);
      if (entries.length === 0) return;
      const nearest = entries.reduce((closest, entry) => {
        return Math.abs(entry.top - 120) < Math.abs(closest.top - 120) ? entry : closest;
      }, entries[0]);
      setActiveTab(nearest.tab);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // The background tubes follow the pointer via body `pointermove`, which the
  // browser stops sending once a touch turns into a scroll. Re-issue it from
  // touchmove so the background tracks the thumb on phones the way it tracks
  // the cursor on desktop.
  useEffect(() => {
    if (typeof PointerEvent === 'undefined' || !window.matchMedia('(hover: none)').matches) return undefined;
    const forward = (event) => {
      const touch = event.touches[0];
      if (!touch) return;
      document.body.dispatchEvent(
        new PointerEvent('pointermove', { clientX: touch.clientX, clientY: touch.clientY, pointerType: 'touch' })
      );
    };
    window.addEventListener('touchstart', forward, { passive: true });
    window.addEventListener('touchmove', forward, { passive: true });
    return () => {
      window.removeEventListener('touchstart', forward);
      window.removeEventListener('touchmove', forward);
    };
  }, []);

  // Chat actions scroll to a section on desktop; on phones they open the sheet.
  const handleChatNavigate = (sectionId) => {
    if (window.matchMedia('(max-width: 767px)').matches) {
      setChatOpen(false);
      mobileSheet.open(sectionId);
      return;
    }
    scrollToSection(sectionId);
  };

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    const target = document.getElementById(sectionIds[tab]);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };


  const themeClasses = {
    root: isDarkMode ? 'bg-[#0a0a0a] text-white' : 'bg-neutral-50 text-neutral-900',
    nav: isDarkMode ? 'bg-[#121212]/70 backdrop-blur-xl border border-white/5 text-white' : 'bg-white/70 backdrop-blur-xl border border-neutral-200/70 text-neutral-900',
    card: isDarkMode ? 'bg-[#111111]/60 backdrop-blur-xl border border-white/10 text-white' : 'bg-white/70 backdrop-blur-xl border border-neutral-200/70 text-neutral-900',
    panel: isDarkMode ? 'bg-[#161616]/60 backdrop-blur-xl border border-white/5 text-white' : 'bg-white/50 backdrop-blur-xl border border-neutral-200/70 text-neutral-900',
    accentText: isDarkMode ? 'text-emerald-400' : 'text-emerald-600',
    mutedText: isDarkMode ? 'text-gray-400' : 'text-neutral-600',
    subCard: isDarkMode ? 'bg-[#1c1c1c]/60 backdrop-blur-md border border-white/10' : 'bg-neutral-100/70 backdrop-blur-md border border-neutral-300/70',
    navButtonText: isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-neutral-500 hover:text-neutral-700',
    accentButton: isDarkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-neutral-900/10 hover:bg-neutral-800/10 text-neutral-900',
  };


  return (
    <>
      <div className={`min-h-screen ${themeClasses.root} font-sans selection:bg-emerald-500/30 overflow-x-hidden`}>
      {/* BACKGROUND */}
      {isDarkMode ? <TubesCursorBackground onColorChange={setBgAccentColor} /> : <LightBackground />}

      {/* PHONE — its own app: a home screen of tiles, each opening a full-screen sheet */}
      <MobileApp
        className="md:hidden"
        ready
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode((current) => !current)}
        themeClasses={themeClasses}
        photo={profilePhoto}
        mindsetShot={BUILD_SHOTS[mindsetIndex]}
        experiences={EXPERIENCES}
        accentColor={isDarkMode ? bgAccentColor : '#8f7cff'}
        sheetNav={mobileSheet}
        onOpenChat={() => setChatOpen(true)}
      />

      {/* DESKTOP & TABLET */}
      <div className="hidden md:block">
      {/* FLOATING NAV — desktop */}
      <nav className={`hidden md:flex fixed top-8 left-1/2 -translate-x-1/2 z-50 items-center gap-2 p-1.5 backdrop-blur-2xl rounded-full shadow-2xl ${themeClasses.nav}`}>
        {Object.keys(sectionIds).map((tab) => (
          <button
            key={tab}
            onClick={() => handleNavClick(tab)}
            className={`px-5 lg:px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-full transition-all whitespace-nowrap ${
              activeTab === tab
                ? isDarkMode
                  ? 'bg-white/10 text-white shadow-inner'
                  : 'bg-neutral-900/10 text-neutral-900 shadow-inner'
                : themeClasses.navButtonText
            }`}
          >
            {tab}
          </button>
        ))}
        <button
          onClick={() => setIsDarkMode((current) => !current)}
          className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition ${themeClasses.accentButton}`}
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
        </button>
      </nav>

      {/* SOCIAL RAIL — desktop only; on phones these live in the mobile menu instead, where they can't cover content */}
      <div className={`hidden md:flex fixed top-1/2 -translate-y-1/2 left-4 sm:left-6 z-50 flex-col items-center gap-2 p-2 backdrop-blur-2xl rounded-full shadow-2xl border ${isDarkMode ? 'border-emerald-500/20' : 'border-emerald-600/20'} ${themeClasses.nav}`}>
        {socialLinks.map(({ href, label, Icon, internal }) => (
          <a
            key={label}
            href={href}
            {...(internal ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
            aria-label={label}
            title={label}
            className={`inline-flex items-center justify-center w-11 h-11 rounded-full transition ${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-900/10'}`}
          >
            <Icon size={20} />
          </a>
        ))}
      </div>

      <main id="home" className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-24 md:pt-32 pb-12 sm:pb-20">

        {/* HERO GRID */}
        <section className="grid grid-cols-2 md:grid-cols-12 gap-4 sm:gap-5 mb-14 sm:mb-24">

          {/* LEFT COLUMN — name card + mindset share both grid rows so the bento ends flush */}
          <div className="hidden md:flex md:col-start-1 md:col-span-4 md:row-start-1 md:row-span-2 flex-col gap-4 sm:gap-5">
          {/* NAME CARD */}
          <div className={`hidden md:flex shrink-0 min-h-[170px] rounded-[2rem] p-6 sm:p-8 flex-col justify-between relative overflow-hidden shadow-[0_10px_45px_rgba(0,_0,_0,_0.35)] ${themeClasses.card}`}>
            <span aria-hidden="true" className={`pointer-events-none select-none absolute -right-4 -bottom-12 text-[9rem] font-black leading-none ${isDarkMode ? 'text-white/[0.04]' : 'text-neutral-900/[0.04]'}`}>
              VR
            </span>
            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-emerald-400 font-black mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {ROLE}
              </span>
              <h1 className={`text-3xl lg:text-[2.4rem] font-black uppercase tracking-tighter leading-[0.95] ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                VISHWASWARUP<br />
                <span className="text-gray-400">RATH</span>
              </h1>
            </div>
            <div className={`relative z-10 mt-8 h-px w-full bg-gradient-to-r from-emerald-500/70 ${isDarkMode ? 'via-white/10' : 'via-neutral-900/10'} to-transparent`} />
          </div>

          {/* MINDSET */}
          <div className={`flex-1 min-h-0 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 flex flex-col justify-between gap-6 shadow-[0_0_35px_rgba(255,_255,_255,_0.06)] ${themeClasses.card}`}>
            <div>
              <h3 className={`text-xl font-black uppercase tracking-tight mb-4 flex items-center gap-3 ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                <Hammer size={22} className="text-emerald-400" /> MINDSET
              </h3>
              <p className={`${themeClasses.mutedText} text-sm leading-relaxed`}>
                {TAGLINE}
              </p>
            </div>
            <div className={`relative flex-1 min-h-[220px] rounded-[2rem] overflow-hidden shadow-inner bg-black ${themeClasses.subCard}`}>
              {/* Screenshots are landscape: shown whole over a blurred copy of themselves */}
              <img src={BUILD_SHOTS[mindsetIndex].src} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover scale-125 blur-2xl opacity-60" />
              <img
                key={mindsetIndex}
                src={BUILD_SHOTS[mindsetIndex].src}
                alt={`${BUILD_SHOTS[mindsetIndex].alt} screenshot`}
                className="absolute inset-x-0 top-1/2 -translate-y-1/2 w-full h-auto animate-photo-settle"
              />
            </div>
          </div>
          </div>

          {/* MAIN PHOTO — desktop only; the phone hero above already leads with it */}
          <div className={`hidden md:block md:col-span-4 md:col-start-5 md:row-start-1 md:row-span-1 h-[320px] md:h-[550px] rounded-[2.5rem] overflow-hidden shadow-[0_10px_50px_rgba(0,_0,_0,_0.3)] relative ${themeClasses.panel}`}>
            <img
              src={profilePhoto}
              className="w-full h-full object-cover"
              alt={NAME}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
          </div>

          {/* CRAFT */}
          <div className={`col-span-2 md:col-span-4 md:col-start-9 md:row-start-1 md:row-span-1 md:min-h-[550px] rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 flex flex-col justify-between shadow-[0_10px_35px_rgba(0,_0,_0,_0.3)] ${themeClasses.card}`}>
            <div>
              <h3 className={`text-xl font-black uppercase tracking-tight mb-4 flex items-center gap-3 ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                <User size={22} className="text-emerald-400" /> ABOUT ME
              </h3>
              <p className={`${themeClasses.mutedText} text-sm leading-relaxed mb-8`}>
                I&apos;m a <span className={`${isDarkMode ? 'text-white' : 'text-neutral-900'} font-medium`}>third-year B.Tech CSE student</span> specialising in AI/ML, with a keen interest in machine learning. My expertise is in <span className={`${isDarkMode ? 'text-white' : 'text-neutral-900'} font-medium`}>generative AI, RAG and LLMs</span>, and I interned for two months at <span className={`${isDarkMode ? 'text-white' : 'text-neutral-900'} font-medium`}>DRDO&apos;s CAIR in Bangalore</span>.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {['GenAI', 'RAG', 'LLMs', 'Python'].map((t) => (
                <span key={t} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase ${isDarkMode ? 'bg-white/5 border border-white/10 text-gray-300' : 'bg-neutral-100 border border-neutral-200 text-neutral-700'}`}>{t}</span>
              ))}
            </div>
          </div>

          {/* QUOTE */}
          <div className={`col-span-1 md:col-span-4 md:col-start-5 md:row-start-2 md:row-span-1 min-h-[150px] md:min-h-[170px] rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-10 flex flex-col justify-center relative overflow-hidden shadow-[0_0_35px_rgba(255,_255,_255,_0.06)] ${themeClasses.card}`}>
            <img src="/spidy.jpg" alt="" aria-hidden="true" loading="lazy" className={`absolute inset-0 w-full h-full object-cover ${isDarkMode ? 'opacity-25' : 'opacity-20'}`} />
            <div className="relative mb-3 sm:mb-4 inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-500/10 text-emerald-400">
              <Quote size={22} className="sm:hidden" /><Quote size={28} className="hidden sm:block" />
            </div>
            <p className={`${isDarkMode ? 'text-white' : 'text-neutral-900'} relative text-base md:text-2xl font-black leading-tight`}>
              “With great code comes great debugging.”
            </p>
          </div>

          {/* LOCATION */}
          <div className={`col-span-1 md:col-span-4 md:col-start-9 md:row-start-2 min-h-[150px] md:min-h-[160px] rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-[0_0_35px_rgba(255,_255,_255,_0.05)] ${themeClasses.card}`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full -mr-10 -mt-10"></div>
            <img src="/delhi-map.jpg" alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-25" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-6">
                <MapPin className="text-emerald-400 shrink-0" size={18} />
                <span className={`text-[9px] sm:text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.35em] ${themeClasses.mutedText}`}>Location</span>
              </div>
              <h3 className={`text-lg md:text-3xl font-black uppercase tracking-tight leading-[1.05] ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>New Delhi, India</h3>
            </div>
          </div>
        </section>
        {/* SCROLL-REVEALED BANNER — wipes open under the bento */}
        <RevealBanner src="/ironman-banner.jpg" position="center 30%" caption="“I am just a mechanic, I like solving problems”" className="mb-16 sm:mb-24 lg:mb-32" />

        {/* PROJECTS SECTION */}
        <section id="projects" className="mb-16 sm:mb-24 lg:mb-32">
          <div className="text-center mb-8 sm:mb-16">
            <p className={`text-[10px] font-black uppercase tracking-[0.5em] ${themeClasses.mutedText}`}>PORTFOLIO</p>
            <h2 className="text-[2.6rem] leading-[0.95] sm:text-4xl md:text-5xl font-black mt-3 sm:mt-4">Featured <span className="text-emerald-500">projects</span></h2>
          </div>

          <ProjectsGallery isDarkMode={isDarkMode} themeClasses={themeClasses} />
        </section>

      {/* Skills Section */}
      <section id="skills" className="py-9 sm:py-20 px-4 sm:px-6">
        <div className={`max-w-7xl mx-auto rounded-[2rem] sm:rounded-[2.5rem] p-4 sm:p-10 ${themeClasses.panel}`}>
          <h2 className={`text-2xl sm:text-3xl md:text-4xl font-black mb-8 md:mb-12 uppercase tracking-wide ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>Technical Skills</h2>
          <SkillsIcons isDarkMode={isDarkMode} themeClasses={themeClasses} />
        </div>
      </section>

      {/* Resume Section */}
      <section id="resume" className="py-9 sm:py-20 px-4 sm:px-6">
        <div className={`max-w-7xl mx-auto rounded-[2rem] sm:rounded-[2.5rem] p-4 sm:p-10 ${themeClasses.panel}`}>
          <div className="text-center mb-7 sm:mb-12">
            <p className={`text-[10px] font-black uppercase tracking-[0.5em] ${themeClasses.mutedText}`}>RESUME</p>
            <h2 className={`text-[2.6rem] leading-[0.95] sm:text-4xl md:text-5xl font-black mt-3 sm:mt-4 ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>My <span className="text-emerald-500">Resume.</span></h2>
            <p className={`${themeClasses.mutedText} mt-4`}>Scroll through it below, or download the PDF.</p>
          </div>
          <ResumePreview isDarkMode={isDarkMode} themeClasses={themeClasses} />
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-9 sm:py-20 px-4 sm:px-6">
        <div className={`max-w-7xl mx-auto rounded-[2rem] sm:rounded-[2.5rem] p-4 sm:p-10 ${themeClasses.panel}`}>
          <h2 className={`text-2xl sm:text-3xl md:text-4xl font-black mb-8 md:mb-12 uppercase tracking-wide ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>Professional Experience</h2>
          <div className="space-y-8">
            {EXPERIENCES.map((exp, idx) => (
              <div key={idx} className={`rounded-[2rem] p-6 ${themeClasses.card}`}>
                <h3 className={`text-2xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>{exp.title}</h3>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-neutral-600'} mb-4 text-sm uppercase tracking-wider`}>{exp.company} • {exp.period}</p>
                {exp.highlights.length > 0 && (
                  <ul className="space-y-2">
                    {exp.highlights.map((highlight, hidx) => (
                      <li key={hidx} className={`${isDarkMode ? 'text-gray-300' : 'text-neutral-700'} text-sm flex items-start gap-2`}>
                        <ChevronRight size={14} className="mt-1 text-emerald-500 min-w-[14px]" /> {highlight}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-9 sm:py-20 px-4 sm:px-6">
        <div className={`max-w-7xl mx-auto rounded-[2rem] sm:rounded-[2.5rem] p-4 sm:p-10 text-center ${themeClasses.panel}`}>
          <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-4 uppercase tracking-wide ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>Let&apos;s Work Together</h2>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-neutral-700'} mb-8 text-lg max-w-2xl mx-auto`}>I&apos;m always open to discussing new projects, freelance opportunities or creative ideas. If you have something in mind, feel free to reach out.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href={`mailto:${EMAIL}`}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <Mail size={20} /> Get In Touch
            </a>
            <a
              href={LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={`px-10 py-3 rounded-xl font-bold transition-all flex items-center gap-2 border ${isDarkMode ? 'border-white/10' : 'border-neutral-300'} ${themeClasses.accentButton}`}
            >
              <Linkedin size={20} /> LinkedIn
            </a>
            <a
              href={LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className={`px-10 py-3 rounded-xl font-bold transition-all flex items-center gap-2 border ${isDarkMode ? 'border-white/10' : 'border-neutral-300'} ${themeClasses.accentButton}`}
            >
              <Github size={20} /> GitHub
            </a>
          </div>
          <div className={`mt-16 pt-8 border-t ${isDarkMode ? 'border-white/5 text-gray-500' : 'border-neutral-200 text-neutral-500'} text-xs tracking-widest uppercase`}>
            <p className="mb-2 tracking-normal text-sm lowercase">{EMAIL}</p>
            <p className="mb-2 tracking-normal text-sm">{PHONE}</p>
            <p>© 2026 {NAME}.</p>
          </div>
        </div>
      </section>
    </main>

      {/* FOOTER */}
      <footer className={`relative z-10 border-t py-16 px-6 text-center ${isDarkMode ? 'border-white/5 bg-[#0a0a0a]' : 'border-neutral-200 bg-neutral-50'}`}>
        <div className={`${isDarkMode ? 'text-gray-500' : 'text-neutral-500'} text-xs font-black uppercase tracking-[0.2em]`}>
            © 2026 {NAME}
        </div>
      </footer>
      </div>


      <ChatAgent
        isDarkMode={isDarkMode}
        themeClasses={themeClasses}
        onNavigate={handleChatNavigate}
        accentColor={isDarkMode ? bgAccentColor : '#8f7cff'}
        open={chatOpen}
        onToggle={() => setChatOpen((v) => !v)}
      />
      </div>
    </>
  );
};

export default Portfolio;
