import React from "react";
import "./Incident.css";

const IncidentTable = ({ incidentData }) => {
  return (
    <table className="incident-table">
      <thead>
        <tr>
          <th>Incident Number</th>
          <th>Type</th>
          <th>Date</th>
          <th>Location</th>
          <th>Status</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {incidentData.map((incident) => (
          <tr key={incident.incidentNumber}>
            <td>{incident.incidentNumber}</td>
            <td>{incident.incidentType}</td>
            <td>{new Date(incident.incidentDate).toLocaleDateString()}</td>
            <td>{incident.location}</td>
            <td>{incident.incidentStatus}</td>
            <td>{incident.incidentDesc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default IncidentTable;
