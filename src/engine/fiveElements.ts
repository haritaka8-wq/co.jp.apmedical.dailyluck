/**
 * Core Yin-Yang & Five Elements Engine (陰陽五行計算エンジン)
 * Deterministic calculation for:
 * 1. Birthdate Five Element & Yin-Yang: N = (Y + 3*M + 7*D) mod 10
 * 2. Day's Five Element: Days since 1970-01-01 mod 5
 * 3. Directional Sheng (相生) and Ke (相剋)
 * 4. Daily Fortune Scoring (B, P, D) and Ranks
 */

import {
  FiveElement,
  YinYang,
  BirthType,
  FortuneRankInfo,
  FortuneRankKey,
} from '../types';

export const FIVE_ELEMENTS_ORDER: FiveElement[] = ['wood', 'fire', 'earth', 'metal', 'water'];

// Classical Sheng (相生: Generating): Key generates Value
export const SHENG_MAP: Record<FiveElement, FiveElement> = {
  wood: 'fire',   // 木生火
  fire: 'earth',  // 火生土
  earth: 'metal', // 土生金
  metal: 'water', // 金生水
  water: 'wood',  // 水生木
};

// Classical Ke (相剋: Controlling): Key controls Value
export const KE_MAP: Record<FiveElement, FiveElement> = {
  wood: 'earth',  // 木剋土
  earth: 'water', // 土剋水
  water: 'fire',  // 水剋火
  fire: 'metal',  // 火剋金
  metal: 'wood',  // 金剋木
};

/**
 * Directional check: Does element A generate element B? (A生B)
 */
export function generates(a: FiveElement, b: FiveElement): boolean {
  return SHENG_MAP[a] === b;
}

/**
 * Directional check: Does element A control element B? (A剋B)
 */
export function controls(a: FiveElement, b: FiveElement): boolean {
  return KE_MAP[a] === b;
}

/**
 * Mutual check: Are elements A and B in a Sheng (generating) relationship?
 */
export function isSheng(a: FiveElement, b: FiveElement): boolean {
  return generates(a, b) || generates(b, a);
}

/**
 * Mutual check: Are elements A and B in a Ke (controlling) relationship?
 */
export function isKe(a: FiveElement, b: FiveElement): boolean {
  return controls(a, b) || controls(b, a);
}

/**
 * Validates whether a given year, month, day represents a real Gregorian date
 */
export function isValidDate(year: number, month: number, day: number): boolean {
  if (isNaN(year) || isNaN(month) || isNaN(day)) return false;
  if (year < 1900 || year > 2100) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;

  const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  const daysInMonths = [31, isLeap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return day <= daysInMonths[month - 1];
}

// 10 Types Mapping (Table 3)
const BIRTH_TYPES_TABLE: Record<number, { element: FiveElement; yinYang: YinYang; nameJa: string; nameEn: string; natureJa: string; natureEn: string; symbolJa: string; symbolEn: string }> = {
  0: { element: 'wood', yinYang: 'yang', nameJa: '木・陽', nameEn: 'Wood · Yang', natureJa: '直進・開拓・高志', natureEn: 'Direct, Pioneering, Aspiration', symbolJa: '大樹の如き真っ直ぐな向上心', symbolEn: 'Upward growth of a tall tree' },
  1: { element: 'wood', yinYang: 'yin', nameJa: '木・陰', nameEn: 'Wood · Yin', natureJa: '柔軟・協調・粘り強さ', natureEn: 'Flexible, Collaborative, Enduring', symbolJa: '草花の如き柔軟としなやかさ', symbolEn: 'Resilient grace of blooming flora' },
  2: { element: 'fire', yinYang: 'yang', nameJa: '火・陽', nameEn: 'Fire · Yang', natureJa: '情熱・光明・求心力', natureEn: 'Passionate, Luminous, Magnetic', symbolJa: '太陽の如き公明正大と活力', symbolEn: 'Radiant warmth of the solar zenith' },
  3: { element: 'fire', yinYang: 'yin', nameJa: '火・陰', nameEn: 'Fire · Yin', natureJa: '直感・温もり・探究心', natureEn: 'Intuitive, Warmth, Inquiring', symbolJa: '灯火の如き洞察と内なる炎', symbolEn: 'Illuminating glow of an inner lantern' },
  4: { element: 'earth', yinYang: 'yang', nameJa: '土・陽', nameEn: 'Earth · Yang', natureJa: '泰然・不動・重厚', natureEn: 'Steadfast, Immovable, Monumental', symbolJa: '大山の如き確固たる信頼感', symbolEn: 'Immovable presence of a high mountain' },
  5: { element: 'earth', yinYang: 'yin', nameJa: '土・陰', nameEn: 'Earth · Yin', natureJa: '育む力・多才・寛容', natureEn: 'Nurturing, Versatile, Generous', symbolJa: '田園の如き包容力と受容性', symbolEn: 'Nurturing abundance of fertile soil' },
  6: { element: 'metal', yinYang: 'yang', nameJa: '金・陽', nameEn: 'Metal · Yang', natureJa: '果断・正義・突破力', natureEn: 'Decisive, Righteous, Piercing', symbolJa: '名刀の如き鋭い決断と意志', symbolEn: 'Razor-sharp focus of forged steel' },
  7: { element: 'metal', yinYang: 'yin', nameJa: '金・陰', nameEn: 'Metal · Yin', natureJa: '美意識・気品・繊細', natureEn: 'Aesthetic, Dignified, Exquisite', symbolJa: '珠玉の如き高い審美眼と気品', symbolEn: 'Refined elegance of a polished gem' },
  8: { element: 'water', yinYang: 'yang', nameJa: '水・陽', nameEn: 'Water · Yang', natureJa: '雄大・知略・自由奔放', natureEn: 'Expansive, Strategic, Dynamic', symbolJa: '大洋の如き深遠と奔放な流れ', symbolEn: 'Vast, boundless currents of the ocean' },
  9: { element: 'water', yinYang: 'yin', nameJa: '水・陰', nameEn: 'Water · Yin', natureJa: '浸透・共感・思慮深さ', natureEn: 'Permeating, Empathetic, Meditative', symbolJa: '雨露の如き慈愛と静かな知性', symbolEn: 'Quiet, nourishing grace of gentle dew' },
};

/**
 * Calculate custom Five Element & Yin-Yang type from birthdate:
 * N = (Y + 3 * M + 7 * D) mod 10
 */
export function calculateBirthType(year: number, month: number, day: number): BirthType {
  if (!isValidDate(year, month, day)) {
    throw new Error(`Invalid calendar date: ${year}-${month}-${day}`);
  }

  const rawN = (year + 3 * month + 7 * day) % 10;
  const n = (rawN + 10) % 10;
  const typeDef = BIRTH_TYPES_TABLE[n];

  return {
    number: n,
    element: typeDef.element,
    yinYang: typeDef.yinYang,
    nameJa: typeDef.nameJa,
    nameEn: typeDef.nameEn,
    natureJa: typeDef.natureJa,
    natureEn: typeDef.natureEn,
    symbolJa: typeDef.symbolJa,
    symbolEn: typeDef.symbolEn,
  };
}

/**
 * Calculates days elapsed from 1970-01-01 UTC to given date (YYYY, MM, DD)
 */
export function getDaysSinceEpoch(year: number, month: number, day: number): number {
  return Math.floor(Date.UTC(year, month - 1, day) / 86400000);
}

/**
 * Determines Day's Five Element from elapsed days since 1970-01-01:
 * Remainder mod 5:
 * 0: 木 (Wood)
 * 1: 火 (Fire)
 * 2: 土 (Earth)
 * 3: 金 (Metal)
 * 4: 水 (Water)
 */
export function calculateDayElement(year: number, month: number, day: number): {
  element: FiveElement;
  remainder: number;
  daysSinceEpoch: number;
} {
  const days = getDaysSinceEpoch(year, month, day);
  const remainder = ((days % 5) + 5) % 5;
  const element = FIVE_ELEMENTS_ORDER[remainder];
  return {
    element,
    remainder,
    daysSinceEpoch: days,
  };
}

/**
 * Evaluates relationship and score between Basic Five Element B and Day Element D:
 * - B == D: +2
 * - D generates B (D生B): +2
 * - B generates D (B生D): +1
 * - B controls D (B剋D): +1
 * - D controls B (D剋B): -1
 * Mutually exclusive!
 */
export function evaluateBasicElementRelation(b: FiveElement, d: FiveElement): {
  key: 'same' | 'day_generates_b' | 'b_generates_day' | 'b_controls_day' | 'day_controls_b';
  score: number;
  nameJa: string;
  nameEn: string;
} {
  if (b === d) {
    return {
      key: 'same',
      score: 2,
      nameJa: '同気（BとDが同じ）：+2点',
      nameEn: 'Resonant (Same Element): +2',
    };
  }
  if (generates(d, b)) {
    return {
      key: 'day_generates_b',
      score: 2,
      nameJa: '相生・受容（DがBを生む）：+2点',
      nameEn: 'Generative Receive (Day generates Basic): +2',
    };
  }
  if (generates(b, d)) {
    return {
      key: 'b_generates_day',
      score: 1,
      nameJa: '相生・発露（BがDを生む）：+1点',
      nameEn: 'Generative Output (Basic generates Day): +1',
    };
  }
  if (controls(b, d)) {
    return {
      key: 'b_controls_day',
      score: 1,
      nameJa: '相剋・統御（BがDを制する）：+1点',
      nameEn: 'Controlling Focus (Basic controls Day): +1',
    };
  }
  // d controls b
  return {
    key: 'day_controls_b',
    score: -1,
    nameJa: '相剋・鍛錬（DがBを制する）：-1点',
    nameEn: 'Controlling Challenge (Day controls Basic): -1',
  };
}

/**
 * Evaluates relationship and score between Primary Five Element P and Day Element D:
 * - P == D: +1
 * - P and D are in Sheng (相生): +1
 * - P and D are in Ke (相剋): -1
 */
export function evaluatePrimaryElementRelation(p: FiveElement, d: FiveElement): {
  key: 'same' | 'sheng' | 'ke';
  score: number;
  nameJa: string;
  nameEn: string;
} {
  if (p === d) {
    return {
      key: 'same',
      score: 1,
      nameJa: '同調（PとDが同じ）：+1点',
      nameEn: 'Aligned (Same Element): +1',
    };
  }
  if (isSheng(p, d)) {
    return {
      key: 'sheng',
      score: 1,
      nameJa: '相生（PとDが相生関係）：+1点',
      nameEn: 'Sheng Flow (Generative Relation): +1',
    };
  }
  // isKe
  return {
    key: 'ke',
    score: -1,
    nameJa: '相剋（PとDが相剋関係）：-1点',
    nameEn: 'Ke Friction (Controlling Relation): -1',
  };
}

// Fortune Ranks Definitions
export const FORTUNE_RANKS: Record<FortuneRankKey, FortuneRankInfo> = {
  good: {
    key: 'good',
    nameJa: '好調',
    nameEn: 'Excellent',
    minScore: 5,
    maxScore: Infinity,
    colorHex: '#4ADE80', // Green
    summaryJa: '巡りが極めて調和し、前進や実りが力強く後押しされる日。',
    summaryEn: 'Harmonious elemental resonance; forward progress is strongly supported.',
  },
  smooth: {
    key: 'smooth',
    nameJa: '順調',
    nameEn: 'Smooth',
    minScore: 3,
    maxScore: 4,
    colorHex: '#C5A059', // Gold
    summaryJa: '安定した追い風が吹き、計画や対話がスムーズに進みやすい日。',
    summaryEn: 'Gentle positive momentum; communication and tasks flow smoothly.',
  },
  stable: {
    key: 'stable',
    nameJa: '安定',
    nameEn: 'Stable',
    minScore: 1,
    maxScore: 2,
    colorHex: '#60A5FA', // Blue
    summaryJa: '平穏で穏やかな一日。着実な一歩と日常の維持が吉を呼びます。',
    summaryEn: 'Calm and steady; grounding routines and consistent effort bring peace.',
  },
  align: {
    key: 'align',
    nameJa: '整える日',
    nameEn: 'Align & Regroup',
    minScore: 0,
    maxScore: 0,
    colorHex: '#FBBF24', // Amber
    summaryJa: '立ち止まり、心身と環境のバランスを丁寧に調律する日。',
    summaryEn: 'A restorative pause to recalibrate mindset, wellness, and surroundings.',
  },
  cautious: {
    key: 'cautious',
    nameJa: '慎重に進む日',
    nameEn: 'Mindful & Cautious',
    minScore: -Infinity,
    maxScore: -1,
    colorHex: '#F87171', // Red
    summaryJa: '無理な突破を避け、点検とセルフケアを最優先に過ごす日。',
    summaryEn: 'Avoid forcing outcomes; prioritize careful review and gentle rest.',
  },
};

/**
 * Returns the Fortune Rank corresponding to score:
 * - 5点以上：好調
 * - 3〜4点：順調
 * - 1〜2点：安定
 * - 0点：整える日
 * - 0点未満：慎重に進む日
 */
export function getFortuneRank(score: number): FortuneRankInfo {
  if (score >= 5) return FORTUNE_RANKS.good;
  if (score >= 3) return FORTUNE_RANKS.smooth;
  if (score >= 1) return FORTUNE_RANKS.stable;
  if (score === 0) return FORTUNE_RANKS.align;
  return FORTUNE_RANKS.cautious;
}
