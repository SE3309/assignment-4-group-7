import React, { useState, useEffect } from 'react';
import './PoliceManager.css';

function PoliceManager() {
  const [officers, setOfficers] = useState([]);
  const [stations, setStations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [resultsPerPage, setResultsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [station, setStation] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    // Fetch police officers
    const url = new URL('http://localhost:3000/api/policeofficers');
    if (station) {
      url.searchParams.append('station', station);
    }
    if (sortOrder) {
      url.searchParams.append('sort', sortOrder);
    }

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setOfficers(data))
      .catch(error => console.error('Error fetching police officers:', error));
  }, [station, sortOrder]);

  useEffect(() => {
    // Fetch station names
    fetch('http://localhost:3000/api/stations')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setStations(data))
      .catch(error => console.error('Error fetching stations:', error));
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleDisplayMore = (officer) => {
    setSelectedOfficer(officer);
  };

  const handleResultsPerPageChange = (event) => {
    setResultsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to first page on results per page change
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const handleStationChange = (event) => {
    setStation(event.target.value);
    setCurrentPage(1); // Reset to first page on station change
  };

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
  };

  const filteredOfficers = officers.filter(officer =>
    officer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (!station || officer.stationLocation === station)
  );

  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const paginatedOfficers = filteredOfficers.slice(startIndex, endIndex);

  return (
    <div className="police-manager">
      <input
        type="text"
        className="search-input"
        placeholder="Search by name"
        value={searchTerm}
        onChange={handleSearch}
      />
      <div className="filter-container">
        <label htmlFor="stationFilter">Filter by station:</label>
        <select id="stationFilter" value={station} onChange={handleStationChange}>
          <option value="">All Stations</option>
          {stations.map(station => (
            <option key={station.location} value={station.location}>{station.location}</option>
          ))}
        </select>
      </div>
      <div className="sort-container">
        <label htmlFor="sortOrder">Sort by station location:</label>
        <select id="sortOrder" value={sortOrder} onChange={handleSortOrderChange}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      <div className="pagination-container">
        <div className="pagination-controls">
          <label htmlFor="resultsPerPage">Results per page:</label>
          <select id="resultsPerPage" value={resultsPerPage} onChange={handleResultsPerPageChange}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div className="pagination-buttons">
          <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
          <button onClick={handleNextPage} disabled={endIndex >= filteredOfficers.length}>Next</button>
        </div>
      </div>
      {paginatedOfficers.length > 0 ? (
        <ul className="officer-list">
          {paginatedOfficers.map(officer => (
            <li key={officer.badgeNumber} className="officer-item">
              <span>{officer.fullName} - {officer.stationLocation}</span>
              <button className="display-more-btn" onClick={() => handleDisplayMore(officer)}>Display More</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No officers found for the selected station.</p>
      )}
      {selectedOfficer && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Officer Details</h2>
            <p><strong>Full Name:</strong> {selectedOfficer.fullName}</p>
            <p><strong>Badge Number:</strong> {selectedOfficer.badgeNumber}</p>
            <p><strong>Date of Hire:</strong> {new Date(selectedOfficer.dateOfHire).toLocaleDateString()}</p>
            <p><strong>Date of Birth:</strong> {new Date(selectedOfficer.dateOfBirth).toLocaleDateString()}</p>
            <p><strong>Email:</strong> {selectedOfficer.staffEmail}</p>
            <p><strong>Phone Number:</strong> {selectedOfficer.phoneNumber}</p>
            <p><strong>Station Location:</strong> {selectedOfficer.stationLocation}</p>
            <button className="close-btn" onClick={() => setSelectedOfficer(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PoliceManager;