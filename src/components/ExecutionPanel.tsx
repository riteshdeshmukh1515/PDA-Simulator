import React from 'react';
import { ExecutionStep, PDATransition } from '../types/pda';
import { CheckCircle, XCircle, ChevronRight, ChevronLeft, Play, Pause, RotateCcw, ArrowRight, Layers } from 'lucide-react';

interface ExecutionPanelProps {
  steps: ExecutionStep[];
  currentStep: number;
  onStepChange: (step: number) => void;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  isPlaying: boolean;
  inputString: string;
}

const TransitionCard: React.FC<{ transition: PDATransition }> = ({ transition }) => {
  const isEpsilonInput = transition.input === 'ε' || transition.input === '' || transition.input === 'ε';
  const isEpsilonPush = transition.push === 'ε' || transition.push === '' || transition.push === 'ε';

  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border-2 border-amber-300 dark:border-amber-700">
      {/* Mathematical Notation */}
      <div className="text-center mb-4 pb-3 border-b border-amber-200 dark:border-amber-700">
        <div className="font-mono text-lg text-amber-800 dark:text-amber-200">
          δ({transition.from}, <span className="text-green-600 dark:text-green-400 font-bold">{isEpsilonInput ? 'ε' : transition.input}</span>, <span className="text-orange-600 dark:text-orange-400 font-bold">{transition.stack}</span>) = ({transition.to}, <span className="text-purple-600 dark:text-purple-400 font-bold">{isEpsilonPush ? 'ε' : transition.push}</span>)
        </div>
      </div>

      {/* Visual Breakdown */}
      <div className="grid grid-cols-5 gap-2 items-center">
        {/* From State */}
        <div className="text-center">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">From State</div>
          <div className="w-12 h-12 mx-auto rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg shadow-md">
            {transition.from}
          </div>
        </div>

        {/* Input Symbol */}
        <div className="text-center">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Read Input</div>
          <div className={`w-10 h-10 mx-auto rounded-lg flex items-center justify-center font-bold text-lg shadow-md ${
            isEpsilonInput
              ? 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
              : 'bg-green-500 text-white'
          }`}>
            {isEpsilonInput ? 'ε' : transition.input}
          </div>
        </div>

        {/* Stack Pop */}
        <div className="text-center">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Pop Stack</div>
          <div className="w-10 h-10 mx-auto rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold text-lg shadow-md">
            {transition.stack}
          </div>
          <div className="text-[10px] text-orange-500 mt-1">↑ pop</div>
        </div>

        {/* To State */}
        <div className="text-center">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">To State</div>
          <div className="w-12 h-12 mx-auto rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-md">
            {transition.to}
          </div>
        </div>

        {/* Stack Push */}
        <div className="text-center">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Push Stack</div>
          <div className={`w-10 h-10 mx-auto rounded-lg flex items-center justify-center font-bold text-lg shadow-md ${
            isEpsilonPush
              ? 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
              : 'bg-purple-500 text-white'
          }`}>
            {isEpsilonPush ? 'ε' : transition.push}
          </div>
          <div className="text-[10px] text-purple-500 mt-1">↓ push</div>
        </div>
      </div>

      {/* Explanation */}
      <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded text-sm">
        <div className="font-medium text-gray-700 dark:text-gray-300 mb-1">What this means:</div>
        <div className="text-gray-600 dark:text-gray-400">
          Moving from <span className="font-bold text-blue-600 dark:text-blue-400">{transition.from}</span> to <span className="font-bold text-amber-600 dark:text-amber-400">{transition.to}</span>
          {isEpsilonInput ? (
            <span> without reading any input (ε-transition)</span>
          ) : (
            <span> after reading <span className="font-bold text-green-600 dark:text-green-400">'{transition.input}'</span></span>
          )}
          {isEpsilonPush ? (
            <span>, only popping <span className="font-bold text-orange-600 dark:text-orange-400">'{transition.stack}'</span> from stack</span>
          ) : (
            <span>, popping <span className="font-bold text-orange-600 dark:text-orange-400">'{transition.stack}'</span> and pushing <span className="font-bold text-purple-600 dark:text-purple-400">'{transition.push}'</span> onto stack</span>
          )}
        </div>
      </div>
    </div>
  );
};

const ExecutionPanel: React.FC<ExecutionPanelProps> = ({
  steps,
  currentStep,
  onStepChange,
  onPlay,
  onPause,
  onReset,
  isPlaying,
  inputString,
}) => {
  const step = steps[currentStep];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      {/* Controls */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <Play size={18} className="text-blue-500" />
          Execution Controls
        </h3>
        <div className="flex gap-2">
          <button
            onClick={onReset}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title="Reset"
          >
            <RotateCcw size={18} className="text-gray-600 dark:text-gray-300" />
          </button>
          <button
            onClick={() => onStepChange(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors"
            title="Previous Step"
          >
            <ChevronLeft size={18} className="text-gray-600 dark:text-gray-300" />
          </button>
          {isPlaying ? (
            <button
              onClick={onPause}
              className="p-2 rounded-lg bg-amber-500 hover:bg-amber-600 transition-colors"
              title="Pause"
            >
              <Pause size={18} className="text-white" />
            </button>
          ) : (
            <button
              onClick={onPlay}
              disabled={currentStep >= steps.length - 1}
              className="p-2 rounded-lg bg-green-500 hover:bg-green-600 disabled:opacity-50 transition-colors"
              title="Play"
            >
              <Play size={18} className="text-white" />
            </button>
          )}
          <button
            onClick={() => onStepChange(Math.min(steps.length - 1, currentStep + 1))}
            disabled={currentStep >= steps.length - 1}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors"
            title="Next Step"
          >
            <ChevronRight size={18} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
          <span>Step {currentStep} of {Math.max(0, steps.length - 1)}</span>
          <span>{steps.length > 0 ? Math.round((currentStep / Math.max(1, steps.length - 1)) * 100) : 0}%</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
            style={{ width: `${steps.length > 1 ? (currentStep / (steps.length - 1)) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Input Progress */}
      <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">Input String Processing:</div>
        <div className="flex gap-1 flex-wrap">
          {inputString.split('').map((char, idx) => (
            <div
              key={idx}
              className={`
                w-10 h-10 rounded flex items-center justify-center font-mono font-bold text-lg
                transition-all duration-300
                ${idx === step.state.inputPointer
                  ? 'bg-amber-500 text-white scale-110 shadow-lg ring-2 ring-amber-300'
                  : idx < step.state.inputPointer
                  ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 line-through'
                  : 'bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-500'
                }
              `}
            >
              {char}
            </div>
          ))}
          {inputString.length === 0 && (
            <div className="text-gray-400 italic text-sm">Empty input</div>
          )}
        </div>
      </div>

      {/* Current Step Details */}
      {step && !step.isAccepted && !step.isRejected && (
        <div className="space-y-4">
          {/* Current State */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border-l-4 border-blue-500">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
              <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">Current State</div>
            </div>
            <div className="text-3xl font-bold text-blue-700 dark:text-blue-300 mt-1 font-mono">
              {step.state.currentState}
            </div>
          </div>

          {/* Transition Card - The New Visual Format */}
          {step.transition && (
            <TransitionCard transition={step.transition} />
          )}

          {/* Remaining Input */}
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">
              Remaining Input
            </div>
            <div className="font-mono text-lg text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 p-2 rounded border">
              {step.state.remainingInput || <span className="text-gray-400 italic">(empty)</span>}
            </div>
          </div>
        </div>
      )}

      {/* Accepted State */}
      {step.isAccepted && (
        <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg border-2 border-green-500">
          <div className="flex items-center justify-center gap-3">
            <CheckCircle size={32} className="text-green-500" />
            <div>
              <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                ACCEPTED
              </div>
              <div className="text-sm text-green-600 dark:text-green-500 mt-1">
                The PDA accepted this input string!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejected State */}
      {step.isRejected && (
        <div className="p-6 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/30 dark:to-rose-900/30 rounded-lg border-2 border-red-500">
          <div className="flex items-center justify-center gap-3">
            <XCircle size={32} className="text-red-500" />
            <div>
              <div className="text-2xl font-bold text-red-700 dark:text-red-400">
                REJECTED
              </div>
              {step.description && (
                <div className="text-sm text-red-600 dark:text-red-500 mt-1">
                  {step.description.split(':')[0]}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Step History */}
      <div className="mt-4">
        <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2">
          <Layers size={16} />
          Step History
        </div>
        <div className="max-h-32 overflow-y-auto space-y-1 bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
          {steps.map((s, idx) => (
            <button
              key={idx}
              onClick={() => onStepChange(idx)}
              className={`
                w-full p-2 rounded text-left text-xs transition-all
                ${idx === currentStep
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-l-4 border-blue-500'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400'
                }
              `}
            >
              <div className="font-medium">
                {idx === 0 ? 'Start' : s.transition
                  ? `${s.transition.from} → ${s.transition.to}`
                  : s.isAccepted ? 'Accepted!' : 'Rejected'}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExecutionPanel;
