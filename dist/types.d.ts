/**
 * ELIZA TypeScript Implementation - Type Definitions
 *
 * ACKNOWLEDGEMENTS:
 * Original ELIZA: Joseph Weizenbaum (1966), MIT
 * Java implementation: Charles Hayden (chayden.net/eliza)
 * Processing library: Andres Colubri (codeanticode)
 */
/**
 * A reassembly rule - a template for generating responses
 * Uses (n) placeholders to insert captured groups from decomposition
 */
export interface ReassemblyRule {
    /** The reassembly pattern, e.g., "Why do you think (1)?" */
    template: string;
}
/**
 * A decomposition rule that matches input patterns
 * Each decomposition has a pattern and multiple possible responses
 */
export interface DecompositionRule {
    /** Pattern with wildcards: * (any words), # (number), @synonym */
    pattern: string;
    /** Whether to save the response to memory instead of returning it */
    save: boolean;
    /** List of possible reassembly responses */
    reassemblyRules: string[];
    /** Current index for cycling through reassembly rules */
    currentIndex: number;
}
/**
 * A keyword with its priority rank and associated decomposition rules
 * Higher rank keywords are matched first
 */
export interface Keyword {
    /** The keyword to match */
    word: string;
    /** Priority rank (higher = checked first) */
    rank: number;
    /** Decomposition rules to try when this keyword is found */
    decompositions: DecompositionRule[];
}
/**
 * A pre/post substitution pair
 * Pre-substitutions normalize input before matching
 * Post-substitutions transform captured groups before output
 */
export interface Substitution {
    /** Pattern to find */
    pattern: string;
    /** Text to replace it with */
    replacement: string;
}
/**
 * A complete parsed ELIZA script
 * Contains all rules needed for conversation
 */
export interface ElizaScript {
    /** Map of keyword -> Keyword object for fast lookup */
    keywords: Map<string, Keyword>;
    /** Map of synonym group representative -> all synonyms in group */
    synonyms: Map<string, string[]>;
    /** Substitutions applied before pattern matching */
    preSubstitutions: Substitution[];
    /** Substitutions applied to captured groups */
    postSubstitutions: Substitution[];
    /** Opening message */
    initialMessage: string;
    /** Closing message (when user says quit word) */
    finalMessage: string;
    /** Words that end the conversation */
    quitWords: Set<string>;
}
/**
 * Configuration options for creating an Eliza instance
 */
export interface ElizaOptions {
    /** Custom script as a string (will be parsed) */
    script?: string;
    /** Enable debug logging of matching process */
    debug?: boolean;
}
/**
 * Internal state used during script parsing
 */
export interface ParserState {
    /** Current keyword being built */
    currentKeyword: Keyword | null;
    /** Current decomposition rule being built */
    currentDecomp: DecompositionRule | null;
}
//# sourceMappingURL=types.d.ts.map