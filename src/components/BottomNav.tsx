import React from 'react';
import { AppView, Language } from '../types';
import { Home, Compass, Activity, Sun, Calendar, ShieldCheck } from 'lucide-react';

interface BottomNavProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  lang: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate, lang }) => {
  const tabs = [
    {
      id: 'home' as AppView,
      icon: Home,
      labelJa: 'ホーム',
      labelEn: 'Home',
    },
    {
      id: 'birth' as AppView,
      icon: Compass,
      labelJa: '五行タイプ',
      labelEn: 'Type',
    },
    {
      id: 'quiz' as AppView,
      icon: Activity,
      labelJa: '体質診断',
      labelEn: 'Quiz',
    },
    {
      id: 'fortune' as AppView,
      icon: Sun,
      labelJa: '日運',
      labelEn: 'Fortune',
    },
    {
      id: 'calendar' as AppView,
      icon: Calendar,
      labelJa: '暦・履歴',
      labelEn: 'Calendar',
    },
    {
      id: 'tests' as AppView,
      icon: ShieldCheck,
      labelJa: 'テスト',
      labelEn: 'Tests',
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0C111D]/95 backdrop-blur-lg border-t border-[#C5A059]/20 pb-safe">
      <div className="grid grid-cols-6 items-center h-16 max-w-lg mx-auto px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            currentView === tab.id ||
            (tab.id === 'quiz' && currentView === 'result');

          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center transition-colors relative cursor-pointer ${
                isActive ? 'text-[#F3E5AB]' : 'text-[#64748B] hover:text-[#94A3B8]'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-[#C5A059]' : ''}`} />
              <span className={`text-[10px] font-medium tracking-tight mt-1 whitespace-nowrap ${isActive ? 'font-semibold text-[#F3E5AB]' : ''}`}>
                {lang === 'ja' ? tab.labelJa : tab.labelEn}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#C5A059]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
