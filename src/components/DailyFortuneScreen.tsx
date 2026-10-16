import React, { useState } from 'react';
import { DailyFortune, UserProfile, Language, AppView } from '../types';
import { Sun, CheckCircle, HeartPulse, Sparkles, Briefcase, Users, Calendar, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';

interface DailyFortuneScreenProps {
  fortune: DailyFortune;
  user: UserProfile;
  onDateChange: (dateStr: string) => void;
  onNavigate: (view: AppView) => void;
  lang: Language;
}

export const DailyFortuneScreen: React.FC<DailyFortuneScreenProps> = ({
  fortune,
  user,
  onDateChange,
  onNavigate,
  lang,
}) => {
  const [selectedDate, setSelectedDate] = useState(fortune.date);

  const handleDayOffset = (offset: number) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + offset);
    const newDateStr = current.toISOString().split('T')[0];
    setSelectedDate(newDateStr);
    onDateChange(newDateStr);
  };

  const ELEMENT_NAMES_JA: Record<string, string> = {
    wood: '木 (もく)',
    fire: '火 (か)',
    earth: '土 (ど)',
    metal: '金 (ごん)',
    water: '水 (すい)',
  };

  const ELEMENT_NAMES_EN: Record<string, string> = {
    wood: 'Wood',
    fire: 'Fire',
    earth: 'Earth',
    metal: 'Metal',
    water: 'Water',
  };

  return (
    <div className="space-y-6 pb-20 md:pb-12 max-w-4xl mx-auto">
      {/* Date Switcher & Header */}
      <div className="border-b border-[#C5A059]/20 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-[#C5A059] uppercase tracking-wider">
            <Sun className="w-4 h-4" />
            <span>{lang === 'ja' ? '陰陽五行 日運鑑定' : 'Yin-Yang Five Elements Daily Fortune'}</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#F3E5AB] mt-1">
            {selectedDate} の運勢
          </h1>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            {lang === 'ja'
              ? `当日の五行：【${ELEMENT_NAMES_JA[fortune.dayElement]}】（1970年からの経過日数：${fortune.epochDays}日）`
              : `Day's Element: [${ELEMENT_NAMES_EN[fortune.dayElement]}] (Epoch days: ${fortune.epochDays})`}
          </p>
        </div>

        {/* Date Pager */}
        <div className="flex items-center gap-1.5 bg-[#172136] p-1 rounded-xl border border-[#334155] self-start sm:self-auto">
          <button
            onClick={() => handleDayOffset(-1)}
            className="p-1.5 hover:bg-[#202E4C] rounded-lg text-[#CBD5E1] transition-colors cursor-pointer"
            title={lang === 'ja' ? '前日へ' : 'Previous Day'}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              onDateChange(e.target.value);
            }}
            className="bg-transparent text-xs text-[#F3E5AB] font-mono px-2 py-1 focus:outline-none cursor-pointer"
          />
          <button
            onClick={() => handleDayOffset(1)}
            className="p-1.5 hover:bg-[#202E4C] rounded-lg text-[#CBD5E1] transition-colors cursor-pointer"
            title={lang === 'ja' ? '翌日へ' : 'Next Day'}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Score & Rank Card */}
      <div className="p-6 rounded-2xl bg-[#0F172A] border border-[#334155] shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-[#94A3B8]">
              {lang === 'ja' ? '運勢ランクとスコア判定' : 'Fortune Rank & Total Score'}
            </span>
            <div className="flex items-center gap-3 mt-1.5">
              <span
                className="px-4 py-1.5 rounded-xl text-base font-bold text-[#0C111D] shadow-sm"
                style={{ backgroundColor: fortune.rank.colorHex }}
              >
                {lang === 'ja' ? fortune.rank.nameJa : fortune.rank.nameEn}
              </span>
              <span className="text-2xl font-bold font-mono text-[#F3E5AB]">
                {fortune.totalScore > 0 ? `+${fortune.totalScore}` : fortune.totalScore} 点
              </span>
            </div>
            <div className="text-xs text-[#CBD5E1] mt-2 leading-relaxed">
              {lang === 'ja' ? fortune.rank.summaryJa : fortune.rank.summaryEn}
            </div>
          </div>

          {/* Lucky Color Swatch */}
          <div className="p-3.5 rounded-xl bg-[#131B2E] border border-[#334155] flex items-center gap-3.5 self-start sm:self-auto shrink-0">
            <span
              className="w-10 h-10 rounded-xl border border-white/20 shadow-md shrink-0"
              style={{ backgroundColor: fortune.luckyColor.hex }}
            />
            <div>
              <div className="text-[10px] text-[#94A3B8]">
                {lang === 'ja' ? '調和のラッキーカラー' : 'Lucky Color'}
              </div>
              <div className="text-sm font-serif font-bold text-[#F3E5AB]">
                {lang === 'ja' ? fortune.luckyColor.nameJa : fortune.luckyColor.nameEn}
              </div>
              <div className="text-[10px] font-mono text-[#64748B]">
                {fortune.luckyColor.hex}
              </div>
            </div>
          </div>
        </div>

        {/* 4 Core Elemental Relations Summary (B, P, D) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-[#334155] text-xs">
          <div className="p-3.5 rounded-xl bg-[#131B2E] border border-[#334155]/60 space-y-1">
            <div className="flex items-center justify-between text-[#94A3B8]">
              <span>{lang === 'ja' ? '基本五行 (B) と 当日の五行 (D)' : 'Basic Element (B) × Day Element (D)'}</span>
              <span className="font-mono font-bold text-[#F3E5AB]">{fortune.bdScore > 0 ? `+${fortune.bdScore}` : fortune.bdScore} 点</span>
            </div>
            <div className="font-semibold text-[#E2E8F0]">
              {lang === 'ja' ? fortune.bdRelationJa : fortune.bdRelationEn}
            </div>
            <div className="text-[11px] text-[#94A3B8]">
              {lang === 'ja'
                ? `基本：${ELEMENT_NAMES_JA[fortune.birthElement]}（${fortune.birthYinYang === 'yang' ? '陽' : '陰'}） × 当日：${ELEMENT_NAMES_JA[fortune.dayElement]}`
                : `Basic: ${ELEMENT_NAMES_EN[fortune.birthElement]} × Day: ${ELEMENT_NAMES_EN[fortune.dayElement]}`}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#131B2E] border border-[#334155]/60 space-y-1">
            <div className="flex items-center justify-between text-[#94A3B8]">
              <span>{lang === 'ja' ? '主五行 (P) と 当日の五行 (D)' : 'Primary Element (P) × Day Element (D)'}</span>
              <span className="font-mono font-bold text-[#F3E5AB]">{fortune.pdScore > 0 ? `+${fortune.pdScore}` : fortune.pdScore} 点</span>
            </div>
            <div className="font-semibold text-[#E2E8F0]">
              {lang === 'ja' ? fortune.pdRelationJa : fortune.pdRelationEn}
            </div>
            <div className="text-[11px] text-[#94A3B8]">
              {lang === 'ja'
                ? `主体質：${ELEMENT_NAMES_JA[fortune.primaryElement]} / 補助：${ELEMENT_NAMES_JA[fortune.auxiliaryElement]}`
                : `Primary: ${ELEMENT_NAMES_EN[fortune.primaryElement]} / Auxiliary: ${ELEMENT_NAMES_EN[fortune.auxiliaryElement]}`}
            </div>
          </div>
        </div>
      </div>

      {/* Comprehensive Advice Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#111927] to-[#17233B] border border-[#C5A059]/30 shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-[#C5A059] uppercase tracking-wide">
          <Sparkles className="w-4 h-4 text-[#C5A059]" />
          <span>{lang === 'ja' ? '本日の総合アドバイス' : 'Overall Daily Guidance'}</span>
        </div>
        <p className="text-sm font-serif text-[#F3E5AB] leading-relaxed">
          {lang === 'ja' ? fortune.overallAdviceJa : fortune.overallAdviceEn}
        </p>
      </div>

      {/* 3 Domain Advice Cards (Work, Interpersonal, Self-Care) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Work & Learning */}
        <div className="p-5 rounded-xl bg-[#0F172A] border border-[#334155] space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-[#F3E5AB]">
            <Briefcase className="w-4 h-4 text-[#C5A059]" />
            <span>{lang === 'ja' ? '仕事・学びのアドバイス' : 'Work & Learning'}</span>
          </div>
          <p className="text-xs text-[#CBD5E1] leading-relaxed">
            {lang === 'ja' ? fortune.workAdviceJa : fortune.workAdviceEn}
          </p>
        </div>

        {/* Interpersonal */}
        <div className="p-5 rounded-xl bg-[#0F172A] border border-[#334155] space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-[#F3E5AB]">
            <Users className="w-4 h-4 text-[#C5A059]" />
            <span>{lang === 'ja' ? '対人関係のアドバイス' : 'Interpersonal Relationships'}</span>
          </div>
          <p className="text-xs text-[#CBD5E1] leading-relaxed">
            {lang === 'ja' ? fortune.interpersonalAdviceJa : fortune.interpersonalAdviceEn}
          </p>
        </div>

        {/* Rest & Self-Care */}
        <div className="p-5 rounded-xl bg-[#0F172A] border border-[#334155] space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-[#F3E5AB]">
            <HeartPulse className="w-4 h-4 text-[#C5A059]" />
            <span>{lang === 'ja' ? '休息・セルフケア' : 'Rest & Self-Care'}</span>
          </div>
          <p className="text-xs text-[#CBD5E1] leading-relaxed">
            {lang === 'ja' ? fortune.selfCareAdviceJa : fortune.selfCareAdviceEn}
          </p>
        </div>
      </div>

      {/* Recommended Actions */}
      <div className="p-6 rounded-2xl bg-[#0F172A] border border-[#2E7D52]/40 space-y-3 shadow-md">
        <div className="flex items-center gap-2 text-xs font-bold text-[#4ADE80]">
          <CheckCircle className="w-4 h-4 text-[#4ADE80]" />
          <span>{lang === 'ja' ? '今日のおすすめ行動（成長・調和）' : 'Recommended Actions for Today'}</span>
        </div>

        <ul className="space-y-2 text-xs text-[#CBD5E1]">
          {(lang === 'ja' ? fortune.recommendedActionsJa : fortune.recommendedActionsEn).map((act, idx) => (
            <li key={idx} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#131B2E]">
              <span className="text-[#4ADE80] font-bold shrink-0">{idx + 1}.</span>
              <span className="leading-relaxed">{act}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Color Meaning Note */}
      <div className="p-4 rounded-xl bg-[#172136] border border-[#334155] text-xs text-[#94A3B8] leading-relaxed">
        <span className="text-[#F3E5AB] font-semibold">
          {lang === 'ja' ? 'ラッキーカラーの活用：' : 'Lucky Color Context: '}
        </span>
        {lang === 'ja' ? fortune.luckyColor.reasonJa : fortune.luckyColor.reasonEn}
      </div>
    </div>
  );
};
