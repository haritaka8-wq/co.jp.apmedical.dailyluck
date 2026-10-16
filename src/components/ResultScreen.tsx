import React from 'react';
import { UserProfile, Language, AppView, FiveElement } from '../types';
import { FiveElementsWheel } from './FiveElementsWheel';
import { APP_ASSETS } from '../assets/images';
import { Sparkles, ArrowRight, RotateCcw, CheckCircle2, Award } from 'lucide-react';

interface ResultScreenProps {
  user: UserProfile;
  onNavigate: (view: AppView) => void;
  lang: Language;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  user,
  onNavigate,
  lang,
}) => {
  const constitution = user.constitution;
  const birthType = user.birthType;

  if (!constitution) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-sm text-[#94A3B8]">
          {lang === 'ja' ? '体質診断がまだ完了していません。' : 'Constitution quiz has not been completed yet.'}
        </p>
        <button
          onClick={() => onNavigate('quiz')}
          className="px-4 py-2 bg-[#C5A059] text-[#0C111D] font-bold text-xs rounded-lg cursor-pointer"
        >
          {lang === 'ja' ? '体質診断（8問）を受ける' : 'Take Quiz'}
        </button>
      </div>
    );
  }

  const ELEMENT_NAMES: Record<FiveElement, { ja: string; en: string; color: string; descJa: string; descEn: string }> = {
    wood: { ja: '木 (Wood)', en: 'Wood', color: '#2E7D52', descJa: '成長・向上心・柔軟な開拓', descEn: 'Growth, ambition, pioneering' },
    fire: { ja: '火 (Fire)', en: 'Fire', color: '#D9483B', descJa: '情熱・自己表現・温かい求心力', descEn: 'Passion, expression, warmth' },
    earth: { ja: '土 (Earth)', en: 'Earth', color: '#C59336', descJa: '包容・安定感・着実な育成', descEn: 'Grounded stability, nurturing' },
    metal: { ja: '金 (Metal)', en: 'Metal', color: '#94A3B8', descJa: '規律・美意識・洗練された秩序', descEn: 'Discipline, refinement, clarity' },
    water: { ja: '水 (Water)', en: 'Water', color: '#25507E', descJa: '知恵・柔軟性・深遠な洞察', descEn: 'Wisdom, adaptability, deep calm' },
  };

  const primaryInfo = ELEMENT_NAMES[constitution.primary];
  const auxiliaryInfo = ELEMENT_NAMES[constitution.auxiliary];

  return (
    <div className="space-y-6 pb-20 md:pb-12 max-w-4xl mx-auto">
      {/* Title Header */}
      <div className="border-b border-[#C5A059]/20 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-[#C5A059] uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>{lang === 'ja' ? '五行体質タイプ 診断結果' : 'Five Elements Constitution Result'}</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#F3E5AB] mt-1">
            {lang === 'ja' ? 'あなたの五行気質プロファイル' : 'Your Elemental Energy Profile'}
          </h1>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            {lang === 'ja'
              ? '※占い上の五行体質タイプ判定です。医学的な体質診断ではありません。'
              : '※Astrological Five Elements personality profile. Not a medical evaluation.'}
          </p>
        </div>

        <button
          onClick={() => onNavigate('quiz')}
          className="flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-[#F3E5AB] transition-colors self-start sm:self-auto cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{lang === 'ja' ? '診断をやり直す' : 'Retake Quiz'}</span>
        </button>
      </div>

      {/* Main Constitution Showcase Card */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-[#C5A059]/40 bg-[#101726] p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 space-y-5">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
            {birthType && (
              <span className="px-3 py-1 rounded-full bg-[#C5A059]/20 text-[#F3E5AB] border border-[#C5A059]/40">
                {lang === 'ja' ? `基本五行：${birthType.nameJa}` : `Basic Element: ${birthType.nameEn}`}
              </span>
            )}
            <span className="px-3 py-1 rounded-full bg-[#1E293B] text-[#CBD5E1] border border-[#334155]">
              {lang === 'ja' ? `主五行 (P)：${primaryInfo.ja}` : `Primary Element (P): ${primaryInfo.en}`}
            </span>
            <span className="px-3 py-1 rounded-full bg-[#1E293B] text-[#94A3B8] border border-[#334155]">
              {lang === 'ja' ? `補助五行：${auxiliaryInfo.ja}` : `Auxiliary: ${auxiliaryInfo.en}`}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#131B2E] border border-[#334155]">
              <span className="text-[11px] font-semibold text-[#C5A059] uppercase tracking-wide">
                {lang === 'ja' ? '主五行（最も強く表れた気質）' : 'Primary Dominant Element'}
              </span>
              <div className="text-xl font-serif font-bold text-[#F3E5AB] mt-1 flex items-center gap-2">
                <span
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: primaryInfo.color }}
                />
                <span>{lang === 'ja' ? primaryInfo.ja : primaryInfo.en}</span>
              </div>
              <p className="text-xs text-[#CBD5E1] mt-1 leading-relaxed">
                {lang === 'ja' ? primaryInfo.descJa : primaryInfo.descEn}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#131B2E] border border-[#334155]">
              <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wide">
                {lang === 'ja' ? '補助五行（2番目に高い気質）' : 'Auxiliary Element'}
              </span>
              <div className="text-xl font-serif font-bold text-[#CBD5E1] mt-1 flex items-center gap-2">
                <span
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: auxiliaryInfo.color }}
                />
                <span>{lang === 'ja' ? auxiliaryInfo.ja : auxiliaryInfo.en}</span>
              </div>
              <p className="text-xs text-[#CBD5E1] mt-1 leading-relaxed">
                {lang === 'ja' ? auxiliaryInfo.descJa : auxiliaryInfo.descEn}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Constitution Score Breakdown Bars */}
      <div className="p-6 rounded-2xl bg-[#0F172A] border border-[#334155] shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#334155] pb-3">
          <div>
            <h3 className="font-serif font-bold text-[#F3E5AB] text-sm">
              {lang === 'ja' ? '五行スコア集計（全8問の内訳）' : 'Five Elements Score Breakdown (8 Questions)'}
            </h3>
            <p className="text-[11px] text-[#94A3B8]">
              {lang === 'ja'
                ? '最高得点を主五行、2番目を補助五行として日運判定に用います。'
                : 'Highest score is Primary (P), second is Auxiliary, used in daily fortune calculations.'}
            </p>
          </div>

          <div className="text-[11px] text-[#64748B]">
            {lang === 'ja'
              ? '同点時：木 → 火 → 土 → 金 → 水の固定順で決定'
              : 'Ties: Wood -> Fire -> Earth -> Metal -> Water'}
          </div>
        </div>

        <div className="space-y-3">
          {(['wood', 'fire', 'earth', 'metal', 'water'] as FiveElement[]).map((elem) => {
            const score = constitution.scores[elem];
            const isPrimary = constitution.primary === elem;
            const isAux = constitution.auxiliary === elem;
            const info = ELEMENT_NAMES[elem];

            return (
              <div key={elem} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: info.color }}
                    />
                    <span className="font-semibold text-[#E2E8F0]">
                      {lang === 'ja' ? info.ja : info.en}
                    </span>
                    {isPrimary && (
                      <span className="text-[10px] font-bold bg-[#C5A059] text-[#0C111D] px-1.5 py-0.2 rounded">
                        {lang === 'ja' ? '主五行' : 'PRIMARY'}
                      </span>
                    )}
                    {isAux && (
                      <span className="text-[10px] font-bold bg-[#334155] text-[#CBD5E1] px-1.5 py-0.2 rounded">
                        {lang === 'ja' ? '補助五行' : 'AUXILIARY'}
                      </span>
                    )}
                  </div>

                  <span className="font-mono text-[#F3E5AB] font-bold">
                    {score} / 8 点
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-[#1E293B] overflow-hidden p-0.5 border border-[#334155]/60">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(score / 8) * 100}%`,
                      backgroundColor: info.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Five Elements Wheel */}
      <div className="p-6 rounded-2xl bg-[#0F172A] border border-[#334155] shadow-lg">
        <h3 className="font-serif font-bold text-[#F3E5AB] text-sm mb-3">
          {lang === 'ja' ? '五行相生・相剋ダイアグラム' : 'Five Elements Sheng & Ke Diagram'}
        </h3>
        <FiveElementsWheel
          userElement={birthType?.element}
          constitutionElement={constitution.primary}
          lang={lang}
          interactive={true}
        />
      </div>

      {/* CTA to Daily Fortune */}
      <div className="flex items-center justify-center pt-2">
        <button
          onClick={() => onNavigate('fortune')}
          className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#C5A059] to-[#D4AF37] hover:brightness-110 text-[#0C111D] font-bold text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>{lang === 'ja' ? '今日の日運とアドバイスを見る' : 'View Today’s Daily Fortune'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
