import './PoliceStationElement.css'

function PoliceStationElement({Info}){

    return(
        <div className="info-box">  
        <h3>{Info.stationName}</h3>
        <p className="Country"><b>Location: </b>{Info.location}</p>

        { 
        Info.officerCount ? (
          <p className="Region">
            <b>Officer Count: </b>{Info.officerCount}
          </p>
        ) : (
            <p className="Region">
            <b>Contact Number: </b>{Info.contactNumber}
          </p>
        )
      }

    </div>
    )
}

export default PoliceStationElement