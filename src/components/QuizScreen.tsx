import React, { useState } from 'react';
import { UserProfile, ConstitutionResult, Language, AppView } from '../types';
import { QUIZ_QUESTIONS, calculateQuizConstitution } from '../data/quizData';
import { Activity, ChevronLeft, ChevronRight, CheckCircle2, RotateCcw } from 'lucide-react';

interface QuizScreenProps {
  user: UserProfile;
  onSaveQuiz: (answers: Record<string, string>, constitution: ConstitutionResult) => void;
  onNavigate: (view: AppView) => void;
  lang: Language;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  user,
  onSaveQuiz,
  onNavigate,
  lang,
}) => {
  const [answers, setAnswers] = useState<Record<string, string>>(user.quizAnswers || {});
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentQ = QUIZ_QUESTIONS[currentIndex];
  const totalQuestions = QUIZ_QUESTIONS.length;
  const answeredCount = Object.keys(answers).length;
  const isAllAnswered = totalQuestions === answeredCount;

  const handleSelect = (answerId: string) => {
    const updated = { ...answers, [currentQ.id]: answerId };
    setAnswers(updated);
  };

  const handleFinish = () => {
    const result = calculateQuizConstitution(answers);
    if (result) {
      onSaveQuiz(answers, result);
      onNavigate('result');
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentIndex(0);
  };

  const ELEMENT_ACCENTS: Record<string, { border: string; bg: string; text: string }> = {
    wood: { border: 'border-[#2E7D52]', bg: 'bg-[#2E7D52]/15', text: 'text-[#4ADE80]' },
    fire: { border: 'border-[#D9483B]', bg: 'bg-[#D9483B]/15', text: 'text-[#F87171]' },
    earth: { border: 'border-[#C59336]', bg: 'bg-[#C59336]/15', text: 'text-[#FBBF24]' },
    metal: { border: 'border-[#94A3B8]', bg: 'bg-[#94A3B8]/15', text: 'text-[#CBD5E1]' },
    water: { border: 'border-[#25507E]', bg: 'bg-[#25507E]/15', text: 'text-[#60A5FA]' },
  };

  return (
    <div className="space-y-6 pb-20 md:pb-12 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#C5A059]/20 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-[#C5A059] uppercase tracking-wider">
            <Activity className="w-4 h-4" />
            <span>{lang === 'ja' ? '五行体質タイプ診断（全8問）' : 'Five Elements Quiz (8 Questions)'}</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#F3E5AB] mt-1">
            {lang === 'ja' ? '心と身体の気質バランス' : 'Discover Your Innate Energy Balance'}
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            {lang === 'ja'
              ? '※本診断は占い上の「五行体質タイプ」として判定するものであり、医学的な体質診断ではありません。'
              : '※This quiz determines an astrological "Five Elements Type" and is not a medical diagnosis.'}
          </p>
        </div>

        {answeredCount > 0 && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-xs text-[#94A3B8] hover:text-[#F3E5AB] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{lang === 'ja' ? 'やり直す' : 'Reset'}</span>
          </button>
        )}
      </div>

      {/* Progress Bar & Question Counter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-[#94A3B8]">
          <span>
            {lang === 'ja' ? `問 ${currentIndex + 1} / 全 ${totalQuestions} 問` : `Question ${currentIndex + 1} of ${totalQuestions}`}
          </span>
          <span className="text-[#C5A059] font-medium">
            {lang === 'ja' ? `回答済: ${answeredCount} / ${totalQuestions}` : `Answered: ${answeredCount} / ${totalQuestions}`}
          </span>
        </div>

        <div className="w-full h-2 rounded-full bg-[#1E293B] overflow-hidden p-0.5 border border-[#334155]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#C5A059] to-[#D4AF37] transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="p-6 rounded-2xl bg-[#0F172A] border border-[#334155] shadow-xl space-y-6">
        <div>
          <span className="text-[11px] font-semibold text-[#C5A059] tracking-wider uppercase bg-[#172136] px-2.5 py-1 rounded-md border border-[#C5A059]/20">
            {lang === 'ja' ? currentQ.titleJa : currentQ.titleEn}
          </span>

          <h2 className="text-lg sm:text-xl font-serif font-bold text-[#F3E5AB] mt-3 leading-relaxed">
            {lang === 'ja' ? currentQ.questionJa : currentQ.questionEn}
          </h2>
        </div>

        {/* 5 Choices */}
        <div className="space-y-3">
          {currentQ.choices.map((choice) => {
            const isSelected = answers[currentQ.id] === choice.answerId;
            const accent = ELEMENT_ACCENTS[choice.elementId];

            return (
              <button
                key={choice.answerId}
                onClick={() => handleSelect(choice.answerId)}
                className={`w-full p-4 rounded-xl text-left transition-all border flex items-start justify-between gap-3 cursor-pointer ${
                  isSelected
                    ? `${accent.border} ${accent.bg} shadow-md`
                    : 'border-[#334155] bg-[#131B2E] hover:bg-[#1A253D] hover:border-[#475569]'
                }`}
              >
                <div className="space-y-1">
                  <div className={`text-sm font-semibold ${isSelected ? 'text-[#F3E5AB]' : 'text-[#E2E8F0]'}`}>
                    {lang === 'ja' ? choice.textJa : choice.textEn}
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected
                      ? 'border-[#C5A059] bg-[#C5A059] text-[#0C111D]'
                      : 'border-[#475569]'
                  }`}
                >
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Navigation Buttons (Prev / Next / Finish) */}
        <div className="flex items-center justify-between pt-4 border-t border-[#334155]">
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="px-4 py-2 bg-[#172136] hover:bg-[#202E4C] disabled:opacity-30 disabled:pointer-events-none text-xs text-[#CBD5E1] rounded-lg border border-[#334155] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{lang === 'ja' ? '前の問へ' : 'Previous'}</span>
          </button>

          {currentIndex < totalQuestions - 1 ? (
            <button
              onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
              disabled={!answers[currentQ.id]}
              className="px-5 py-2 bg-[#1E293B] hover:bg-[#283850] disabled:opacity-40 disabled:pointer-events-none text-xs font-semibold text-[#F3E5AB] rounded-lg border border-[#C5A059]/30 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{lang === 'ja' ? '次の問へ' : 'Next'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={!isAllAnswered}
              className="px-6 py-2.5 bg-gradient-to-r from-[#C5A059] to-[#D4AF37] hover:brightness-110 disabled:opacity-40 disabled:pointer-events-none text-[#0C111D] font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{lang === 'ja' ? '診断結果を見る' : 'View Results'}</span>
            </button>
          )}
        </div>
      </div>

      {!isAllAnswered && (
        <div className="text-center text-xs text-[#64748B]">
          {lang === 'ja'
            ? '※全8問に回答すると、五行ごとの合計点から主五行および補助五行が確定します。'
            : '※Complete all 8 questions to calculate your Primary and Auxiliary Five Elements.'}
        </div>
      )}
    </div>
  );
};
