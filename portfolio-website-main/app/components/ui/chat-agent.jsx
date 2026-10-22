"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Sparkles } from 'lucide-react';
import { NAME, EMAIL } from '../../data/profile';

// Rule-based FAQ answers. This is the offline fallback; once an LLM API is
// wired into getReply() below, it only needs to be used when that call fails.
const KNOWLEDGE_BASE = [
  {
    keywords: ['skill', 'tech', 'stack', 'language', 'know', 'good at'],
    reply: "Vishwaswarup works with Python and JavaScript, builds with React, FastAPI, Flask and Next.js, and does AI/ML work with TensorFlow, YOLOv8, RAG pipelines and LangChain, backed by MongoDB, PostgreSQL and AWS. The Skills section has the full breakdown.",
    action: 'skills',
  },
  {
    keywords: ['experience', 'intern', 'work', 'job', 'career', 'background', 'cair', 'drdo'],
    reply: "He was an AI Intern at CAIR, DRDO in Bengaluru (Jun – Jul 2026), working on a RAG-based system for multi-modal intelligence analysis. He is also a Stanford Certified ML Developer, an Amazon ML Summer School student and a B.Tech AI/ML student. See the Experience section for details.",
    action: 'experience',
  },
  {
    keywords: ['project', 'built', 'portfolio', 'rag', 'nocodeml', 'happenmuj', 'muj', 'intellirag', 'artefax', 'biterate', 'visionai', 'stock', 'recommender'],
    reply: "Highlights: NoCodeML (a no-code ML experimentation platform with an 8-step workflow and 9 model types), HappenMUJ (a campus event discovery and community platform on FastAPI + MongoDB), IntelliRAG (multi-modal RAG for incident analysis), BiteRate (restaurant review sentiment analyzer, up to 88% accuracy), Artefax (one document turned into summaries, posts and decks with Gemini), a personal Stock Recommender (FastAPI + React) and VisionAI (a Gemini-powered voice assistant). AI-Logistic-Orchestrator is in early development. They're all in the Projects section.",
    action: 'projects',
  },
  {
    keywords: ['education', 'study', 'student', 'university', 'college', 'degree', 'b.tech', 'btech'],
    reply: "He's a B.Tech student specialising in AI/ML, and a Stanford Certified ML Developer. More in the Experience section.",
    action: 'experience',
  },
  {
    keywords: ['resume', 'cv', 'download'],
    reply: "You can scroll through his resume and download the PDF in the Resume section.",
    action: 'resume',
  },
  {
    keywords: ['contact', 'email', 'reach', 'phone', 'linkedin', 'github', 'leetcode'],
    reply: `You can email him at ${EMAIL}, or find him on LinkedIn, GitHub and LeetCode via the Contact section.`,
    action: 'contact',
  },
  {
    keywords: ['hire', 'work with', 'collaborate', 'freelance', 'opportunit'],
    reply: "Great to hear! He's open to new projects, freelance opportunities and creative ideas. The Contact section has the fastest ways to reach him.",
    action: 'contact',
  },
];

const FALLBACK_REPLY = `I'm a simple FAQ assistant, so I might not have that one — try asking about skills, experience, projects or his resume. You can also email ${NAME.split(' ')[0]} directly at ${EMAIL}.`;

const GREETING = `Hi, I'm ${NAME.split(' ')[0]}'s assistant. Ask me about his skills, projects, experience or resume.`;

const QUICK_REPLIES = ['What are your skills?', 'Tell me about your projects', 'Show me your resume', 'How can I contact you?'];

function matchReply(text) {
  const lower = text.toLowerCase();
  for (const entry of KNOWLEDGE_BASE) {
    if (entry.keywords.some((k) => lower.includes(k))) {
      return entry;
    }
  }
  return { reply: FALLBACK_REPLY };
}

// The single place that produces a reply. `history` is the conversation so
// far ({ role: 'user' | 'bot', text }). It returns { reply, action? }, where
// `action` is an optional section id to scroll to (phones open its sheet).
// To use an LLM, call your API route here and fall back to matchReply(text)
// if the request fails.
async function getReply(text, history) { // eslint-disable-line no-unused-vars
  return matchReply(text);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Texting rhythm: a beat before the reply starts being typed, then typing time
// that grows with the length of the answer.
const READ_DELAY_MS = 600;
const typingTime = (text) => Math.min(3200, Math.max(1100, 700 + text.length * 16));

export default function ChatAgent({ isDarkMode, themeClasses, onNavigate, accentColor = '#8f7cff', open, onToggle }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false); // typing dots visible
  const [pending, setPending] = useState(false); // blocks sending mid-conversation
  const greeted = useRef(false);
  const scrollRef = useRef(null);

  // First open: the greeting arrives like a message instead of being on screen already.
  useEffect(() => {
    if (!open || greeted.current) return;
    greeted.current = true;
    setPending(true);
    setTyping(true);
    // No cleanup on purpose: the widget lives as long as the page, and a
    // cleanup would cancel this under React strict mode's double effect run.
    setTimeout(() => {
      setTyping(false);
      setMessages([{ role: 'bot', text: GREETING }]);
      setPending(false);
    }, 1300);
  }, [open]);

  // Glide to the newest message rather than jumping.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, typing, open]);

  const respond = async (text) => {
    if (pending) return;
    const history = [...messages, { role: 'user', text }];
    setMessages(history);
    setPending(true);
    const started = Date.now();
    const typingTimer = setTimeout(() => setTyping(true), READ_DELAY_MS);
    let match;
    try {
      match = await getReply(text, history);
    } catch {
      match = { reply: FALLBACK_REPLY };
    }
    // Never faster than a person could type it; a slow LLM call simply keeps
    // the dots on for longer.
    const wait = READ_DELAY_MS + typingTime(match.reply) - (Date.now() - started);
    if (wait > 0) await sleep(wait);
    clearTimeout(typingTimer);
    setTyping(false);
    setMessages((prev) => [...prev, { role: 'bot', text: match.reply }]);
    setPending(false);
    if (match.action) {
      setTimeout(() => onNavigate(match.action), 1100);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    respond(trimmed);
    setInput('');
  };

  return (
    <>
      {/* Floating orb is desktop-only; on phones the same orb sits in the bottom tab bar */}
      <div className={`hidden sm:flex fixed bottom-6 right-6 z-[60] flex-col items-end gap-3 ${open ? '' : 'animate-gentle-float'}`}>
        <button
          onClick={onToggle}
          aria-label={open ? 'Close chat assistant' : 'Open chat assistant'}
          style={{ '--orb-color': accentColor }}
          className="ai-orb relative inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full text-white transition-transform hover:scale-105"
        >
          <span className="ai-orb-shine" aria-hidden="true" />
          {open ? <X size={22} className="relative z-10" /> : <Sparkles size={22} className="relative z-10" />}
        </button>
      </div>

      {open && (
        <div onClick={onToggle} className="sm:hidden fixed inset-0 z-[59] bg-black/60 backdrop-blur-[2px] touch-none" aria-hidden="true" />
      )}

      {open && (
        <div className={`fixed bottom-3 right-3 left-3 sm:bottom-24 sm:right-6 sm:left-auto z-[60] sm:w-[22rem] h-[min(78svh,36rem)] sm:h-[28rem] rounded-[1.75rem] shadow-2xl flex flex-col overflow-hidden ${isDarkMode ? 'max-sm:bg-[#0c0c0c]' : 'max-sm:bg-neutral-50'} ${themeClasses.card}`}>
          <div className={`px-5 py-4 flex items-center gap-3 border-b ${isDarkMode ? 'border-white/10' : 'border-neutral-200'}`}>
            <div className="w-9 h-9 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-400">
              <Sparkles size={18} />
            </div>
            <div className="flex-1">
              <p className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>Ask about {NAME.split(' ')[0]}</p>
              <p className="text-[11px] text-emerald-400 uppercase tracking-widest font-bold">FAQ assistant</p>
            </div>
            {/* Phones have no orb to close with, so the panel carries its own */}
            <button
              onClick={onToggle}
              aria-label="Close chat assistant"
              className={`sm:hidden w-10 h-10 inline-flex items-center justify-center rounded-full ${isDarkMode ? 'bg-white/5 text-gray-300' : 'bg-neutral-900/5 text-neutral-700'}`}
            >
              <X size={18} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} style={{ transformOrigin: m.role === 'user' ? 'right bottom' : 'left bottom' }} className={`chat-msg-in flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-emerald-500 text-white'
                      : `${themeClasses.subCard} ${isDarkMode ? 'text-gray-200' : 'text-neutral-700'}`
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="chat-msg-in flex justify-start" style={{ transformOrigin: 'left bottom' }} role="status" aria-label="Typing">
                <div className={`flex items-center gap-1.5 rounded-2xl px-4 py-3.5 ${themeClasses.subCard}`}>
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      style={{ animationDelay: `${d * 0.18}s` }}
                      className={`typing-dot w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-gray-400' : 'bg-neutral-500'}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="shrink-0 px-5 pb-3 flex flex-nowrap gap-2 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {QUICK_REPLIES.map((q) => (
              <button
                key={q}
                onClick={() => respond(q)}
                disabled={pending}
                className={`shrink-0 whitespace-nowrap text-[11px] font-bold px-3 py-1.5 rounded-full border transition-colors disabled:opacity-50 disabled:pointer-events-none ${
                  isDarkMode ? 'border-white/10 text-gray-300 hover:border-emerald-500/50 hover:text-emerald-300' : 'border-neutral-200 text-neutral-600 hover:border-emerald-500/50 hover:text-emerald-600'
                }`}
              >
                {q}
              </button>
            ))}
          </div>

          <form onSubmit={handleSend} className={`px-4 py-3 flex items-center gap-2 border-t ${isDarkMode ? 'border-white/10' : 'border-neutral-200'}`}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question…"
              className={`flex-1 rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/40 ${themeClasses.subCard} ${isDarkMode ? 'text-white placeholder:text-gray-500' : 'text-neutral-900 placeholder:text-neutral-400'}`}
            />
            <button
              type="submit"
              disabled={pending}
              aria-label="Send"
              className="w-10 h-10 shrink-0 inline-flex items-center justify-center rounded-full bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
