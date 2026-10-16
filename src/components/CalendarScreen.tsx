import React, { useState, useMemo } from 'react';
import { UserProfile, DailyFortune, Language, AppView } from '../types';
import { calculateDayElement, calculateBirthType } from '../engine/fiveElements';
import { generateDailyFortune } from '../data/fortuneAdvice';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Sun } from 'lucide-react';

interface CalendarScreenProps {
  user: UserProfile;
  currentDateStr: string;
  onSelectDate: (dateStr: string) => void;
  onNavigate: (view: AppView) => void;
  lang: Language;
}

export const CalendarScreen: React.FC<CalendarScreenProps> = ({
  user,
  currentDateStr,
  onSelectDate,
  onNavigate,
  lang,
}) => {
  const [viewYear, setViewYear] = useState(() => new Date(currentDateStr).getFullYear());
  const [viewMonth, setViewMonth] = useState(() => new Date(currentDateStr).getMonth() + 1); // 1-12
  const [activeDate, setActiveDate] = useState(currentDateStr);

  const birthType = user.birthType || calculateBirthType(1995, 8, 15);

  const inspectedFortune = useMemo(() => {
    return generateDailyFortune(activeDate, birthType, user.constitution);
  }, [activeDate, birthType, user.constitution]);

  const daysInMonth = new Date(viewYear, viewMonth, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth - 1, 1).getDay(); // 0 = Sun

  const handlePrevMonth = () => {
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear(prev => prev - 1);
    } else {
      setViewMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear(prev => prev + 1);
    } else {
      setViewMonth(prev => prev + 1);
    }
  };

  const monthNamesJa = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  const monthNamesEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const weekDaysJa = ['日', '月', '火', '水', '木', '金', '土'];
  const weekDaysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const ELEMENT_KANJI: Record<string, string> = {
    wood: '木',
    fire: '火',
    earth: '土',
    metal: '金',
    water: '水',
  };

  return (
    <div className="space-y-6 pb-20 md:pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#C5A059]/20 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-[#C5A059] uppercase tracking-wider">
            <CalendarIcon className="w-4 h-4" />
            <span>{lang === 'ja' ? '運勢カレンダーと履歴' : 'Fortune Calendar & History'}</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#F3E5AB] mt-1">
            {lang === 'ja' ? '五行日運リズムカレンダー' : 'Elemental Rhythm Calendar'}
          </h1>
        </div>

        <button
          onClick={() => {
            const today = new Date().toISOString().split('T')[0];
            setActiveDate(today);
            setViewYear(new Date(today).getFullYear());
            setViewMonth(new Date(today).getMonth() + 1);
          }}
          className="px-3.5 py-1.5 bg-[#172136] hover:bg-[#202E4C] text-[#F3E5AB] border border-[#C5A059]/30 rounded-lg text-xs font-semibold self-start sm:self-auto transition-colors cursor-pointer"
        >
          {lang === 'ja' ? '今日へ戻る' : 'Today'}
        </button>
      </div>

      {/* Calendar Grid Card */}
      <div className="p-6 rounded-2xl bg-[#0F172A] border border-[#334155] shadow-xl space-y-4">
        {/* Month Navigation */}
        <div className="flex items-center justify-between border-b border-[#334155] pb-3">
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg font-bold text-[#F3E5AB]">
              {viewYear}年 {lang === 'ja' ? monthNamesJa[viewMonth - 1] : monthNamesEn[viewMonth - 1]}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg bg-[#172136] hover:bg-[#202E4C] text-[#CBD5E1] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg bg-[#172136] hover:bg-[#202E4C] text-[#CBD5E1] transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-[#94A3B8]">
          {(lang === 'ja' ? weekDaysJa : weekDaysEn).map((d, i) => (
            <div key={d} className={`py-1 ${i === 0 ? 'text-[#F87171]' : i === 6 ? 'text-[#38BDF8]' : ''}`}>
              {d}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[58px] p-1 rounded-lg bg-[#131B2E]/30 opacity-20" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = `${viewYear}-${String(viewMonth).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const isToday = dateStr === currentDateStr;
            const isSelected = dateStr === activeDate;

            const dayElement = calculateDayElement(viewYear, viewMonth, dayNum).element;
            const fortune = generateDailyFortune(dateStr, birthType, user.constitution);

            return (
              <button
                key={dateStr}
                onClick={() => {
                  setActiveDate(dateStr);
                  onSelectDate(dateStr);
                }}
                className={`min-h-[64px] p-1.5 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'border-[#C5A059] bg-[#1E293B] shadow-md ring-1 ring-[#C5A059]'
                    : isToday
                    ? 'border-[#38BDF8]/60 bg-[#131B2E]'
                    : 'border-[#334155]/60 bg-[#111827] hover:bg-[#172136]'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-xs font-bold font-mono ${
                      isSelected
                        ? 'text-[#F3E5AB]'
                        : isToday
                        ? 'text-[#38BDF8]'
                        : 'text-[#E2E8F0]'
                    }`}
                  >
                    {dayNum}
                  </span>

                  <span className="text-[10px] text-[#94A3B8] font-bold">
                    {ELEMENT_KANJI[dayElement]}
                  </span>
                </div>

                <div className="flex items-center justify-between w-full mt-1">
                  <span
                    className="text-[10px] font-bold px-1 rounded text-[#0C111D]"
                    style={{ backgroundColor: fortune.rank.colorHex }}
                  >
                    {fortune.rank.nameJa.slice(0, 2)}
                  </span>

                  <span
                    className="w-2 h-2 rounded-full border border-white/20"
                    style={{ backgroundColor: fortune.luckyColor.hex }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day In-Depth Preview Card */}
      <div className="p-6 rounded-2xl bg-[#0F172A] border border-[#C5A059]/40 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#334155] pb-3">
          <div>
            <span className="text-xs text-[#C5A059] font-medium tracking-wide">
              {lang === 'ja' ? '選択日の運勢プレビュー' : 'Selected Day Fortune'}
            </span>
            <h3 className="text-xl font-serif font-bold text-[#F3E5AB]">
              {inspectedFortune.date}（当日の五行：{ELEMENT_KANJI[inspectedFortune.dayElement]}）
            </h3>
          </div>

          <button
            onClick={() => {
              onSelectDate(activeDate);
              onNavigate('fortune');
            }}
            className="px-4 py-2 bg-gradient-to-r from-[#C5A059] to-[#D4AF37] hover:brightness-110 text-[#0C111D] font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Sun className="w-3.5 h-3.5" />
            <span>{lang === 'ja' ? 'この日の詳細運勢を見る' : 'Full Fortune Details'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-[#131B2E] border border-[#334155]">
            <div className="text-[#94A3B8]">{lang === 'ja' ? '運勢ランク' : 'Fortune Rank'}</div>
            <div className="text-base font-bold text-[#F3E5AB] mt-1 flex items-center gap-2">
              <span
                className="px-2 py-0.5 rounded text-xs text-[#0C111D]"
                style={{ backgroundColor: inspectedFortune.rank.colorHex }}
              >
                {lang === 'ja' ? inspectedFortune.rank.nameJa : inspectedFortune.rank.nameEn}
              </span>
              <span>{inspectedFortune.totalScore > 0 ? `+${inspectedFortune.totalScore}` : inspectedFortune.totalScore} 点</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#131B2E] border border-[#334155] flex items-center gap-3">
            <span
              className="w-8 h-8 rounded-lg border border-white/20 shrink-0"
              style={{ backgroundColor: inspectedFortune.luckyColor.hex }}
            />
            <div>
              <div className="text-[10px] text-[#94A3B8]">{lang === 'ja' ? 'ラッキーカラー' : 'Lucky Color'}</div>
              <div className="font-bold text-[#F3E5AB] text-xs">
                {lang === 'ja' ? inspectedFortune.luckyColor.nameJa : inspectedFortune.luckyColor.nameEn}
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#131B2E] border border-[#334155]">
            <div className="text-[10px] text-[#94A3B8]">{lang === 'ja' ? '総合アドバイス' : 'Overall Guidance'}</div>
            <p className="text-xs text-[#CBD5E1] line-clamp-2 mt-0.5">
              {lang === 'ja' ? inspectedFortune.overallAdviceJa : inspectedFortune.overallAdviceEn}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
