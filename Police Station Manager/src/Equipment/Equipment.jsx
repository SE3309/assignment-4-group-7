import React, { useState, useEffect } from "react";
import EquipmentCard from "./EquipmentCard";
import "./Equipment.css";

const Equipment = () => {
  const [equipmentData, setEquipmentData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; 

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/equipment");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEquipmentData(data);
        setFilteredData(data); 
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch equipment data:", error);
      }
    };

    fetchEquipment();
  }, []);

  const handleSearch = (e) => {
    const search = e.target.value.toLowerCase();
    setSearchTerm(search);
    const filtered = equipmentData.filter((item) =>
      item.equipmentName.toLowerCase().includes(search)
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
    <div className="equipment-page">
      <h1>Equipment Management</h1>
      <input
        type="text"
        placeholder="Search Equipment"
        value={searchTerm}
        onChange={handleSearch}
        className="search-bar"
      />
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="equipment-card-grid">
          {paginatedData.map((equipment) => (
            <EquipmentCard key={equipment.serialNumber} equipment={equipment} />
          ))}
        </div>
      )}
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
    </div>
  );
};

export default Equipment;
