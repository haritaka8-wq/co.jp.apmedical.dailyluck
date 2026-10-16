import React, { useState, useMemo } from 'react';
import { UserProfile, BirthType, Language, AppView } from '../types';
import { calculateBirthType, isValidDate } from '../engine/fiveElements';
import { Compass, CheckCircle2, AlertCircle, Info, Calendar as CalendarIcon, ArrowRight } from 'lucide-react';

interface BirthInputScreenProps {
  user: UserProfile;
  onSaveBirthDate: (birthDate: string, birthType: BirthType) => void;
  onNavigate: (view: AppView) => void;
  lang: Language;
}

export const BirthInputScreen: React.FC<BirthInputScreenProps> = ({
  user,
  onSaveBirthDate,
  onNavigate,
  lang,
}) => {
  const initialDate = user.birthDate || '1995-08-15';
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const liveType = useMemo(() => {
    try {
      const parts = selectedDate.split('-').map(Number);
      if (parts.length === 3 && isValidDate(parts[0], parts[1], parts[2])) {
        return calculateBirthType(parts[0], parts[1], parts[2]);
      }
      return null;
    } catch {
      return null;
    }
  }, [selectedDate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSelectedDate(val);
    const parts = val.split('-').map(Number);
    if (parts.length === 3 && isValidDate(parts[0], parts[1], parts[2])) {
      setErrorMsg(null);
    } else {
      setErrorMsg(
        lang === 'ja'
          ? '実在する有効な生年月日（1900年1月1日〜2100年12月31日）を入力してください。'
          : 'Please enter a valid Gregorian birth date between 1900-01-01 and 2100-12-31.'
      );
    }
  };

  const handleSave = () => {
    if (!liveType) {
      setErrorMsg(
        lang === 'ja'
          ? '実在する有効な生年月日を入力してください。'
          : 'Please enter a valid birth date.'
      );
      return;
    }
    onSaveBirthDate(selectedDate, liveType);
  };

  const ELEMENT_COLORS: Record<string, string> = {
    wood: '#2E7D52',
    fire: '#D9483B',
    earth: '#C59336',
    metal: '#94A3B8',
    water: '#25507E',
  };

  return (
    <div className="space-y-6 pb-20 md:pb-12 max-w-4xl mx-auto">
      {/* Title */}
      <div className="border-b border-[#C5A059]/20 pb-4">
        <div className="flex items-center gap-2 text-xs font-medium text-[#C5A059] uppercase tracking-wider">
          <Compass className="w-4 h-4" />
          <span>{lang === 'ja' ? '生年月日からの独自五行判定' : 'Birthdate Five Element Type'}</span>
        </div>
        <h1 className="text-2xl font-serif font-bold text-[#F3E5AB] mt-1">
          {lang === 'ja' ? '生年月日の登録と五行・陰陽判定' : 'Enter Birthdate & Calculate Elemental Type'}
        </h1>
        <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
          {lang === 'ja'
            ? '西暦生年月日（Y年M月D日）から、計算式 N = (Y + 3×M + 7×D) mod 10 により基本五行と陰陽を判定します。'
            : 'Determines your Basic Five Element and Yin/Yang using the deterministic formula: N = (Y + 3×M + 7×D) mod 10.'}
        </p>
      </div>

      {/* Input Form Card */}
      <div className="p-6 rounded-2xl bg-[#0F172A] border border-[#334155] shadow-lg space-y-4">
        <div className="space-y-2">
          <label className="block text-xs font-medium text-[#CBD5E1]">
            {lang === 'ja' ? '西暦生年月日 (1900年〜2100年)' : 'Birth Date (1900 - 2100)'}
          </label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <CalendarIcon className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="date"
                min="1900-01-01"
                max="2100-12-31"
                value={selectedDate}
                onChange={handleDateChange}
                className="w-full bg-[#172136] border border-[#C5A059]/40 rounded-xl py-2.5 pl-10 pr-4 text-sm text-[#F3E5AB] focus:outline-none focus:ring-1 focus:ring-[#C5A059] transition-all font-mono"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={!liveType}
              className="px-6 py-2.5 bg-gradient-to-r from-[#C5A059] to-[#D4AF37] hover:brightness-110 disabled:opacity-50 text-[#0C111D] font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{lang === 'ja' ? '五行タイプを保存' : 'Save Type'}</span>
            </button>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-1.5 text-xs text-[#F87171] mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Quick Date Presets */}
        <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[#64748B] text-[11px]">
            {lang === 'ja' ? '検証プリセット:' : 'Verification Presets:'}
          </span>
          {[
            { label: '1990-05-15 (N=0 木・陽)', date: '1990-05-15' },
            { label: '1992-06-08 (N=2 火・陽)', date: '1992-06-08' },
            { label: '1995-08-15 (N=6 金・陽)', date: '1995-08-15' },
            { label: '2000-01-01 (N=0 木・陽)', date: '2000-01-01' },
            { label: '2024-02-29 (閏日)', date: '2024-02-29' },
          ].map((preset) => (
            <button
              key={preset.date}
              onClick={() => {
                setSelectedDate(preset.date);
                setErrorMsg(null);
              }}
              className="px-2.5 py-1 bg-[#172136] hover:bg-[#202E4C] border border-[#334155] rounded-md text-[11px] text-[#CBD5E1] transition-colors cursor-pointer"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Live Calculated Birth Type Card */}
      {liveType && (
        <div className="p-6 rounded-2xl bg-[#0F172A] border border-[#C5A059]/30 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#334155] pb-3">
            <div>
              <span className="text-xs text-[#C5A059] font-medium tracking-wider">
                {lang === 'ja' ? '算出された五行タイプ' : 'Calculated Elemental Type'}
              </span>
              <h2 className="text-lg font-serif font-bold text-[#F3E5AB]">
                {selectedDate} → N = {liveType.number}
              </h2>
            </div>
            <div className="text-[11px] text-[#94A3B8]">
              {lang === 'ja' ? 'アプリ独自の五行分類式（四柱推命不使用）' : 'Unique App Formula (No BaZi)'}
            </div>
          </div>

          {/* Type Highlight Box */}
          <div className="p-5 rounded-xl bg-[#131B2E] border-2 border-[#C5A059] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center font-serif text-3xl font-bold text-white shadow-lg ring-2 ring-[#F3E5AB]/40 shrink-0"
                style={{ backgroundColor: ELEMENT_COLORS[liveType.element] }}
              >
                {liveType.element === 'wood' ? '木' : liveType.element === 'fire' ? '火' : liveType.element === 'earth' ? '土' : liveType.element === 'metal' ? '金' : '水'}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-serif font-bold text-[#F3E5AB]">
                    {lang === 'ja' ? liveType.nameJa : liveType.nameEn}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-[#1E293B] border border-[#334155] text-[#CBD5E1]">
                    {liveType.yinYang === 'yang' ? (lang === 'ja' ? '陽性' : 'Yang') : (lang === 'ja' ? '陰性' : 'Yin')}
                  </span>
                </div>
                <div className="text-xs text-[#94A3B8] mt-1">
                  {lang === 'ja' ? liveType.natureJa : liveType.natureEn}
                </div>
              </div>
            </div>

            <div className="text-xs text-[#CBD5E1] sm:text-right max-w-xs">
              <span className="text-[#C5A059] font-medium block">
                {lang === 'ja' ? '本質イメージ：' : 'Core Essence:'}
              </span>
              <span>{lang === 'ja' ? liveType.symbolJa : liveType.symbolEn}</span>
            </div>
          </div>

          {/* 10 Types Reference Grid */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-[#CBD5E1]">
              {lang === 'ja' ? 'N=0〜9の五行・陰陽 判定基準表' : 'N=0 to 9 Type Lookup Table'}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
              {[
                { n: 0, label: 'N=0: 木・陽', elem: 'wood' },
                { n: 1, label: 'N=1: 木・陰', elem: 'wood' },
                { n: 2, label: 'N=2: 火・陽', elem: 'fire' },
                { n: 3, label: 'N=3: 火・陰', elem: 'fire' },
                { n: 4, label: 'N=4: 土・陽', elem: 'earth' },
                { n: 5, label: 'N=5: 土・陰', elem: 'earth' },
                { n: 6, label: 'N=6: 金・陽', elem: 'metal' },
                { n: 7, label: 'N=7: 金・陰', elem: 'metal' },
                { n: 8, label: 'N=8: 水・陽', elem: 'water' },
                { n: 9, label: 'N=9: 水・陰', elem: 'water' },
              ].map(item => (
                <div
                  key={item.n}
                  className={`p-2 rounded-lg border text-center transition-all ${
                    liveType.number === item.n
                      ? 'border-[#C5A059] bg-[#C5A059]/20 font-bold text-[#F3E5AB]'
                      : 'border-[#334155]/60 bg-[#131B2E] text-[#94A3B8]'
                  }`}
                >
                  <div className="font-mono text-[11px]">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Step Banner */}
          <div className="p-4 rounded-xl bg-[#172136] border border-[#334155] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Info className="w-5 h-5 text-[#C5A059] shrink-0" />
              <div className="text-xs text-[#CBD5E1] leading-relaxed">
                {lang === 'ja'
                  ? '五行タイプが判定されました。次は「五行体質診断（8問）」に回答して、主五行と補助五行を決定しましょう。'
                  : 'Elemental type determined. Proceed to the 8-Question Constitution Quiz to identify your Primary & Auxiliary elements.'}
              </div>
            </div>

            <button
              onClick={() => {
                handleSave();
                onNavigate('quiz');
              }}
              className="px-4 py-2 bg-[#C5A059] hover:bg-[#D4AF37] text-[#0C111D] font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 self-start sm:self-auto cursor-pointer whitespace-nowrap"
            >
              <span>{lang === 'ja' ? '体質診断（8問）へ進む' : 'Go to Quiz (8 Qs)'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Methodology Transparent Disclosure */}
      <div className="p-5 rounded-2xl bg-[#0F172A]/70 border border-[#334155]/60 text-xs text-[#94A3B8] space-y-2">
        <h4 className="font-serif font-bold text-[#CBD5E1] text-sm">
          {lang === 'ja' ? '占術方式の明確なご案内' : 'Methodology Notice'}
        </h4>
        <p className="leading-relaxed">
          {lang === 'ja'
            ? '本アプリでは、四柱推命の命式計算（年柱・月柱・日柱・時柱の算出や節入り計算）を一切使用しておりません。生年月日の西暦から直接計算する独自の10分類式【N = (Y + 3×M + 7×D) mod 10】を採用し、五行（木火土金水）と陰陽を分離して保持しています。五行は当日の五行との相生・相剋判定に使用され、陰陽は日運アドバイスの文章に反映されます。'
            : 'This application does not employ classical Four Pillars (BaZi) or solar terms calculations. It uses a clean, deterministic mathematical classification formula: N = (Y + 3×M + 7×D) mod 10. The Five Element is used for Sheng/Ke relations, while Yin/Yang enriches the bespoke narrative advice.'}
        </p>
      </div>
    </div>
  );
};
