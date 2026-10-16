/**
 * Daily Fortune Advice Generator (日運アドバイス生成エンジン)
 * Deterministic generation of:
 * - 総合アドバイス (Overall Advice)
 * - 仕事・学びのアドバイス (Work / Learning Advice)
 * - 対人関係のアドバイス (Interpersonal Advice)
 * - 休息・セルフケアのアドバイス (Rest & Self-care Advice)
 * - ラッキーカラー (Lucky Color & Reason)
 * - 今日のおすすめ行動 (Recommended Actions: 3 items)
 * Strict rules:
 * - Sheng (相生) emphasizes growth, cooperation, learning, and steady forward progress.
 * - Ke (相剋) emphasizes mindful care, review, adjustment, and priority setting (never framed as purely bad or cursed).
 * - Fully deterministic for the same inputs (targetDate + birthType + quizResult).
 */

import {
  FiveElement,
  YinYang,
  DailyFortune,
  ConstitutionResult,
  BirthType,
} from '../types';
import {
  calculateDayElement,
  evaluateBasicElementRelation,
  evaluatePrimaryElementRelation,
  getFortuneRank,
  SHENG_MAP,
} from '../engine/fiveElements';

// Lucky color definitions mapped to Five Elements
export const ELEMENT_LUCKY_COLORS: Record<FiveElement, { nameJa: string; nameEn: string; hex: string; reasonJa: string; reasonEn: string }[]> = {
  wood: [
    { nameJa: '常盤緑 (ときわみどり)', nameEn: 'Evergreen Forest Green', hex: '#235937', reasonJa: '大樹の如き不変の生命力を育み、焦りを鎮めて着実な前進を助けます。', reasonEn: 'Nurtures enduring vitality like a deep cedar forest, soothing impatience.' },
    { nameJa: '青磁色 (せいじいろ)', nameEn: 'Celadon Jade', hex: '#699E87', reasonJa: '清新な木気を呼び込み、新しいアイデアの芽吹きと成長を支えます。', reasonEn: 'Attracts refreshing wood energy, fostering fresh ideas and budding initiatives.' },
  ],
  fire: [
    { nameJa: '朱色 (しゅいろ)', nameEn: 'Vermilion Red', hex: '#C84630', reasonJa: '内なる情熱の炎を灯し、温かい自己表現と求心力を高めます。', reasonEn: 'Kindles warm inner flame, empowering charismatic self-expression.' },
    { nameJa: '茜色 (あかねいろ)', nameEn: 'Sunset Crimson', hex: '#B7410E', reasonJa: '太陽の夕映えのように、周囲を包み込む温もりと活力をもたらします。', reasonEn: 'Imparts sunset warmth, fostering camaraderie and active vitality.' },
  ],
  earth: [
    { nameJa: '琥珀色 (こはくいろ)', nameEn: 'Golden Amber', hex: '#B4782A', reasonJa: '大地の豊かな安定感を養い、足元をどっしりと定着させます。', reasonEn: 'Deepens rooted stability like ancient soil, fortifying steady progress.' },
    { nameJa: '黄土色 (おうどいろ)', nameEn: 'Rich Loam Ochre', hex: '#9E6D38', reasonJa: '実りの大地のように、あらゆる経験を受け止めて糧に変える包容力を授けます。', reasonEn: 'Bestows grounded patience to embrace and absorb all experiences into wisdom.' },
  ],
  metal: [
    { nameJa: '白銀色 (はくぎんいろ)', nameEn: 'Platinum Silver', hex: '#C0C5CE', reasonJa: '思考の雑音を断ち切り、研ぎ澄まされた直感と美基準を磨きます。', reasonEn: 'Clears mental static, sharpening crisp discernment and aesthetic clarity.' },
    { nameJa: '胡粉色 (ごふんいろ)', nameEn: 'Pure Pearl White', hex: '#F0EFEA', reasonJa: '心身の淀みを清め、まっさらな初心に立ち戻る純度をもたらします。', reasonEn: 'Purifies lingering fatigue, restoring pristine beginner clarity.' },
  ],
  water: [
    { nameJa: '瑠璃紺 (るりこん)', nameEn: 'Lapis Navy', hex: '#1B2C4F', reasonJa: '深海のような静けさを湛え、状況を冷静に見通す洞察力を授けます。', reasonEn: 'Instills deep oceanic serenity, granting profound strategic foresight.' },
    { nameJa: '墨色 (すみいろ)', nameEn: 'Sumi Charcoal', hex: '#262933', reasonJa: '外からの過剰な刺激を和らげ、内なるエネルギーを静かに蓄積させます。', reasonEn: 'Shields against external sensory noise, replenishing essential inner energy.' },
  ],
};

function deterministicHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Generate complete deterministic daily fortune
 */
export function generateDailyFortune(
  targetDateStr: string, // YYYY-MM-DD
  birthType: BirthType,
  constitution: ConstitutionResult | null
): DailyFortune {
  const parts = targetDateStr.split('-').map(Number);
  const year = parts[0];
  const month = parts[1];
  const day = parts[2];

  const dayCalc = calculateDayElement(year, month, day);
  const dayElement = dayCalc.element;
  const dayRemainder = dayCalc.remainder;
  const epochDays = dayCalc.daysSinceEpoch;

  const b = birthType.element;
  const p = constitution ? constitution.primary : birthType.element;
  const a = constitution ? constitution.auxiliary : (SHENG_MAP[b] || 'wood');

  // Relations & Scores
  const bdEval = evaluateBasicElementRelation(b, dayElement);
  const pdEval = evaluatePrimaryElementRelation(p, dayElement);

  const totalScore = bdEval.score + pdEval.score;
  const rank = getFortuneRank(totalScore);

  const seed = deterministicHash(`${targetDateStr}_${b}_${p}_${birthType.yinYang}`);

  // Select Lucky Color
  // Balancing: If Ke tension is present, wear the generating element of the day or basic element
  const balanceTarget = (bdEval.key === 'day_controls_b' || pdEval.key === 'ke')
    ? (Object.keys(SHENG_MAP).find(k => SHENG_MAP[k as FiveElement] === b) as FiveElement || 'earth')
    : dayElement;
  const colorList = ELEMENT_LUCKY_COLORS[balanceTarget];
  const luckyColor = colorList[seed % colorList.length];

  // Build Advice
  const advice = buildBilingualAdvice(
    bdEval.key,
    pdEval.key,
    rank.key,
    b,
    birthType.yinYang,
    p,
    dayElement,
    seed
  );

  return {
    date: targetDateStr,
    epochDays,
    dayElement,
    dayElementRemainder: dayRemainder,
    birthElement: b,
    birthYinYang: birthType.yinYang,
    birthNumber: birthType.number,
    primaryElement: p,
    auxiliaryElement: a,
    bdRelationKey: bdEval.key,
    bdRelationJa: bdEval.nameJa,
    bdRelationEn: bdEval.nameEn,
    bdScore: bdEval.score,
    pdRelationKey: pdEval.key,
    pdRelationJa: pdEval.nameJa,
    pdRelationEn: pdEval.nameEn,
    pdScore: pdEval.score,
    totalScore,
    rank,
    overallAdviceJa: advice.overallJa,
    overallAdviceEn: advice.overallEn,
    workAdviceJa: advice.workJa,
    workAdviceEn: advice.workEn,
    interpersonalAdviceJa: advice.interpersonalJa,
    interpersonalAdviceEn: advice.interpersonalEn,
    selfCareAdviceJa: advice.selfCareJa,
    selfCareAdviceEn: advice.selfCareEn,
    luckyColor,
    recommendedActionsJa: advice.recommendedJa,
    recommendedActionsEn: advice.recommendedEn,
  };
}

function buildBilingualAdvice(
  bdKey: 'same' | 'day_generates_b' | 'b_generates_day' | 'b_controls_day' | 'day_controls_b',
  pdKey: 'same' | 'sheng' | 'ke',
  rankKey: 'good' | 'smooth' | 'stable' | 'align' | 'cautious',
  b: FiveElement,
  yinYang: YinYang,
  p: FiveElement,
  d: FiveElement,
  seed: number
) {
  const isShengDominated = bdKey === 'day_generates_b' || bdKey === 'b_generates_day' || pdKey === 'sheng';
  const isKePresent = bdKey === 'day_controls_b' || pdKey === 'ke';

  // Overall Advice
  let overallJa = '';
  let overallEn = '';

  if (rankKey === 'good' || rankKey === 'smooth') {
    overallJa = `今日の五行【${d}】は、あなたの基本五行【${b}】および主体質【${p}】と非常に良好に共鳴しています。相生のエネルギーが後押しとなり、新しい計画や共同作業が伸びやかに前進するタイミングです。`;
    overallEn = `Today’s ${d} element resonates harmoniously with your basic element ${b} and constitution ${p}. Generative Sheng energy provides natural tailwinds for collaborative growth and forward progress.`;
  } else if (rankKey === 'stable') {
    overallJa = `今日の五行【${d}】とあなたの気質はバランスが取れた穏やかな関係です。焦って大きな勝負に出るよりも、日々のルーティンや足元の地盤を確実に固めることで、安定した実りが育まれます。`;
    overallEn = `A steady and grounded interaction between today’s ${d} and your inner nature. Rather than rushing drastic leaps, steady consistency reinforces your stable foundations.`;
  } else if (rankKey === 'align') {
    overallJa = `今日は心身と身の回りのバランスを「整える」ための好機です。内外の刺激を受け止めつつ、優先順位を整理して無駄な力を抜くことで、次の好調期への準備が整います。`;
    overallEn = `An auspicious day for alignment and thoughtful recalibration. Review priorities, declutter tasks, and breathe deeply to prepare smoothly for upcoming cycles.`;
  } else {
    overallJa = `相剋の気配が強い日ですが、これは不吉ではなく「点検と慎重な見直し」を促すための尊いサインです。強引な前進を控え、細部の確認や守りの姿勢を徹底することで、無用なトラブルを未然に防げます。`;
    overallEn = `Controlling Ke currents are active, serving not as misfortune, but as a constructive signal for mindful review and adjustment. Favor thorough verification over forced breakthroughs.`;
  }

  // Work & Learning Advice
  let workJa = '';
  let workEn = '';
  if (isShengDominated) {
    workJa = '知識の吸収力やチーム内での連携がスムーズです。以前から興味のあった分野の学習を始めたり、周囲へ積極的な提案を持ちかけると良い展開が期待できます。';
    workEn = 'Receptive learning and team synergy are heightened. Start studying a subject of interest or propose collaborative initiatives.';
  } else if (isKePresent) {
    workJa = '契約書や送信メールの確認、計画のスケジュール精査など、「見直しと調整」に最も適した日です。判断を急がず一呼吸置くことが最大の成果を生みます。';
    workEn = 'Prime day for meticulous auditing and schedule review. Double-check important documents; pausing before finalizing decisions ensures excellence.';
  } else {
    workJa = '日常の定型業務や整理整頓を着実にこなすことで、思考のクリアさが高まります。優先順位リストを作成して一つずつ完了させましょう。';
    workEn = 'Focusing on core daily workflows and workspace organization enhances mental clarity. Work through your priority checklist systematically.';
  }

  // Interpersonal Advice
  let interpersonalJa = '';
  let interpersonalEn = '';
  if (isShengDominated) {
    interpersonalJa = '温かい共感と協力の輪が広がりやすい時です。感謝の言葉を素直に伝えたり、相手の話にじっくり耳を傾けることで信頼が一層深まります。';
    interpersonalEn = 'Warm empathy and cooperative connections flourish. Express sincere appreciation and listen attentively to deepen mutual trust.';
  } else if (isKePresent) {
    interpersonalJa = '意見の食い違いが生じた時は白黒をつけようとせず、「相手の視点を受け止める時間」と捉えましょう。境界線を大切にし、穏やかな対話を心がけてください。';
    interpersonalEn = 'If viewpoints clash, avoid forcing a black-and-white verdict. Respect healthy boundaries and practice gentle, patient communication.';
  } else {
    interpersonalJa = '過度な気遣いを手放し、自然体で人と接することが心地よい関係を保つ秘訣です。無理なお誘いには丁寧に断りを入れても大丈夫です。';
    interpersonalEn = 'Engage with natural authenticity rather than over-accommodating. Declining unaligned requests gently preserves your peaceful baseline.';
  }

  // Self-Care & Rest Advice
  let selfCareJa = '';
  let selfCareEn = '';
  if (isKePresent) {
    selfCareJa = '緊張が体に残りやすいため、ぬるめのお湯にゆっくり浸かり、首や肩を温めましょう。夜はデジタル機器から離れ、早めの消灯を心がけてください。';
    selfCareEn = 'Tension may linger easily; enjoy a warm relaxing bath and gentle shoulder stretches. Disconnect from screens early for deep restorative rest.';
  } else {
    selfCareJa = '温かいお茶や栄養バランスの良い食事で胃腸を労わりましょう。軽い散歩や深呼吸で新鮮な空気を取り入れ、体内の気を爽快に巡らせてください。';
    selfCareEn = 'Nourish your digestion with warm tea and wholesome meals. A refreshing walk in open air keeps your vital energy circulating smoothly.';
  }

  // Recommended Actions (3 items)
  const recommendedPoolJa = isShengDominated
    ? [
        '長年の構想や温めていたアイデアを書き留めて人に共有する',
        'お世話になっている人へ感謝のメッセージを1通送る',
        '新しい本や教材を開き、知的な学びを15分楽しむ',
      ]
    : isKePresent
    ? [
        '予定表やタスクの期日をもう一度見直し、無理を省く',
        '静かなカフェや自宅の部屋で一人の休息時間を30分確保する',
        '机の引き出しや書類を整理して、物理的な余白を作る',
      ]
    : [
        '旬の食材を取り入れた温かい食事を丁寧に味わう',
        '深呼吸を3回行い、今ある環境のありがたさを思い出す',
        '翌日の準備を前夜のうちに整え、ゆとりある朝を迎える',
      ];

  const recommendedPoolEn = isShengDominated
    ? [
        'Write down your ideas and share them with a trusted collaborator',
        'Send a short, genuine note of gratitude to an ally or mentor',
        'Dedicate 15 unhurried minutes to learning a new skill or topic',
      ]
    : isKePresent
    ? [
        'Review your upcoming deadlines and trim non-essential commitments',
        'Protect 30 minutes of undisturbed solo quiet time to recharge',
        'Declutter your immediate desk or workspace to create breathing room',
      ]
    : [
        'Savor a nourishing seasonal meal with mindful appreciation',
        'Take three deep diaphragmatic breaths and ground in the present',
        'Prepare tomorrow’s essentials in advance for an effortless morning',
      ];

  return {
    overallJa,
    overallEn,
    workJa,
    workEn,
    interpersonalJa,
    interpersonalEn,
    selfCareJa,
    selfCareEn,
    recommendedJa: recommendedPoolJa,
    recommendedEn: recommendedPoolEn,
  };
}
