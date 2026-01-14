/**
 * ELIZA Key Stack
 *
 * A priority-ordered stack of keywords found in the input.
 * Keywords are stored with highest rank at the bottom,
 * so when iterating from 0, we process highest priority first.
 *
 * Based on Charles Hayden's KeyStack.java implementation
 */
import type { Keyword } from '../types.js';
/**
 * Stack of keywords sorted by rank (highest priority at index 0)
 */
export declare class KeyStack {
    private stack;
    /**
     * Push a keyword into the stack, maintaining rank order
     * Higher rank keywords end up at lower indices (processed first)
     */
    push(key: Keyword): void;
    /**
     * Get keyword at index (0 = highest priority)
     */
    get(index: number): Keyword | null;
    /**
     * Get number of keywords in stack
     */
    size(): number;
    /**
     * Reset the stack for a new input
     */
    reset(): void;
    /**
     * Iterate over keywords in priority order
     */
    [Symbol.iterator](): Iterator<Keyword>;
}
//# sourceMappingURL=KeyStack.d.ts.map