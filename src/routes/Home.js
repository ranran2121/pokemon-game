import React, { useState, useContext } from "react";
import { AppContext } from "./Root";

const Home = () => {
  const { map, setMap } = useContext(AppContext);
  const [dimensions, setDimensions] = useState("small");
  const [sea, setSea] = useState(10);
  const [land, setLand] = useState(10);
  const [grass, setGrass] = useState(10);

  const generateMap = () => {
    let size;
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

    // Inizializza la mappa con tutte le celle come "land"
    const map = Array(size)
      .fill()
      .map(() => Array(size).fill("land"));

    // Funzione helper per posizionare zone contigue sulla mappa
    const placeContiguousArea = (map, size, numCells, terrainType) => {
      let placedCells = 0;
      while (placedCells < numCells) {
        const startX = Math.floor(Math.random() * size);
        const startY = Math.floor(Math.random() * size);

        // Controlla che la cella di partenza sia "land"
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

    // Posiziona le zone di mare
    placeContiguousArea(map, size, seaCells, "sea");

    // Posiziona le zone di erba
    placeContiguousArea(map, size, grassCells, "grass");

    console.table(map);
    setMap(map);
  };

  const saveMapToLocalStorage = () => {
    if (map) {
      localStorage.setItem("generatedMap", JSON.stringify(map));
      alert("Map saved to localStorage successfully!");
    } else {
      alert("Please generate the map first!");
    }
  };

  return (
    <>
      <div className="pl-4">
        <div className="setting">
          <label htmlFor="dimension-select">Select map's size:</label>
          <select
            id="dimension-select"
            value={dimensions}
            onChange={(event) => {
              setDimensions(event.target.value);
            }}
            ß
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>

        <div className="setting">
          <label htmlFor="sea-input">Sea parameters: </label>
          <input
            type="number"
            id="sea-input"
            value={sea}
            min="10" // Imposta il valore minimo a 10
            max="30" // Imposta il valore massimo a 30
            onChange={(event) => {
              const value = parseInt(event.target.value, 10);
              if (value >= 10 && value <= 30) {
                setSea(value);
              }
            }}
          />
        </div>

        <div className="setting">
          <label htmlFor="land-input">Land parameters: </label>
          <input
            type="number"
            id="land-input"
            value={land}
            min="10" // Imposta il valore minimo a 10
            max="30" // Imposta il valore massimo a 30
            onChange={(event) => {
              const value = parseInt(event.target.value, 10);
              if (value >= 10 && value <= 30) {
                setLand(value);
              }
            }}
          />
        </div>

        <div className="setting">
          <label htmlFor="grass-input">Grass parameters: </label>
          <input
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
        <div id="gridContainer">
          <table>
            <tbody>
              {map.map((row, i) => {
                return (
                  <tr key={i}>
                    {row.map((_, j) => {
                      if (map[i][j] === "land") {
                        return (
                          <td
                            key={j}
                            className="w-4 h-4"
                            style={{ backgroundColor: "yellow" }}
                          ></td>
                        );
                      }
                      if (map[i][j] === "sea") {
                        return (
                          <td
                            key={j}
                            className="w-4 h-4"
                            style={{ backgroundColor: "blue" }}
                          ></td>
                        );
                      }
                      if (map[i][j] === "grass") {
                        return (
                          <td
                            key={j}
                            className="w-4 h-4"
                            style={{ backgroundColor: "green" }}
                          ></td>
                        );
                      }
                      return (
                        <td
                          key={j}
                          className="w-4 h-4"
                          style={{ backgroundColor: "red" }}
                        ></td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="setting">
        <button
          className="rounded-lg p-3 bg-purple-400 capitalize"
          onClick={saveMapToLocalStorage}
        >
          save map
        </button>
      </div>
    </>
  );
};

export default Home;
