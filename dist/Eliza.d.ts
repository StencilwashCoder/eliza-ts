/**
 * ELIZA - A TypeScript Implementation of the Classic Chatbot
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
 * This implementation preserves the original ELIZA algorithm
 * and default psychotherapist script while modernizing for
 * the TypeScript/Node.js ecosystem.
 */
import type { ElizaOptions } from './types.js';
/**
 * ELIZA chatbot - simulates a Rogerian psychotherapist
 *
 * @example
 * ```typescript
 * import { Eliza } from 'eliza-ts';
 *
 * const eliza = new Eliza();
 * console.log(eliza.getInitialMessage());
 *
 * const response = eliza.respond("I am feeling sad today");
 * console.log(response);
 * ```
 */
export declare class Eliza {
    private script;
    private memory;
    private keyStack;
    private finished;
    private debug;
    /**
     * Create a new ELIZA instance
     * @param options - Configuration options
     */
    constructor(options?: ElizaOptions);
    /**
     * Get the initial greeting message
     */
    getInitialMessage(): string;
    /**
     * Get the goodbye message
     */
    getFinalMessage(): string;
    /**
     * Check if the conversation has ended
     */
    isFinished(): boolean;
    /**
     * Load a new script, resetting state
     */
    loadScript(scriptText: string): void;
    /**
     * Reset conversation state (memory, finished flag)
     */
    reset(): void;
    /**
     * Process user input and generate a response
     * @param input - User's message
     * @returns ELIZA's response
     */
    respond(input: string): string;
    /**
     * Normalize input for pattern matching
     */
    private normalizeInput;
    /**
     * Process a single sentence
     */
    private processSentence;
    /**
     * Build the key stack from words in the sentence
     */
    private buildKeyStack;
    /**
     * Try decomposition rules for a keyword
     * Returns response string, or { goto: keywordName } for goto rules
     */
    private decompose;
    /**
     * Assemble a response from decomposition rule and captured groups
     * Returns response string, or { goto: keywordName } for goto rules
     */
    private assemble;
    /**
     * Apply word substitutions to a string
     * Substitutions are applied in a single pass to avoid cascading
     * (e.g., "me" → "you" → "I" should not happen)
     */
    private applySubstitutions;
    /**
     * Escape special regex characters
     */
    private escapeRegex;
}
//# sourceMappingURL=Eliza.d.ts.map