import Lyrics from './data/All_Lyrics_No_Speakers';
import LyricsSpeakers from './data/All_Lyrics_Speakers';
import CONSTANTS from './constants';
import Tokenizer from 'tokenize-text';
import levenshtein from 'levenshtein-edit-distance';

const {ALT_STR_MAP} = CONSTANTS;

const tokenize = new Tokenizer();
const words = Lyrics;
const _wordsTokenized = tokenize.words()(words);
const _wordsIsolatedSanitized = _wordsTokenized.map(token => token.value);

/**
 * strip a string of all non-word characters, joining words with a single space
 * @param  {string} str original string
 * @return {string}     trimmed string with no punctuation
 */
function _removePunct(str) {
  return str
    .replace(/[’']/, '')
    .replace(/[^\w\s]|_/g, ' ')
    .replace(/\s+/g, ' ');
}

/**
 * gets unique counts of string
 * @param  {Array<str>} strs array of strings
 * @return {Object}          key is the string value, values is the string frequency
 */
function _getWordsCounts(strs) {
  return strs.reduce((acc, str) => {
    acc[str] = acc[str] ? acc[str] + 1 : 1;
    return acc;
  }, {});
}

function _tokensToStr(tokens) {
  let lastToken = tokens[tokens.length - 1];
  let first = tokens[0].index;
  let last = lastToken.index + lastToken.offset;
  return Lyrics.slice(first, last);
}

/**
 * get words of a given frequency
 * @param  {number} num word frequency
 * @return {array<str>}     list of words with given frequency
 */
function getWordsWithFrequency(num) {
  if (num <= 0 || parseInt(num) !== num) {
    throw new Error('`frequency` must be a postive int');
  }
  let counts = _getWordsCounts(_wordsIsolatedSanitized);
  return Object.keys(counts).filter(key => counts[key] === num);
}

/**
 * get an array of strings that include the word with n words before/after
 * @param  string word        the chosen word
 * @param  int    wordsBefore int 0 or less
 * @param  int    wordsAfter  int 0 or more
 * @return arr<string>        strings with the chosen word in the context
 */
function _getWordsInContext(word, wordsBefore, wordsAfter) {
  if (!word) throw new Error('_getWordsInContext() needs a word passed in');
  if (wordsBefore > wordsAfter) throw new Error('wordsBefore must be lower than wordsAfter');
  let offsets = [];
  for (let i = wordsBefore; i <= wordsAfter; i++) {
    offsets.push(i);
  }

  let tokensFiltered = _wordsTokenized.reduce((acc, token, i) => {
    if (token.value.toLowerCase() === word.toLowerCase()) {
      token.tokenIndex = i;
      acc.push(token);
    }
    return acc;
  }, []);

  let tokensFilteredWithContext = tokensFiltered.map(token => {
    return offsets.map(offset => _wordsTokenized[token.tokenIndex + offset]);
  });

  return tokensFilteredWithContext;
}

/**
 * Get strings joined together for display
 * @param  {str} word         the chosen word
 * @param  {int} wordsBefore  0 or lower
 * @param  {int} wordsAfter   0 or higher
 * @return {str}              the chosen word(s) in context, joined together with breaks
 */
function getStringsWithContext(word, wordsBefore, wordsAfter) {
  let tokensCollections = _getWordsInContext(word, wordsBefore, wordsAfter);
  return tokensCollections.map(_tokensToStr).join('\n\n');
}

/**
 * Returns an array of adjacent words
 * @param  {str} word    the chosen word
 * @param  {int} before  optional, used to override in case our chosen word is actually a phrase
 * @param  {int} after   optional, used to override in case our chosen word is actually a phrase
 * @return {arr<obj>}  This is an array of word objects
 */
function getAdjacentStringCollections(word, before, after) {
  var arrs = _getWordsInContext(word, before - 1 || -1, after + 1 || 1);
  var arrsWithWordsRemoved = arrs.map(arr => [arr[0], arr[arr.length - 1]]);
  return arrsWithWordsRemoved;
}

/**
 * checks to see if the passed word is adjacent to any instance of the chosen word
 * @param  {str}  word               the chosen word
 * @param  {str}  adjacentCandidate  the word to test
 * @param  {int}  before             optional, used to override in case our chosen word is actually a phrase
 * @param  {int}  after              optional, used to override in case our chosen word is actually a phrase
 * @return {bool}                    true if a match, false if not
 */
function isAdjacentStringMatching(word, adjacentCandidate, before, after) {
  var adjacentStringCollections = getAdjacentStringCollections(word, before, after);
  var adjacentStringCollectionsFlattened = [].concat.apply([], adjacentStringCollections);
  var adjacentStrings = adjacentStringCollectionsFlattened.map(obj => obj.value);

  for (let i = 0; i < adjacentStrings.length; i++) {
    if (_doStringsMatch(adjacentStrings[i], adjacentCandidate)) {
      return true;
    }
  }
  return false;
}
/**
 * Looks up the string in the alternate string map
 * @param  {string} str the input string
 * @return {string}     the replaced string (should properly be an array of options)
 */
function _getAltStr(str) {
  return ALT_STR_MAP[str] || str;
}

function _doStringsMatch(origStr1, origStr2) {
  let s1 = _removePunct(origStr1).toLowerCase().trim();
  let s2 = _removePunct(origStr2).toLowerCase().trim();
  let s1Alt = _getAltStr(s1);
  let s2Alt = _getAltStr(s2);
  let acceptableEditDistance = Math.max(s1.length, s2.length) < 5 ? 0 : 1;
  let withinEditDistance = (
    levenshtein(s1, s2) <= acceptableEditDistance &&
    s1.slice(-1) === s2.slice(-1)
  );
  let isMatching = (
    withinEditDistance ||
    s1Alt === s2 ||
    s1Alt === s2Alt
  );
  return isMatching;
}

export default {
  getWordsWithFrequency,
  getStringsWithContext,
  getAdjacentStringCollections,
  isAdjacentStringMatching,
};