import React from 'react';
import { UserProfile, DailyFortune, AppView, Language } from '../types';
import { APP_ASSETS } from '../assets/images';
import { Compass, Activity, Sun, Calendar, Sparkles, ChevronRight, Star, ShieldCheck } from 'lucide-react';
import { FiveElementsWheel } from './FiveElementsWheel';

interface HomeScreenProps {
  user: UserProfile;
  todayFortune: DailyFortune;
  onNavigate: (view: AppView) => void;
  lang: Language;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  user,
  todayFortune,
  onNavigate,
  lang,
}) => {
  const birthType = user.birthType;
  const constitution = user.constitution;

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
      {/* Hero Card with Washi Paper & Gold Foil Aesthetic */}
      <div className="relative overflow-hidden rounded-2xl border border-[#C5A059]/30 bg-[#101726] shadow-xl">
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src={APP_ASSETS.washiBg}
            alt="Japanese washi gold texture"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C111D] via-[#0C111D]/80 to-transparent" />
        </div>

        <div className="relative z-10 p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-[#C5A059] tracking-widest uppercase">
                <span>{lang === 'ja' ? '陰陽五行 日運暦' : 'Yin-Yang Five Elements Daily Almanac'}</span>
                <span aria-hidden="true">·</span>
                <span>{todayFortune.date}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#F3E5AB] tracking-wide text-balance">
                {lang === 'ja' ? '今日の五行の巡りと調和の導き' : 'Today’s Elemental Rhythms & Harmony'}
              </h1>

              <p className="text-xs sm:text-sm text-[#CBD5E1] max-w-xl leading-relaxed">
                {lang === 'ja'
                  ? `本日（1970年からの経過日数：${todayFortune.epochDays}日）の当日の五行は【${ELEMENT_NAMES_JA[todayFortune.dayElement]}】です。あなたの基本五行・体質五行との相生・相剋から日運を算出します。`
                  : `Today's element (epoch days: ${todayFortune.epochDays}) is [${ELEMENT_NAMES_EN[todayFortune.dayElement]}]. Daily fortune is calculated through Sheng (generating) and Ke (controlling) interactions.`}
              </p>
            </div>

            {/* Enso Circle Avatar Art */}
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border border-[#C5A059]/40 overflow-hidden shrink-0 shadow-lg p-0.5 bg-[#0C111D]/60 self-center md:self-auto">
              <img
                src={APP_ASSETS.ensoCircle}
                alt="Enso Zen Circle"
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* User Profile Banner / Onboarding Callout */}
          <div className="mt-6 pt-5 border-t border-[#C5A059]/20 flex flex-wrap items-center justify-between gap-4">
            {birthType ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1E293B] border border-[#C5A059]/30 flex items-center justify-center font-serif text-lg font-bold text-[#F3E5AB]">
                  {birthType.element === 'wood' ? '木' : birthType.element === 'fire' ? '火' : birthType.element === 'earth' ? '土' : birthType.element === 'metal' ? '金' : '水'}
                </div>
                <div>
                  <div className="text-xs text-[#94A3B8]">
                    {lang === 'ja' ? '生年月日からの独自五行タイプ' : 'Your Birth Five Element Type'}
                  </div>
                  <div className="text-sm font-semibold text-[#F3E5AB]">
                    {lang === 'ja' ? birthType.nameJa : birthType.nameEn}
                    <span className="text-xs font-normal text-[#CBD5E1] ml-2">
                      ({lang === 'ja' ? birthType.natureJa : birthType.natureEn})
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Compass className="w-8 h-8 text-[#C5A059] shrink-0" />
                <div>
                  <div className="text-xs text-[#94A3B8]">
                    {lang === 'ja' ? '生年月日が未登録です' : 'Birthdate not registered'}
                  </div>
                  <div className="text-xs text-[#E2E8F0]">
                    {lang === 'ja' ? '生年月日から独自五行タイプ（全10種）を判定します' : 'Determine your 10 Yin-Yang Five Element types from birthdate'}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              {!birthType ? (
                <button
                  onClick={() => onNavigate('birth')}
                  className="px-4 py-2 bg-[#C5A059] hover:bg-[#D4AF37] text-[#0C111D] font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{lang === 'ja' ? '生年月日を設定する' : 'Enter Birthdate'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : !constitution ? (
                <button
                  onClick={() => onNavigate('quiz')}
                  className="px-4 py-2 bg-[#1E293B] hover:bg-[#283850] border border-[#C5A059]/40 text-[#F3E5AB] font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{lang === 'ja' ? '体質診断（8問）を受ける' : 'Take Constitution Quiz'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => onNavigate('birth')}
                  className="text-xs text-[#C5A059] hover:underline cursor-pointer"
                >
                  {lang === 'ja' ? '生年月日を変更・確認' : 'Change Birthdate'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Today's Fortune Highlight Card */}
      <div className="p-6 rounded-2xl bg-[#0F172A] border border-[#334155] shadow-lg space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs text-[#94A3B8]">
              {lang === 'ja' ? '本日の日運ランク' : 'Today’s Fortune Rank'}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="px-3 py-1 rounded-lg text-sm font-bold text-[#0C111D]"
                style={{ backgroundColor: todayFortune.rank.colorHex }}
              >
                {lang === 'ja' ? todayFortune.rank.nameJa : todayFortune.rank.nameEn}
              </span>
              <span className="text-sm font-semibold font-mono text-[#F3E5AB]">
                {todayFortune.totalScore > 0 ? `+${todayFortune.totalScore}` : todayFortune.totalScore} 点
              </span>
            </div>
          </div>

          {/* Lucky Color Swatch */}
          <div className="flex items-center gap-2.5 bg-[#172136] px-3.5 py-2 rounded-xl border border-[#334155] self-start sm:self-auto">
            <span
              className="w-5 h-5 rounded-full border border-white/20 shadow-sm shrink-0"
              style={{ backgroundColor: todayFortune.luckyColor.hex }}
            />
            <div className="text-right">
              <div className="text-[10px] text-[#94A3B8]">
                {lang === 'ja' ? 'ラッキーカラー' : 'Lucky Color'}
              </div>
              <div className="text-xs font-semibold text-[#E2E8F0]">
                {lang === 'ja' ? todayFortune.luckyColor.nameJa : todayFortune.luckyColor.nameEn}
              </div>
            </div>
          </div>
        </div>

        {/* Relational Breakdown Tags */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#131B2E] border border-[#334155]/60">
            <div className="text-[10px] text-[#94A3B8]">
              {lang === 'ja' ? '基本五行 × 当日の五行' : 'Basic Element × Day Element'}
            </div>
            <div className="text-xs font-bold text-[#F3E5AB] mt-0.5">
              {lang === 'ja' ? todayFortune.bdRelationJa : todayFortune.bdRelationEn}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#131B2E] border border-[#334155]/60">
            <div className="text-[10px] text-[#94A3B8]">
              {lang === 'ja' ? '主五行 × 当日の五行' : 'Primary Element × Day Element'}
            </div>
            <div className="text-xs font-bold text-[#F3E5AB] mt-0.5">
              {lang === 'ja' ? todayFortune.pdRelationJa : todayFortune.pdRelationEn}
            </div>
          </div>
        </div>

        {/* Overall Advice Snippet */}
        <div className="p-4 rounded-xl bg-[#172136]/70 border border-[#C5A059]/15">
          <div className="text-xs font-serif text-[#F3E5AB] leading-relaxed">
            {lang === 'ja' ? todayFortune.overallAdviceJa : todayFortune.overallAdviceEn}
          </div>
        </div>

        {/* CTA to Full Fortune */}
        <button
          onClick={() => onNavigate('fortune')}
          className="w-full py-3 bg-gradient-to-r from-[#C5A059] to-[#D4AF37] hover:brightness-110 text-[#0C111D] font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sun className="w-4 h-4" />
          <span>{lang === 'ja' ? '今日の日運アドバイスを詳しく見る' : 'View Full Daily Advice & Actions'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Two Column Section: Five Elements Wheel & Quick Nav */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Five Elements Live Diagram Card */}
        <div className="p-5 rounded-2xl bg-[#0F172A] border border-[#334155] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif font-bold text-[#F3E5AB] text-sm">
                {lang === 'ja' ? '五行相生・相剋ダイアグラム' : 'Five Elements Interaction Wheel'}
              </h3>
              <span className="text-[11px] text-[#94A3B8]">
                {lang === 'ja' ? '木生火・火生土・土生金・金生水・水生木' : 'Sheng & Ke Cycles'}
              </span>
            </div>
            <FiveElementsWheel
              userElement={birthType?.element}
              constitutionElement={constitution?.primary}
              currentDayElement={todayFortune.dayElement}
              lang={lang}
              interactive={true}
            />
          </div>
        </div>

        {/* Feature Hub Card */}
        <div className="space-y-3 flex flex-col justify-between">
          <button
            onClick={() => onNavigate('birth')}
            className="w-full p-4 rounded-xl bg-[#131B2E] hover:bg-[#1A253D] border border-[#334155] text-left transition-colors flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#1E293B] border border-[#C5A059]/20 flex items-center justify-center text-[#C5A059]">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-[#E2E8F0] group-hover:text-[#F3E5AB]">
                  {lang === 'ja' ? '生年月日からの独自五行判定' : 'Birthdate Five Element Type'}
                </div>
                <div className="text-xs text-[#94A3B8]">
                  {lang === 'ja' ? 'N=(Y+3M+7D) mod 10による独自分類（全10種）' : 'Unique formula N=(Y+3M+7D) mod 10'}
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#64748B] group-hover:text-[#F3E5AB] transition-transform group-hover:translate-x-0.5" />
          </button>

          <button
            onClick={() => onNavigate('quiz')}
            className="w-full p-4 rounded-xl bg-[#131B2E] hover:bg-[#1A253D] border border-[#334155] text-left transition-colors flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#1E293B] border border-[#C5A059]/20 flex items-center justify-center text-[#C5A059]">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-[#E2E8F0] group-hover:text-[#F3E5AB]">
                  {lang === 'ja' ? '五行体質診断（8問）' : 'Five Elements Quiz (8 Questions)'}
                </div>
                <div className="text-xs text-[#94A3B8]">
                  {lang === 'ja' ? '木火土金水の5択から主五行・補助五行を判定' : 'Identify your Primary & Auxiliary elements'}
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#64748B] group-hover:text-[#F3E5AB] transition-transform group-hover:translate-x-0.5" />
          </button>

          <button
            onClick={() => onNavigate('tests')}
            className="w-full p-4 rounded-xl bg-[#131B2E] hover:bg-[#1A253D] border border-[#334155] text-left transition-colors flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#1E293B] border border-[#C5A059]/20 flex items-center justify-center text-[#4ADE80]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-[#E2E8F0] group-hover:text-[#F3E5AB]">
                  {lang === 'ja' ? '自動テスト検証（全15項目）' : 'Automated Test Suite (15 Tests)'}
                </div>
                <div className="text-xs text-[#94A3B8]">
                  {lang === 'ja' ? '相生相剋・スコア計算・境界値のテスト結果確認' : 'Verify Sheng/Ke, scoring rules, edge cases'}
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#64748B] group-hover:text-[#F3E5AB] transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
