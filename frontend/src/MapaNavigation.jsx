import React, { useState } from "react";
import { GoogleMap, DirectionsService, DirectionsRenderer } from "@react-google-maps/api";

export const MapaNavigation = (props) => {
    let destination = props.dest;
    let origin = props.ori;
    let [directions, setDirections] = useState(undefined);
    console.log(directions);
    return (
        <div className='map-container'>
            <GoogleMap
                id='direction-example'
                mapContainerStyle={{
                    height: '400px',
                    width: '100%'
                }}
                zoom={7}
                center={{ lat: 0, lng: -180 }}
            >
                {!directions &&
                    < DirectionsService
                        options={{
                            destination: destination,
                            origin: origin,
                            travelMode: "DRIVING"
                        }}
                        callback={(response) => {
                            setDirections(response);
                        }}
                    />
                }
                {directions && <DirectionsRenderer
                    options={{
                        directions: directions
                    }}
                />}
            </GoogleMap>
        </div>
    );
};