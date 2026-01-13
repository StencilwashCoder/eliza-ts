# ELIZA TypeScript Port - Design Document

**Date:** 2026-01-13
**Status:** Approved
**Original:** https://github.com/codeanticode/eliza

## Overview

Port the classic ELIZA chatbot from Java/Processing to modern TypeScript, preserving the original algorithm and all acknowledgements.

## Decisions

| Aspect | Choice |
|--------|--------|
| Runtime | Node.js library |
| Modules | ESM only |
| API Style | Modern idiomatic TypeScript |

## Project Structure

```
eliza/
├── src/
│   ├── index.ts              # Public API exports
│   ├── Eliza.ts              # Main Eliza class
│   ├── types.ts              # All TypeScript interfaces
│   ├── script/
│   │   ├── ScriptParser.ts   # Parses script files
│   │   └── defaultScript.ts  # Embedded default ELIZA script
│   ├── matching/
│   │   ├── PatternMatcher.ts # Pattern matching (replaces EString)
│   │   ├── KeyStack.ts       # Key priority stack
│   │   └── Decomposer.ts     # Decomposition/reassembly logic
│   └── data/
│       ├── KeyList.ts        # Keyword storage
│       ├── SynonymList.ts    # Synonym groups
│       ├── PrePostList.ts    # Pre/post substitutions
│       └── Memory.ts         # Conversation memory
├── scripts/
│   └── eliza.script          # Classic ELIZA script file
├── package.json
├── tsconfig.json
└── README.md
```

## TypeScript Interfaces

```typescript
interface DecompositionRule {
  pattern: string;
  save: boolean;
  reassemblyRules: string[];
  currentIndex: number;
}

interface Keyword {
  word: string;
  rank: number;
  decompositions: DecompositionRule[];
}

interface Substitution {
  pattern: string;
  replacement: string;
}

interface ElizaScript {
  keywords: Map<string, Keyword>;
  synonyms: Map<string, string[]>;
  preSubstitutions: Substitution[];
  postSubstitutions: Substitution[];
  initialMessage: string;
  finalMessage: string;
  quitWords: Set<string>;
}

interface ElizaOptions {
  script?: string | ElizaScript;
  debug?: boolean;
}
```

## Public API

```typescript
export class Eliza {
  constructor(options?: ElizaOptions);
  getInitialMessage(): string;
  respond(input: string): string;
  isFinished(): boolean;
  getFinalMessage(): string;
  loadScript(script: string): void;
  reset(): void;
}
```

### Usage Example

```typescript
import { Eliza } from 'eliza';

const eliza = new Eliza();
console.log(eliza.getInitialMessage());

const response = eliza.respond("I am feeling sad today");
console.log(response);

if (eliza.isFinished()) {
  console.log(eliza.getFinalMessage());
}
```

## Pattern Matching Algorithm

1. Normalize input (lowercase, remove punctuation, compress spaces)
2. Apply pre-substitutions ("dont" → "don't")
3. Split into sentences on `.` `!` `?`
4. For each sentence, find matching keywords sorted by rank
5. Try decomposition rules until one matches
6. Apply post-substitutions to captures ("my" → "your")
7. Assemble response using template
8. If nothing matches, try memory, then fallback to "xnone" key

### Pattern Syntax

- `*` = match any sequence of words
- `#` = match a number
- `@synonym` = match any word in synonym group

## Script Format

Unchanged from original:

```
initial: How do you do. Please tell me your problem.
final: Goodbye. Thank you for talking to me.
quit: bye

pre: dont don't
post: your my

synon: belief feel think believe wish

key: remember 5
  decomp: * i remember *
    reasmb: Do you often think of (2)?
    reasmb: What else does (2) remind you of?
```

## Acknowledgements

**Original ELIZA program:**
- Joseph Weizenbaum (1966)
- MIT Artificial Intelligence Laboratory
- Communications of the ACM, January 1966

**Java implementation:**
- Charles Hayden
- http://www.chayden.net/eliza/Eliza.html

**Processing library adaptation:**
- Andres Colubri (codeanticode)
- https://github.com/codeanticode/eliza

## What Stays the Same

- The core ELIZA algorithm (Weizenbaum's decomposition/reassembly)
- The script file format
- The default psychotherapist script
- All original acknowledgements

## What Changes

- Java → TypeScript
- Processing dependency removed
- Custom list classes → Map/Set
- Method names modernized (`processInput` → `respond`)
- Proper TypeScript types throughout
