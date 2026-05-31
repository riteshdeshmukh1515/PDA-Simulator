import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PDAConfiguration, ExecutionStep } from './types/pda';
import { PDAEngine } from './lib/pdaEngine';
import StateDiagram from './components/StateDiagram';
import StackVisualization from './components/StackVisualization';
import ExecutionPanel from './components/ExecutionPanel';
import PDAEditor from './components/PDAEditor';
import PredefinedExamples from './components/PredefinedExamples';
import PDAExplanation from './components/PDAExplanation';
import { Sun, Moon, Download, Upload, Settings, X, Play } from 'lucide-react';

const defaultConfig: PDAConfiguration = {
  states: ['q0', 'q1', 'q2', 'q3'],
  startState: 'q0',
  finalStates: ['q3'],
  inputAlphabet: ['a', 'b'],
  stackAlphabet: ['Z', 'A'],
  initialStackSymbol: 'Z',
  transitions: [
    { from: 'q0', to: 'q3', input: 'ε', stack: 'Z', push: 'ε' },
    { from: 'q0', to: 'q1', input: 'a', stack: 'Z', push: 'AZ' },
    { from: 'q0', to: 'q1', input: 'a', stack: 'A', push: 'AA' },
    { from: 'q1', to: 'q1', input: 'a', stack: 'A', push: 'AA' },
    { from: 'q1', to: 'q2', input: 'b', stack: 'A', push: 'ε' },
    { from: 'q2', to: 'q2', input: 'b', stack: 'A', push: 'ε' },
    { from: 'q2', to: 'q3', input: 'ε', stack: 'Z', push: 'ε' },
  ],
};

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [config, setConfig] = useState<PDAConfiguration>(defaultConfig);
  const [pdaName, setPdaName] = useState('aⁿbⁿ');
  const [inputString, setInputString] = useState('aabb');
  const [steps, setSteps] = useState<ExecutionStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [showEditor, setShowEditor] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, []);

  const runSimulation = useCallback(() => {
    try {
      setError(null);
      const engine = new PDAEngine(config);
      const result = engine.simulate(inputString);
      setSteps(result.steps);
      setCurrentStep(0);
      setIsPlaying(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setSteps([]);
    }
  }, [config, inputString]);

  const handlePlay = useCallback(() => {
    if (steps.length === 0) {
      runSimulation();
    }
    setIsPlaying(true);
  }, [steps.length, runSimulation]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
    if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
      playIntervalRef.current = null;
    }
  }, []);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
    if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
      playIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isPlaying || steps.length === 0) {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
        playIntervalRef.current = null;
      }
      return;
    }

    playIntervalRef.current = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, speed);

    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, [isPlaying, steps.length, speed]);

  const currentStepData = steps[currentStep] || {
    state: {
      currentState: config.startState,
      remainingInput: inputString,
      stack: [config.initialStackSymbol],
      inputPointer: 0,
    },
  };

  const handleExportJSON = () => {
    const data = {
      name: pdaName,
      config,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pdaName.replace(/[^a-z0-9]/gi, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const data = JSON.parse(evt.target?.result as string);
          if (data.config) {
            setConfig(data.config);
            setPdaName(data.name || 'Imported PDA');
          }
        } catch {
          setError('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleExampleSelect = (newConfig: PDAConfiguration, name: string) => {
    setConfig(newConfig);
    setPdaName(name);
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
    setError(null);
  };

  const hasResult = steps.length > 0;
  const isAccepted = steps.length > 0 && steps[steps.length - 1].isAccepted;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <Play className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                PDA Simulator
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Interactive Pushdown Automata Visualization
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleImportJSON}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Import PDA"
            >
              <Upload size={20} className="text-gray-600 dark:text-gray-300" />
            </button>
            <button
              onClick={handleExportJSON}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Export PDA"
            >
              <Download size={20} className="text-gray-600 dark:text-gray-300" />
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {darkMode ? (
                <Sun size={20} className="text-amber-500" />
              ) : (
                <Moon size={20} className="text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {/* PDA Explanation - Educational Section */}
        <div className="mb-6">
          <PDAExplanation />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Input and Controls */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    PDA Name
                  </label>
                  <input
                    type="text"
                    value={pdaName}
                    onChange={(e) => setPdaName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Language name"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Input String
                  </label>
                  <input
                    type="text"
                    value={inputString}
                    onChange={(e) => setInputString(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white font-mono"
                    placeholder="Enter input string"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={runSimulation}
                  className="flex-1 sm:flex-none px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg hover:from-blue-600 hover:to-blue-800 transition-all font-medium shadow-md hover:shadow-lg"
                >
                  Run Simulation
                </button>
                <button
                  onClick={() => setShowEditor(true)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
                >
                  <Settings size={18} />
                  Edit PDA
                </button>
              </div>

              {hasResult && (
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Speed:</span>
                  <input
                    type="range"
                    min="100"
                    max="1500"
                    step="100"
                    value={1600 - speed}
                    onChange={(e) => setSpeed(1600 - parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400 w-16">
                    {speed < 300 ? 'Fast' : speed < 700 ? 'Normal' : 'Slow'}
                  </span>
                </div>
              )}
            </div>

            {/* State Diagram */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                State Diagram
              </h2>
              <div className="flex justify-center">
                <StateDiagram
                  config={config}
                  currentState={currentStepData.state.currentState}
                  activeTransition={currentStepData.transition}
                  width={600}
                  height={350}
                />
              </div>
            </div>

            {/* Execution Panel and Stack */}
            {hasResult && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ExecutionPanel
                    steps={steps}
                    currentStep={currentStep}
                    onStepChange={setCurrentStep}
                    onPlay={handlePlay}
                    onPause={handlePause}
                    onReset={handleReset}
                    isPlaying={isPlaying}
                    inputString={inputString}
                  />

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">
                      Stack Visualization
                    </h3>
                    <StackVisualization
                      stack={currentStepData.state.stack}
                      highlightedItem={currentStepData.state.stack.length > 0 ? currentStepData.state.stack.length - 1 : undefined}
                    />
                  </div>
                </div>

                {/* Final Result */}
                <div
                  className={`
                    mt-6 p-6 rounded-lg text-center transition-all transform
                    ${isAccepted
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-500'
                      : 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-2 border-red-500'
                    }
                    ${isAccepted ? 'animate-pulse' : ''}
                  `}
                >
                  <div
                    className={`
                      text-4xl font-bold
                      ${isAccepted ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}
                    `}
                  >
                    {isAccepted ? 'ACCEPTED' : 'REJECTED'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Input: "{inputString}" | Steps: {steps.length - 1}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Predefined Examples Sidebar */}
          <div className="space-y-6">
            <PredefinedExamples onSelect={handleExampleSelect} />
          </div>
        </div>
      </main>

      {/* PDA Editor Modal */}
      {showEditor && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                PDA Editor
              </h2>
              <button
                onClick={() => setShowEditor(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-600 dark:text-gray-300" />
              </button>
            </div>
            <div className="p-4">
              <PDAEditor
                config={config}
                onChange={(newConfig) => {
                  setConfig(newConfig);
                  setSteps([]);
                }}
              />
            </div>
            <div className="sticky bottom-0 bg-white dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowEditor(false)}
                className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
