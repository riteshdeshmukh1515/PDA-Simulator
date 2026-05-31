import React from 'react';
import { PDAConfiguration } from '../types/pda';
import { BookOpen } from 'lucide-react';

interface PredefinedExamplesProps {
  onSelect: (config: PDAConfiguration, name: string) => void;
}

const predefinedPDAs = [
  {
    name: 'aⁿbⁿ',
    description: 'Accepts strings of the form aⁿbⁿ (equal number of as followed by bs)',
    examples: ['ab', 'aabb', 'aaabbb', 'aaaabbbb'],
    config: {
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
    },
  },
  {
    name: 'Balanced Parentheses',
    description: 'Accepts strings with balanced opening and closing parentheses',
    examples: ['()', '(())', '()()', '((()))'],
    config: {
      states: ['q0', 'q1'],
      startState: 'q0',
      finalStates: ['q0'],
      inputAlphabet: ['(', ')'],
      stackAlphabet: ['Z', 'P'],
      initialStackSymbol: 'Z',
      transitions: [
        { from: 'q0', to: 'q0', input: '(', stack: 'Z', push: 'PZ' },
        { from: 'q0', to: 'q0', input: '(', stack: 'P', push: 'PP' },
        { from: 'q0', to: 'q0', input: ')', stack: 'P', push: 'ε' },
      ],
    },
  },
  {
    name: 'Palindrome (even length)',
    description: 'Accepts even-length palindromes over {a, b}',
    examples: ['aa', 'bb', 'abba', 'baab', 'aabb'],
      config: {
      states: ['q0', 'q1', 'q2', 'q3'],
      startState: 'q0',
      finalStates: ['q3'],
      inputAlphabet: ['a', 'b'],
      stackAlphabet: ['Z', 'A', 'B'],
      initialStackSymbol: 'Z',
      transitions: [
        { from: 'q0', to: 'q0', input: 'a', stack: 'Z', push: 'AZ' },
        { from: 'q0', to: 'q0', input: 'a', stack: 'A', push: 'AA' },
        { from: 'q0', to: 'q0', input: 'a', stack: 'B', push: 'AB' },
        { from: 'q0', to: 'q0', input: 'b', stack: 'Z', push: 'BZ' },
        { from: 'q0', to: 'q0', input: 'b', stack: 'A', push: 'BA' },
        { from: 'q0', to: 'q0', input: 'b', stack: 'B', push: 'BB' },
        { from: 'q0', to: 'q1', input: 'ε', stack: 'Z', push: 'Z' },
        { from: 'q0', to: 'q1', input: 'ε', stack: 'A', push: 'A' },
        { from: 'q0', to: 'q1', input: 'ε', stack: 'B', push: 'B' },
        { from: 'q1', to: 'q2', input: 'a', stack: 'A', push: 'ε' },
        { from: 'q1', to: 'q2', input: 'b', stack: 'B', push: 'ε' },
        { from: 'q2', to: 'q2', input: 'a', stack: 'A', push: 'ε' },
        { from: 'q2', to: 'q2', input: 'b', stack: 'B', push: 'ε' },
        { from: 'q2', to: 'q3', input: 'ε', stack: 'Z', push: 'ε' },
      ],
    },
  },
  {
    name: 'Equal a and b',
    description: 'Accepts strings with equal number of as and bs (any order)',
    examples: ['ab', 'ba', 'aabb', 'abab', 'baba'],
    config: {
      states: ['q0', 'q1'],
      startState: 'q0',
      finalStates: ['q0'],
      inputAlphabet: ['a', 'b'],
      stackAlphabet: ['Z', 'A', 'B'],
      initialStackSymbol: 'Z',
      transitions: [
        { from: 'q0', to: 'q0', input: 'a', stack: 'Z', push: 'AZ' },
        { from: 'q0', to: 'q0', input: 'a', stack: 'A', push: 'AA' },
        { from: 'q0', to: 'q0', input: 'b', stack: 'A', push: 'ε' },
        { from: 'q0', to: 'q0', input: 'b', stack: 'Z', push: 'BZ' },
        { from: 'q0', to: 'q0', input: 'b', stack: 'B', push: 'BB' },
        { from: 'q0', to: 'q0', input: 'a', stack: 'B', push: 'ε' },
      ],
    },
  },
  {
    name: '{wcwᴿ | w ∈ {a,b}*}',
    description: 'Accepts strings of form wcwᴿ where w is any string over {a,b}',
    examples: ['cac', 'bcb', 'abcba', 'aabcbaa'],
    config: {
      states: ['q0', 'q1', 'q2', 'q3'],
      startState: 'q0',
      finalStates: ['q3'],
      inputAlphabet: ['a', 'b', 'c'],
      stackAlphabet: ['Z', 'A', 'B'],
      initialStackSymbol: 'Z',
      transitions: [
        { from: 'q0', to: 'q0', input: 'a', stack: 'Z', push: 'AZ' },
        { from: 'q0', to: 'q0', input: 'a', stack: 'A', push: 'AA' },
        { from: 'q0', to: 'q0', input: 'a', stack: 'B', push: 'AB' },
        { from: 'q0', to: 'q0', input: 'b', stack: 'Z', push: 'BZ' },
        { from: 'q0', to: 'q0', input: 'b', stack: 'A', push: 'BA' },
        { from: 'q0', to: 'q0', input: 'b', stack: 'B', push: 'BB' },
        { from: 'q0', to: 'q1', input: 'c', stack: 'Z', push: 'Z' },
        { from: 'q0', to: 'q1', input: 'c', stack: 'A', push: 'A' },
        { from: 'q0', to: 'q1', input: 'c', stack: 'B', push: 'B' },
        { from: 'q1', to: 'q2', input: 'a', stack: 'A', push: 'ε' },
        { from: 'q1', to: 'q2', input: 'b', stack: 'B', push: 'ε' },
        { from: 'q1', to: 'q1', input: 'ε', stack: 'Z', push: 'Z' },
        { from: 'q2', to: 'q2', input: 'a', stack: 'A', push: 'ε' },
        { from: 'q2', to: 'q2', input: 'b', stack: 'B', push: 'ε' },
        { from: 'q2', to: 'q3', input: 'ε', stack: 'Z', push: 'ε' },
      ],
    },
  },
];

const PredefinedExamples: React.FC<PredefinedExamplesProps> = ({ onSelect }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen size={20} className="text-blue-500" />
        <h3 className="font-semibold text-gray-800 dark:text-gray-200">
          Predefined Examples
        </h3>
      </div>
      <div className="grid gap-3">
        {predefinedPDAs.map((pda) => (
          <button
            key={pda.name}
            onClick={() => onSelect(pda.config as PDAConfiguration, pda.name)}
            className="text-left p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 border border-blue-200 dark:border-blue-800 transition-all transform hover:scale-[1.02] group"
          >
            <div className="font-bold text-blue-700 dark:text-blue-300 mb-1">
              {pda.name}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {pda.description}
            </div>
            <div className="flex flex-wrap gap-1">
              <span className="text-xs text-gray-500 dark:text-gray-400 me-1">Try:</span>
              {pda.examples.map((ex, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 rounded text-xs font-mono"
                >
                  {ex}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PredefinedExamples;
