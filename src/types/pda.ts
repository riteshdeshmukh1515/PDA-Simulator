export interface PDATransition {
  from: string;
  to: string;
  input: string;
  stack: string;
  push: string;
}

export interface PDAConfiguration {
  states: string[];
  startState: string;
  finalStates: string[];
  inputAlphabet: string[];
  stackAlphabet: string[];
  initialStackSymbol: string;
  transitions: PDATransition[];
}

export interface PDAState {
  currentState: string;
  remainingInput: string;
  stack: string[];
  inputPointer: number;
}

export interface ExecutionStep {
  stepNumber: number;
  state: PDAState;
  transition?: PDATransition;
  description: string;
  isAccepted?: boolean;
  isRejected?: boolean;
}

export interface SimulationResult {
  steps: ExecutionStep[];
  isAccepted: boolean;
  finalState: PDAState;
}

export interface SavedPDA {
  id: string;
  name: string;
  description: string;
  config: PDAConfiguration;
  is_predefined: boolean;
  user_id?: string;
  created_at: string;
}
