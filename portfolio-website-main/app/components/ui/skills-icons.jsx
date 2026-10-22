"use client";
import React from 'react';
import { SiPython, SiJavascript, SiReact, SiGit, SiTensorflow, SiYolo, SiLangchain, SiMongodb } from 'react-icons/si';
import { FaAws } from 'react-icons/fa';
import { BrainCircuit } from 'lucide-react';

export const SKILL_GROUPS = [
  {
    category: 'Languages & Web',
    items: [
      { name: 'Python', Icon: SiPython },
      { name: 'JavaScript', Icon: SiJavascript },
      { name: 'React', Icon: SiReact },
      { name: 'Git', Icon: SiGit },
    ],
  },
  {
    category: 'AI & ML',
    items: [
      { name: 'TensorFlow', Icon: SiTensorflow },
      { name: 'YOLOv8', Icon: SiYolo },
      { name: 'RAG', Icon: BrainCircuit },
      { name: 'LangChain', Icon: SiLangchain },
    ],
  },
  {
    category: 'Data & Cloud',
    items: [
      { name: 'MongoDB', Icon: SiMongodb },
      { name: 'AWS', Icon: FaAws },
    ],
  },
];

export default function SkillsIcons({ isDarkMode, themeClasses }) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {SKILL_GROUPS.map((group) => (
        <div key={group.category} className={`rounded-[2rem] p-6 ${themeClasses.card}`}>
          <h3 className={`font-bold mb-6 uppercase text-xs tracking-widest ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>{group.category}</h3>
          <div className="grid grid-cols-2 gap-4">
            {group.items.map(({ name, Icon }) => (
              <div
                key={name}
                className={`group flex flex-col items-center gap-3 rounded-2xl py-5 px-3 transition-all ${themeClasses.subCard} hover:-translate-y-1`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border transition-colors ${
                    isDarkMode
                      ? 'bg-gradient-to-b from-white/10 to-white/[0.02] border-white/15 text-gray-200 group-hover:border-emerald-400/60 group-hover:text-emerald-300'
                      : 'bg-gradient-to-b from-white to-neutral-100 border-neutral-300 text-neutral-600 group-hover:border-emerald-500/60 group-hover:text-emerald-600'
                  }`}
                  style={{ boxShadow: isDarkMode ? 'inset 0 1px 0 rgba(255,255,255,0.15)' : 'inset 0 1px 0 rgba(255,255,255,0.8)' }}
                >
                  <Icon size={20} />
                </div>
                <span className={`text-[11px] font-bold text-center ${themeClasses.mutedText}`}>{name}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
