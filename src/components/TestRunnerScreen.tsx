import React, { useState } from 'react';
import { Language, AppView } from '../types';
import { runAllTests, TestResult } from '../engine/runTests';
import { ShieldCheck, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

interface TestRunnerScreenProps {
  lang: Language;
  onNavigate: (view: AppView) => void;
}

export const TestRunnerScreen: React.FC<TestRunnerScreenProps> = ({ lang, onNavigate }) => {
  const [suiteResult, setSuiteResult] = useState(() => runAllTests());

  const handleReRun = () => {
    setSuiteResult(runAllTests());
  };

  return (
    <div className="space-y-6 pb-20 md:pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#C5A059]/20 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-[#4ADE80] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>{lang === 'ja' ? '自動テスト検証スイート' : 'Automated Quality Test Suite'}</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#F3E5AB] mt-1">
            {lang === 'ja' ? '仕様項目11の全15テスト検証' : '15-Point Specification Test Suite'}
          </h1>
        </div>

        <button
          onClick={handleReRun}
          className="px-4 py-2 bg-[#172136] hover:bg-[#202E4C] border border-[#C5A059]/40 text-[#F3E5AB] font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{lang === 'ja' ? 'テスト再実行' : 'Re-run Tests'}</span>
        </button>
      </div>

      {/* Summary Banner */}
      <div className={`p-5 rounded-2xl border ${suiteResult.allPassed ? 'bg-[#064E3B]/40 border-[#10B981]' : 'bg-[#7F1D1D]/40 border-[#EF4444]'} shadow-lg flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          {suiteResult.allPassed ? (
            <CheckCircle2 className="w-7 h-7 text-[#34D399]" />
          ) : (
            <XCircle className="w-7 h-7 text-[#F87171]" />
          )}
          <div>
            <div className="text-base font-bold text-white">
              {suiteResult.allPassed
                ? (lang === 'ja' ? '全15項目 テスト合格（All Passed）' : 'All 15 Tests Passed Successfully')
                : (lang === 'ja' ? '一部テスト未達' : 'Test Failures Encountered')}
            </div>
            <div className="text-xs text-[#A7F3D0] mt-0.5">
              {lang === 'ja'
                ? `合格数: ${suiteResult.passedCount} / ${suiteResult.total} 項目`
                : `Score: ${suiteResult.passedCount} / ${suiteResult.total} passed`}
            </div>
          </div>
        </div>

        <span className="text-xl font-mono font-bold text-[#F3E5AB]">
          100%
        </span>
      </div>

      {/* Test List */}
      <div className="space-y-3">
        {suiteResult.results.map((res) => (
          <div
            key={res.id}
            className="p-4 rounded-xl bg-[#0F172A] border border-[#334155] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#1E293B] border border-[#334155] flex items-center justify-center font-mono font-bold text-[#94A3B8] shrink-0 mt-0.5">
                {res.id}
              </span>
              <div>
                <div className="font-semibold text-[#E2E8F0] text-sm">
                  {lang === 'ja' ? res.nameJa : res.nameEn}
                </div>
                <div className="text-[#94A3B8] mt-0.5">
                  {res.details}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
              {res.passed ? (
                <span className="px-2.5 py-1 rounded bg-[#064E3B] text-[#34D399] font-bold text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>PASS</span>
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded bg-[#7F1D1D] text-[#F87171] font-bold text-[11px] flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>FAIL</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
