import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "./Root";
import axios from "axios";

const PlayPage = () => {
  const { setMap } = useContext(AppContext);
  const [localMap, setLocalMap] = useState(null);
  const [pokemonData, setPokemonData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Retrieve map from localStorage
    const storedMap = localStorage.getItem("generatedMap");
    if (storedMap) {
      const parsedMap = JSON.parse(storedMap);
      setLocalMap(parsedMap);
      setMap(parsedMap); // Set the map in context
    }
  }, [setMap]);

  const fetchRandomPokemon = async () => {
    try {
      setError(""); // Reset error message
      const response = await axios.get(
        "https://pokeapi.co/api/v2/pokemon?limit=1000"
      ); // Get a list of Pokémon
      const pokemonList = response.data.results;

      if (pokemonList.length === 0) {
        setError("No Pokémon found");
        return;
      }

      // Generate a random index
      const randomIndex = Math.floor(Math.random() * pokemonList.length);
      const randomPokemon = pokemonList[randomIndex];

      // Fetch data for the random Pokémon
      const pokemonResponse = await axios.get(randomPokemon.url);
      console.log(pokemonResponse.data);

      // Update map with Pokémon in the middle cell
      if (localMap) {
        const numRows = localMap.length;
        const numCols = localMap[0].length;
        const midRow = Math.floor(numRows / 2);
        const midCol = Math.floor(numCols / 2);

        const updatedMap = localMap.map((row, rowIndex) =>
          row.map((cell, colIndex) =>
            rowIndex === midRow && colIndex === midCol
              ? `pokemon-${pokemonResponse.data.name}`
              : cell
          )
        );

        setLocalMap(updatedMap);
        setMap(updatedMap); // Update map in context
        localStorage.setItem("generatedMap", JSON.stringify(updatedMap)); // Save updated map to localStorage
      }

      setPokemonData(pokemonResponse.data);
    } catch (err) {
      setError("Failed to fetch Pokémon");
      setPokemonData(null);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      {error && <div className="">{error}</div>}
      <div className="my-2">
        {pokemonData?.name ? (
          <h2 onClick={fetchRandomPokemon}>
            Play with <span className="capitalize">{pokemonData.name}</span>
          </h2>
        ) : (
          <button
            onClick={fetchRandomPokemon}
            className="bg-pink-400 p-4 rounded-xl uppercase text-white"
          >
            Play
          </button>
        )}
      </div>
      <div className="map-display">
        {localMap ? (
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
                      src={pokemonData.sprites.front_default}
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
        ) : (
          <p>No map available. Please generate and save a map first.</p>
        )}
      </div>
    </div>
  );
};

export default PlayPage;
