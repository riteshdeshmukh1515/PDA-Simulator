import React, { useMemo } from 'react';
import { PDAConfiguration, PDATransition } from '../types/pda';

interface StateDiagramProps {
  config: PDAConfiguration;
  currentState?: string;
  activeTransition?: PDATransition;
  width?: number;
  height?: number;
}

const StateDiagram: React.FC<StateDiagramProps> = ({
  config,
  currentState,
  activeTransition,
  width = 600,
  height = 400,
}) => {
  const statePositions = useMemo(() => {
    const positions: Record<string, { x: number; y: number }> = {};
    const stateCount = config.states.length;

    if (stateCount === 1) {
      positions[config.states[0]] = { x: width / 2, y: height / 2 };
    } else {
      const radius = Math.min(width, height) * 0.35;
      const centerX = width / 2;
      const centerY = height / 2;

      config.states.forEach((state, index) => {
        const angle = (index * 2 * Math.PI) / stateCount - Math.PI / 2;
        positions[state] = {
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle),
        };
      });
    }

    return positions;
  }, [config.states, width, height]);

  const groupedTransitions = useMemo(() => {
    const groups: Record<string, { from: string; to: string; transitions: PDATransition[] }> = {};

    config.transitions.forEach((t) => {
      const key = `${t.from}-${t.to}`;
      if (!groups[key]) {
        groups[key] = { from: t.from, to: t.to, transitions: [] };
      }
      groups[key].transitions.push(t);
    });

    return Object.values(groups);
  }, [config.transitions]);

  const getCurvePath = (
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    isSelfLoop: boolean,
    curveOffset: number = 0
  ): string => {
    if (isSelfLoop) {
      const loopOffsetX = 50;
      const loopOffsetY = -60;
      const cx = fromX + loopOffsetX;
      const cy = fromY + loopOffsetY;
      return `M ${fromX} ${fromY} C ${fromX} ${fromY - 40}, ${cx - 40} ${cy}, ${cx} ${cy} C ${cx + 40} ${cy}, ${toX} ${toY - 40}, ${toX} ${toY}`;
    }

    const midX = (fromX + toX) / 2;
    const midY = (fromY + toY) / 2;

    const dx = toX - fromX;
    const dy = toY - fromY;
    const perpX = -dy;
    const perpY = dx;
    const len = Math.sqrt(perpX * perpX + perpY * perpY);
    const normalizedPerpX = len > 0 ? (perpX / len) * curveOffset : 0;
    const normalizedPerpY = len > 0 ? (perpY / len) * curveOffset : 0;

    const ctrlX = midX + normalizedPerpX;
    const ctrlY = midY + normalizedPerpY;

    return `M ${fromX} ${fromY} Q ${ctrlX} ${ctrlY} ${toX} ${toY}`;
  };

  return (
    <svg width={width} height={height} className="w-full h-full">
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" className="text-gray-500 dark:text-gray-300" />
        </marker>
        <marker
          id="arrowhead-active"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" className="text-amber-500" />
        </marker>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {groupedTransitions.map((group, groupIndex) => {
        const fromPos = statePositions[group.from];
        const toPos = statePositions[group.to];
        if (!fromPos || !toPos) return null;

        const isSelfLoop = group.from === group.to;
        const curveOffset = groupIndex % 2 === 0 ? 30 : -30;
        const isActive = activeTransition &&
          activeTransition.from === group.from &&
          activeTransition.to === group.to;

        const angle = Math.atan2(toPos.y - fromPos.y, toPos.x - fromPos.x);
        const nodeRadius = 32;
        const startX = fromPos.x + nodeRadius * Math.cos(angle);
        const startY = fromPos.y + nodeRadius * Math.sin(angle);
        const endX = toPos.x - nodeRadius * Math.cos(angle);
        const endY = toPos.y - nodeRadius * Math.sin(angle);

        const path = getCurvePath(startX, startY, endX, endY, isSelfLoop, curveOffset);

        const transitionLabels = group.transitions
          .map((t) => `${t.input},${t.stack}→${t.push}`)
          .join('  ');

        const midX = isSelfLoop
          ? fromPos.x + 50
          : (startX + endX) / 2;
        const midY = isSelfLoop
          ? fromPos.y - 65
          : (startY + endY) / 2;

        return (
          <g key={`${group.from}-${group.to}`}>
            <path
              d={path}
              fill="none"
              stroke={isActive ? 'rgb(245 158 11)' : 'rgb(107 114 128)'}
              strokeWidth={isActive ? 3 : 2}
              markerEnd={isActive ? 'url(#arrowhead-active)' : 'url(#arrowhead)'}
              className={isActive ? 'transition-all duration-300' : ''}
              filter={isActive ? 'url(#glow)' : undefined}
            />
            <text
              x={midX}
              y={midY - (isSelfLoop ? 0 : 8)}
              textAnchor="middle"
              className={`text-xs font-medium ${isActive ? 'fill-amber-500' : 'fill-gray-600 dark:fill-gray-400'}`}
            >
              {transitionLabels}
            </text>
          </g>
        );
      })}

      {Object.entries(statePositions).map(([state, pos]) => {
        const isStart = state === config.startState;
        const isFinal = config.finalStates.includes(state);
        const isActive = state === currentState;
        const radius = 32;

        return (
          <g key={state}>
            {isStart && (
              <path
                d={`M ${pos.x - 60} ${pos.y - 15} L ${pos.x - radius - 8} ${pos.y}`}
                stroke="currentColor"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
                className="text-gray-500 dark:text-gray-300"
              />
            )}

            {Math.abs(pos.x - 100) < 50 && Math.abs(pos.y - 50) < 50 && (
              <circle
                cx={pos.x}
                cy={pos.y}
                r={radius + 6}
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="5,5"
                className="text-gray-300 dark:text-gray-600"
              />
            )}

            <circle
              cx={pos.x}
              cy={pos.y}
              r={radius}
              fill={isActive ? 'rgb(245 158 11)' : 'rgb(30 64 175)'}
              stroke={isActive ? 'rgb(251 191 36)' : 'rgb(59 130 246)'}
              strokeWidth={isActive ? 3 : 2}
              className={isActive ? 'transition-all duration-300' : ''}
              filter={isActive ? 'url(#glow)' : undefined}
            />

            {isFinal && (
              <circle
                cx={pos.x}
                cy={pos.y}
                r={radius - 5}
                fill="none"
                stroke={isActive ? 'rgb(251 191 36)' : 'rgb(255 255 255)'}
                strokeWidth={2}
              />
            )}

            <text
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={isActive ? 'rgb(0 0 0)' : 'white'}
              className="font-bold text-lg select-none"
            >
              {state}
            </text>

            {isStart && (
              <text
                x={pos.x - 80}
                y={pos.y - 20}
                className="text-xs fill-gray-500 dark:fill-gray-400"
              >
                Start
              </text>
            )}

            {isFinal && (
              <text
                x={pos.x}
                y={pos.y + radius + 15}
                textAnchor="middle"
                className="text-xs fill-emerald-500"
              >
                Final
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

export default StateDiagram;
