/**
 * 陰陽五行の日運占い (Yin-Yang Five Elements Daily Fortune)
 * Main Application Component
 */

import React, { useState, useEffect, useMemo } from 'react';
import { UserProfile, DailyFortune, AppView, Language, BirthType, ConstitutionResult } from './types';
import { calculateBirthType } from './engine/fiveElements';
import { calculateQuizConstitution } from './data/quizData';
import { generateDailyFortune } from './data/fortuneAdvice';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { BirthInputScreen } from './components/BirthInputScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultScreen } from './components/ResultScreen';
import { DailyFortuneScreen } from './components/DailyFortuneScreen';
import { CalendarScreen } from './components/CalendarScreen';
import { DocsAndSettingsScreen } from './components/DocsAndSettingsScreen';
import { TestRunnerScreen } from './components/TestRunnerScreen';

const STORAGE_KEY_USER = 'gogyo_user_profile_v2';
const STORAGE_KEY_LANG = 'gogyo_user_lang_v2';

function getInitialProfile(): UserProfile {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_USER);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // fallback
  }

  // Pre-seed an initial valid birth profile (1995-08-15) and completed 8-question quiz
  const sampleBirth = '1995-08-15';
  const birthType = calculateBirthType(1995, 8, 15);
  const sampleAnswers: Record<string, string> = {
    q1: 'q1_wood',
    q2: 'q2_wood',
    q3: 'q3_wood',
    q4: 'q4_wood',
    q5: 'q5_fire',
    q6: 'q6_wood',
    q7: 'q7_earth',
    q8: 'q8_wood',
  };
  const constitution = calculateQuizConstitution(sampleAnswers);

  return {
    birthDate: sampleBirth,
    birthType,
    constitution,
    quizAnswers: sampleAnswers,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export default function App() {
  const [user, setUser] = useState<UserProfile>(getInitialProfile);
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [lang, setLang] = useState<Language>(() => {
    try {
      const savedLang = localStorage.getItem(STORAGE_KEY_LANG);
      return (savedLang === 'en' ? 'en' : 'ja') as Language;
    } catch {
      return 'ja';
    }
  });

  // Current local date in YYYY-MM-DD
  const getTodayLocal = (): string => {
    try {
      const d = new Date();
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch {
      return new Date().toISOString().split('T')[0];
    }
  };

  const [targetDateStr, setTargetDateStr] = useState<string>(getTodayLocal);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    } catch {
      // ignore
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LANG, lang);
    } catch {
      // ignore
    }
  }, [lang]);

  // Compute Daily Fortune
  const todayFortune: DailyFortune = useMemo(() => {
    const bType = user.birthType || calculateBirthType(1995, 8, 15);
    return generateDailyFortune(targetDateStr, bType, user.constitution);
  }, [targetDateStr, user.birthType, user.constitution]);

  const handleToggleLang = () => {
    setLang((prev) => (prev === 'ja' ? 'en' : 'ja'));
  };

  const handleSaveBirthDate = (birthDate: string, birthType: BirthType) => {
    setUser((prev) => ({
      ...prev,
      birthDate,
      birthType,
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleSaveQuiz = (answers: Record<string, string>, constitution: ConstitutionResult) => {
    setUser((prev) => ({
      ...prev,
      quizAnswers: answers,
      constitution,
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleResetData = () => {
    const emptyProfile: UserProfile = {
      birthDate: '',
      birthType: null,
      constitution: null,
      quizAnswers: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setUser(emptyProfile);
    setCurrentView('birth');
  };

  return (
    <div className="min-h-screen bg-[#0C111D] text-[#E8E6DF] flex flex-col font-sans selection:bg-[#C5A059]/30 selection:text-[#F3E5AB]">
      {/* Top Bar Header */}
      <Header
        currentView={currentView}
        onNavigate={setCurrentView}
        lang={lang}
        onToggleLang={handleToggleLang}
        dateStr={targetDateStr}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-8 py-6">
        {currentView === 'home' && (
          <HomeScreen
            user={user}
            todayFortune={todayFortune}
            onNavigate={setCurrentView}
            lang={lang}
          />
        )}

        {currentView === 'birth' && (
          <BirthInputScreen
            user={user}
            onSaveBirthDate={handleSaveBirthDate}
            onNavigate={setCurrentView}
            lang={lang}
          />
        )}

        {currentView === 'quiz' && (
          <QuizScreen
            user={user}
            onSaveQuiz={handleSaveQuiz}
            onNavigate={setCurrentView}
            lang={lang}
          />
        )}

        {currentView === 'result' && (
          <ResultScreen
            user={user}
            onNavigate={setCurrentView}
            lang={lang}
          />
        )}

        {currentView === 'fortune' && (
          <DailyFortuneScreen
            fortune={todayFortune}
            user={user}
            onDateChange={setTargetDateStr}
            onNavigate={setCurrentView}
            lang={lang}
          />
        )}

        {currentView === 'calendar' && (
          <CalendarScreen
            user={user}
            currentDateStr={targetDateStr}
            onSelectDate={setTargetDateStr}
            onNavigate={setCurrentView}
            lang={lang}
          />
        )}

        {currentView === 'tests' && (
          <TestRunnerScreen
            lang={lang}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'docs' && (
          <DocsAndSettingsScreen
            user={user}
            lang={lang}
            onToggleLang={handleToggleLang}
            onResetData={handleResetData}
            onNavigate={setCurrentView}
          />
        )}
      </main>

      {/* Mobile Ergonomic Bottom Tab Bar */}
      <BottomNav
        currentView={currentView}
        onNavigate={setCurrentView}
        lang={lang}
      />
    </div>
  );
}
