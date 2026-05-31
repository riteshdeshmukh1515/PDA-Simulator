import React, { useState } from 'react';
import { PDAConfiguration, PDATransition } from '../types/pda';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';

interface PDAEditorProps {
  config: PDAConfiguration;
  onChange: (config: PDAConfiguration) => void;
}

const PDAEditor: React.FC<PDAEditorProps> = ({ config, onChange }) => {
  const [editingTransition, setEditingTransition] = useState<number | null>(null);
  const [newTransition, setNewTransition] = useState<PDATransition>({
    from: '',
    to: '',
    input: '',
    stack: '',
    push: '',
  });

  const [newState, setNewState] = useState('');
  const [newSymbol, setNewSymbol] = useState('');
  const [newStackSymbol, setNewStackSymbol] = useState('');

  const handleStateAdd = () => {
    if (newState && !config.states.includes(newState)) {
      onChange({
        ...config,
        states: [...config.states, newState],
      });
      setNewState('');
    }
  };

  const handleStateRemove = (state: string) => {
    if (state === config.startState) return;
    onChange({
      ...config,
      states: config.states.filter((s) => s !== state),
      finalStates: config.finalStates.filter((s) => s !== state),
      transitions: config.transitions.filter(
        (t) => t.from !== state && t.to !== state
      ),
    });
  };

  const handleInputSymbolAdd = () => {
    if (newSymbol && !config.inputAlphabet.includes(newSymbol)) {
      onChange({
        ...config,
        inputAlphabet: [...config.inputAlphabet, newSymbol],
      });
      setNewSymbol('');
    }
  };

  const handleStackSymbolAdd = () => {
    if (newStackSymbol && !config.stackAlphabet.includes(newStackSymbol)) {
      onChange({
        ...config,
        stackAlphabet: [...config.stackAlphabet, newStackSymbol],
      });
      setNewStackSymbol('');
    }
  };

  const handleTransitionAdd = () => {
    if (newTransition.from && newTransition.to && newTransition.stack) {
      onChange({
        ...config,
        transitions: [
          ...config.transitions,
          {
            ...newTransition,
            input: newTransition.input || 'ε',
            push: newTransition.push || 'ε',
          },
        ],
      });
      setNewTransition({
        from: '',
        to: '',
        input: '',
        stack: '',
        push: '',
      });
    }
  };

  const handleTransitionUpdate = (index: number, transition: PDATransition) => {
    const updated = [...config.transitions];
    updated[index] = transition;
    onChange({ ...config, transitions: updated });
    setEditingTransition(null);
  };

  const handleTransitionRemove = (index: number) => {
    onChange({
      ...config,
      transitions: config.transitions.filter((_, i) => i !== index),
    });
  };

  const handleStartStateChange = (state: string) => {
    onChange({ ...config, startState: state });
  };

  const handleFinalStateToggle = (state: string) => {
    const isFinal = config.finalStates.includes(state);
    onChange({
      ...config,
      finalStates: isFinal
        ? config.finalStates.filter((s) => s !== state)
        : [...config.finalStates, state],
    });
  };

  return (
    <div className="space-y-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          States
        </h3>
        <div className="flex flex-wrap gap-2 mb-2">
          {config.states.map((state) => (
            <div
              key={state}
              className={`
                px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2
                ${state === config.startState
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 ring-2 ring-blue-500'
                  : config.finalStates.includes(state)
                  ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 ring-2 ring-emerald-500'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                }
              `}
            >
              <span>{state}</span>
              {config.states.length > 1 && state !== config.startState && (
                <button
                  onClick={() => handleStateRemove(state)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newState}
            onChange={(e) => setNewState(e.target.value)}
            placeholder="State name (e.g., q4)"
            className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            onKeyPress={(e) => e.key === 'Enter' && handleStateAdd()}
          />
          <button
            onClick={handleStateAdd}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Start State
        </h3>
        <select
          value={config.startState}
          onChange={(e) => handleStartStateChange(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        >
          {config.states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Final States
        </h3>
        <div className="flex flex-wrap gap-2">
          {config.states.map((state) => (
            <button
              key={state}
              onClick={() => handleFinalStateToggle(state)}
              className={`
                px-3 py-1 rounded-full text-sm font-medium transition-all
                ${config.finalStates.includes(state)
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                }
              `}
            >
              {state}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Input Alphabet
          </h3>
          <div className="flex flex-wrap gap-1 mb-2">
            {config.inputAlphabet.map((symbol) => (
              <span
                key={symbol}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono text-gray-800 dark:text-gray-200"
              >
                {symbol}
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              maxLength={1}
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value)}
              placeholder="Symbol"
              className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              onKeyPress={(e) => e.key === 'Enter' && handleInputSymbolAdd()}
            />
            <button
              onClick={handleInputSymbolAdd}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Stack Alphabet
          </h3>
          <div className="flex flex-wrap gap-1 mb-2">
            {config.stackAlphabet.map((symbol) => (
              <span
                key={symbol}
                className={`px-2 py-1 rounded text-sm font-mono ${
                  symbol === config.initialStackSymbol
                    ? 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 font-bold'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                }`}
              >
                {symbol}
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              maxLength={1}
              value={newStackSymbol}
              onChange={(e) => setNewStackSymbol(e.target.value)}
              placeholder="Symbol"
              className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              onKeyPress={(e) => e.key === 'Enter' && handleStackSymbolAdd()}
            />
            <button
              onClick={handleStackSymbolAdd}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Transitions
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-600 dark:text-gray-400">
                <th className="px-2 py-1 text-left">From</th>
                <th className="px-2 py-1 text-left">Input</th>
                <th className="px-2 py-1 text-left">Stack</th>
                <th className="px-2 py-1 text-left">To</th>
                <th className="px-2 py-1 text-left">Push</th>
                <th className="px-2 py-1"></th>
              </tr>
            </thead>
            <tbody>
              {config.transitions.map((t, index) => (
                <TransitionRow
                  key={index}
                  transition={t}
                  states={config.states}
                  stackAlphabet={config.stackAlphabet}
                  inputAlphabet={config.inputAlphabet}
                  isEditing={editingTransition === index}
                  onStartEdit={() => setEditingTransition(index)}
                  onSave={(updated) => handleTransitionUpdate(index, updated)}
                  onCancel={() => setEditingTransition(null)}
                  onRemove={() => handleTransitionRemove(index)}
                />
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-semibold">
            Add New Transition
          </div>
          <div className="grid grid-cols-5 gap-2">
            <select
              value={newTransition.from}
              onChange={(e) =>
                setNewTransition({ ...newTransition, from: e.target.value })
              }
              className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-800 dark:text-white"
            >
              <option value="">From</option>
              {config.states.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <input
              type="text"
              maxLength={1}
              value={newTransition.input}
              onChange={(e) =>
                setNewTransition({ ...newTransition, input: e.target.value })
              }
              placeholder="In (ε)"
              className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-800 dark:text-white"
            />

            <input
              type="text"
              maxLength={1}
              value={newTransition.stack}
              onChange={(e) =>
                setNewTransition({ ...newTransition, stack: e.target.value })
              }
              placeholder="Pop"
              className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-800 dark:text-white"
            />

            <select
              value={newTransition.to}
              onChange={(e) =>
                setNewTransition({ ...newTransition, to: e.target.value })
              }
              className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-800 dark:text-white"
            >
              <option value="">To</option>
              {config.states.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <input
              type="text"
              value={newTransition.push}
              onChange={(e) =>
                setNewTransition({ ...newTransition, push: e.target.value })
              }
              placeholder="Push (ε)"
              className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-800 dark:text-white"
            />
          </div>
          <button
            onClick={handleTransitionAdd}
            className="mt-2 w-full px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
          >
            Add Transition
          </button>
        </div>
      </div>
    </div>
  );
};

interface TransitionRowProps {
  transition: PDATransition;
  states: string[];
  stackAlphabet: string[];
  inputAlphabet: string[];
  isEditing: boolean;
  onStartEdit: () => void;
  onSave: (transition: PDATransition) => void;
  onCancel: () => void;
  onRemove: () => void;
}

const TransitionRow: React.FC<TransitionRowProps> = ({
  transition,
  states,
  isEditing,
  onStartEdit,
  onSave,
  onCancel,
  onRemove,
}) => {
  const [editTransition, setEditTransition] = useState(transition);

  if (isEditing) {
    return (
      <tr>
        <td className="px-2 py-1">
          <select
            value={editTransition.from}
            onChange={(e) =>
              setEditTransition({ ...editTransition, from: e.target.value })
            }
            className="px-2 py-1 text-xs border dark:bg-gray-800 dark:text-white"
          >
            {states.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </td>
        <td className="px-2 py-1">
          <input
            type="text"
            maxLength={1}
            value={editTransition.input}
            onChange={(e) =>
              setEditTransition({ ...editTransition, input: e.target.value })
            }
            className="px-2 py-1 text-xs w-12 border dark:bg-gray-800 dark:text-white"
          />
        </td>
        <td className="px-2 py-1">
          <input
            type="text"
            maxLength={1}
            value={editTransition.stack}
            onChange={(e) =>
              setEditTransition({ ...editTransition, stack: e.target.value })
            }
            className="px-2 py-1 text-xs w-12 border dark:bg-gray-800 dark:text-white"
          />
        </td>
        <td className="px-2 py-1">
          <select
            value={editTransition.to}
            onChange={(e) =>
              setEditTransition({ ...editTransition, to: e.target.value })
            }
            className="px-2 py-1 text-xs border dark:bg-gray-800 dark:text-white"
          >
            {states.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </td>
        <td className="px-2 py-1">
          <input
            type="text"
            value={editTransition.push}
            onChange={(e) =>
              setEditTransition({ ...editTransition, push: e.target.value })
            }
            className="px-2 py-1 text-xs w-12 border dark:bg-gray-800 dark:text-white"
          />
        </td>
        <td className="px-2 py-1 flex gap-1">
          <button onClick={() => onSave(editTransition)} className="text-green-500">
            <Check size={14} />
          </button>
          <button onClick={onCancel} className="text-red-500">
            <X size={14} />
          </button>
        </td>
      </tr>
    );
  }

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
      <td className="px-2 py-1 font-mono">{transition.from}</td>
      <td className="px-2 py-1 font-mono">{transition.input || 'ε'}</td>
      <td className="px-2 py-1 font-mono">{transition.stack}</td>
      <td className="px-2 py-1 font-mono">{transition.to}</td>
      <td className="px-2 py-1 font-mono">{transition.push || 'ε'}</td>
      <td className="px-2 py-1 flex gap-1">
        <button onClick={onStartEdit} className="text-blue-500">
          <Edit2 size={14} />
        </button>
        <button onClick={onRemove} className="text-red-500">
          <Trash2 size={14} />
        </button>
      </td>
    </tr>
  );
};

export default PDAEditor;
