import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './Header/Header';
import Sidebar from './Sidebar/Sidebar';
import PoliceManager from './PoliceManager/PoliceManager';
import Suspect from './Suspect/Suspect';

function App() {
  return (
    <Router>
      <div className='body'>
        <Header />
        <div className="content">
          <Sidebar />
          <div className='main-content'>
            <Routes>
              <Route path="/police-officer" element={<PoliceManager />} />
              <Route path="/suspect" element={<Suspect />}/>
              {/* Add other routes here */}
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;