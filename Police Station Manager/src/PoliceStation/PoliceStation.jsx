import './PoliceStation.css';
import { useState, useEffect } from 'react';
import PoliceStationElement from './PoliceStationElement/PoliceStationElement.jsx';

function PoliceStation() {
  const [policeElement, setPoliceElement] = useState([]);
  const [highCount, setHighCount] = useState(null)


 
  useEffect(() => {
   
    fetch('http://localhost:3000/api/policestation')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
       
        const elements = data.map((element) => (
          <PoliceStationElement Info={element} key={element.stationName} />
        ));
        setPoliceElement(elements); 

        console.log('Fetched officers:', data);
      })
      .catch(error => console.error('Error fetching police officers:', error));
  }, []); 

  function show(){
    fetch('http://localhost:3000/api/policestation/mostOfficers')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
        setHighCount(<PoliceStationElement Info={data[0]}></PoliceStationElement>)
      console.log('Fetched officers:', data);
    })
    .catch(error => console.error('Error fetching police officers:', error));
  }



  return (
    <div>
    <div className='info-container'>
      {policeElement} 
    </div>

    <button onClick={show} className='button'> Station With Most Officers</button>
    {highCount ? 
    <div className='info-container'>
    {highCount} 
    </div>: null}
    
    </div>
    
  );
}

export default PoliceStation;
