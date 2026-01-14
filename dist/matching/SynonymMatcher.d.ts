/**
 * ELIZA Synonym Matching
 *
 * Handles patterns with @synonym markers.
 * When a pattern contains @word, it matches any word
 * in the synonym group containing 'word'.
 *
 * Example: "* i am @sad *" matches "i am unhappy" if
 * "unhappy" is in the same synonym group as "sad"
 *
 * Based on Charles Hayden's SynList.java implementation
 */
/**
 * Find which synonym group contains the given word
 * @returns Array of all synonyms in the group, or null if not found
 */
export declare function findSynonymGroup(synonyms: Map<string, string[]>, word: string): string[] | null;
/**
 * Match a decomposition pattern that may contain @synonym markers
 *
 * If pattern has no @synonym, does a regular match.
 * If pattern has @word, tries matching with each synonym in word's group.
 *
 * @param str - Input string to match
 * @param pattern - Pattern (may contain @word markers)
 * @param matches - Array to fill with captured groups
 * @param synonyms - Map of synonym groups
 * @returns true if match succeeded
 */
export declare function matchDecomp(str: string, pattern: string, matches: string[], synonyms: Map<string, string[]>): boolean;
//# sourceMappingURL=SynonymMatcher.d.ts.map