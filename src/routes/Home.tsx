import React, { useEffect, useState } from "react";
import Map from "../components/Map";

const Home = () => {
  const [map, setMap] = useState<string[][] | null>(null);
  const [dimensions, setDimensions] = useState("small");
  const [sea, setSea] = useState(10);
  const [grass, setGrass] = useState(10);
  const [hasStoredMap, setHasStoredMap] = useState(false);

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
    let size: number;
    switch (dimensions) {
      case "small":
        size = 10;
        break;
      case "medium":
        size = 20;
        break;
      case "large":
        size = 30;
        break;
      default:
        size = 10;
    }

    const totalCells = size * size;
    const seaCells = Math.round((sea / 100) * totalCells);
    const grassCells = Math.round((grass / 100) * totalCells);

    // initialize with all land cells
    const map = Array(size)
      .fill("")
      .map(() => Array(size).fill("land"));

    // helper function to place contiguously cells
    const placeContiguousArea = (
      map: string[][],
      size: number,
      numCells: number,
      terrainType: string
    ) => {
      let placedCells = 0;
      while (placedCells < numCells) {
        const startX = Math.floor(Math.random() * size);
        const startY = Math.floor(Math.random() * size);

        if (map[startX][startY] === "land") {
          const toPlace = Math.min(numCells - placedCells, size - startX);
          for (let i = 0; i < toPlace; i++) {
            if (map[startX + i][startY] === "land") {
              map[startX + i][startY] = terrainType;
              placedCells++;
              if (placedCells === numCells) break;
            }
          }
        }
      }
    };

    // place sea cells
    placeContiguousArea(map, size, seaCells, "sea");

    // place grass cells
    placeContiguousArea(map, size, grassCells, "grass");

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
    <div className="pl-4">
      <div>
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
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
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
          <button
            className="rounded-lg p-3 bg-purple-400 capitalize"
            onClick={generateMap}
          >
            generate map
          </button>
        </div>
      </div>

      {map && (
        <div className="flex gap-4">
          <p className="text-pink-400 uppercase">Map preview:</p>
          <Map localMap={map} />
        </div>
      )}

      <div className="my-3">
        <button
          className="rounded-lg p-3 bg-purple-400 capitalize"
          onClick={saveMapToLocalStorage}
        >
          save map
        </button>

        {hasStoredMap && (
          <div className="my-3 px-3 bg-pink-300 text-white w-fit">
            A map is already stored. Saving a new map will reset the previous
            game
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
