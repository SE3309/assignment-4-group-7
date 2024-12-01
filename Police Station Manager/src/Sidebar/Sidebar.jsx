import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <Link to="/police-officer" className="option">Police Officer</Link>
      
      <Link to="/suspect" className="option">Suspect</Link>
      <Link to="/police-station" className="option">Police Station</Link>
          <div className="option">Incident</div>
      <div className="option">Equipment</div>
      <div className="option">Warrant</div>
    </div>
  );
}

export default Sidebar;