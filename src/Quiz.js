import React, { Component } from 'react';
import Ham from './Ham';
import './Quiz.css';

function addEllipses(str) {
  return `... ${str} ...`;
}

class Quiz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      word: 'Hamilton',
      wordFrequency: 1,
      wordsBefore: 0,
      wordsAfter: 0,
    };

    this.nextWord = this.nextWord.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  nextWord() {
    let words = Ham.getWordsWithFrequency(this.state.wordFrequency);
    if (words.length === 0) {
      console.log('Oh No! We can\'t find a word with that frequency!');
      return;
    }
    let i = Math.floor(Math.random() * words.length);

    this.setState(prevState => ({
      wordsBefore: 0,
      wordsAfter: 0,
      word: words[i],
    }));
  }

  handleClick() {
    this.nextWord()
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
        <input
           type="range"
           value={this.state.wordFrequency}
           min="1"
           max="50"
           onInput={this.handleChange.bind(this, "wordFrequency")}
           step="1" />
        <p>{this.state.wordFrequency}</p>
        <input
           type="range"
           value={this.state.wordsBefore}
           min="0"
           max="10"
           onInput={this.handleChange.bind(this, "wordsBefore")}
           step="1" />
        <p>{this.state.wordsBefore}</p>
        <input
           type="range"
           value={this.state.wordsAfter}
           min="0"
           max="10"
           onInput={this.handleChange.bind(this, "wordsAfter")}
           step="1" />
        <p>{this.state.wordsAfter}</p>
        <h2>{this.state.word}</h2>

        <pre className="json">{
          Ham.getStringsWithContext(
            this.state.word,
            this.state.wordsBefore * -1,
            this.state.wordsAfter
          )
        }</pre>
        <hr />
        <pre className="json">{/*JSON.stringify(Ham.wordsTokenized.slice(0,1000), null, 2)*/}</pre>
      </div>
    );
  }
}

export default Quiz;
