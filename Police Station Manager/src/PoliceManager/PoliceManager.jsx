import React, { useState, useEffect } from 'react';
import './PoliceManager.css';

function PoliceManager() {
  const [officers, setOfficers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch police officers from the database
    fetch('http://localhost:3000/api/policeofficers')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Fetched officers:', data);
        setOfficers(data);
      })
      .catch(error => console.error('Error fetching police officers:', error));
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredOfficers = officers.filter(officer =>
    officer.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="police-manager">
      <input
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={handleSearch}
      />
      <ul>
        {filteredOfficers.map(officer => (
          <li key={officer.badgeNumber}>
            {officer.fullName} - {officer.stationLocation}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PoliceManager;