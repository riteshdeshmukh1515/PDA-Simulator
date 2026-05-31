/*
  # Create PDA Configurations Table

  1. New Tables
    - `pda_configurations`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `config` (jsonb - stores states, alphabet, transitions, etc.)
      - `is_predefined` (boolean - for built-in examples)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on `pda_configurations` table
    - Allow public read for predefined PDAs
    - Allow authenticated users to manage their own PDAs
*/

CREATE TABLE IF NOT EXISTS pda_configurations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  config jsonb NOT NULL,
  is_predefined boolean DEFAULT false,
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE pda_configurations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view predefined PDAs"
  ON pda_configurations FOR SELECT
  TO authenticated
  USING (is_predefined = true OR user_id = auth.uid());

CREATE POLICY "Users can create own PDAs"
  ON pda_configurations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own PDAs"
  ON pda_configurations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own PDAs"
  ON pda_configurations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert predefined PDA examples
INSERT INTO pda_configurations (name, description, config, is_predefined) VALUES
(
  'aⁿbⁿ Language',
  'Accepts strings of the form aⁿbⁿ where n ≥ 0',
  '{
    "states": ["q0", "q1", "q2", "q3"],
    "startState": "q0",
    "finalStates": ["q3"],
    "inputAlphabet": ["a", "b"],
    "stackAlphabet": ["Z", "A"],
    "initialStackSymbol": "Z",
    "transitions": [
      {"from": "q0", "to": "q3", "input": "ε", "stack": "Z", "push": "ε"},
      {"from": "q0", "to": "q1", "input": "a", "stack": "Z", "push": "AZ"},
      {"from": "q0", "to": "q1", "input": "a", "stack": "A", "push": "AA"},
      {"from": "q1", "to": "q1", "input": "a", "stack": "A", "push": "AA"},
      {"from": "q1", "to": "q2", "input": "b", "stack": "A", "push": "ε"},
      {"from": "q2", "to": "q2", "input": "b", "stack": "A", "push": "ε"},
      {"from": "q2", "to": "q3", "input": "ε", "stack": "Z", "push": "ε"}
    ]
  }'::jsonb,
  true
),
(
  'Balanced Parentheses',
  'Accepts strings with balanced parentheses',
  '{
    "states": ["q0", "q1"],
    "startState": "q0",
    "finalStates": ["q0"],
    "inputAlphabet": ["(", ")"],
    "stackAlphabet": ["Z", "P"],
    "initialStackSymbol": "Z",
    "transitions": [
      {"from": "q0", "to": "q0", "input": "(", "stack": "Z", "push": "PZ"},
      {"from": "q0", "to": "q0", "input": "(", "stack": "P", "push": "PP"},
      {"from": "q0", "to": "q0", "input": ")", "stack": "P", "push": "ε"}
    ]
  }'::jsonb,
  true
),
(
  'Palindrome (a,b)',
  'Accepts palindromes over {a, b}',
  '{
    "states": ["q0", "q1", "q2", "q3"],
    "startState": "q0",
    "finalStates": ["q3"],
    "inputAlphabet": ["a", "b"],
    "stackAlphabet": ["Z", "A", "B"],
    "initialStackSymbol": "Z",
    "transitions": [
      {"from": "q0", "to": "q0", "input": "ε", "stack": "Z", "push": "Z"},
      {"from": "q0", "to": "q0", "input": "a", "stack": "Z", "push": "AZ"},
      {"from": "q0", "to": "q0", "input": "a", "stack": "A", "push": "AA"},
      {"from": "q0", "to": "q0", "input": "a", "stack": "B", "push": "AB"},
      {"from": "q0", "to": "q0", "input": "b", "stack": "Z", "push": "BZ"},
      {"from": "q0", "to": "q0", "input": "b", "stack": "A", "push": "BA"},
      {"from": "q0", "to": "q0", "input": "b", "stack": "B", "push": "BB"},
      {"from": "q0", "to": "q1", "input": "ε", "stack": "Z", "push": "Z"},
      {"from": "q0", "to": "q1", "input": "ε", "stack": "A", "push": "A"},
      {"from": "q0", "to": "q1", "input": "ε", "stack": "B", "push": "B"},
      {"from": "q1", "to": "q2", "input": "a", "stack": "A", "push": "ε"},
      {"from": "q1", "to": "q2", "input": "b", "stack": "B", "push": "ε"},
      {"from": "q2", "to": "q2", "input": "a", "stack": "A", "push": "ε"},
      {"from": "q2", "to": "q2", "input": "b", "stack": "B", "push": "ε"},
      {"from": "q2", "to": "q3", "input": "ε", "stack": "Z", "push": "ε"}
    ]
  }'::jsonb,
  true
),
(
  'Equal a and b',
  'Accepts strings with equal number of as and bs',
  '{
    "states": ["q0", "q1", "q2", "q3"],
    "startState": "q0",
    "finalStates": ["q0"],
    "inputAlphabet": ["a", "b"],
    "stackAlphabet": ["Z", "A", "B"],
    "initialStackSymbol": "Z",
    "transitions": [
      {"from": "q0", "to": "q0", "input": "a", "stack": "Z", "push": "AZ"},
      {"from": "q0", "to": "q0", "input": "a", "stack": "A", "push": "AA"},
      {"from": "q0", "to": "q1", "input": "a", "stack": "B", "push": "ε"},
      {"from": "q0", "to": "q0", "input": "b", "stack": "Z", "push": "BZ"},
      {"from": "q0", "to": "q0", "input": "b", "stack": "B", "push": "BB"},
      {"from": "q0", "to": "q1", "input": "b", "stack": "A", "push": "ε"},
      {"from": "q1", "to": "q1", "input": "a", "stack": "B", "push": "ε"},
      {"from": "q1", "to": "q1", "input": "b", "stack": "A", "push": "ε"},
      {"from": "q1", "to": "q0", "input": "ε", "stack": "Z", "push": "Z"}
    ]
  }'::jsonb,
  true
);