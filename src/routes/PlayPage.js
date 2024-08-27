import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { fetchRandomPokemon } from "../lib/utils";

const PlayPage = () => {
  const [localMap, setLocalMap] = useState(null);
  const [pokemonData, setPokemonData] = useState(null);
  const [error, setError] = useState("");
  const [capturedPokemons, setCapturedPokemons] = useState([]);
  const [pokemonPosition, setPokemonPosition] = useState({ row: 0, col: 0 });
  const [previousCellValue, setPreviousCellValue] = useState();

  const reset = () => {
    localStorage.clear();
    setLocalMap(null);
    setError(null);
    setCapturedPokemons([]);
    setPokemonData(null);
    setPokemonPosition(null);
  };

  useEffect(() => {
    if (!pokemonData) {
      const storedPokemon = localStorage.getItem("generatedPokemon");
      if (storedPokemon) {
        const parsedPokemonData = JSON.parse(storedPokemon);
        setPokemonData(parsedPokemonData);
      }
    }
  });

  useEffect(() => {
    const storedMap = localStorage.getItem("generatedMap");
    if (storedMap) {
      const parsedMap = JSON.parse(storedMap);
      setLocalMap(parsedMap);
    }
  }, [pokemonPosition]);

  const fetchPokemon = async () => {
    if (localMap) {
      try {
        setError("");

        const pokemonResponse = await fetchRandomPokemon();

        // Set Pokémon position to the center of the map
        const centerRow = Math.floor(localMap.length / 2);
        const centerCol = Math.floor(localMap[0].length / 2);
        //store cell value
        const value = localMap[centerRow][centerCol];
        setPreviousCellValue(value);

        setPokemonPosition({ row: centerRow, col: centerCol });

        // Update map with Pokémon in the middle cell
        const updatedMap = localMap.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            return rowIndex === centerRow && colIndex === centerCol
              ? `pokemon-${pokemonResponse.data.name}`
              : cell;
          })
        );
        setLocalMap(updatedMap);
        localStorage.setItem("generatedMap", JSON.stringify(updatedMap));
        setPokemonData(pokemonResponse.data);

        localStorage.setItem(
          "generatedPokemon",
          JSON.stringify(pokemonResponse.data)
        ); // Save pokemon data to localStorage
      } catch (err) {
        setError("Failed to fetch Pokémon");
        localStorage.setItem("generatedPokemon", null);
      }
    }
  };

  useEffect(() => {
    // Handle keyboard input for Pokémon movement
    const handleKeyDown = async (event) => {
      if (!localMap || !pokemonData) return;

      const { row, col } = pokemonPosition;

      let newRow = row;
      let newCol = col;

      switch (event.key) {
        case "ArrowUp":
          newRow = Math.max(0, row - 1);
          break;
        case "ArrowDown":
          newRow = Math.min(localMap.length - 1, row + 1);
          break;
        case "ArrowLeft":
          newCol = Math.max(0, col - 1);
          break;
        case "ArrowRight":
          newCol = Math.min(localMap[0].length - 1, col + 1);
          break;
        default:
          return;
      }

      // Check if the new position is a valid move
      if (localMap[newRow][newCol] !== "sea") {
        const updatedMap = localMap.map((row) => [...row]);

        //restore previous position
        updatedMap[row][col] = previousCellValue;
        setPreviousCellValue(updatedMap[newRow][newCol]);
        updatedMap[newRow][newCol] = `pokemon-${pokemonData.name}`;

        setPokemonPosition({ row: newRow, col: newCol });

        // Check if the new position is grass
        if (localMap[newRow][newCol] === "grass") {
          // 20% chance to find a Pokémon
          if (Math.random() < 0.2) {
            const pokemonResponse = await fetchRandomPokemon();

            // Add the captured Pokémon to the list
            setCapturedPokemons((prev) => [
              ...prev,
              {
                name: pokemonResponse.data.name,
                sprite: pokemonResponse.data.sprites.front_default,
              },
            ]);

            console.log("POKEMON CAPTURED: " + pokemonResponse.data.name);
          }
        }

        // Update the map state
        setLocalMap([...updatedMap]);

        localStorage.setItem("generatedMap", JSON.stringify(updatedMap));
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pokemonPosition, localMap, pokemonData]);

  return (
    <div className="flex flex-col justify-center items-center mt-2">
      {error && <div className="">{error}</div>}
      {localMap && pokemonData && (
        <button
          onClick={reset}
          className="bg-pink-400 p-4 rounded-xl uppercase text-white"
        >
          clear
        </button>
      )}

      <div className="">
        {localMap ? (
          <div className="flex flex-col items-center">
            <div className="my-2">
              {pokemonData?.name ? (
                <h2>
                  Play with{" "}
                  <span className="capitalize">{pokemonData.name}</span>
                </h2>
              ) : (
                <button
                  onClick={fetchPokemon}
                  className="bg-pink-400 p-4 rounded-xl uppercase text-white"
                >
                  Play
                </button>
              )}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${localMap[0].length}, 30px)`,
              }}
            >
              {localMap.flat().map((cell, index) => {
                const isPokemon = cell.startsWith("pokemon-");
                const pokemonName = isPokemon ? cell.split("-")[1] : null;

                return (
                  <div
                    key={index}
                    style={{
                      width: "30px",
                      height: "30px",
                      backgroundColor: isPokemon
                        ? "red" // Color for Pokémon
                        : cell === "sea"
                        ? "blue"
                        : cell === "grass"
                        ? "green"
                        : "yellow",
                      border: "1px solid #ccc",
                      position: "relative",
                    }}
                  >
                    {isPokemon && pokemonName && pokemonData?.sprites && (
                      <img
                        src={pokemonData.sprites.front_default} // Use the correct image URL
                        alt={pokemonName}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          position: "absolute",
                          top: 0,
                          left: 0,
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p>
            No map available. Please generate and save a map first in the{" "}
            <NavLink to="/" className="capitalize text-purple-400">
              home page
            </NavLink>
          </p>
        )}
      </div>
      <div className="captured-pokemons">
        <h3>Captured Pokémon</h3>
        <ul>
          {capturedPokemons.map((pokemon, index) => (
            <li key={index}>
              <img
                src={pokemon.sprite}
                alt={pokemon.name}
                style={{ width: "50px", height: "50px" }}
              />
              {pokemon.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PlayPage;
