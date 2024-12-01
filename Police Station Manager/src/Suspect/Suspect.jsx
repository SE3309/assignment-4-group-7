import React, { useState, useEffect } from 'react';
import './Suspect.css';

function Suspect() {
  const [suspects, setSuspects] = useState([]);  // Store suspects with incidentCount
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState(null); // null, 'asc', or 'desc'

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

  const handleSort = (order) => {
    setSortOrder(order);
  };

  const filteredSuspects = suspects
    .filter(suspect =>
      suspect.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.incidentCount - b.incidentCount;
      } else if (sortOrder === 'desc') {
        return b.incidentCount - a.incidentCount;
      }
      return 0;
    });

  return (
    <div className="police-manager">
      <input
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={handleSearch}
      />

      <div className="sort-buttons">
        <button onClick={() => handleSort('asc')}>Sort Ascending</button>
        <button onClick={() => handleSort('desc')}>Sort Descending</button>
      </div>

      <ul>
        {filteredSuspects.map(suspect => (
          <li key={suspect.suspectID}>
            Name: {suspect.fullName} | Involved Incidents: {suspect.incidentCount}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Suspect;
