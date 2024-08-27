import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "./Root";
import axios from "axios";

const PlayPage = () => {
  const { map, setMap } = useContext(AppContext);
  const [localMap, setLocalMap] = useState(null);

  useEffect(() => {
    // Retrieve map from localStorage
    const storedMap = localStorage.getItem("generatedMap");
    if (storedMap) {
      const parsedMap = JSON.parse(storedMap);
      setLocalMap(parsedMap);
      setMap(parsedMap); // Set the map in context
    }
  }, [setMap]);

  return (
    <div className="flex flex-col justify-center items-center">
      <h2>Play Map</h2>
      <div className="map-display">
        {localMap ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${map.length}, 30px)`,
            }}
          >
            {localMap.flat().map((cell, index) => (
              <div
                key={index}
                style={{
                  width: "30px",
                  height: "30px",
                  backgroundColor:
                    cell === "sea"
                      ? "blue"
                      : cell === "grass"
                      ? "green"
                      : "yellow",
                  border: "1px solid #ccc",
                }}
              />
            ))}
          </div>
        ) : (
          <p>No map available. Please generate and save a map first.</p>
        )}
      </div>
    </div>
  );
};

export default PlayPage;
