/**
 * ELIZA Pattern Matching Engine
 *
 * Implements Weizenbaum's pattern matching algorithm with wildcards:
 *   * = match any sequence of words (including empty)
 *   # = match a number
 *   @word = match any word in the synonym group containing 'word'
 *
 * Based on Charles Hayden's EString.java implementation
 */
/**
 * Core pattern matching function
 * Matches str against pat, filling matches array with captured wildcards
 *
 * @param str - Input string to match
 * @param pat - Pattern with wildcards
 * @param matches - Array to fill with captured groups
 * @returns true if match succeeded
 */
export declare function match(str: string, pat: string, matches: string[]): boolean;
/**
 * Translate characters from src set to dest set
 * Used for case conversion and character normalization
 */
export declare function translate(str: string, src: string, dest: string): string;
/**
 * Compress whitespace in string:
 * - Remove space before space, comma, period
 * - Add space before question mark
 */
export declare function compress(s: string): string;
/**
 * Trim leading whitespace
 */
export declare function trim(s: string): string;
/**
 * Pad string with spaces at beginning and end
 * Required for pattern matching to work correctly at boundaries
 */
export declare function pad(s: string): string;
/**
 * Count occurrences of character in string
 */
export declare function count(s: string, c: string): number;
//# sourceMappingURL=PatternMatcher.d.ts.map