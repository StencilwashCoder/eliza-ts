/**
 * ELIZA Memory System
 *
 * Stores responses for later use when no pattern matches.
 * Implements a FIFO queue - first saved response is returned first.
 *
 * This is a key part of ELIZA's illusion of understanding:
 * when it can't find a good response, it recalls something
 * the user said earlier.
 *
 * Based on Charles Hayden's Mem.java implementation
 */
/**
 * Memory storage for ELIZA conversations
 * Stores responses marked with $ (save) flag for later retrieval
 */
export declare class Memory {
    private memory;
    /**
     * Save a response to memory
     * If memory is full, oldest entries are preserved (new entry dropped)
     */
    save(response: string): void;
    /**
     * Get and remove the oldest saved response
     * @returns The response, or null if memory is empty
     */
    get(): string | null;
    /**
     * Clear all stored memories
     */
    clear(): void;
    /**
     * Check if memory has any stored responses
     */
    isEmpty(): boolean;
}
//# sourceMappingURL=Memory.d.ts.map