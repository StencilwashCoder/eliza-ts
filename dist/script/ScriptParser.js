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
import { match } from '../matching/PatternMatcher.js';
/**
 * Create an empty script structure
 */
export function createEmptyScript() {
    return {
        keywords: new Map(),
        synonyms: new Map(),
        preSubstitutions: [],
        postSubstitutions: [],
        initialMessage: 'Hello.',
        finalMessage: 'Goodbye.',
        quitWords: new Set(),
    };
}
/**
 * Parse a complete script string into an ElizaScript
 */
export function parseScript(scriptText) {
    const script = createEmptyScript();
    const state = {
        currentKeyword: null,
        currentDecomp: null,
    };
    const lines = scriptText.split('\n');
    for (const line of lines) {
        parseLine(line.trim(), script, state);
    }
    return script;
}
/**
 * Parse a single line of script and update the script/state
 */
function parseLine(line, script, state) {
    // Skip empty lines and comments
    if (line.length === 0 || line.startsWith('#')) {
        return;
    }
    const parts = ['', '', '', ''];
    // Try each pattern in order
    // reasmb: <response>
    if (match(line, '*reasmb: *', parts)) {
        if (!state.currentDecomp) {
            console.error('Error: reasmb without decomp');
            return;
        }
        state.currentDecomp.reassemblyRules.push(parts[1]);
        return;
    }
    // decomp: [$ ]<pattern>
    if (match(line, '*decomp: *', parts)) {
        if (!state.currentKeyword) {
            console.error('Error: decomp without key');
            return;
        }
        let pattern = parts[1];
        let save = false;
        // Check for memory marker ($)
        const memParts = ['', ''];
        if (match(pattern, '$ *', memParts)) {
            save = true;
            pattern = memParts[1];
        }
        state.currentDecomp = {
            pattern,
            save,
            reassemblyRules: [],
            currentIndex: 0,
        };
        state.currentKeyword.decompositions.push(state.currentDecomp);
        return;
    }
    // key: <word> #<rank>
    if (match(line, '*key: * #*', parts)) {
        let rank = 0;
        if (parts[2].length > 0) {
            rank = parseInt(parts[2], 10) || 0;
        }
        state.currentKeyword = {
            word: parts[1],
            rank,
            decompositions: [],
        };
        state.currentDecomp = null;
        script.keywords.set(parts[1], state.currentKeyword);
        return;
    }
    // key: <word> (no rank)
    if (match(line, '*key: *', parts)) {
        state.currentKeyword = {
            word: parts[1],
            rank: 0,
            decompositions: [],
        };
        state.currentDecomp = null;
        script.keywords.set(parts[1], state.currentKeyword);
        return;
    }
    // synon: <word1> <word2> ...
    if (match(line, '*synon: *', parts)) {
        const words = parts[1].split(/\s+/).filter((w) => w.length > 0);
        if (words.length > 0) {
            // Use first word as the key, store all words as synonyms
            script.synonyms.set(words[0], words);
        }
        return;
    }
    // pre: <from> <to>
    if (match(line, '*pre: * *', parts)) {
        script.preSubstitutions.push({
            pattern: parts[1],
            replacement: parts[2],
        });
        return;
    }
    // post: <from> <to>
    if (match(line, '*post: * *', parts)) {
        script.postSubstitutions.push({
            pattern: parts[1],
            replacement: parts[2],
        });
        return;
    }
    // initial: <message>
    if (match(line, '*initial: *', parts)) {
        script.initialMessage = parts[1];
        return;
    }
    // final: <message>
    if (match(line, '*final: *', parts)) {
        script.finalMessage = parts[1];
        return;
    }
    // quit: <word>
    if (match(line, '*quit: *', parts)) {
        // Pad with spaces for word boundary matching
        script.quitWords.add(' ' + parts[1] + ' ');
        return;
    }
    // Unrecognized line
    if (line.length > 0) {
        console.warn(`Unrecognized script line: ${line}`);
    }
}
//# sourceMappingURL=ScriptParser.js.map