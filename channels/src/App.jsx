import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Details from '../components/Details/Details';
import TV from '../components/TV/TV';
import Radio from '../components/Radio/Radio';
import Billboard from '../components/Billboard/Billboard';
import Website from '../components/Website/Website';
import Display from '../components/Display/Display';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<TV />} />
          <Route path="/details" element={<Details />} />
          <Route path="/radio" element={<Radio />} />
          <Route path="/billboard" element={<Billboard />} />
          <Route path="/website" element={<Website />} />
          <Route path="/display" element={<Display />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
