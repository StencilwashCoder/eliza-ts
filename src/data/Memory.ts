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

/** Maximum number of stored memories */
const MAX_MEMORY = 20;

/**
 * Memory storage for ELIZA conversations
 * Stores responses marked with $ (save) flag for later retrieval
 */
export class Memory {
  private memory: string[] = [];

  /**
   * Save a response to memory
   * If memory is full, oldest entries are preserved (new entry dropped)
   */
  save(response: string): void {
    if (this.memory.length < MAX_MEMORY) {
      this.memory.push(response);
    }
  }

  /**
   * Get and remove the oldest saved response
   * @returns The response, or null if memory is empty
   */
  get(): string | null {
    if (this.memory.length === 0) {
      return null;
    }
    // Remove and return first element (FIFO)
    return this.memory.shift() ?? null;
  }

  /**
   * Clear all stored memories
   */
  clear(): void {
    this.memory = [];
  }

  /**
   * Check if memory has any stored responses
   */
  isEmpty(): boolean {
    return this.memory.length === 0;
  }
}
