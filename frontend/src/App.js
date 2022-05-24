import './App.css';
import Home from './Home';
import GetPlabookPage from './GetPlaybookPage';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/getPlabookPage" element={<GetPlabookPage />} />
      </Routes>
    </Router>
  );
}

export default App;
