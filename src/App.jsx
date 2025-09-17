import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import AdminPanelClean from './components/AdminPanelClean';
import './App.css';

function App() {
  return (
    <GameProvider>
      <Router basename="/GameQrodeFach">
        <div className="App">
          <Routes>
            <Route path="/" element={<AdminPanelClean />} />
            <Route path="/admin" element={<AdminPanelClean />} />
          </Routes>
        </div>
      </Router>
    </GameProvider>
  );
}

export default App;
