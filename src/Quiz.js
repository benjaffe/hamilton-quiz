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
      word: 'spies',
      wordFrequency: 1,
      wordsBefore: 0,
      wordsAfter: 0,
      userAnswer: '',
    };

    this.addHint = this.addHint.bind(this);
    this.nextWord = this.nextWord.bind(this);
    this.focusInput = this.focusInput.bind(this);
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
      userAnswer: ''
    }));

    this.focusInput();
  }

  addHint() {
    this.setState(prevState => ({
      wordsBefore: this.state.wordsBefore + 1
    }));

    this.focusInput();
  }

  handleRangeChange(name, event) {
    var obj = {};
    obj[name] = event.target.value * 1;
    this.setState(prevState => obj);
  }

  handleChange(name, event) {
    var obj = {};
    obj[name] = event.target.value;
    this.setState(prevState => obj);
  }

  focusInput() {
    this.textInput.focus();
  }

  isMatch() {
    return Ham.isAdjacentStringMatching(
      this.state.word,
      this.state.userAnswer,
      this.state.wordsBefore * -1,
      this.state.wordsAfter
    );
  }

  hintButton() {
    if (!this.isMatch()) {
      return (
        <button
          className="btn"
          onClick={this.addHint}>
          give me a hint
        </button>
      );
    }
  }

  renderDevControls() {
    if (JSON.parse(localStorage.devMode || false)) {
      return (
        <div>
          <input
             type="range"
             value={this.state.wordFrequency}
             min="1"
             max="50"
             onInput={this.handleRangeChange.bind(this, "wordFrequency")}
             step="1" />
          <p>{this.state.wordFrequency}</p>
          <input
             type="range"
             value={this.state.wordsBefore}
             min="0"
             max="10"
             onInput={this.handleRangeChange.bind(this, "wordsBefore")}
             step="1" />
          <p>{this.state.wordsBefore}</p>
          <input
             type="range"
             value={this.state.wordsAfter}
             min="0"
             max="10"
             onInput={this.handleRangeChange.bind(this, "wordsAfter")}
             step="1" />
          <p>{this.state.wordsAfter}</p>
          <pre>
            {"State:\n" + JSON.stringify(this.state, null, 2)}
          </pre>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="Quiz">
        <br />
        {this.renderDevControls()}
        <h2>{this.state.word}</h2>

        <pre className="json">{
          (this.isMatch() ? '...' : '') +
          Ham.getStringsWithContext(
            this.state.word,
            this.isMatch() ? -5 : this.state.wordsBefore * -1,
            this.isMatch() ? 5 : this.state.wordsAfter
          ) + (this.isMatch() ? '...' : '')
        }</pre>

        <input
          autoFocus
          ref={input => { this.textInput = input; }}
          className="answerField"
          type="text"
          value={this.state.userAnswer}
          placeholder="Your answer goes here"
          onInput={this.handleChange.bind(this, "userAnswer")}
        />
        <br />
        {this.hintButton()}
        <button
          className="btn"
          onClick={this.nextWord}>
          {this.isMatch() ? 'Congratulations!' : 'I give up'}
        </button>
      </div>
    );
  }
}

export default Quiz;
