import React from 'react';
import { AppView, Language } from '../types';
import { Globe, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  lang: Language;
  onToggleLang: () => void;
  dateStr: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  lang,
  onToggleLang,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0C111D]/90 backdrop-blur-md border-b border-[#C5A059]/20 px-4 sm:px-8 py-3 transition-colors">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Single Wordmark */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-left group cursor-pointer focus-visible:outline-none"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8C6D23] flex items-center justify-center p-0.5 shadow-sm">
            <div className="w-full h-full rounded-full bg-[#0C111D] flex items-center justify-center text-[#F3E5AB] font-serif font-bold text-sm">
              五
            </div>
          </div>
          <span className="font-serif text-lg font-bold tracking-wider text-[#F3E5AB] whitespace-nowrap shrink-0 group-hover:text-white transition-colors">
            {lang === 'ja' ? '五行日運暦' : 'Gogyo Fortune'}
          </span>
        </button>

        {/* Zone 2: Concise Single-Line Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs lg:text-sm font-medium text-[#94A3B8]">
          <button
            onClick={() => onNavigate('fortune')}
            className={`whitespace-nowrap shrink-0 hover:text-[#F3E5AB] transition-colors cursor-pointer ${
              currentView === 'fortune' ? 'text-[#F3E5AB] font-semibold underline underline-offset-8 decoration-[#C5A059]' : ''
            }`}
          >
            {lang === 'ja' ? '今日の日運' : 'Daily Fortune'}
          </button>
          <button
            onClick={() => onNavigate('birth')}
            className={`whitespace-nowrap shrink-0 hover:text-[#F3E5AB] transition-colors cursor-pointer ${
              currentView === 'birth' ? 'text-[#F3E5AB] font-semibold underline underline-offset-8 decoration-[#C5A059]' : ''
            }`}
          >
            {lang === 'ja' ? '五行タイプ' : 'Birth Type'}
          </button>
          <button
            onClick={() => onNavigate('quiz')}
            className={`whitespace-nowrap shrink-0 hover:text-[#F3E5AB] transition-colors cursor-pointer ${
              currentView === 'quiz' || currentView === 'result' ? 'text-[#F3E5AB] font-semibold underline underline-offset-8 decoration-[#C5A059]' : ''
            }`}
          >
            {lang === 'ja' ? '体質診断' : 'Constitution'}
          </button>
          <button
            onClick={() => onNavigate('calendar')}
            className={`whitespace-nowrap shrink-0 hover:text-[#F3E5AB] transition-colors cursor-pointer ${
              currentView === 'calendar' ? 'text-[#F3E5AB] font-semibold underline underline-offset-8 decoration-[#C5A059]' : ''
            }`}
          >
            {lang === 'ja' ? '暦・履歴' : 'Calendar'}
          </button>
          <button
            onClick={() => onNavigate('tests')}
            className={`whitespace-nowrap shrink-0 hover:text-[#F3E5AB] transition-colors flex items-center gap-1 cursor-pointer ${
              currentView === 'tests' ? 'text-[#34D399] font-semibold underline underline-offset-8 decoration-[#10B981]' : ''
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#34D399]" />
            <span>{lang === 'ja' ? 'テスト検証' : 'Tests'}</span>
          </button>
          <button
            onClick={() => onNavigate('docs')}
            className={`whitespace-nowrap shrink-0 hover:text-[#F3E5AB] transition-colors cursor-pointer ${
              currentView === 'docs' ? 'text-[#F3E5AB] font-semibold underline underline-offset-8 decoration-[#C5A059]' : ''
            }`}
          >
            {lang === 'ja' ? '占術仕様' : 'Specs'}
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action (Language Switcher) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#F3E5AB] bg-[#172136] hover:bg-[#202E4C] border border-[#C5A059]/30 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            aria-label="Toggle language"
          >
            <Globe className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="font-semibold">{lang === 'ja' ? 'English' : '日本語'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
