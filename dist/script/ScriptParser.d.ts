/**
 * ELIZA Script Parser
 *
 * Parses the classic ELIZA script format into structured data.
 *
 * Script format:
 *   initial: <greeting>
 *   final: <goodbye>
 *   quit: <word>
 *   pre: <from> <to>
 *   post: <from> <to>
 *   synon: <word1> <word2> ...
 *   key: <keyword> [rank]
 *     decomp: [$ ]<pattern>
 *       reasmb: <response>
 *
 * Based on Charles Hayden's collect() method in Eliza.java
 */
import type { ElizaScript } from '../types.js';
/**
 * Create an empty script structure
 */
export declare function createEmptyScript(): ElizaScript;
/**
 * Parse a complete script string into an ElizaScript
 */
export declare function parseScript(scriptText: string): ElizaScript;
//# sourceMappingURL=ScriptParser.d.ts.map