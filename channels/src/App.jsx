import { useState } from 'react'
import Navbar from '../components/Navbar/Navbar';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css'
import TV from '../components/TV/TV';
import Details from '../components/Details/Details';

function App() {

  return (
    <div>
      <Router>
        <Navbar />
        <Route path="/tv" element={<TV />} />
        <Route path="/radio" element={<TV />} />
        <Route path="/billboard" element={<TV />} />
        <Route path="/website" element={<TV />} />
        <Route path="/display" element={<TV />} />
        <Route path="/details" element={<Details />} />
      </Router>
    </div>

  )
}

export default App
