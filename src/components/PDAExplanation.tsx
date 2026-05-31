import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Layers, ArrowRight, Circle, Square } from 'lucide-react';

const PDAExplanation: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center gap-3">
          <BookOpen size={24} className="text-blue-500" />
          <div className="text-left">
            <h3 className="font-bold text-gray-800 dark:text-gray-200">
              What is a Pushdown Automaton (PDA)?
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Learn how PDAs work and understand the simulation
            </p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="text-gray-400" />
        ) : (
          <ChevronDown className="text-gray-400" />
        )}
      </button>

      {expanded && (
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 space-y-6">
          {/* What is a PDA */}
          <section>
            <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-3 text-lg">
              What is a Pushdown Automaton?
            </h4>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              A <strong>Pushdown Automaton (PDA)</strong> is a theoretical machine used in computer science
              to recognize patterns in strings. Think of it as a more powerful version of a Finite Automaton
              because it has a <strong>stack</strong> - a memory structure that allows it to store and
              retrieve information.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-2">
              PDAs are used to recognize <strong>Context-Free Languages</strong>, which include many
              important patterns like balanced parentheses, valid mathematical expressions, and programming
              language syntax.
            </p>
          </section>

          {/* Components */}
          <section>
            <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-3 text-lg">
              Key Components
            </h4>
            <div className="grid gap-4">
              <div className="flex gap-4 items-start p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Circle className="text-blue-500 mt-1 flex-shrink-0" size={20} />
                <div>
                  <div className="font-bold text-blue-700 dark:text-blue-300">States</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    The different "modes" the PDA can be in. At any moment, the PDA is in exactly one state.
                    States are shown as circles in the diagram.
                  </div>
                </div>
              </div>

              <div className="flex gap-4 items-start p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <ArrowRight className="text-green-500 mt-1 flex-shrink-0" size={20} />
                <div>
                  <div className="font-bold text-green-700 dark:text-green-300">Transitions</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Rules that tell the PDA how to move between states. Each transition reads an input
                    symbol, pops from the stack, and pushes new symbols onto the stack.
                  </div>
                </div>
              </div>

              <div className="flex gap-4 items-start p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <Layers className="text-amber-500 mt-1 flex-shrink-0" size={20} />
                <div>
                  <div className="font-bold text-amber-700 dark:text-amber-300">Stack</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    A LIFO (Last-In, First-Out) memory. The PDA can push symbols onto the top and pop
                    symbols from the top. This allows it to remember information for later use.
                  </div>
                </div>
              </div>

              <div className="flex gap-4 items-start p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Square className="text-purple-500 mt-1 flex-shrink-0" size={20} />
                <div>
                  <div className="font-bold text-purple-700 dark:text-purple-300">Final States</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Special states that indicate acceptance. If the PDA reaches a final state after
                    processing all input (sometimes with an empty stack), the input is accepted.
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* How Transitions Work */}
          <section>
            <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-3 text-lg">
              How Transitions Work
            </h4>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              Each transition follows this format: <strong>δ(state, input, stackTop) = (newState, push)</strong>
            </p>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg font-mono text-sm">
              <div className="mb-2">
                Example: <span className="text-blue-600 dark:text-blue-400">δ(q0, a, Z) = (q1, AZ)</span>
              </div>
              <ul className="space-y-1 text-gray-600 dark:text-gray-400 text-xs">
                <li>• From state: <span className="text-blue-500">q0</span></li>
                <li>• Read input: <span className="text-green-500">a</span> (or ε for no input)</li>
                <li>• Pop from stack: <span className="text-amber-500">Z</span></li>
                <li>• Go to state: <span className="text-blue-500">q1</span></li>
                <li>• Push onto stack: <span className="text-amber-500">A, then Z</span> (top to bottom)</li>
              </ul>
            </div>
          </section>

          {/* Acceptance */}
          <section>
            <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-3 text-lg">
              When is a String Accepted?
            </h4>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              A string is <strong>accepted</strong> by a PDA when:
            </p>
            <ul className="mt-3 space-y-2 text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">1.</span>
                All input symbols have been processed (end of string reached)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">2.</span>
                The PDA is in a <strong>final state</strong>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-green-500 font-bold">*</span>
                Some PDAs also require the stack to be empty (only initial symbol Z remains)
              </li>
            </ul>
          </section>

          {/* Example Walkthrough */}
          <section>
            <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-3 text-lg">
              Example: The aⁿbⁿ Language
            </h4>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
              Let's trace how a PDA accepts the string <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">aabb</span>:
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <span className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">Step 0</span>
                <span>Start: state=q0, input="aabb", stack=[Z]</span>
              </div>
              <div className="flex items-center gap-3 p-2 bg-blue-50 dark:bg-blue-900/30 rounded">
                <span className="text-xs bg-blue-200 dark:bg-blue-800 px-2 py-1 rounded">Step 1</span>
                <span>Read 'a', push A: state=q1, input="abb", stack=[A,Z]</span>
              </div>
              <div className="flex items-center gap-3 p-2 bg-blue-50 dark:bg-blue-900/30 rounded">
                <span className="text-xs bg-blue-200 dark:bg-blue-800 px-2 py-1 rounded">Step 2</span>
                <span>Read 'a', push A: state=q1, input="bb", stack=[A,A,Z]</span>
              </div>
              <div className="flex items-center gap-3 p-2 bg-amber-50 dark:bg-amber-900/30 rounded">
                <span className="text-xs bg-amber-200 dark:bg-amber-800 px-2 py-1 rounded">Step 3</span>
                <span>Read 'b', pop A: state=q2, input="b", stack=[A,Z]</span>
              </div>
              <div className="flex items-center gap-3 p-2 bg-amber-50 dark:bg-amber-900/30 rounded">
                <span className="text-xs bg-amber-200 dark:bg-amber-800 px-2 py-1 rounded">Step 4</span>
                <span>Read 'b', pop A: state=q2, input="", stack=[Z]</span>
              </div>
              <div className="flex items-center gap-3 p-2 bg-green-50 dark:bg-green-900/30 rounded">
                <span className="text-xs bg-green-200 dark:bg-green-800 px-2 py-1 rounded">Step 5</span>
                <span>Move to q3 (empty input, final state): <strong className="text-green-600 dark:text-green-400">ACCEPTED!</strong></span>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 italic">
              The PDA uses the stack to count the number of 'a's and ensures an equal number of 'b's follow.
            </p>
          </section>

          {/* Tips */}
          <section className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-2">
              Tips for Using This Simulator
            </h4>
            <ul className="space-y-2 text-sm text-blue-600 dark:text-blue-400">
              <li>• Use the <strong>Play/Pause</strong> buttons to auto-step through the simulation</li>
              <li>• <strong>Step Forward/Back</strong> to manually control the execution</li>
              <li>• Watch the <strong>State Diagram</strong> to see which state is active (highlighted)</li>
              <li>• The <strong>Stack Visualization</strong> shows symbols being pushed and popped</li>
              <li>• Try different input strings to see which are accepted or rejected</li>
              <li>• Use the <strong>Predefined Examples</strong> to explore classic PDA problems</li>
            </ul>
          </section>
        </div>
      )}
    </div>
  );
};

export default PDAExplanation;
