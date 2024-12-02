import React, { useState, useEffect } from "react";
import IncidentTable from "./IncidentTable";
import "./Incident.css";

const Incident = () => {
  const [incidentData, setIncidentData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [incidentStatuses, setIncidentStatuses] = useState([]);
  const [incidentTypes, setIncidentTypes] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const url = new URL("http://localhost:3000/api/incidents");
        url.searchParams.append("page", currentPage);
        url.searchParams.append("limit", itemsPerPage);
        if (searchTerm) {
          url.searchParams.append("searchTerm", searchTerm);
        }
        if (selectedStatus) {
          url.searchParams.append("status", selectedStatus);
        }
        if (selectedType) {
          url.searchParams.append("type", selectedType);
        }

        const response = await fetch(url);
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
  }, [searchTerm, currentPage, selectedStatus, selectedType]);

  useEffect(() => {
    const fetchIncidentStatuses = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/incidents/statuses");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setIncidentStatuses(data);
      } catch (error) {
        console.error("Failed to fetch incident statuses:", error);
      }
    };

    const fetchIncidentTypes = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/incidents/types");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setIncidentTypes(data);
      } catch (error) {
        console.error("Failed to fetch incident types:", error);
      }
    };

    fetchIncidentStatuses();
    fetchIncidentTypes();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    setCurrentPage(1);
  };

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
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
      <div className="filters">
        <select value={selectedStatus} onChange={handleStatusChange}>
          <option value="">All Statuses</option>
          {incidentStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <select value={selectedType} onChange={handleTypeChange}>
          <option value="">All Types</option>
          {incidentTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
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