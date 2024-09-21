"use client";

import React, { Suspense, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  DirectionsRenderer,
} from "@react-google-maps/api";

export default function Dashboard() {
  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  };

  const center = {
    lat: 49.2827,
    lng: -123.1207,
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

            console.log("Full Directions API Response: ", result);

            const route = result?.routes[0];
            if (route) {
              console.log("Route Summary: ", route.summary);
              console.log("Bounding Box: ", route.bounds);
              console.log("Overview Polyline: ", route.overview_polyline);
              console.log("Warnings: ", route.warnings);

              let totalDuration = 0;
              route?.legs.forEach((leg, index) => {
                console.log(`Leg ${index + 1}:`);
                console.log("Start Address:", leg.start_address);
                console.log("End Address:", leg.end_address);
                console.log("Distance:", leg.distance?.text || "N/A");
                console.log(
                  "Duration:",
                  leg.duration ? leg.duration.text : "N/A"
                );

                console.log(
                  "Duration with Traffic:",
                  leg.duration_in_traffic?.text || "N/A"
                );

                if (leg.duration_in_traffic) {
                  totalDuration += leg.duration_in_traffic.value;
                } else if (leg.duration) {
                  totalDuration += leg.duration.value;
                }

                leg.steps.forEach((step, stepIndex) => {
                  console.log(`Step ${stepIndex + 1}: ${step.instructions}`);
                  console.log(
                    `Distance: ${step.distance?.text || "N/A"}, Duration: ${
                      step.duration?.text || "N/A"
                    }`
                  );
                });
              });

              const hours = Math.floor(totalDuration / 3600);
              const minutes = Math.floor((totalDuration % 3600) / 60);
              const totalTimeString = `${hours} hours and ${minutes} minutes`;

              setPredictedTime(totalTimeString);

              console.log(
                `Total predicted travel time (including traffic): ${totalTimeString}`
              );
            }
          } else {
            console.error(`Error fetching directions: ${status}`);
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
        <p>Predicted Total Travel Time with Traffic: {predictedTime}</p>
      )}
      <Suspense fallback={<div>Loading...</div>}>
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
      </Suspense>
    </div>
  );
}
