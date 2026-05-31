# 📌 Pushdown Automata (PDA) Simulator

A modern, interactive **Pushdown Automata Simulator Web Application** built using **React, TypeScript, Vite, Tailwind CSS, and Supabase**.

This project visually demonstrates how a Pushdown Automaton processes input strings step-by-step using stack-based logic, helping students understand **Automata Theory and Context-Free Languages (CFLs)** in an interactive and visual way.

---

🌐 Live Demo

https://pda-simulator-orpin.vercel.app/

# 📖 Project Description 

The **PDA Simulator** is an educational web-based tool designed to help students and learners understand the working of a Pushdown Automaton through **visual simulation and step-by-step execution**.

Unlike traditional learning methods that rely only on theory and diagrams, this project provides a **real-time interactive environment** where users can:

- Create or select a PDA
- Enter input strings
- Observe how the automaton processes each symbol
- View state transitions visually
- Understand stack-based computation conceptually

### 🧠 Core Idea of the Project

A Pushdown Automaton is used to recognize **Context-Free Languages**, which cannot be handled by Finite Automata.

This project simulates:
- How states change based on input symbols
- How memory (stack concept) influences transitions
- How acceptance or rejection is decided

The simulator makes abstract theoretical concepts **easy to understand through visualization and interaction**.

---

# 🎯 Project Objective

The goal of this project is to:

- Visualize Pushdown Automata (PDA) execution
- Help understand stack-based computation
- Simulate acceptance/rejection of strings
- Provide an interactive learning experience for Automata Theory

---

# 🧠 What is PDA?

A Pushdown Automaton (PDA) is a computational model used to recognize **Context-Free Languages (CFLs)**.

It extends finite automata with a conceptual **stack memory**, allowing it to:

- Push symbols into memory
- Pop symbols from memory
- Make decisions based on current state and input

This makes PDA suitable for problems like:
- Balanced parentheses
- aⁿbⁿ languages
- Nested structures

---

# 🚀 Features

## 🎮 Interactive Simulation
- Step-by-step execution of PDA transitions
- Play, Pause, Next Step, and Reset controls

## 🧩 Custom PDA Builder
- Define states and transitions
- Set start and final states
- Build your own automaton

## 📊 State Diagram Visualization
- Graph-based state representation
- Active state highlighting during execution

## 🧠 Execution Panel
Displays real-time information:
- Current state
- Remaining input
- Transition applied
- Step count
- Acceptance status

## 📚 Predefined Examples
- aⁿbⁿ language
- Balanced parentheses
- Custom test cases

## 💾 Supabase Integration
- Save PDA configurations
- Store simulation history
- Future authentication support

## 📱 Responsive Design
- Works on desktop, tablet, and mobile devices

---

# 🧪 Supported Languages

- aⁿbⁿ language  
- Balanced parentheses  
- Palindromes (basic simulation)  
- User-defined PDA rules  

---

# ⚙️ Tech Stack

- React (Frontend UI)
- TypeScript (Type Safety)
- Vite (Build Tool)
- Tailwind CSS (Styling)
- Supabase (Backend & Database)

---

# 📁 Project Structure

```
PDA-Simulator/
│
├── src/
│   ├── components/
│   │   ├── PDAEditor.tsx
│   │   ├── ExecutionPanel.tsx
│   │   ├── StateDiagram.tsx
│   │   ├── StackVisualization.tsx
│   │   ├── PredefinedExamples.tsx
│   │   ├── PDAExplanation.tsx
│   │
│   ├── lib/
│   │   ├── pdaEngine.ts
│   │   ├── supabase.ts
│   │
│   ├── types/
│   │   ├── pda.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│
├── supabase/
├── public/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
```

---

# ⚙️ Installation & Setup

## 1. Clone Repository
```bash
git clone https://github.com/riteshdeshmukh1515/PDA-Simulator.git
cd PDA-Simulator
```

---

## 2. Install Dependencies
```bash
npm install
```

---

## 3. Run Development Server
```bash
npm run dev
```

Open:
```
http://localhost:5173/
```

---

# 🧪 How It Works

1. User enters an input string
2. Selects or creates a PDA configuration
3. Starts simulation
4. The system processes input step-by-step
5. Each transition is displayed visually
6. Final state determines output:
   - ACCEPTED
   - REJECTED

---

# 💾 Supabase Features

- Store PDA configurations in database
- Save simulation history
- Enable future authentication system
- Backend support for persistence and scalability

---

# 🎨 UI/UX Highlights

- Clean modern dashboard interface
- Smooth animations for transitions
- Highlighted active states in real-time
- Step-by-step execution tracking
- Fully responsive design

---

# 📌 Example Test Cases

### Example 1
Input:
```
aaabbb
```
Output:
```
ACCEPTED
```

---

### Example 2
Input:
```
(()())
```
Output:
```
ACCEPTED
```

---

### Example 3
Input:
```
aabbb
```
Output:
```
REJECTED
```

---

# 🚀 Deployment

You can deploy this project using:

- Vercel (Recommended)
- Netlify
- GitHub Pages

---

# ⚠️ Known Issues

- npm audit warnings (can be fixed using `npm audit fix`)
- Browserslist update warning (non-critical)

---

# 🔮 Future Improvements

- Drag & drop PDA builder
- CFG → PDA converter
- Animated transition system
- Multi-user login system
- Cloud saved simulations
- AI-based PDA generator

---

# 👨‍💻 Author

**Ritesh Deshmukh**

---


