import axios from "axios";

export const fetchRandomPokemon = async () => {
  try {
    const response = await axios.get(
      "https://pokeapi.co/api/v2/pokemon?limit=1000"
    ); // Get a list of Pokémon
    const pokemonList = response.data.results;

    if (pokemonList.length === 0) {
      throw new Error("No Pokémon found");
    }
    // Generate a random index
    const randomIndex = Math.floor(Math.random() * pokemonList.length);
    const randomPokemon = pokemonList[randomIndex];

    // Fetch data for the random Pokémon
    const pokemonResponse = await axios.get(randomPokemon.url);

    return pokemonResponse;
  } catch (e) {
    throw new Error("No Pokémon found");
  }
};
