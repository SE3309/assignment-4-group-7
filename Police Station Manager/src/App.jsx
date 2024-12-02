import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './Header/Header';
import Sidebar from './Sidebar/Sidebar';
import PoliceManager from './PoliceManager/PoliceManager';
import PoliceStation from './PoliceStation/PoliceStation';
import Suspect from './Suspect/Suspect';
import Equipment from './Equipment/Equipment';

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
              <Route path="/police-station" element={<PoliceStation/>} />
              <Route path="/suspect" element={<Suspect />}/>
              <Route path="/equipment" element={<Equipment />}/>
              {/* Add other routes here */}
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;