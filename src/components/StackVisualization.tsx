import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface StackVisualizationProps {
  stack: string[];
  highlightedItem?: number;
  previousStack?: string[];
}

const StackVisualization: React.FC<StackVisualizationProps> = ({
  stack,
  highlightedItem,
}) => {
  return (
    <div className="flex flex-col items-center">
      {/* Visual Stack */}
      <div className="relative w-28">
        {/* Arrow pointing to top */}
        <div className="absolute -right-12 top-0 flex items-center gap-1 text-amber-500">
          <ArrowDown size={16} />
          <span className="text-xs font-medium">Top</span>
        </div>

        {/* Stack container */}
        <div
          className="relative border-2 border-blue-500 rounded-b-lg overflow-hidden"
          style={{ minHeight: '200px', background: 'linear-gradient(to top, rgba(59, 130, 246, 0.05), transparent)' }}
        >
          {stack.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm italic">
              Stack is empty
            </div>
          ) : (
            <div className="flex flex-col-reverse">
              {stack.slice().reverse().map((item, displayIndex) => {
                const actualIndex = stack.length - 1 - displayIndex;
                const isTop = displayIndex === 0;

                return (
                  <div
                    key={`${actualIndex}-${item}`}
                    className={`
                      h-12 flex items-center justify-center border-b border-blue-200 dark:border-blue-700
                      transition-all duration-300 transform
                      ${isTop
                        ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold scale-[1.02] shadow-lg'
                        : 'bg-gradient-to-r from-blue-400 to-blue-600 text-white'
                      }
                    `}
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-xl font-mono">{item}</span>
                      {isTop && (
                        <span className="text-[10px] opacity-80">Stack Top</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Stack bottom label */}
        <div className="text-center mt-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">Bottom</span>
        </div>
      </div>

      {/* Stack Info */}
      <div className="mt-6 text-center space-y-2">
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Stack Height</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 font-mono">
            {stack.length}
          </div>
        </div>

        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Stack Contents</div>
          <div className="font-mono text-sm text-gray-700 dark:text-gray-300">
            [{stack.join(', ') || 'empty'}]
          </div>
        </div>

        {stack.length > 0 && (
          <div className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
            <div className="text-xs text-amber-600 dark:text-amber-400 mb-1">Top Element</div>
            <div className="text-xl font-bold text-amber-700 dark:text-amber-300 font-mono">
              {stack[stack.length - 1]}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StackVisualization;
