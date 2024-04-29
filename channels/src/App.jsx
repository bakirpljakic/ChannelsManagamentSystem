import { useState } from 'react'
import Navbar from '../components/Navbar/Navbar';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css'
import TV from '../components/TV/TV';

function App() {

  return (
    <div>
      <Router>
        <Navbar />
        <TV></TV>
      </Router>
    </div>

  )
}

export default App
