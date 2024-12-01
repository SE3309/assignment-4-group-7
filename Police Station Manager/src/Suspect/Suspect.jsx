import React, { useState, useEffect } from 'react';
import './Suspect.css';

function Suspect() {
  const [suspects, setSuspects] = useState([]);  // Store suspects with incidentCount
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/api/suspects')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched suspects:', data);
        setSuspects(data);
      })
      .catch(error => console.error('Error fetching suspects:', error));
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredSuspects = suspects.filter(suspect =>
    suspect.fullName.toLowerCase().includes(searchTerm.toLowerCase())
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
        {filteredSuspects.map(suspect => (
          <li key={suspect.suspectID}>
            {suspect.fullName} - {suspect.incidentCount}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Suspect;
