import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import './Navbar.css';

const Navbar = () => {
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await fetch('http://localhost:3000/groups', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch regions');
        }

        const data = await response.json();
        setRegions(data);

        const savedRegionId = Cookies.get('selectedRegionId');
        if (savedRegionId) {
          const region = data.find(r => r.id === parseInt(savedRegionId));
          if (region) {
            setSelectedRegion(region.name);
          }
        }
      } catch (error) {
        console.error('Error fetching regions:', error);
      }
    };

    fetchRegions();
  }, []);

  const handleRegionChange = (event) => {
    const regionName = event.target.value;
    if (regionName === '') {
      window.location.reload();
      // Ako je izabrana opcija "All regions", obriši kolačić 'selectedRegionId'
      Cookies.remove('selectedRegionId');
      setSelectedRegion(''); // Postavljamo selectedRegion na prazan string
      window.location.reload();

    } else {
      setSelectedRegion(regionName);
      const region = regions.find(r => r.name === regionName);
      if (region) {
        console.log(`Selected region: ${region.name}, ID: ${region.id}`);
        Cookies.set('selectedRegionId', region.id, { expires: 1 });
        window.location.reload();
      }
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-center">
        <Link to="/" className="navbar-item">TV</Link>
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
            <option key={index} value={region.name}>{region.name}</option>
          ))}
        </select>
      </div>
    </nav>
  );
};

export default Navbar;
