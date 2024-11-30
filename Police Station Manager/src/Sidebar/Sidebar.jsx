import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <Link to="/police-officer" className="option">Police Officer</Link>
      <div className="option">Police Station</div>
      <div className="option">Suspect</div>
      <div className="option">Incident</div>
      <div className="option">Equipment</div>
      <div className="option">Warrant</div>
    </div>
  );
}

export default Sidebar;