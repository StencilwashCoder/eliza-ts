/**
 * ELIZA - A TypeScript Implementation of the Classic Chatbot
 *
 * @packageDocumentation
 *
 * ACKNOWLEDGEMENTS:
 *
 * Original ELIZA program:
 *   Joseph Weizenbaum (1966)
 *   MIT Artificial Intelligence Laboratory
 *   Communications of the ACM, January 1966
 *
 * Java implementation:
 *   Charles Hayden
 *   http://www.chayden.net/eliza/Eliza.html
 *
 * Processing library adaptation:
 *   Andres Colubri (codeanticode)
 *   https://github.com/codeanticode/eliza
 *
 * @example
 * ```typescript
 * import { Eliza } from 'eliza-ts';
 *
 * const eliza = new Eliza();
 * console.log(eliza.getInitialMessage());
 * // "How do you do. Please tell me your problem."
 *
 * console.log(eliza.respond("I am feeling sad today"));
 * // "I am sorry to hear that you are sad."
 *
 * console.log(eliza.respond("goodbye"));
 * // "Goodbye. Thank you for talking to me."
 *
 * console.log(eliza.isFinished()); // true
 * ```
 */

// Main class
export { Eliza } from './Eliza.js';

// Types for advanced usage
export type {
  ElizaOptions,
  ElizaScript,
  Keyword,
  DecompositionRule,
  Substitution,
} from './types.js';

// Script utilities for custom script creation
export { parseScript, createEmptyScript } from './script/ScriptParser.js';
export { DEFAULT_SCRIPT } from './script/defaultScript.js';
