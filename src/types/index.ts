/**
 * Core Types for Yin-Yang Five Elements Daily Fortune Telling App (陰陽五行の日運占い)
 * Pure Five Elements + Yin-Yang formulation (Four Pillars removed per specification).
 */

export type FiveElement = 'wood' | 'fire' | 'earth' | 'metal' | 'water';
export type YinYang = 'yang' | 'yin';

export interface BirthType {
  number: number; // 0 to 9: (Y + 3*M + 7*D) mod 10
  element: FiveElement;
  yinYang: YinYang;
  nameJa: string;
  nameEn: string;
  natureJa: string;
  natureEn: string;
  symbolJa: string;
  symbolEn: string;
}

export interface QuizChoice {
  answerId: string;
  elementId: FiveElement;
  textJa: string;
  textEn: string;
  subtextJa?: string;
  subtextEn?: string;
}

export interface QuizQuestion {
  id: string;
  number: number; // 1 to 8
  titleJa: string;
  titleEn: string;
  questionJa: string;
  questionEn: string;
  choices: QuizChoice[];
}

export interface ConstitutionResult {
  scores: Record<FiveElement, number>;
  primary: FiveElement; // 主五行
  auxiliary: FiveElement; // 補助五行
  tiedElements: FiveElement[]; // 同点の場合の五行リスト
  completedAt: string;
}

export type FortuneRankKey = 'good' | 'smooth' | 'stable' | 'align' | 'cautious';

export interface FortuneRankInfo {
  key: FortuneRankKey;
  nameJa: string; // 好調, 順調, 安定, 整える日, 慎重に進む日
  nameEn: string;
  minScore: number;
  maxScore: number;
  colorHex: string;
  summaryJa: string;
  summaryEn: string;
}

export interface DailyFortune {
  date: string; // YYYY-MM-DD
  epochDays: number;
  dayElement: FiveElement; // 当日の五行 (余り 0:木, 1:火, 2:土, 3:金, 4:水)
  dayElementRemainder: number; // 0..4

  // User elements
  birthElement: FiveElement; // 基本五行 B
  birthYinYang: YinYang; // 陰陽
  birthNumber: number; // 0..9
  primaryElement: FiveElement; // 主五行 P
  auxiliaryElement: FiveElement; // 補助五行

  // Relational breakdown
  bdRelationKey: 'same' | 'day_generates_b' | 'b_generates_day' | 'b_controls_day' | 'day_controls_b';
  bdRelationJa: string;
  bdRelationEn: string;
  bdScore: number; // +2, +2, +1, +1, -1

  pdRelationKey: 'same' | 'sheng' | 'ke';
  pdRelationJa: string;
  pdRelationEn: string;
  pdScore: number; // +1, +1, -1

  totalScore: number; // bdScore + pdScore
  rank: FortuneRankInfo;

  // Guidance sections
  overallAdviceJa: string;
  overallAdviceEn: string;
  workAdviceJa: string;
  workAdviceEn: string;
  interpersonalAdviceJa: string;
  interpersonalAdviceEn: string;
  selfCareAdviceJa: string;
  selfCareAdviceEn: string;

  luckyColor: {
    nameJa: string;
    nameEn: string;
    hex: string;
    reasonJa: string;
    reasonEn: string;
  };
  recommendedActionsJa: string[];
  recommendedActionsEn: string[];
}

export interface UserProfile {
  birthDate: string; // YYYY-MM-DD
  birthType: BirthType | null;
  constitution: ConstitutionResult | null;
  quizAnswers: Record<string, string>; // questionId -> answerId
  createdAt: string;
  updatedAt: string;
}

export type AppView = 'home' | 'birth' | 'quiz' | 'result' | 'fortune' | 'calendar' | 'docs' | 'tests';
export type Language = 'ja' | 'en';
