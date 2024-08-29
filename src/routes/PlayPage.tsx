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
  const [pokemonPosition, setPokemonPosition] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const reset = () => {
    localStorage.clear();
    setLocalMap(null);
    setError(null);
    setCapturedPokemons([]);
    setPokemonData(null);
    setPokemonPosition(null);
    setLog([]);
  };

  useEffect(() => {
    const storedPokemon = localStorage.getItem("generatedPokemon");
    if (storedPokemon) {
      const parsedPokemonData = JSON.parse(storedPokemon);
      setPokemonData(parsedPokemonData);
    }

    const storedPokemonPosition = localStorage.getItem("pokemonPosition");
    if (storedPokemonPosition) {
      const { row, col } = JSON.parse(storedPokemonPosition);
      setPokemonPosition({ row, col });
    }

    const storedMap = localStorage.getItem("generatedMap");
    if (storedMap) {
      const parsedMap = JSON.parse(storedMap);
      setLocalMap(parsedMap);
    }

    const storedCapturedPokemons = localStorage.getItem("capturedPokemons");
    if (storedCapturedPokemons) {
      const parsedCapturedPokemons = JSON.parse(storedCapturedPokemons);
      setCapturedPokemons(parsedCapturedPokemons);
    }

    const storedLog = localStorage.getItem("log");
    if (storedLog) {
      const parsedLog = JSON.parse(storedLog);
      setLog(parsedLog);
    }
  }, []);

  const fetchPokemon = async () => {
    if (localMap) {
      try {
        setError("");

        const pokemonResponse = await fetchRandomPokemon();

        // Set Pokémon position to the center of the map
        const centerRow = Math.floor(localMap.length / 2);
        const centerCol = Math.floor(localMap[0].length / 2);

        setPokemonPosition({ row: centerRow, col: centerCol });
        localStorage.setItem(
          "pokemonPosition",
          JSON.stringify({ row: centerRow, col: centerCol })
        );

        setPokemonData(pokemonResponse.data);
        localStorage.setItem(
          "generatedPokemon",
          JSON.stringify(pokemonResponse.data)
        );
      } catch (err) {
        setError("Failed to fetch Pokémon");
      }
    }
  };

  useEffect(() => {
    // Handle keyboard input for Pokémon movement
    const handleKeyDown = async (event: any) => {
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)
      ) {
        event.preventDefault();
      }

      if (!localMap || !pokemonData) return;

      if (pokemonPosition) {
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
          //set new Pokemon's position
          setPokemonPosition({ row: newRow, col: newCol });
          localStorage.setItem(
            "pokemonPosition",
            JSON.stringify({
              row: newRow,
              col: newCol,
            })
          );

          setLog((prev: string[]) => [...prev, `You moved ${move}`]);

          // Check if the new position is grass
          if (localMap[newRow][newCol] === "grass") {
            // 20% chance to find a Pokémon
            if (Math.random() < 0.2) {
              const pokemonResponse = await fetchRandomPokemon();

              // Add the captured Pokémon to the list
              localStorage.setItem(
                "capturedPokemons",
                JSON.stringify([
                  ...capturedPokemons,
                  {
                    name: pokemonResponse.data.name,
                    sprite: pokemonResponse.data.sprites.front_default,
                  },
                ])
              );
              setCapturedPokemons((prev: any[]) => [
                ...prev,
                {
                  name: pokemonResponse.data.name,
                  sprite: pokemonResponse.data.sprites.front_default,
                },
              ]);

              setLog((prev: string[]) => [
                ...prev,
                `You caught ${pokemonResponse.data.name.toUpperCase()}`,
              ]);
            }
          }
        }

        localStorage.setItem(
          "log",
          JSON.stringify([...log, `You moved ${move}`])
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pokemonPosition, pokemonData, localMap, log, capturedPokemons]);

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
                    <span className="uppercase text-pink-400 font-bold ">
                      {pokemonData.name}
                    </span>
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
              <Map
                pokemonData={pokemonData}
                localMap={localMap}
                pokemonPosition={pokemonPosition}
                size="30px"
              />
            </div>

            <div className="mt-3 flex justify-between w-screen h-1/2">
              <div className="basis-1/2 pl-2">
                <List
                  list={capturedPokemons}
                  title={"Captured Pokémon"}
                  isLog={false}
                />
              </div>
              <div className="border-purple-400 border-double border-l-4 basis-1/2 pl-2">
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
