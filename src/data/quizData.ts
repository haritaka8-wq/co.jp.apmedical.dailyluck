/**
 * 8-Question Five Elements Constitution Quiz Data (五行体質タイプ診断 8問)
 * Frame strictly as astrological/fortune "Five Elements Constitution Type" (占い上の五行体質タイプ),
 * never as medical diagnosis.
 */

import { QuizQuestion, FiveElement, ConstitutionResult } from '../types';
import { FIVE_ELEMENTS_ORDER } from '../engine/fiveElements';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    number: 1,
    titleJa: '感情の現れ方',
    titleEn: 'Emotional Tendency',
    questionJa: '不意のプレッシャーや忙しさに直面した時、最も心に現れやすい傾向は？',
    questionEn: 'When under sudden pressure, what emotion or mental state arises most naturally?',
    choices: [
      { answerId: 'q1_wood', elementId: 'wood', textJa: 'イライラ・焦り（前進を阻まれるもどかしさ）', textEn: 'Impatience / Frustration (eagerness to push forward)' },
      { answerId: 'q1_fire', elementId: 'fire', textJa: '興奮・動揺（心拍が高まり、落ち着きを失う）', textEn: 'Excitement / Restlessness (sudden emotional spark)' },
      { answerId: 'q1_earth', elementId: 'earth', textJa: '思い悩み・反芻（堂々巡りの心配や気遣い）', textEn: 'Overthinking / Worry (circulating anxious thoughts)' },
      { answerId: 'q1_metal', elementId: 'metal', textJa: '憂い・悲哀（徒労感、完璧にいかない失望）', textEn: 'Melancholy / Discouragement (strict self-expectations)' },
      { answerId: 'q1_water', elementId: 'water', textJa: '不安・警戒（先の見えなさへの恐れ、守りの姿勢）', textEn: 'Apprehension / Caution (instinctive defensive retreat)' },
    ],
  },
  {
    id: 'q2',
    number: 2,
    titleJa: '欲する味覚の傾向',
    titleEn: 'Taste Affinity',
    questionJa: '疲れた時や日常の中で、無意識に欲しくなる・心地よく感じる味覚は？',
    questionEn: 'When tired, which flavor profile do you intuitively seek or find comforting?',
    choices: [
      { answerId: 'q2_wood', elementId: 'wood', textJa: '酸味（柑橘類、梅干し、酢の物のスッキリ感）', textEn: 'Sour (Citrus, vinegar, crisp tartness)' },
      { answerId: 'q2_fire', elementId: 'fire', textJa: '苦味（深煎り珈琲、抹茶、ダークカカオ）', textEn: 'Bitter (Dark roast coffee, green tea, cacao)' },
      { answerId: 'q2_earth', elementId: 'earth', textJa: '甘味（穀物や芋類の自然な甘み、優しい和菓子）', textEn: 'Sweet (Whole grains, honey, comforting sweets)' },
      { answerId: 'q2_metal', elementId: 'metal', textJa: '辛味（生姜、山椒、スパイスなどの香気ある辛さ）', textEn: 'Pungent / Spices (Ginger, peppers, aromatic spices)' },
      { answerId: 'q2_water', elementId: 'water', textJa: '塩味・出汁（天然塩、味噌汁、海藻の旨み）', textEn: 'Salty / Umami (Rich miso broth, sea minerals)' },
    ],
  },
  {
    id: 'q3',
    number: 3,
    titleJa: '気候・季節の敏感さ',
    titleEn: 'Seasonal Sensitivity',
    questionJa: '体調や気分が揺らぎやすく、苦手意識を感じやすい季節や天候は？',
    questionEn: 'Which seasonal turn or weather condition challenges your vitality most?',
    choices: [
      { answerId: 'q3_wood', elementId: 'wood', textJa: '春先・風の強い日（寒暖差や気圧の乱高下）', textEn: 'Early Spring & Gusty Winds (barometric swings)' },
      { answerId: 'q3_fire', elementId: 'fire', textJa: '盛夏・猛暑（強い直射日光、熱気による消耗）', textEn: 'Midsummer Heatwaves (intense sunlight and heat)' },
      { answerId: 'q3_earth', elementId: 'earth', textJa: '梅雨・湿気の多い季節の変わり目（ジメジメ感）', textEn: 'Rainy Season & Damp Humidity (sluggish dampness)' },
      { answerId: 'q3_metal', elementId: 'metal', textJa: '晩秋・乾燥した空気（乾いた風、肌や喉の渇き）', textEn: 'Late Autumn Dryness (parched air, dry throat)' },
      { answerId: 'q3_water', elementId: 'water', textJa: '厳冬・底冷え（手足の冷え、寒冷な寒さ）', textEn: 'Deep Winter Freezing Cold (chilled limbs)' },
    ],
  },
  {
    id: 'q4',
    number: 4,
    titleJa: '心身の緊張サイン',
    titleEn: 'Tension Sign',
    questionJa: '疲労が重なった時、自分の中で最も緊張や負担を感じやすい部分は？',
    questionEn: 'When fatigue builds up, where do you most readily notice physical tension?',
    choices: [
      { answerId: 'q4_wood', elementId: 'wood', textJa: '目・首筋・肩の筋のこわばり', textEn: 'Eyes, neck and muscle/tendon stiffness' },
      { answerId: 'q4_fire', elementId: 'fire', textJa: '動悸・顔の火照り・寝つきの浅さ', textEn: 'Restless pulse, facial warmth, light sleep' },
      { answerId: 'q4_earth', elementId: 'earth', textJa: '胃腸の重さ・食欲のムラ・お腹の張り', textEn: 'Digestive heaviness, irregular appetite' },
      { answerId: 'q4_metal', elementId: 'metal', textJa: '呼吸の浅さ・喉の渇き・皮膚のカサつき', textEn: 'Shallow breath, dry throat, sensitive skin' },
      { answerId: 'q4_water', elementId: 'water', textJa: '腰のだるさ・足元の冷え・根源的な脱力感', textEn: 'Lower back stiffness, cold feet, deep fatigue' },
    ],
  },
  {
    id: 'q5',
    number: 5,
    titleJa: '行動スタイルとテンポ',
    titleEn: 'Action Style & Cadence',
    questionJa: '課題や新しい目標に向き合う時、最も自分らしい推進ペースは？',
    questionEn: 'When approaching a new goal, what is your innate action style?',
    choices: [
      { answerId: 'q5_wood', elementId: 'wood', textJa: '先陣を切る開拓力（思い立ったら素早く行動開始）', textEn: 'Pioneering Initiative (swift early action)' },
      { answerId: 'q5_fire', elementId: 'fire', textJa: '情熱で巻き込む発信力（直感と熱意で人を鼓舞）', textEn: 'Inspiring Dynamism (charismatic enthusiasm)' },
      { answerId: 'q5_earth', elementId: 'earth', textJa: '土台を固める包容力（全員の合意と調和を重視）', textEn: 'Grounded Nurturing (consensus and stability)' },
      { answerId: 'q5_metal', elementId: 'metal', textJa: '洗練と規律の構造化（無駄を削ぎ落とし秩序を保つ）', textEn: 'Disciplined Precision (sleek order and clarity)' },
      { answerId: 'q5_water', elementId: 'water', textJa: '変幻自在の柔軟適応（状況を静かに読み水のように流れる）', textEn: 'Adaptive Fluidity (observant, patient flexibility)' },
    ],
  },
  {
    id: 'q6',
    number: 6,
    titleJa: '声のトーン・会話の癖',
    titleEn: 'Vocal Tone & Manner',
    questionJa: '親しい人と話している時、自分の話し方や声のトーンに最も近いものは？',
    questionEn: 'How would you describe your natural speaking tone during conversations?',
    choices: [
      { answerId: 'q6_wood', elementId: 'wood', textJa: '張りがあり力強い（ハキハキと前向き、意思が明確）', textEn: 'Clear and Projecting (direct, articulate forward tone)' },
      { answerId: 'q6_fire', elementId: 'fire', textJa: '軽快で抑揚豊か（笑顔が多くテンポが速い）', textEn: 'Lively and Expressive (upbeat tempo, animated)' },
      { answerId: 'q6_earth', elementId: 'earth', textJa: '穏やかで温かみがある（ゆったり語りかけ安心させる）', textEn: 'Warm and Calming (grounded, gentle pacing)' },
      { answerId: 'q6_metal', elementId: 'metal', textJa: '歯切れよく明瞭（鈴の音のように澄んで整然としている）', textEn: 'Crisp and Composed (chime-like clarity, concise)' },
      { answerId: 'q6_water', elementId: 'water', textJa: '低めで深く静か（落ち着きがあり余韻を感じさせる）', textEn: 'Deep and Contemplative (soft depth, measured)' },
    ],
  },
  {
    id: 'q7',
    number: 7,
    titleJa: '心身が整う空間',
    titleEn: 'Restorative Space',
    questionJa: '精神をリフレッシュし、最も自然体を取り戻せると感じる環境は？',
    questionEn: 'In which setting do you feel most thoroughly restored and centered?',
    choices: [
      { answerId: 'q7_wood', elementId: 'wood', textJa: '深緑の森林や並木道（瑞々しい植物に囲まれる場所）', textEn: 'Verdant Forest Trails (lush botanical greenery)' },
      { answerId: 'q7_fire', elementId: 'fire', textJa: '陽光降り注ぐ高台や明るいテラス（暖かな光の場）', textEn: 'Sunlit Terraces & Warmth (bright sun, hearth warmth)' },
      { answerId: 'q7_earth', elementId: 'earth', textJa: '畳の和室や陶芸の器（大地のぬくもりを感じる場所）', textEn: 'Tatami Rooms & Pottery (grounded earthen textures)' },
      { answerId: 'q7_metal', elementId: 'metal', textJa: '整然と磨かれたミニマルな空間（白や銀の静寂）', textEn: 'Minimalist Clean Sanctuary (crisp order, pristine white)' },
      { answerId: 'q7_water', elementId: 'water', textJa: '静かな湖畔やせせらぎの音（流れる水と夜の静けさ）', textEn: 'Serene Lakeside & Waters (flowing streams, night calm)' },
    ],
  },
  {
    id: 'q8',
    number: 8,
    titleJa: '直感的に惹かれる色彩',
    titleEn: 'Intuitive Color Resonance',
    questionJa: '持ち物や装飾を選ぶ際、直感的に落ち着きや自信を覚える色調は？',
    questionEn: 'Which color palette intuitively gives you confidence and calm?',
    choices: [
      { answerId: 'q8_wood', elementId: 'wood', textJa: '深緑・常盤色・エメラルド（生き生きとした緑）', textEn: 'Deep Forest Green & Emerald (vitality of leaves)' },
      { answerId: 'q8_fire', elementId: 'fire', textJa: '朱色・茜色・コーラル（生命を燃やす温かい赤）', textEn: 'Vermilion & Coral (warm radiant fire)' },
      { answerId: 'q8_earth', elementId: 'earth', textJa: '黄土色・琥珀色・キャメル（大地の豊かな実り）', textEn: 'Ochre, Amber & Camel (warm earth tones)' },
      { answerId: 'q8_metal', elementId: 'metal', textJa: '白銀・純白・プラチナ（清潔で曇りのない銀色）', textEn: 'Silver & Crisp White (pristine metal clarity)' },
      { answerId: 'q8_water', elementId: 'water', textJa: '濃紺・藍色・漆黒（深海のような深遠な青）', textEn: 'Deep Indigo & Lapis (ocean depths and midnight)' },
    ],
  },
];

/**
 * Calculates constitution scores from 8 answers.
 * Rule:
 * 1. Each answer adds +1 to its element.
 * 2. Primary: highest score.
 * 3. Auxiliary: 2nd highest score.
 * 4. Ties: tiedElements list contains all tied elements.
 * 5. If representative single element is required, resolves via fixed order: 木 → 火 → 土 → 金 → 水.
 */
export function calculateQuizConstitution(answers: Record<string, string>): ConstitutionResult | null {
  const qIds = QUIZ_QUESTIONS.map(q => q.id);
  const isComplete = qIds.every(id => Boolean(answers[id]));
  if (!isComplete) return null;

  const scores: Record<FiveElement, number> = {
    wood: 0,
    fire: 0,
    earth: 0,
    metal: 0,
    water: 0,
  };

  for (const q of QUIZ_QUESTIONS) {
    const selectedAnswerId = answers[q.id];
    const choice = q.choices.find(c => c.answerId === selectedAnswerId);
    if (choice) {
      scores[choice.elementId] += 1;
    }
  }

  // Find max score
  const maxScore = Math.max(...Object.values(scores));
  const topTied = FIVE_ELEMENTS_ORDER.filter(elem => scores[elem] === maxScore);

  // Representative primary: fixed order 木 → 火 → 土 → 金 → 水 among the highest
  const primary = topTied[0];

  // Find 2nd highest score (excluding elements with maxScore or considering second rank)
  // Sort elements by score desc, then fixed order
  const sorted = [...FIVE_ELEMENTS_ORDER].sort((a, b) => {
    if (scores[b] !== scores[a]) return scores[b] - scores[a];
    return FIVE_ELEMENTS_ORDER.indexOf(a) - FIVE_ELEMENTS_ORDER.indexOf(b);
  });

  const auxiliary = sorted[1];

  return {
    scores,
    primary,
    auxiliary,
    tiedElements: topTied,
    completedAt: new Date().toISOString(),
  };
}
