import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const [selectedRegion, setSelectedRegion] = useState(''); // Stanje za odabranu regiju

  const handleRegionChange = (event) => {
    const selectedRegion = event.target.value;
    setSelectedRegion(selectedRegion);
    // Ovdje možete implementirati logiku za odabir regije (npr. navigacija ili promjena stanja)
    console.log(`Odabrana regija: ${selectedRegion}`);
  };

  const regions = [
    'Sarajevo',
    'Mostar',
    'Banja Luka',
    'Tuzla',
    'Zenica',
    'Bihać',
    'Doboj',
    'Trebinje',
    // Dodajte ostale regije po potrebi
  ];

  return (
    <nav className="navbar">
      <div className="navbar-center">
        <Link to="/tv" className="navbar-item">TV</Link>
        <Link to="/radio" className="navbar-item">Radio</Link>
        <Link to="/billboard" className="navbar-item">Billboard</Link>
        <Link to="/website" className="navbar-item">Website</Link>
        <Link to="/display" className="navbar-item">Display</Link>
      </div>

      <div className="dropdown-container">
        <select
          className="input-select"
          value={selectedRegion}
          onChange={handleRegionChange}
        >
          <option value="">All regions</option>
          {regions.map((region, index) => (
            <option key={index} value={region}>{region}</option>
          ))}
        </select>
      </div>
    </nav>
  );
};

export default Navbar;
