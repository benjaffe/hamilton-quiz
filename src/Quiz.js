import React, { Component } from 'react';
import Ham from './Ham';

function addEllipses(str) {
  return `... ${str} ...`;
}

class Quiz extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.nextWord = this.nextWord.bind(this);

    this.state = {
      word: 'pro',
      wordsBefore: 0,
      wordsAfter: 0,
      wordFrequency: 1,
    };

    // this.state.word = this.nextWord();
  }

  nextWord() {
    let words = Ham.getWordsWithFrequency(this.state.wordFrequency);
    console.log('words are ' + words);
    let i = Math.floor(Math.random() * words.length);
    return words[i];
  }

  handleClick() {
    this.setState(prevState => ({
      word: this.nextWord()
    }));
  }

  handleChange(name, event) {
    var obj = {};
    obj[name] = event.target.value * 1;
    this.setState(prevState => obj);
  }

  render() {
    return (
      <div className="Quiz">
        <button onClick={this.handleClick}>Next Word</button>
        <br />
        <p>Word Frequency: {this.state.wordFrequency}</p>
        <input
           type="range"
           value={this.state.wordFrequency}
           min="1"
           max="20"
           onChange={this.handleChange.bind(this, "wordFrequency")}
           step="1" />
        <p>{this.state.wordsBefore} Words Before</p>
        <input
           type="range"
           value={this.state.wordsBefore}
           min="0"
           max="10"
           onChange={this.handleChange.bind(this, "wordsBefore")}
           step="1" />
        <p>{this.state.wordsAfter} Words After</p>
        <input
           type="range"
           value={this.state.wordsAfter}
           min="0"
           max="10"
           onChange={this.handleChange.bind(this, "wordsAfter")}
           step="1" />
        <h2>{this.state.word}</h2>
        <pre className="App-intro">
          {
            Ham
              .getOffsetWords(
                this.state.word,
                this.state.wordsBefore * -1,
                this.state.wordsAfter,
              )
              .map(addEllipses)
              .join('\n\n')
          }
        </pre>
      </div>
    );
  }
}

export default Quiz;
