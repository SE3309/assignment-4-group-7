import React, { useState, useEffect } from 'react';
import './PoliceManager.css';

function PoliceManager() {
  const [officers, setOfficers] = useState([]);
  const [stationLocations, setStationLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [resultsPerPage, setResultsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [station, setStation] = useState('');
  const [dateOfHire, setDateOfHire] = useState('');
  const [badgeNumber, setBadgeNumber] = useState('');
  const [sortField, setSortField] = useState('stationLocation');
  const [sortOrder, setSortOrder] = useState('asc');
  const [groupedByYear, setGroupedByYear] = useState([]);

  useEffect(() => {
    // Fetch police officers
    const url = new URL('http://localhost:3000/api/policeofficers');
    if (station) {
      url.searchParams.append('station', station);
    }
    if (dateOfHire) {
      url.searchParams.append('dateOfHire', dateOfHire);
    }
    if (badgeNumber) {
      url.searchParams.append('badgeNumber', badgeNumber);
    }
    if (sortField) {
      url.searchParams.append('sortField', sortField);
    }
    if (sortOrder) {
      url.searchParams.append('sortOrder', sortOrder);
    }
    if (searchTerm) {
      url.searchParams.append('searchTerm', searchTerm);
    }
    url.searchParams.append('page', currentPage);
    url.searchParams.append('limit', resultsPerPage);

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setOfficers(data))
      .catch(error => console.error('Error fetching police officers:', error));
  }, [station, dateOfHire, badgeNumber, sortField, sortOrder, searchTerm, currentPage, resultsPerPage]);

  useEffect(() => {
    // Fetch station locations
    fetch('http://localhost:3000/api/policeofficers/location')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setStationLocations(data))
      .catch(error => console.error('Error fetching station locations:', error));
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

  const handleDateOfHireChange = (event) => {
    setDateOfHire(event.target.value);
    setCurrentPage(1); // Reset to first page on date of hire change
  };

  const handleBadgeNumberChange = (event) => {
    setBadgeNumber(event.target.value);
    setCurrentPage(1); // Reset to first page on badge number change
  };

  const handleSortFieldChange = (event) => {
    setSortField(event.target.value);
  };

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
  };

  const handleFetchGroupedByYear = () => {
    fetch('http://localhost:3000/api/policeofficers?groupByYear=true')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setGroupedByYear(data))
      .catch(error => console.error('Error fetching grouped officers by year:', error));
  };

  const filteredOfficers = officers.filter(officer =>
    officer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (!station || officer.stationLocation === station) &&
    (!dateOfHire || officer.dateOfHire === dateOfHire) &&
    (!badgeNumber || officer.badgeNumber === badgeNumber)
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
          {stationLocations.map(location => (
            <option key={location.stationLocation} value={location.stationLocation}>{location.stationLocation}</option>
          ))}
        </select>
        <label htmlFor="dateOfHireFilter">Filter by date of hire:</label>
        <input
          type="date"
          id="dateOfHireFilter"
          value={dateOfHire}
          onChange={handleDateOfHireChange}
        />
        <label htmlFor="badgeNumberFilter">Filter by badge number:</label>
        <input
          type="text"
          id="badgeNumberFilter"
          value={badgeNumber}
          onChange={handleBadgeNumberChange}
        />
      </div>
      <div className="sort-container">
        <label htmlFor="sortField">Sort by:</label>
        <select id="sortField" value={sortField} onChange={handleSortFieldChange}>
          <option value="stationLocation">Station Location</option>
          <option value="fullName">Full Name</option>
          <option value="dateOfHire">Date of Hire</option>
        </select>
        <label htmlFor="sortOrder">Order:</label>
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
      <button onClick={handleFetchGroupedByYear}>Fetch Officers Grouped by Year of Hire</button>
      {groupedByYear.length > 0 && (
        <div className="grouped-by-year">
          <h3>Officers Grouped by Year of Hire</h3>
          <ul>
            {groupedByYear.map((group, index) => (
              <li key={index}>
                <span>{group.hireYear}: {group.officerCount} officers</span>
              </li>
            ))}
          </ul>
        </div>
      )}
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