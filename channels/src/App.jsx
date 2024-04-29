import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Details from '../components/Details/Details';
import TV from '../components/TV/TV';


function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/details" element={<Details />} />
          <Route path="/tv" element={<TV />} />
          <Route path="/radio" element={<TV />} />
          <Route path="/billboard" element={<TV />} />
          <Route path="/website" element={<TV />} />
          <Route path="/display" element={<TV />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
