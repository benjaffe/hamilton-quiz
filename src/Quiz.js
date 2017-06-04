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
  }

  addHint() {
    this.setState(prevState => ({
      wordsBefore: this.state.wordsBefore + 1
    }));
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

  isMatch() {
    return Ham.isAdjacentStringMatching(
      this.state.word,
      this.state.userAnswer,
      this.state.wordsBefore * -1,
      this.state.wordsAfter,
    );
  }

  hintButton() {
    if (!this.isMatch()) {
      return <button onClick={this.addHint}>give me a hint</button>
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
          Ham.getStringsWithContext(
            this.state.word,
            this.state.wordsBefore * -1,
            this.state.wordsAfter
          )
        }</pre>

        <input
          type="text"
          value={this.state.userAnswer}
          placeholder="Your answer goes here"
          onInput={this.handleChange.bind(this, "userAnswer")}
        />

        {this.hintButton()}
        <button onClick={this.nextWord}>{this.isMatch() ? 'YAYYYYYYY' : 'I give up'}</button>
      </div>
    );
  }
}

export default Quiz;
