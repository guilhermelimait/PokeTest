const pokemonList = document.getElementById('pokemon-list');
const typeFilter = document.getElementById('type-filter');
const nameSearch = document.getElementById('name-search');
const previousPageButton = document.getElementById('previous-page');
const nextPageButton = document.getElementById('next-page');

let allPokemonData = [];
let currentPage = 1;
const pokemonPerPage = 9;

async function fetchPokemonData() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        const data = await response.json();
        const pokemonPromises = data.results.map(async (pokemon) => {
            const pokemonDetailsResponse = await fetch(pokemon.url);
            return await pokemonDetailsResponse.json();
        });
        allPokemonData = await Promise.all(pokemonPromises);
        displayPokemon(currentPage);
        fetchPokemonTypes();
    } catch (error) {
        console.error('Error fetching Pokémon data:', error);
    }
}

async function fetchPokemonTypes() {
    const response = await fetch('https://pokeapi.co/api/v2/type');
    const data = await response.json();
    const typeFilter = document.getElementById('type-filter');

    data.results.forEach(type => {
        const option = document.createElement('option');
        option.value = type.name;
        option.text = type.name;
        typeFilter.appendChild(option);
    });
}

function displayPokemon(page) {
    const startIndex = (page - 1) * pokemonPerPage;
    const endIndex = startIndex + pokemonPerPage;
    const pokemonToDisplay = allPokemonData.slice(startIndex, endIndex);

    pokemonList.innerHTML = '';

    pokemonToDisplay.forEach(pokemon => {
        const card = createPokemonCard(pokemon);
        pokemonList.appendChild(card);
    });
}

function createPokemonCard(pokemon) {
    const cardContainer = document.createElement('div');
    cardContainer.classList.add('pokemon-card-container');

    const cardBackground = document.createElement('div');
    cardBackground.classList.add
