import Lyrics from './data/All_Lyrics_No_Speakers';
import LyricsSpeakers from './data/All_Lyrics_Speakers';

const words = Lyrics;
const wordsIsolated = removePunct(words).split(' ');
const wordsIsolatedSanitized = removePunct(Lyrics.toLowerCase()).split(' ');

function removePunct(str) {
  return str
    .replace(/[^\w\s]|_/g, ' ')
    .replace(/\s+/g, ' ');
}

function getOffsetWords(word, offset, offset2) {
  let i = -1;
  let offsetWordCollection = [];

  do {
    i = words.toLowerCase().indexOf(word.toLowerCase(), i + 1);
    console.log(i);
    offsetWordCollection.push(getFirstOffsetWords(word, offset, offset2, i));
  } while (i !== -1);

  return offsetWordCollection;
}

function getFirstOffsetWords(word, offset, offset2, startPosition) {
  let i = words.toLowerCase().indexOf(word.toLowerCase(), startPosition);

  let endIndex = i + word.length;
  while (offset2 > 0) {
    // console.log(offset2, endIndex);
    endIndex = words.indexOf(' ', endIndex + 1);
    offset2--;
  }

  let startIndex = i;
  while (offset <= 0) {
    // console.log(offset, startIndex);
    startIndex = words.lastIndexOf(' ', startIndex - 1);
    offset++;
  }

  return words.slice(startIndex, endIndex).trim();
}



function getOffsetWordArray(word, offset, offset2) {
  let i = wordsIsolatedSanitized.findIndex(w => w === word.toLowerCase());

  let words = [];
  // previous word(s)
  while (offset < 0) {
    words.push(wordsIsolatedSanitized[i + offset++]);
  }

  // the original word
  words.push(wordsIsolatedSanitized[i + offset++]);

  // next word(s)
  if (offset2) {
    while (offset < offset2) {
      words.push(wordsIsolatedSanitized[i + offset++]);
    }
  }

  return words;
}

function getWordsWithFrequency(num) {
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
  getOffsetWordArray,
  getOffsetWords,
};