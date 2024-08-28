import React from "react";

const Map = ({
  localMap,
  pokemonData = null,
  size = "10px",
}: {
  localMap: string[][];
  pokemonData?: any;
  size?: string;
}) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${localMap[0].length}, ${size})`,
      }}
    >
      {localMap.flat().map((cell, index) => {
        const isPokemon = cell.startsWith("pokemon-");
        const pokemonName = isPokemon ? cell.split("-")[1] : null;

        return (
          <div
            key={index}
            style={{
              width: size,
              height: size,
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
  );
};

export default Map;
