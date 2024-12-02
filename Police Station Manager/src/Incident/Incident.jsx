import React, { useState, useEffect } from "react";
import IncidentTable from "./IncidentTable";
import "./Incident.css";

const Incident = () => {
  const [incidentData, setIncidentData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/incidents");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setIncidentData(data);
        setFilteredData(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch incident data:", error);
      }
    };

    fetchIncidents();
  }, []);

  const handleSearch = (e) => {
    const search = e.target.value.toLowerCase();
    setSearchTerm(search);
    const filtered = incidentData.filter(
      (item) =>
        item.incidentType.toLowerCase().includes(search) ||
        item.location.toLowerCase().includes(search)
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    if (currentPage * itemsPerPage < filteredData.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="incident-page">
      <h1>Incident Management</h1>
      <input
        type="text"
        placeholder="Search Incidents"
        value={searchTerm}
        onChange={handleSearch}
        className="search-bar"
      />
      <div className="pagination-controls">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <button
          onClick={handleNextPage}
          disabled={currentPage * itemsPerPage >= filteredData.length}
        >
          Next
        </button>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <IncidentTable incidentData={paginatedData} />
      )}
    </div>
  );
};

export default Incident;
