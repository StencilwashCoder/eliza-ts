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
import { parseScript } from './script/ScriptParser.js';
import { DEFAULT_SCRIPT } from './script/defaultScript.js';
import { Memory } from './data/Memory.js';
import { KeyStack } from './matching/KeyStack.js';
import { match, translate, compress, trim, pad } from './matching/PatternMatcher.js';
import { matchDecomp } from './matching/SynonymMatcher.js';
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
export class Eliza {
    script;
    memory;
    keyStack;
    finished = false;
    debug;
    /**
     * Create a new ELIZA instance
     * @param options - Configuration options
     */
    constructor(options = {}) {
        this.debug = options.debug ?? false;
        this.memory = new Memory();
        this.keyStack = new KeyStack();
        // Parse script (custom or default)
        if (options.script) {
            this.script = parseScript(options.script);
        }
        else {
            this.script = parseScript(DEFAULT_SCRIPT);
        }
    }
    /**
     * Get the initial greeting message
     */
    getInitialMessage() {
        return this.script.initialMessage;
    }
    /**
     * Get the goodbye message
     */
    getFinalMessage() {
        return this.script.finalMessage;
    }
    /**
     * Check if the conversation has ended
     */
    isFinished() {
        return this.finished;
    }
    /**
     * Load a new script, resetting state
     */
    loadScript(scriptText) {
        this.script = parseScript(scriptText);
        this.reset();
    }
    /**
     * Reset conversation state (memory, finished flag)
     */
    reset() {
        this.memory.clear();
        this.keyStack.reset();
        this.finished = false;
    }
    /**
     * Process user input and generate a response
     * @param input - User's message
     * @returns ELIZA's response
     */
    respond(input) {
        // Normalize input
        let s = this.normalizeInput(input);
        if (this.debug) {
            console.log(`[ELIZA] Normalized input: "${s}"`);
        }
        // Split into sentences and process each
        const parts = ['', ''];
        while (match(s, '*.*', parts)) {
            const reply = this.processSentence(parts[0]);
            if (reply)
                return reply;
            s = trim(parts[1]);
        }
        // Process remaining text
        if (s.length > 0) {
            const reply = this.processSentence(s);
            if (reply)
                return reply;
        }
        // Nothing matched - try memory
        const memorized = this.memory.get();
        if (memorized) {
            if (this.debug) {
                console.log(`[ELIZA] Using memorized response`);
            }
            return memorized;
        }
        // No memory - use xnone fallback
        const xnone = this.script.keywords.get('xnone');
        if (xnone) {
            const reply = this.decompose(xnone, s);
            if (typeof reply === 'string')
                return reply;
        }
        // Ultimate fallback
        return "I am at a loss for words.";
    }
    /**
     * Normalize input for pattern matching
     */
    normalizeInput(input) {
        // Convert to lowercase
        let s = translate(input, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz');
        // Replace punctuation with spaces
        s = translate(s, '@#$%^&*()_-+=~`{[}]|:;<>\\"', '                          ');
        // Convert sentence-ending punctuation to periods
        s = translate(s, ',?!', '...');
        // Compress whitespace
        s = compress(s);
        // Apply pre-substitutions
        s = this.applySubstitutions(s, this.script.preSubstitutions);
        return s;
    }
    /**
     * Process a single sentence
     */
    processSentence(sentence) {
        // Pad for boundary matching
        const s = pad(sentence);
        // Check for quit word
        for (const quitWord of this.script.quitWords) {
            if (s.includes(quitWord)) {
                this.finished = true;
                return this.script.finalMessage;
            }
        }
        // Build key stack from words in sentence
        this.buildKeyStack(s);
        if (this.debug) {
            console.log(`[ELIZA] Key stack size: ${this.keyStack.size()}`);
        }
        // Try each key in priority order
        for (const key of this.keyStack) {
            if (this.debug) {
                console.log(`[ELIZA] Trying key: "${key.word}" (rank ${key.rank})`);
            }
            let result = this.decompose(key, s);
            // Handle goto chains - keep trying with the same input
            while (result && typeof result === 'object' && 'goto' in result) {
                const targetKey = this.script.keywords.get(result.goto);
                if (!targetKey) {
                    console.error(`Goto target not found: "${result.goto}"`);
                    result = null;
                    break;
                }
                if (this.debug) {
                    console.log(`[ELIZA] Following goto to: "${result.goto}"`);
                }
                result = this.decompose(targetKey, s);
            }
            if (typeof result === 'string') {
                return result;
            }
        }
        return null;
    }
    /**
     * Build the key stack from words in the sentence
     */
    buildKeyStack(sentence) {
        this.keyStack.reset();
        let s = trim(sentence);
        const parts = ['', ''];
        // Extract words and find matching keys
        while (match(s, '* *', parts)) {
            const word = parts[0];
            const key = this.script.keywords.get(word);
            if (key) {
                this.keyStack.push(key);
            }
            s = parts[1];
        }
        // Check last word
        const key = this.script.keywords.get(s);
        if (key) {
            this.keyStack.push(key);
        }
    }
    /**
     * Try decomposition rules for a keyword
     * Returns response string, or { goto: keywordName } for goto rules
     */
    decompose(key, input) {
        const matches = new Array(10).fill('');
        for (const decomp of key.decompositions) {
            if (this.debug) {
                console.log(`[ELIZA] Trying pattern: "${decomp.pattern}"`);
            }
            if (matchDecomp(input, decomp.pattern, matches, this.script.synonyms)) {
                if (this.debug) {
                    console.log(`[ELIZA] Pattern matched! Captures: ${JSON.stringify(matches.filter(m => m))}`);
                }
                const result = this.assemble(decomp, matches);
                if (result)
                    return result;
            }
        }
        return null;
    }
    /**
     * Assemble a response from decomposition rule and captured groups
     * Returns response string, or { goto: keywordName } for goto rules
     */
    assemble(decomp, captures) {
        // Advance to next reassembly rule (cycles through them)
        decomp.currentIndex = (decomp.currentIndex + 1) % decomp.reassemblyRules.length;
        const rule = decomp.reassemblyRules[decomp.currentIndex];
        if (this.debug) {
            console.log(`[ELIZA] Using reassembly rule: "${rule}"`);
        }
        // Check for goto - return the target name to be handled by caller
        const gotoParts = ['', ''];
        if (match(rule, 'goto *', gotoParts)) {
            const targetName = gotoParts[0].trim();
            return { goto: targetName };
        }
        // Build response by substituting (n) placeholders
        let response = '';
        let remaining = rule;
        const subParts = ['', '', ''];
        while (match(remaining, '* (#)*', subParts)) {
            const n = parseInt(subParts[1], 10) - 1; // Convert to 0-indexed
            if (n >= 0 && n < captures.length) {
                // Apply post-substitutions to captured text
                let captured = captures[n];
                captured = this.applySubstitutions(captured, this.script.postSubstitutions);
                response += subParts[0] + ' ' + captured;
            }
            else {
                response += subParts[0];
            }
            remaining = subParts[2];
        }
        response += remaining;
        // Clean up extra spaces
        response = response.replace(/\s+/g, ' ').trim();
        // If this is a memory rule, save instead of returning
        if (decomp.save) {
            if (this.debug) {
                console.log(`[ELIZA] Saving to memory: "${response}"`);
            }
            this.memory.save(response);
            return null;
        }
        return response;
    }
    /**
     * Apply word substitutions to a string
     * Substitutions are applied in a single pass to avoid cascading
     * (e.g., "me" → "you" → "I" should not happen)
     */
    applySubstitutions(text, substitutions) {
        // Build a map for quick lookup
        const subMap = new Map();
        for (const { pattern, replacement } of substitutions) {
            subMap.set(pattern.toLowerCase(), replacement);
        }
        // Split into words, substitute each, rejoin
        const words = text.split(/\s+/);
        const result = words.map(word => {
            const lower = word.toLowerCase();
            return subMap.has(lower) ? subMap.get(lower) : word;
        });
        return result.join(' ');
    }
    /**
     * Escape special regex characters
     */
    escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}
//# sourceMappingURL=Eliza.js.map