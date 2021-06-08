import React from 'react';
import './App.scss';
import Results from './Results';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h2>Live &lt; 15 min from Trader Joe's</h2>
        <div>We love Trader Joe's and believe that it should be easier to find your dream home based off where the closest Trader Joe's is. Search below. :)</div>
      </header>
      <Results />
      <div className="contact"><a href="mailto:tjhouseapp@gmail.com">Contact</a></div>
    </div>
  );
}

export default App;
