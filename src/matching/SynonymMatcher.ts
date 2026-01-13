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

import { match, count } from './PatternMatcher.js';

/**
 * Find which synonym group contains the given word
 * @returns Array of all synonyms in the group, or null if not found
 */
export function findSynonymGroup(
  synonyms: Map<string, string[]>,
  word: string
): string[] | null {
  // Check if word is a key (group representative)
  if (synonyms.has(word)) {
    return synonyms.get(word)!;
  }

  // Check if word is in any group's values
  for (const [, group] of synonyms) {
    if (group.includes(word)) {
      return group;
    }
  }

  return null;
}

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
export function matchDecomp(
  str: string,
  pattern: string,
  matches: string[],
  synonyms: Map<string, string[]>
): boolean {
  // Check if pattern contains @synonym marker
  const synMatch: string[] = ['', '', ''];
  if (!match(pattern, '*@* *', synMatch)) {
    // No synonym in pattern - do regular match
    return match(str, pattern, matches);
  }

  // Pattern has synonym - isolate it
  const beforeSyn = synMatch[0]; // Everything before @
  const synWord = synMatch[1]; // The synonym reference word
  const afterSyn = ' ' + synMatch[2]; // Everything after (with space)

  // Find the synonym group
  const synGroup = findSynonymGroup(synonyms, synWord);
  if (!synGroup) {
    console.error(`Could not find synonym list for: ${synWord}`);
    return false;
  }

  // Try each synonym in the group
  for (const synonym of synGroup) {
    // Build pattern with this specific synonym
    const expandedPattern = beforeSyn + synonym + afterSyn;

    if (match(str, expandedPattern, matches)) {
      // Match succeeded - insert the matched synonym into matches
      // Count how many wildcards are before the synonym
      const wildcardsBefore = count(beforeSyn, '*');

      // Shift matches to make room for the synonym
      for (let j = matches.length - 2; j >= wildcardsBefore; j--) {
        matches[j + 1] = matches[j];
      }

      // Insert the synonym that matched
      matches[wildcardsBefore] = synonym;
      return true;
    }
  }

  return false;
}
