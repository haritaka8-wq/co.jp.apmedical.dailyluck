import React, { useState } from 'react';
import { UserProfile, Language, AppView } from '../types';
import { BookOpen, Code2, Copy, Check } from 'lucide-react';

interface DocsAndSettingsScreenProps {
  user: UserProfile;
  lang: Language;
  onToggleLang: () => void;
  onResetData: () => void;
  onNavigate: (view: AppView) => void;
}

export const DocsAndSettingsScreen: React.FC<DocsAndSettingsScreenProps> = ({
  user,
  lang,
  onToggleLang,
  onResetData,
}) => {
  const [activeTab, setActiveTab] = useState<'methodology' | 'android'>('methodology');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const ANDROID_GRADLE_SNIPPET = `// build.gradle.kts (Module :app)
plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.ksp)
}

android {
    namespace = "com.waunreki.fortune"
    compileSdk = 36 // Google Play 2026 Target Requirement

    defaultConfig {
        applicationId = "com.waunreki.fortune"
        minSdk = 26
        targetSdk = 36
        versionCode = 2
        versionName = "2.0.0"
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            // Use release signing configured via environment variables / keystore
            // signingConfig = signingConfigs.getByName("release")
        }
    }

    buildFeatures {
        compose = true
    }
}

dependencies {
    // Jetpack Compose & Material 3
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.material3)
    
    // Room Offline Database
    implementation(libs.androidx.room.runtime)
    implementation(libs.androidx.room.ktx)
    ksp(libs.androidx.room.compiler)
    
    // Preferences DataStore
    implementation(libs.androidx.datastore.preferences)
}`;

  const ANDROID_ENGINE_KOTLIN = `// FiveElementsEngine.kt (Pure Kotlin Engine)
package com.waunreki.fortune.domain.engine

import java.time.LocalDate
import java.time.temporal.ChronoUnit

enum class FiveElement(val order: Int) {
    WOOD(0), FIRE(1), EARTH(2), METAL(3), WATER(4)
}

enum class YinYang { YANG, YIN }

data class BirthType(
    val number: Int,
    val element: FiveElement,
    val yinYang: YinYang
)

class FiveElementsEngine {
    // 1. Birthdate Formula: N = (Y + 3*M + 7*D) mod 10
    fun calculateBirthType(year: Int, month: Int, day: Int): BirthType {
        val n = (((year + 3 * month + 7 * day) % 10) + 10) % 10
        val element = when (n) {
            0, 1 -> FiveElement.WOOD
            2, 3 -> FiveElement.FIRE
            4, 5 -> FiveElement.EARTH
            6, 7 -> FiveElement.METAL
            else -> FiveElement.WATER
        }
        val yinYang = if (n % 2 == 0) YinYang.YANG else YinYang.YIN
        return BirthType(n, element, yinYang)
    }

    // 2. Day Element: Days elapsed from 1970-01-01 mod 5
    fun calculateDayElement(date: LocalDate): FiveElement {
        val epoch = LocalDate.of(1970, 1, 1)
        val days = ChronoUnit.DAYS.between(epoch, date)
        val remainder = (((days % 5) + 5) % 5).toInt()
        return FiveElement.values()[remainder]
    }

    // 3. Sheng (相生)
    fun generates(a: FiveElement, b: FiveElement): Boolean = when (a) {
        FiveElement.WOOD -> b == FiveElement.FIRE
        FiveElement.FIRE -> b == FiveElement.EARTH
        FiveElement.EARTH -> b == FiveElement.METAL
        FiveElement.METAL -> b == FiveElement.WATER
        FiveElement.WATER -> b == FiveElement.WOOD
    }

    // 4. Ke (相剋)
    fun controls(a: FiveElement, b: FiveElement): Boolean = when (a) {
        FiveElement.WOOD -> b == FiveElement.EARTH
        FiveElement.EARTH -> b == FiveElement.WATER
        FiveElement.WATER -> b == FiveElement.FIRE
        FiveElement.FIRE -> b == FiveElement.METAL
        FiveElement.METAL -> b == FiveElement.WOOD
    }

    // 5. Score Calculation
    fun calculateFortuneScore(b: FiveElement, p: FiveElement, d: FiveElement): Int {
        // B & D relation (Mutually exclusive)
        val bdScore = when {
            b == d -> 2
            generates(d, b) -> 2
            generates(b, d) -> 1
            controls(b, d) -> 1
            else -> -1
        }
        // P & D relation
        val pdScore = when {
            p == d -> 1
            generates(p, d) || generates(d, p) -> 1
            else -> -1
        }
        return bdScore + pdScore
    }

    fun getFortuneRank(score: Int): String = when {
        score >= 5 -> "好調"
        score in 3..4 -> "順調"
        score in 1..2 -> "安定"
        score == 0 -> "整える日"
        else -> "慎重に進む日"
    }
}`;

  return (
    <div className="space-y-6 pb-20 md:pb-12 max-w-4xl mx-auto">
      {/* Title */}
      <div className="border-b border-[#C5A059]/20 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-[#C5A059] uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>{lang === 'ja' ? '占術仕様・設定・Android設計' : 'Engine Rules, Settings & Android Blueprint'}</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#F3E5AB] mt-1">
            {lang === 'ja' ? '確定仕様書とネイティブ設計' : 'Engine Specifications & Android Architecture'}
          </h1>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 p-1 bg-[#172136] rounded-xl border border-[#334155] self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('methodology')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'methodology'
                ? 'bg-[#C5A059] text-[#0C111D]'
                : 'text-[#CBD5E1] hover:text-white'
            }`}
          >
            {lang === 'ja' ? '確定占術仕様' : 'Fortune Rules'}
          </button>
          <button
            onClick={() => setActiveTab('android')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'android'
                ? 'bg-[#C5A059] text-[#0C111D]'
                : 'text-[#CBD5E1] hover:text-white'
            }`}
          >
            {lang === 'ja' ? 'Androidネイティブ設計' : 'Android Kotlin Blueprint'}
          </button>
        </div>
      </div>

      {activeTab === 'methodology' ? (
        <div className="space-y-6">
          {/* Section 1: Elimination of BaZi */}
          <div className="p-6 rounded-2xl bg-[#0F172A] border border-[#334155] shadow-lg space-y-4">
            <h2 className="text-lg font-serif font-bold text-[#F3E5AB]">
              {lang === 'ja' ? '1. 四柱推命不使用の確定仕様' : '1. Pure Yin-Yang Five Elements Specification'}
            </h2>
            <div className="p-4 rounded-xl bg-[#131B2E] border border-[#334155]/60 text-xs text-[#CBD5E1] leading-relaxed space-y-2">
              <p>
                {lang === 'ja'
                  ? '本アプリでは四柱推命の命式計算（年柱・月柱・日柱・時柱の算出、干支暦や節入り計算、出生時刻による判定など）は一切使用いたしません。生年月日からの独自五行判定、8問の五行体質診断、当日の五行（基準日からの経過日数）、および相生・相剋による日運計算のみを使用します。'
                  : 'All classical Four Pillars calculations (Year/Month/Day/Hour pillars, Ganzhi, and solar terms) have been completely replaced with the pure Yin-Yang Five Elements system.'}
              </p>
            </div>
          </div>

          {/* Section 2: Birthdate Type Formula */}
          <div className="p-6 rounded-2xl bg-[#0F172A] border border-[#334155] shadow-lg space-y-4">
            <h2 className="text-lg font-serif font-bold text-[#F3E5AB]">
              {lang === 'ja' ? '2. 生年月日からの独自五行タイプ判定式' : '2. Birthdate Unique Classification Formula'}
            </h2>
            <div className="space-y-3 text-xs text-[#CBD5E1] leading-relaxed">
              <div className="p-3.5 rounded-xl bg-[#172136] font-mono text-[#F3E5AB] font-bold">
                N = (Y + 3 × M + 7 × D) mod 10
              </div>
              <ul className="list-disc list-inside space-y-1">
                <li>N=0：木・陽 / N=1：木・陰</li>
                <li>N=2：火・陽 / N=3：火・陰</li>
                <li>N=4：土・陽 / N=5：土・陰</li>
                <li>N=6：金・陽 / N=7：金・陰</li>
                <li>N=8：水・陽 / N=9：水・陰</li>
              </ul>
              <p className="text-[11px] text-[#94A3B8]">
                {lang === 'ja'
                  ? '※五行タイプと陰陽タイプは別々に保持。五行は相生・相剋計算に用い、陰陽はアドバイス文章に反映されます。'
                  : '※Five Element and Yin/Yang are stored separately. Element is used in calculations, Yin/Yang in text.'}
              </p>
            </div>
          </div>

          {/* Section 3: Day's Element */}
          <div className="p-6 rounded-2xl bg-[#0F172A] border border-[#334155] shadow-lg space-y-4">
            <h2 className="text-lg font-serif font-bold text-[#F3E5AB]">
              {lang === 'ja' ? '3. 当日の五行判定（基準日からの経過日数）' : '3. Day’s Five Element Formula'}
            </h2>
            <div className="space-y-2 text-xs text-[#CBD5E1] leading-relaxed">
              <p>
                {lang === 'ja'
                  ? '1970年1月1日からの経過日数を5で割った余りから判定します：'
                  : 'Determined from elapsed days since 1970-01-01 mod 5:'}
              </p>
              <div className="grid grid-cols-5 gap-2 text-center font-mono">
                <div className="p-2 rounded bg-[#131B2E]">余り0：木</div>
                <div className="p-2 rounded bg-[#131B2E]">余り1：火</div>
                <div className="p-2 rounded bg-[#131B2E]">余り2：土</div>
                <div className="p-2 rounded bg-[#131B2E]">余り3：金</div>
                <div className="p-2 rounded bg-[#131B2E]">余り4：水</div>
              </div>
            </div>
          </div>

          {/* Section 4: Scoring & Ranks */}
          <div className="p-6 rounded-2xl bg-[#0F172A] border border-[#334155] shadow-lg space-y-4">
            <h2 className="text-lg font-serif font-bold text-[#F3E5AB]">
              {lang === 'ja' ? '4. 日運スコア計算と運勢ランク' : '4. Scoring Rules & Fortune Ranks'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#CBD5E1]">
              <div className="p-4 rounded-xl bg-[#131B2E] border border-[#334155]/60 space-y-1.5">
                <span className="font-bold text-[#F3E5AB] block text-sm">
                  基本五行 (B) と 当日の五行 (D)
                </span>
                <ul className="space-y-1 pl-1">
                  <li>BとDが同じ：+2点</li>
                  <li>DがBを生む：+2点</li>
                  <li>BがDを生む：+1点</li>
                  <li>BがDを制する：+1点</li>
                  <li>DがBを制する：-1点</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-[#131B2E] border border-[#334155]/60 space-y-1.5">
                <span className="font-bold text-[#F3E5AB] block text-sm">
                  主五行 (P) と 当日の五行 (D)
                </span>
                <ul className="space-y-1 pl-1">
                  <li>PとDが同じ：+1点</li>
                  <li>PとDが相生関係：+1点</li>
                  <li>PとDが相剋関係：-1点</li>
                </ul>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#172136] text-xs text-[#CBD5E1] space-y-2">
              <span className="font-bold text-[#F3E5AB] block">運勢ランク境界値：</span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center font-semibold">
                <div className="p-2 rounded bg-[#064E3B] text-[#34D399]">5点以上：好調</div>
                <div className="p-2 rounded bg-[#78350F] text-[#FBBF24]">3〜4点：順調</div>
                <div className="p-2 rounded bg-[#1E3A8A] text-[#60A5FA]">1〜2点：安定</div>
                <div className="p-2 rounded bg-[#374151] text-[#E5E7EB]">0点：整える日</div>
                <div className="p-2 rounded bg-[#7F1D1D] text-[#F87171]">0点未満：慎重に進む日</div>
              </div>
            </div>
          </div>

          {/* Section 5: Settings */}
          <div className="p-6 rounded-2xl bg-[#0F172A] border border-[#334155] shadow-lg space-y-4">
            <h2 className="text-lg font-serif font-bold text-[#F3E5AB]">
              {lang === 'ja' ? '5. 設定とデータ管理' : '5. Settings & Local Data'}
            </h2>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#131B2E]">
              <div>
                <div className="text-sm font-semibold text-[#E2E8F0]">
                  {lang === 'ja' ? '言語切り替え (Language)' : 'Language Setting'}
                </div>
                <div className="text-xs text-[#94A3B8]">
                  {lang === 'ja' ? '日本語とEnglishを切り替えます' : 'Switch between Japanese and English'}
                </div>
              </div>
              <button
                onClick={onToggleLang}
                className="px-4 py-2 bg-[#172136] hover:bg-[#202E4C] border border-[#C5A059]/40 text-[#F3E5AB] font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                {lang === 'ja' ? 'Switch to English' : '日本語に切り替え'}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#131B2E]">
              <div>
                <div className="text-sm font-semibold text-[#F87171]">
                  {lang === 'ja' ? '端末内データの初期化' : 'Reset Local Storage Data'}
                </div>
                <div className="text-xs text-[#94A3B8]">
                  {lang === 'ja' ? '生年月日や体質診断の回答を消去して初期状態に戻します' : 'Clears stored birthdate, quiz answers, and history'}
                </div>
              </div>
              <button
                onClick={onResetData}
                className="px-4 py-2 bg-[#7F1D1D] hover:bg-[#991B1B] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                {lang === 'ja' ? 'データをリセット' : 'Reset All Data'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Android Native Blueprint Tab */
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#0F172A] border border-[#C5A059]/30 shadow-lg space-y-4">
            <div className="flex items-center gap-2 text-xs font-medium text-[#C5A059]">
              <Code2 className="w-4 h-4" />
              <span>{lang === 'ja' ? 'Google Play 2026提出要件準拠 (targetSdk 36)' : 'Google Play Submission Ready (targetSdk 36)'}</span>
            </div>

            <h2 className="text-lg font-serif font-bold text-[#F3E5AB]">
              {lang === 'ja' ? 'Kotlin + Jetpack Compose + Room + DataStore 実装仕様' : 'Android Kotlin Native Implementation'}
            </h2>

            <p className="text-xs text-[#CBD5E1] leading-relaxed">
              {lang === 'ja'
                ? '全占術ロジックをAndroidネイティブKotlinとして実装し、Google Playの最新提出要件（APIレベル36以上、AAB形式、オプトインオフライン完結）を満たす設計仕様書です。'
                : 'Complete native Kotlin implementation meeting all Google Play submission requirements (API 36+, AAB bundle format, pure offline operation).'}
            </p>
          </div>

          {/* Code Snippet: Gradle */}
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-[#334155] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#F3E5AB]">
                build.gradle.kts (:app module)
              </span>
              <button
                onClick={() => handleCopy(ANDROID_GRADLE_SNIPPET, 'gradle')}
                className="flex items-center gap-1 text-[11px] text-[#C5A059] hover:underline cursor-pointer"
              >
                {copiedSnippet === 'gradle' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSnippet === 'gradle' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-3.5 rounded-xl bg-[#090D16] border border-[#334155] font-mono text-[11px] text-[#CBD5E1] overflow-x-auto">
              {ANDROID_GRADLE_SNIPPET}
            </pre>
          </div>

          {/* Code Snippet: Pure Kotlin Engine */}
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-[#334155] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#F3E5AB]">
                FiveElementsEngine.kt (Pure Kotlin Calculation)
              </span>
              <button
                onClick={() => handleCopy(ANDROID_ENGINE_KOTLIN, 'engine')}
                className="flex items-center gap-1 text-[11px] text-[#C5A059] hover:underline cursor-pointer"
              >
                {copiedSnippet === 'engine' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSnippet === 'engine' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-3.5 rounded-xl bg-[#090D16] border border-[#334155] font-mono text-[11px] text-[#CBD5E1] overflow-x-auto">
              {ANDROID_ENGINE_KOTLIN}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
