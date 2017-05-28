import React, { Component } from 'react';
import Quiz from './Quiz';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Do you really know every word to Hamilton?</h2>
          <p>These words only occur once in Hamilton. What words come after?</p>
        </div>
        <Quiz />
      </div>
    );
  }
}

export default App;
