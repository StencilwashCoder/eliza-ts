/**
 * ELIZA Key Stack
 *
 * A priority-ordered stack of keywords found in the input.
 * Keywords are stored with highest rank at the bottom,
 * so when iterating from 0, we process highest priority first.
 *
 * Based on Charles Hayden's KeyStack.java implementation
 */
/** Maximum stack size */
const STACK_SIZE = 20;
/**
 * Stack of keywords sorted by rank (highest priority at index 0)
 */
export class KeyStack {
    stack = [];
    /**
     * Push a keyword into the stack, maintaining rank order
     * Higher rank keywords end up at lower indices (processed first)
     */
    push(key) {
        if (this.stack.length >= STACK_SIZE) {
            return;
        }
        // Find insertion point - keys with higher rank go to lower indices
        let insertAt = this.stack.length;
        for (let i = this.stack.length - 1; i >= 0; i--) {
            if (key.rank > this.stack[i].rank) {
                // Shift this element up to make room
                insertAt = i;
            }
            else {
                break;
            }
        }
        // Insert at the found position
        this.stack.splice(insertAt, 0, key);
    }
    /**
     * Get keyword at index (0 = highest priority)
     */
    get(index) {
        if (index < 0 || index >= this.stack.length) {
            return null;
        }
        return this.stack[index];
    }
    /**
     * Get number of keywords in stack
     */
    size() {
        return this.stack.length;
    }
    /**
     * Reset the stack for a new input
     */
    reset() {
        this.stack = [];
    }
    /**
     * Iterate over keywords in priority order
     */
    [Symbol.iterator]() {
        let index = 0;
        const stack = this.stack;
        return {
            next() {
                if (index < stack.length) {
                    return { value: stack[index++], done: false };
                }
                return { value: undefined, done: true };
            },
        };
    }
}
//# sourceMappingURL=KeyStack.js.map