import React, { useState } from 'react';
import { FiveElement, Language } from '../types';
import { SHENG_MAP, KE_MAP } from '../engine/fiveElements';

interface FiveElementsWheelProps {
  userElement?: FiveElement;
  constitutionElement?: FiveElement;
  currentDayElement?: FiveElement;
  lang: Language;
  interactive?: boolean;
}

interface ElementNode {
  id: FiveElement;
  kanji: string;
  nameJa: string;
  nameEn: string;
  organJa: string;
  organEn: string;
  colorHex: string;
  x: number;
  y: number;
}

const ELEMENT_NODES: ElementNode[] = [
  { id: 'wood', kanji: '木', nameJa: '木 (もく)', nameEn: 'Wood', organJa: '肝・目・筋', organEn: 'Liver, Eyes, Tendons', colorHex: '#2E7D52', x: 150, y: 40 },
  { id: 'fire', kanji: '火', nameJa: '火 (か)', nameEn: 'Fire', organJa: '心・舌・血脈', organEn: 'Heart, Tongue, Vessels', colorHex: '#D9483B', x: 255, y: 115 },
  { id: 'earth', kanji: '土', nameJa: '土 (ど)', nameEn: 'Earth', organJa: '脾・口・肌肉', organEn: 'Spleen, Mouth, Muscles', colorHex: '#C59336', x: 215, y: 240 },
  { id: 'metal', kanji: '金', nameJa: '金 (ごん)', nameEn: 'Metal', organJa: '肺・鼻・皮毛', organEn: 'Lungs, Nose, Skin', colorHex: '#BAC0CD', x: 85, y: 240 },
  { id: 'water', kanji: '水', nameJa: '水 (すい)', nameEn: 'Water', organJa: '腎・耳・骨', organEn: 'Kidneys, Ears, Bones', colorHex: '#25507E', x: 45, y: 115 },
];

export const FiveElementsWheel: React.FC<FiveElementsWheelProps> = ({
  userElement,
  constitutionElement,
  currentDayElement,
  lang,
  interactive = true,
}) => {
  const [selectedElement, setSelectedElement] = useState<FiveElement | null>(userElement || 'wood');

  const activeNode = ELEMENT_NODES.find(n => n.id === selectedElement) || ELEMENT_NODES[0];
  const shengTarget = SHENG_MAP[activeNode.id];
  const keTarget = KE_MAP[activeNode.id];

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative w-full max-w-[320px] aspect-square flex items-center justify-center">
        <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-lg">
          <defs>
            <linearGradient id="goldRing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C5A059" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#E5C77D" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#9C772F" stopOpacity="0.4" />
            </linearGradient>

            <marker id="arrowSheng" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#E5C77D" />
            </marker>

            <marker id="arrowKe" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M 0 2 L 6 5 L 0 8 z" fill="#8C93A8" fillOpacity="0.6" />
            </marker>
          </defs>

          {/* Background subtle enso circle */}
          <circle cx="150" cy="150" r="115" fill="none" stroke="url(#goldRing)" strokeWidth="1" strokeDasharray="3 3" />

          {/* Ke (相剋) lines (pentagram) */}
          {ELEMENT_NODES.map((node) => {
            const targetId = KE_MAP[node.id];
            const targetNode = ELEMENT_NODES.find(n => n.id === targetId);
            if (!targetNode) return null;
            const isHighlight = selectedElement === node.id;
            return (
              <line
                key={`ke-${node.id}-${targetId}`}
                x1={node.x}
                y1={node.y}
                x2={targetNode.x}
                y2={targetNode.y}
                stroke={isHighlight ? '#E57373' : '#334155'}
                strokeWidth={isHighlight ? '2' : '1'}
                strokeDasharray={isHighlight ? 'none' : '4 3'}
                opacity={isHighlight ? 0.9 : 0.35}
                markerEnd="url(#arrowKe)"
              />
            );
          })}

          {/* Sheng (相生) perimeter lines */}
          {ELEMENT_NODES.map((node) => {
            const targetId = SHENG_MAP[node.id];
            const targetNode = ELEMENT_NODES.find(n => n.id === targetId);
            if (!targetNode) return null;
            const isHighlight = selectedElement === node.id;
            return (
              <line
                key={`sheng-${node.id}-${targetId}`}
                x1={node.x}
                y1={node.y}
                x2={targetNode.x}
                y2={targetNode.y}
                stroke={isHighlight ? '#F3E5AB' : '#475569'}
                strokeWidth={isHighlight ? '2.5' : '1.2'}
                opacity={isHighlight ? 1 : 0.45}
                markerEnd="url(#arrowSheng)"
              />
            );
          })}

          {/* Central Taiji / Enso subtle ring */}
          <circle cx="150" cy="150" r="28" fill="#131B2E" stroke="#C5A059" strokeWidth="1" opacity="0.8" />
          <text x="150" y="146" textAnchor="middle" fill="#C5A059" fontSize="11" fontFamily="Noto Serif JP, serif" fontWeight="600">
            陰陽
          </text>
          <text x="150" y="160" textAnchor="middle" fill="#94A3B8" fontSize="9" fontFamily="Plus Jakarta Sans, sans-serif">
            五行
          </text>

          {/* Element Nodes */}
          {ELEMENT_NODES.map((node) => {
            const isSelected = selectedElement === node.id;
            const isUserDM = userElement === node.id;
            const isConst = constitutionElement === node.id;
            const isDay = currentDayElement === node.id;

            return (
              <g
                key={node.id}
                className={interactive ? 'cursor-pointer transition-transform' : ''}
                onClick={() => interactive && setSelectedElement(node.id)}
              >
                {(isUserDM || isConst) && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isSelected ? '24' : '21'}
                    fill="none"
                    stroke="#D4AF37"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                    opacity="0.9"
                  />
                )}

                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isSelected ? '19' : '17'}
                  fill={node.colorHex}
                  stroke={isSelected ? '#F3E5AB' : '#1E293B'}
                  strokeWidth={isSelected ? '2' : '1'}
                  className="transition-all duration-200"
                />

                <text
                  x={node.x}
                  y={node.y + 5}
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize={isSelected ? '15' : '13'}
                  fontFamily="Shippori Mincho, Noto Serif JP, serif"
                  fontWeight="700"
                >
                  {node.kanji}
                </text>

                {isUserDM && (
                  <text
                    x={node.x}
                    y={node.y - 21}
                    textAnchor="middle"
                    fill="#F3E5AB"
                    fontSize="8"
                    fontWeight="700"
                    fontFamily="Noto Serif JP, serif"
                  >
                    基本
                  </text>
                )}
                {isDay && !isUserDM && (
                  <text
                    x={node.x}
                    y={node.y - 21}
                    textAnchor="middle"
                    fill="#38BDF8"
                    fontSize="8"
                    fontWeight="700"
                    fontFamily="Noto Serif JP, serif"
                  >
                    当日
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Element Insight Bar */}
      <div className="w-full bg-[#111927]/90 border border-[#C5A059]/25 rounded-xl p-3 text-xs text-[#CBD5E1] mt-2 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#334155]/60 pb-1.5 mb-1.5">
          <div className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: activeNode.colorHex }}
            />
            <span className="font-serif font-bold text-[#F3E5AB] text-sm">
              {lang === 'ja' ? activeNode.nameJa : activeNode.nameEn}
            </span>
            <span className="text-[11px] text-[#94A3B8]">
              （{lang === 'ja' ? activeNode.organJa : activeNode.organEn}）
            </span>
          </div>
          {interactive && (
            <span className="text-[10px] text-[#C5A059]">
              {lang === 'ja' ? '五行をタップして詳細確認' : 'Tap node to inspect'}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="flex items-center gap-1 text-[#E2E8F0]">
            <span className="text-[#F3E5AB] font-semibold">相生 (生む):</span>
            <span>
              {activeNode.kanji} → {ELEMENT_NODES.find(n => n.id === shengTarget)?.kanji}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[#E2E8F0]">
            <span className="text-[#F87171] font-semibold">相剋 (制す):</span>
            <span>
              {activeNode.kanji} → {ELEMENT_NODES.find(n => n.id === keTarget)?.kanji}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
