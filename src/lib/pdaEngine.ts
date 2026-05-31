import { PDAConfiguration, PDAState, PDATransition, ExecutionStep, SimulationResult } from '../types/pda';

export class PDAEngine {
  private config: PDAConfiguration;
  private initialState: PDAState;

  constructor(config: PDAConfiguration) {
    this.config = config;
    this.validateConfiguration();
    this.initialState = {
      currentState: config.startState,
      remainingInput: '',
      stack: [config.initialStackSymbol],
      inputPointer: 0,
    };
  }

  private validateConfiguration(): void {
    if (!this.config.states.includes(this.config.startState)) {
      throw new Error(`Start state "${this.config.startState}" is not in the list of states`);
    }
    for (const finalState of this.config.finalStates) {
      if (!this.config.states.includes(finalState)) {
        throw new Error(`Final state "${finalState}" is not in the list of states`);
      }
    }
  }

  private cloneState(state: PDAState): PDAState {
    return {
      currentState: state.currentState,
      remainingInput: state.remainingInput,
      stack: [...state.stack],
      inputPointer: state.inputPointer,
    };
  }

  private isEpsilon(s: string): boolean {
    return s === 'ε' || s === '' || s === '';
  }

  simulate(inputString: string): SimulationResult {
    const steps: ExecutionStep[] = [];
    let currentState: PDAState = {
      currentState: this.config.startState,
      remainingInput: inputString,
      stack: [this.config.initialStackSymbol],
      inputPointer: 0,
    };

    steps.push({
      stepNumber: 0,
      state: this.cloneState(currentState),
      description: `Start: state=${currentState.currentState}, input="${inputString}", stack=[${currentState.stack.join(',')}]`,
    });

    const maxSteps = 1000;
    let stepNumber = 1;

    while (stepNumber <= maxSteps) {
      const stackTop = currentState.stack.length > 0 ? currentState.stack[currentState.stack.length - 1] : '';
      const inputSymbol = currentState.remainingInput.length > 0 ? currentState.remainingInput[0] : null;

      let matchingTransitions: PDATransition[] = [];

      for (const t of this.config.transitions) {
        if (t.from !== currentState.currentState) continue;
        if (t.stack !== stackTop) continue;

        if (inputSymbol !== null && t.input === inputSymbol) {
          matchingTransitions.push(t);
        }
      }

      if (matchingTransitions.length === 0) {
        for (const t of this.config.transitions) {
          if (t.from !== currentState.currentState) continue;
          if (t.stack !== stackTop) continue;

          if (this.isEpsilon(t.input)) {
            matchingTransitions.push(t);
          }
        }
      }

      if (matchingTransitions.length === 0) {
        if (currentState.remainingInput.length === 0) {
          const isInFinalState = this.config.finalStates.includes(currentState.currentState);
          const stackCleared = currentState.stack.length === 0 ||
            (currentState.stack.length === 1 && currentState.stack[0] === this.config.initialStackSymbol);

          if (isInFinalState || stackCleared) {
            steps.push({
              stepNumber,
              state: this.cloneState(currentState),
              description: `ACCEPTED: Input consumed, state=${currentState.currentState}. ${isInFinalState ? 'In final state.' : 'Stack cleared.'}`,
              isAccepted: true,
            });
            return { steps, isAccepted: true, finalState: currentState };
          }
        }

        steps.push({
          stepNumber,
          state: this.cloneState(currentState),
          description: `REJECTED: No transition from ${currentState.currentState} with input='${inputSymbol || 'ε'}', stackTop='${stackTop}'`,
          isRejected: true,
        });
        return { steps, isAccepted: false, finalState: currentState };
      }

      const transition = matchingTransitions[0];

      const newState: PDAState = {
        currentState: transition.to,
        remainingInput: currentState.remainingInput,
        stack: [...currentState.stack],
        inputPointer: currentState.inputPointer,
      };

      if (!this.isEpsilon(transition.input)) {
        newState.remainingInput = newState.remainingInput.slice(1);
        newState.inputPointer++;
      }

      newState.stack.pop();

      if (!this.isEpsilon(transition.push)) {
        for (let i = transition.push.length - 1; i >= 0; i--) {
          newState.stack.push(transition.push[i]);
        }
      }

      const inputStr = transition.input === 'ε' ? 'ε' : transition.input;
      const pushStr = transition.push === 'ε' ? 'ε' : transition.push;

      steps.push({
        stepNumber,
        state: this.cloneState(newState),
        transition,
        description: `δ(${transition.from}, ${inputStr}, ${transition.stack}) = (${transition.to}, ${pushStr}) | ` +
          `Input: "${currentState.remainingInput}" → "${newState.remainingInput || '(empty)'}", ` +
          `Stack: [${currentState.stack.join(',')}] → [${newState.stack.join(',')}]`,
      });

      currentState = newState;
      stepNumber++;

      if (currentState.remainingInput.length === 0) {
        const isInFinalState = this.config.finalStates.includes(currentState.currentState);
        const stackCleared = currentState.stack.length === 0 ||
          (currentState.stack.length === 1 && currentState.stack[0] === this.config.initialStackSymbol);

        if (isInFinalState || stackCleared) {
          steps.push({
            stepNumber,
            state: this.cloneState(currentState),
            description: `ACCEPTED: All input processed. State=${currentState.currentState}. ${isInFinalState ? 'Final state reached.' : 'Stack cleared.'}`,
            isAccepted: true,
          });
          return { steps, isAccepted: true, finalState: currentState };
        }
      }
    }

    steps.push({
      stepNumber,
      state: this.cloneState(currentState),
      description: 'REJECTED: Maximum steps exceeded',
      isRejected: true,
    });
    return { steps, isAccepted: false, finalState: currentState };
  }

  getConfig(): PDAConfiguration {
    return this.config;
  }

  getInitialState(): PDAState {
    return {
      currentState: this.config.startState,
      remainingInput: '',
      stack: [this.config.initialStackSymbol],
      inputPointer: 0,
    };
  }
}
