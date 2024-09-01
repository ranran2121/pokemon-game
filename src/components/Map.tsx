import React from "react";

const Map = ({
  localMap,
  pokemonData = null,
  pokemonPosition,
  size = "10px",
}: {
  localMap: string[][];
  pokemonData?: any;
  pokemonPosition?: { row: number; col: number } | null;
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
        let isPokemon = false;

        //check if the cell is equal to the Pokemon's current position
        if (
          pokemonPosition &&
          pokemonPosition?.row >= 0 &&
          pokemonPosition?.col >= 0
        ) {
          const rowPositionInFlat = Math.floor(index / localMap[0].length);
          const colPositionInFlat = index % localMap[0].length;

          isPokemon =
            pokemonData.name &&
            pokemonPosition.row === rowPositionInFlat &&
            pokemonPosition.col === colPositionInFlat;
        }

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
                : "rgb(217 119 6)",
              border: "1px solid white",
              borderRadius: "5px",
              position: "relative",
            }}
          >
            {isPokemon && pokemonData?.name && pokemonData?.sprites && (
              <img
                src={pokemonData.sprites.front_default}
                alt={pokemonData?.name}
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
