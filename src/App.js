import React, { Component } from 'react';
import Ham from './Ham';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Do you really know every word to Hamilton?</h2>
          <p>These words only occur once in Hamilton. What words come after?</p>
        </div>
        <pre className="App-intro">
          {
            ['...'].concat(Ham.getOffsetWords('dead', -3, 3).join('\n\n'), '...').join(' ')
          }
        </pre>
      </div>
    );
  }
}

export default App;
