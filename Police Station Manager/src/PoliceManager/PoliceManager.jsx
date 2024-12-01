import React, { useState, useEffect } from 'react';
import './PoliceManager.css';

function PoliceManager() {
  const [officers, setOfficers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [resultsPerPage, setResultsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('asc');
  const [stationLocations, setStationLocations] = useState([]);
  const [selectedStation, setSelectedStation] = useState('');
  const [hireYears, setHireYears] = useState([]);
  const [selectedHireYear, setSelectedHireYear] = useState('');

  useEffect(() => {
    // Fetch distinct station locations
    fetch('http://localhost:3000/api/policeofficers/location')
      .then(response => response.json())
      .then(data => {
        setStationLocations(data);
      })
      .catch(error => console.error('Error fetching station locations:', error));
  }, []);

  useEffect(() => {
    // Fetch distinct hire years
    fetch('http://localhost:3000/api/policeofficers/hireyears')
      .then(response => response.json())
      .then(data => {
        setHireYears(data);
      })
      .catch(error => console.error('Error fetching hire years:', error));
  }, []);

  useEffect(() => {
    // Fetch police officers
    const url = new URL('http://localhost:3000/api/policeofficers');
    if (searchTerm) {
      url.searchParams.append('searchTerm', searchTerm);
    }
    if (selectedStation) {
      url.searchParams.append('station', selectedStation);
    }
    if (selectedHireYear) {
      url.searchParams.append('hireYear', selectedHireYear);
    }
    url.searchParams.append('page', currentPage);
    url.searchParams.append('limit', resultsPerPage);
    url.searchParams.append('sortField', 'stationLocation');
    url.searchParams.append('sortOrder', sortOrder);

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Fetched data:', data); // Debugging information
        setOfficers(data);
      })
      .catch(error => console.error('Error fetching police officers:', error));
  }, [searchTerm, currentPage, resultsPerPage, sortOrder, selectedStation, selectedHireYear]);

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

  const handleStationChange = (event) => {
    setSelectedStation(event.target.value);
    setCurrentPage(1); // Reset to first page on station change
  };

  const handleHireYearChange = (event) => {
    setSelectedHireYear(event.target.value);
    setCurrentPage(1); // Reset to first page on hire year change
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  return (
    <div className="police-manager">
      <input
        type="text"
        className="search-input"
        placeholder="Search by name"
        value={searchTerm}
        onChange={handleSearch}
      />
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
        <div className="pagination-controls">
          <label htmlFor="station">Filter by station location:</label>
          <select id="station" value={selectedStation} onChange={handleStationChange}>
            <option value="">All</option>
            {stationLocations.map(location => (
              <option key={location.stationLocation} value={location.stationLocation}>
                {location.stationLocation}
              </option>
            ))}
          </select>
        </div>
        <div className="pagination-controls">
          <label htmlFor="hireYear">Filter by hire year:</label>
          <select id="hireYear" value={selectedHireYear} onChange={handleHireYearChange}>
            <option value="">All</option>
            {hireYears.map(year => (
              <option key={year.hireYear} value={year.hireYear}>
                {year.hireYear}
              </option>
            ))}
          </select>
        </div>
        <div className="pagination-buttons">
          <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
          <button onClick={handleNextPage}>Next</button>
        </div>
      </div>
      {officers.length > 0 ? (
        <ul className="officer-list">
          {officers.map(officer => (
            <li key={officer.badgeNumber} className="officer-item">
              <span>{officer.fullName} - {officer.stationLocation}</span>
              <button className="display-more-btn" onClick={() => handleDisplayMore(officer)}>Display More</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No officers found for the selected criteria.</p>
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