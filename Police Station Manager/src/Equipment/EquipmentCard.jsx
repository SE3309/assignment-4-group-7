import React from "react";
import "./Equipment.css";

const EquipmentCard = ({ equipment }) => {
    const statusColor =
      equipment.equipmentStatus === "Available"
        ? "green"
        : equipment.equipmentStatus === "In Use"
        ? "orange"
        : "red";
  
    return (
      <div className="equipment-card">
        <h3>{equipment.equipmentName}</h3>
        <p><strong>Type:</strong> {equipment.equipmentType}</p>
        <p><strong>Status:</strong> <span style={{ color: statusColor }}>{equipment.equipmentStatus}</span></p>
        <p><strong>Badge Number:</strong> {equipment.badgeNumber}</p>
        <p><strong>Location:</strong> {equipment.location}</p>
      </div>
    );
};
  

export default EquipmentCard;
