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

/** Digits for number matching */
const DIGITS = '0123456789';

/**
 * Match the beginning of str against pat (up to first wildcard)
 * @returns Number of matching characters, or -1 if no match
 */
function amatch(str: string, pat: string): number {
  let count = 0;
  let i = 0; // index into str
  let j = 0; // index into pat

  while (i < str.length && j < pat.length) {
    const p = pat.charAt(j);
    // Stop at wildcards
    if (p === '*' || p === '#') {
      return count;
    }
    // Characters must match exactly
    if (str.charAt(i) !== p) {
      return -1;
    }
    i++;
    j++;
    count++;
  }

  // If we've consumed the pattern but not the string, that's a partial match
  if (j >= pat.length && i < str.length) {
    return count;
  }

  return count;
}

/**
 * Find where pattern starts matching in string
 * @returns Position in str where match begins, or -1 if not found
 */
function findPat(str: string, pat: string): number {
  for (let i = 0; i < str.length; i++) {
    if (amatch(str.substring(i), pat) >= 0) {
      return i;
    }
  }
  return -1;
}

/**
 * Count consecutive digits at start of string
 */
function findNum(str: string): number {
  let count = 0;
  for (let i = 0; i < str.length; i++) {
    if (DIGITS.indexOf(str.charAt(i)) === -1) {
      return count;
    }
    count++;
  }
  return count;
}

/**
 * Core pattern matching function
 * Matches str against pat, filling matches array with captured wildcards
 *
 * @param str - Input string to match
 * @param pat - Pattern with wildcards
 * @param matches - Array to fill with captured groups
 * @returns true if match succeeded
 */
export function match(str: string, pat: string, matches: string[]): boolean {
  let i = 0; // position in str
  let j = 0; // position in matches
  let pos = 0; // position in pat

  // Clear matches array
  for (let k = 0; k < matches.length; k++) {
    matches[k] = '';
  }

  while (pos < pat.length && j < matches.length) {
    const p = pat.charAt(pos);

    if (p === '*') {
      // Wildcard: match any sequence
      let n: number;

      if (pos + 1 === pat.length) {
        // * is the last thing in pattern - consume rest of string
        n = str.length - i;
      } else {
        // Find where the rest of the pattern matches
        n = findPat(str.substring(i), pat.substring(pos + 1));
      }

      if (n < 0) return false;

      matches[j++] = str.substring(i, i + n);
      i += n;
      pos++;
    } else if (p === '#') {
      // Number wildcard: match digits
      const n = findNum(str.substring(i));
      matches[j++] = str.substring(i, i + n);
      i += n;
      pos++;
    } else {
      // Literal characters must match
      const n = amatch(str.substring(i), pat.substring(pos));
      if (n <= 0) return false;
      i += n;
      pos += n;
    }
  }

  // Match succeeds if we've consumed both string and pattern
  return i >= str.length && pos >= pat.length;
}

/**
 * Translate characters from src set to dest set
 * Used for case conversion and character normalization
 */
export function translate(str: string, src: string, dest: string): string {
  if (src.length !== dest.length) {
    throw new Error('Source and destination must have same length');
  }

  let result = str;
  for (let i = 0; i < src.length; i++) {
    result = result.split(src.charAt(i)).join(dest.charAt(i));
  }
  return result;
}

/**
 * Compress whitespace in string:
 * - Remove space before space, comma, period
 * - Add space before question mark
 */
export function compress(s: string): string {
  if (s.length === 0) return s;

  let result = '';
  let prev = s.charAt(0);

  for (let i = 1; i < s.length; i++) {
    const curr = s.charAt(i);

    if (prev === ' ' && (curr === ' ' || curr === ',' || curr === '.')) {
      // Drop the space
    } else if (prev !== ' ' && curr === '?') {
      // Add space before question
      result += prev + ' ';
    } else {
      result += prev;
    }
    prev = curr;
  }
  result += prev;

  return result;
}

/**
 * Trim leading whitespace
 */
export function trim(s: string): string {
  for (let i = 0; i < s.length; i++) {
    if (s.charAt(i) !== ' ') {
      return s.substring(i);
    }
  }
  return '';
}

/**
 * Pad string with spaces at beginning and end
 * Required for pattern matching to work correctly at boundaries
 */
export function pad(s: string): string {
  if (s.length === 0) return ' ';

  const first = s.charAt(0);
  const last = s.charAt(s.length - 1);

  if (first === ' ' && last === ' ') return s;
  if (first === ' ' && last !== ' ') return s + ' ';
  if (first !== ' ' && last === ' ') return ' ' + s;
  return ' ' + s + ' ';
}

/**
 * Count occurrences of character in string
 */
export function count(s: string, c: string): number {
  let n = 0;
  for (let i = 0; i < s.length; i++) {
    if (s.charAt(i) === c) n++;
  }
  return n;
}
