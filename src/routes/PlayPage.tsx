import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { fetchRandomPokemon } from "../lib/utils";
import Map from "../components/Map";
import List from "../components/List";

const PlayPage = () => {
  const [localMap, setLocalMap] = useState<string[][] | null>(null);
  const [pokemonData, setPokemonData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [capturedPokemons, setCapturedPokemons] = useState<any[]>([]);
  const [log, setLog] = useState<string[]>([]);
  const [pokemonPosition, setPokemonPosition] = useState({ row: 0, col: 0 });
  const [previousCellValue, setPreviousCellValue] = useState("");

  const reset = () => {
    localStorage.clear();
    setLocalMap(null);
    setError(null);
    setCapturedPokemons([]);
    setPokemonData(null);
    setPokemonPosition({ row: 0, col: 0 });
    setPreviousCellValue("");
    setLog([]);
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
      }
    }
  };

  useEffect(() => {
    // Handle keyboard input for Pokémon movement
    const handleKeyDown = async (event: any) => {
      if (!localMap || !pokemonData) return;

      const { row, col } = pokemonPosition;

      let newRow = row;
      let newCol = col;
      let move = "";

      switch (event.key) {
        case "ArrowUp":
          newRow = Math.max(0, row - 1);
          move = "up";
          break;
        case "ArrowDown":
          newRow = Math.min(localMap.length - 1, row + 1);
          move = "down";
          break;
        case "ArrowLeft":
          newCol = Math.max(0, col - 1);
          move = "left";
          break;
        case "ArrowRight":
          newCol = Math.min(localMap[0].length - 1, col + 1);
          move = "right";
          break;
        default:
          return;
      }

      // Check if the new position is a valid move
      if (localMap[newRow][newCol] === "sea") {
        setLog((prev: string[]) => [...prev, "Invalid move"]);
      } else {
        const updatedMap = localMap.map((row) => [...row]);

        //restore previous position
        updatedMap[row][col] = previousCellValue;
        setPreviousCellValue(updatedMap[newRow][newCol]);
        updatedMap[newRow][newCol] = `pokemon-${pokemonData.name}`;

        setPokemonPosition({ row: newRow, col: newCol });
        setLog((prev: string[]) => [...prev, `You moved ${move}`]);

        // Check if the new position is grass
        if (localMap[newRow][newCol] === "grass") {
          // 20% chance to find a Pokémon
          if (Math.random() < 0.2) {
            const pokemonResponse = await fetchRandomPokemon();

            // Add the captured Pokémon to the list
            setCapturedPokemons((prev: any[]) => [
              ...prev,
              {
                name: pokemonResponse.data.name,
                sprite: pokemonResponse.data.sprites.front_default,
              },
            ]);

            setLog((prev: string[]) => [
              ...prev,
              `You caught ${pokemonResponse.data.name}`,
            ]);
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

      <div className="h-screen overflow-hidden">
        {localMap ? (
          <>
            <div className="flex flex-col items-center">
              {pokemonData && (
                <button
                  onClick={reset}
                  className="bg-pink-400 p-4 rounded-xl uppercase text-white"
                >
                  clear
                </button>
              )}

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
              <Map pokemonData={pokemonData} localMap={localMap} size="30px" />
            </div>

            <div className="mt-3 flex justify-between w-screen h-1/2">
              <div className="overflow-y-auto basis-1/2 pl-2">
                <List
                  list={capturedPokemons}
                  title={"Captured Pokémon"}
                  isLog={false}
                />
              </div>
              <div className="overflow-y-auto border-purple-400 border-double border-l-4 basis-1/2 pl-2">
                <List list={log} title={"Log"} isLog={true} />
              </div>
            </div>
          </>
        ) : (
          <p>
            No map available. Please generate and save a map first in the{" "}
            <NavLink to="/" className="capitalize text-purple-400">
              home page
            </NavLink>
          </p>
        )}
      </div>
    </div>
  );
};

export default PlayPage;
