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
      <Link to="/equipment" className="option">Equipment</Link>
      <Link to="/warrant" className="option">Warrant</Link>
    </div>
  );
}

export default Sidebar;