import React, { useState, useEffect } from 'react';
import './Warrant.css';

const Warrant = () => {
  const [warrants, setWarrants] = useState([]);
  const [recentWarrants, setRecentWarrants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(5);
  const [sortOrder, setSortOrder] = useState('asc');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchWarrants();
  }, [searchTerm, currentPage, resultsPerPage, sortOrder]);

  const fetchWarrants = () => {
    const url = new URL('http://localhost:3000/api/warrants');
    if (searchTerm) {
      url.searchParams.append('searchTerm', searchTerm);
    }
    url.searchParams.append('page', currentPage);
    url.searchParams.append('limit', resultsPerPage);
    url.searchParams.append('sortField', 'issuedDate');
    url.searchParams.append('sortOrder', sortOrder);

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setWarrants(data);
      })
      .catch(error => console.error('Error fetching warrants:', error));
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page on search
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

  const handleFetchRecentWarrants = () => {
    fetch('http://localhost:3000/api/warrants/recent-active')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setRecentWarrants(data);
        setShowModal(true);
      })
      .catch(error => console.error('Error fetching recent active warrants:', error));
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="warrant-manager">
      <input
        type="text"
        className="search-input"
        placeholder="Search by suspect name or status"
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
        <div className="pagination-buttons">
          <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
          <button onClick={handleNextPage}>Next</button>
        </div>
      </div>
      <button className="specific-query-btn" onClick={handleFetchRecentWarrants}>Fetch Recent Active Warrants</button>
      {warrants.length > 0 ? (
        <ul className="warrant-list">
          {warrants.map(warrant => (
            <li key={warrant.warrantID} className="warrant-item">
              <h2>Warrant Details</h2>
              <p><strong>Warrant ID:</strong> {warrant.warrantID}</p>
              <p><strong>Issued Date:</strong> {new Date(warrant.issuedDate).toLocaleDateString()}</p>
              <p><strong>Expiration Date:</strong> {new Date(warrant.expirationDate).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {warrant.warrantStatus}</p>
              <h3>Suspect Details</h3>
              <p><strong>Name:</strong> {warrant.suspectName}</p>
              <p><strong>Date of Birth:</strong> {new Date(warrant.suspectDOB).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No warrants found for the selected criteria.</p>
      )}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Recent Active Warrants</h2>
            <button className="close-btn" onClick={closeModal}>Close</button>
            {recentWarrants.length > 0 ? (
              <ul className="warrant-list">
                {recentWarrants.map(warrant => (
                  <li key={warrant.warrantID} className="warrant-item">
                    <h2>Warrant Details</h2>
                    <p><strong>Warrant ID:</strong> {warrant.warrantID}</p>
                    <p><strong>Issued Date:</strong> {new Date(warrant.issuedDate).toLocaleDateString()}</p>
                    <p><strong>Expiration Date:</strong> {new Date(warrant.expirationDate).toLocaleDateString()}</p>
                    <p><strong>Status:</strong> {warrant.warrantStatus}</p>
                    <h3>Suspect Details</h3>
                    <p><strong>Name:</strong> {warrant.suspectName}</p>
                    <p><strong>Date of Birth:</strong> {new Date(warrant.suspectDOB).toLocaleDateString()}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No recent active warrants found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Warrant;