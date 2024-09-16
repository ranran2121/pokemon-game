import React, { useEffect, useState } from "react";
import Map from "../components/Map";
import {
  placeContiguousArea,
  recheckMapForIsolatedLandCells,
} from "../lib/mapGeneration";
import { NavLink } from "react-router-dom";

const Home = () => {
  const [map, setMap] = useState<string[][] | null>(null);
  const [dimensions, setDimensions] = useState("small");
  const [sea, setSea] = useState(10);
  const [grass, setGrass] = useState(10);
  const [hasStoredMap, setHasStoredMap] = useState(false);

  const options = [
    { value: "small", label: "Small", width: 10, height: 10 },
    { value: "medium", label: "Medium", width: 25, height: 20 },
    { value: "large", label: "Large", width: 40, height: 25 },
  ];

  useEffect(() => {
    const storedMap = localStorage.getItem("generatedMap");
    if (storedMap) {
      setHasStoredMap(true);
    } else {
      setHasStoredMap(false);
    }

    const handleStorageChange = () => {
      const storedMap = localStorage.getItem("generatedMap");
      setHasStoredMap(storedMap !== null);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const generateMap = () => {
    let width: number, height: number;
    switch (dimensions) {
      case "small":
        width = options[0].width;
        height = options[0].height;
        break;
      case "medium":
        width = options[1].width;
        height = options[1].height;
        break;
      case "large":
        width = options[2].width;
        height = options[2].height;
        break;
      default:
        width = 10;
        height = 10;
    }

    const totalCells = width * height;
    const seaCells = Math.round((sea / 100) * totalCells);
    const grassCells = Math.round((grass / 100) * totalCells);

    // initialize with all land cells
    const map = Array(height)
      .fill("")
      .map(() => Array(width).fill("land"));

    // place sea cells
    placeContiguousArea({
      map,
      width,
      height,
      numCells: seaCells,
      terrainType: "sea",
    });

    // Place grass cells
    placeContiguousArea({
      map,
      width,
      height,
      numCells: grassCells,
      terrainType: "grass",
    });

    recheckMapForIsolatedLandCells({ width, height, map });

    setMap(map);
  };

  const saveMapToLocalStorage = () => {
    if (map) {
      //reset local storage from previous game
      localStorage.clear();
      setHasStoredMap(false);

      localStorage.setItem("generatedMap", JSON.stringify(map));
      alert(
        `Map saved to localStorage successfully!
        \nNow you can navigate to the Play page`
      );
      setHasStoredMap(true);
    } else {
      alert("Please generate the map first!");
    }
  };

  return (
    <div className="text-center">
      <div className="my-5">
        <p className="">
          You can set the size and percentages of grass and sea cells below ...
        </p>
        <p className="">
          Or You can navigate directly to the{" "}
          <NavLink to="/play" className="capitalize text-orange-400">
            Play page
          </NavLink>{" "}
          and load a locally saved game
        </p>
      </div>

      <div className="my-5">
        <div className="setting">
          <label htmlFor="dimension-select">Select map's size: </label>
          <select
            className="input"
            id="dimension-select"
            value={dimensions}
            onChange={(event) => {
              setDimensions(event.target.value);
            }}
          >
            {options.map(({ value, label, width, height }) => {
              return (
                <option value={value} key={value}>
                  {label} ({width}x{height}){" "}
                </option>
              );
            })}
          </select>
        </div>

        <div className="setting">
          <label htmlFor="sea-input">Sea parameters: </label>
          <input
            className="input"
            type="number"
            id="sea-input"
            value={sea}
            min="10"
            max="30"
            onChange={(event) => {
              const value = parseInt(event.target.value, 10);
              if (value >= 10 && value <= 30) {
                setSea(value);
              }
            }}
          />
        </div>

        <div className="setting">
          <label htmlFor="grass-input">Grass parameters: </label>
          <input
            className="input"
            type="number"
            id="grass-input"
            value={grass}
            min="10"
            max="30"
            onChange={(event) => {
              const value = parseInt(event.target.value, 10);
              if (value >= 10 && value <= 30) {
                setGrass(value);
              }
            }}
          />
        </div>

        <div className="setting">
          <button className="button" onClick={generateMap}>
            generate map
          </button>
        </div>
      </div>

      {map && (
        <div className="flex gap-4 justify-center">
          <p className="text-orange-500 uppercase">Map preview:</p>
          <Map localMap={map} />
        </div>
      )}

      <div className="my-5 text-center">
        <button className="button" onClick={saveMapToLocalStorage}>
          save map
        </button>

        {hasStoredMap && (
          <div className="my-4 px-3 bg-amber-300 text-orange-500 w-fit mx-auto">
            A map is already stored. Saving a new map will reset the previous
            game
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
