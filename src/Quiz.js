import React, { Component } from 'react';
import Ham from './Ham';

function addEllipses(str) {
  return `... ${str} ...`;
}

class Quiz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      word: this.nextWord(),
      wordsBefore: 0,
      wordsAfter: 0,
    };

    this.handleClick = this.handleClick.bind(this);
  }

  nextWord() {
    let words = Ham.getWordsWithFrequency(1);
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
    obj[name] = event.target.value;
    this.setState(prevState => obj);
  }

  render() {
    return (
      <div className="Quiz">
        <button onClick={this.handleClick}>Next Word</button>
        <br />
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
        <pre className="App-intro">
          {
            Ham.getOffsetWords(this.state.word, this.state.wordsBefore * -1, this.state.wordsAfter).map(addEllipses).join('\n\n')
          }
        </pre>
      </div>
    );
  }
}

export default Quiz;
