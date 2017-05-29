import Lyrics from './data/All_Lyrics_No_Speakers';
import LyricsSpeakers from './data/All_Lyrics_Speakers';

const words = Lyrics;
const wordsIsolated = _removePunct(words).split(' ');
const wordsIsolatedSanitized = _removePunct(Lyrics.toLowerCase()).split(' ');

String.prototype.indexOfRegex = function(regex, fromIndex){
  var str = fromIndex ? this.substring(fromIndex) : this;
  var match = str.match(regex);
  return match ? str.indexOf(match[0]) + fromIndex : -1;
}

String.prototype.lastIndexOfRegex = function(regex, fromIndex){
  var str = fromIndex ? this.substring(0, fromIndex) : this;
  var match = str.match(regex);
  return match ? str.lastIndexOf(match[match.length-1]) : -1;
}

function _removePunct(str) {
  return str
    .replace(/[^\w\s]|_/g, ' ')
    .replace(/\s+/g, ' ');
}



function getOffsetWords(word, offset, offset2, frequency) {
  let i = -1;
  let offsetWordCollection = [];

  if (!word) console.log(arguments);

  do {
    i = words.toLowerCase().indexOf(word.toLowerCase(), i + 1);
    if (i === -1) continue;

    offsetWordCollection.push(getFirstOffsetWords(word, offset, offset2, i + 1));
  } while (i !== -1);

  return offsetWordCollection;
}

function getFirstOffsetWords(word, offset, offset2, startPosition) {
  console.log(word, offset, offset2, startPosition);

  let regexp = new RegExp('[^\\w](' + word.toLowerCase() + ')[^\\w]', 'ig');
  let i = words.toLowerCase().indexOfRegex(regexp, startPosition);

  let endIndex = i + word.length;
  while (offset2 > 0) {
    endIndex = words.indexOfRegex(/\s/, endIndex + 1);
    offset2--;
  }

  let startIndex = i;
  while (offset < 0) {
    startIndex = words.lastIndexOfRegex(/\s/, startIndex);
    offset++;
  }

  return words.slice(startIndex, endIndex + 1).trim();
}



// function getOffsetWordArray(word, offset, offset2) {
//   let i = wordsIsolatedSanitized.findIndex(w => w === word.toLowerCase());

//   let words = [];
//   // previous word(s)
//   while (offset < 0) {
//     words.push(wordsIsolatedSanitized[i + offset++]);
//   }

//   // the original word
//   words.push(wordsIsolatedSanitized[i + offset++]);

//   // next word(s)
//   if (offset2) {
//     while (offset < offset2) {
//       words.push(wordsIsolatedSanitized[i + offset++]);
//     }
//   }

//   return words;
// }

function getWordsWithFrequency(num) {
  console.log('getting words with frequency ' + num);
  let counts = getWordsCounts();
  return Object.keys(counts).filter(key => counts[key] === num);
}

function getWordsCounts() {
  let wordCounts = wordsIsolated.reduce((acc, word) => {
    let wordSanitized = word.toLowerCase();
    acc[wordSanitized] = acc[wordSanitized] ? acc[wordSanitized] + 1 : 1;
    return acc;
  }, {});

  return wordCounts;
}

function getLyrics() {
  return Lyrics;
}

export default {
  getLyrics,
  getWordsWithFrequency,
  getWordsCounts,
  // getOffsetWordArray,
  getOffsetWords,
};