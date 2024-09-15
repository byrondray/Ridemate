"use client";

import React, { useState } from "react";
import {
  GoogleMap,
  LoadScript,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";

export default function Dashboard() {
  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  };

  const center = {
    lat: 37.7749,
    lng: -122.4194,
  };

  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [waypoints, setWaypoints] = useState<string[]>([]);
  const [departureTime, setDepartureTime] = useState(new Date().toISOString());
  const [directionsResponse, setDirectionsResponse] =
    useState<google.maps.DirectionsResult | null>(null);
  const [predictedTime, setPredictedTime] = useState<string>("");

  const handleWaypointChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const waypointsArray = input.split(",").map((waypoint) => waypoint.trim());
    setWaypoints(waypointsArray);
  };

  const handleGetDirections = () => {
    if (origin && destination) {
      const formattedWaypoints = waypoints.map((wp) => ({
        location: wp,
        stopover: true,
      }));

      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: origin,
          destination: destination,
          waypoints: formattedWaypoints,
          travelMode: window.google.maps.TravelMode.DRIVING,
          drivingOptions: {
            departureTime: new Date(departureTime),
            trafficModel: google.maps.TrafficModel.BEST_GUESS,
          },
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirectionsResponse(result);

            const route = result?.routes[0];
            const leg = route?.legs ? route.legs[0] : null;
            if (leg && leg.duration_in_traffic) {
              setPredictedTime(leg.duration_in_traffic.text);
            } else {
              setPredictedTime(
                leg?.duration ? leg.duration.text : "Duration not available"
              );
            }
          } else {
            console.error(`Error fetching directions ${result}`);
          }
        }
      );
    }
  };

  return (
    <div className="container">
      <h1>You are now logged in</h1>

      <div>
        <input
          type="text"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          placeholder="Enter Origin"
        />
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Enter Destination"
        />
        <input
          type="text"
          onChange={handleWaypointChange}
          placeholder="Enter Waypoints (comma-separated)"
        />
        <input
          type="datetime-local"
          value={new Date(departureTime).toISOString().substring(0, 16)}
          onChange={(e) =>
            setDepartureTime(new Date(e.target.value).toISOString())
          }
          placeholder="Select Departure Time"
        />
        <button onClick={handleGetDirections}>Get Directions</button>
      </div>

      {predictedTime && (
        <p>Predicted Travel Time with Traffic: {predictedTime}</p>
      )}

      <LoadScript
        googleMapsApiKey={`${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={10}
        >
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
