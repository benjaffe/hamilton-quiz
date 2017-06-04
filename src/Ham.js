import Lyrics from './data/All_Lyrics_No_Speakers';
import LyricsSpeakers from './data/All_Lyrics_Speakers';
import Tokenizer from 'tokenize-text';

const tokenize = new Tokenizer();

const words = Lyrics;
const wordsIsolatedSanitized = _removePunct(Lyrics.toLowerCase()).split(' ');
const _wordsTokenized = tokenize.words()(words);

/**
 * strip a string of punctuation
 * @param  {string} str original string
 * @return {string}     trimmed string with no punctuation
 */
function _removePunct(str) {
  return str
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
  let counts = _getWordsCounts(wordsIsolatedSanitized);
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
 * @param  {str} word [description]
 * @return {[type]}      [description]
 */
function getAdjacentStrings(word) {
  var arrs = _getWordsInContext(word, -1, 1);
  return [].concat.apply([], arrs);
}

export default {
  getWordsWithFrequency,
  getStringsWithContext,
  getAdjacentStrings,
};