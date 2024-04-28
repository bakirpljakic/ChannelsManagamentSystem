import { useState } from 'react'
import Navbar from '../components/Navbar'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css'

function App() {

  return (
    <div>
      <Router>
        <Navbar />
      </Router>
    </div>

  )
}

export default App
