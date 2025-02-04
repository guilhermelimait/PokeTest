const pokemonList = document.getElementById('pokemon-list');
const typeFilter = document.getElementById('type-filter');
const nameSearch = document.getElementById('name-search');
const previousPageButton = document.getElementById('previous-page');
const nextPageButton = document.getElementById('next-page');

let allPokemonData = []; // Store all fetched Pokémon data
let currentPage = 1;
const pokemonPerPage = 9; // Number of Pokémon per page

// Function to fetch Pokémon data from the PokeAPI
async function fetchPokemonData() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151'); // Limit to 151 Gen I Pokémon
        const data = await response.json();
        const pokemonPromises = data.results.map(async (pokemon) => {
            const pokemonDetailsResponse = await fetch(pokemon.url);
            return await pokemonDetailsResponse.json();
        });
        allPokemonData = await Promise.all(pokemonPromises);
        displayPokemon(currentPage);
    } catch (error) {
        console.error('Error fetching Pokémon data:', error);
    }
}

// Function to display Pokémon on the current page
function displayPokemon(page) {
    const startIndex = (page - 1) * pokemonPerPage;
    const endIndex = startIndex + pokemonPerPage;
    const pokemonToDisplay = allPokemonData.slice(startIndex, endIndex);

    pokemonList.innerHTML = ''; // Clear previous Pokémon

    pokemonToDisplay.forEach(pokemon => {
        const card = createPokemonCard(pokemon);
        pokemonList.appendChild(card);
    });
}

// Function to create a Pokémon card element
function createPokemonCard(pokemon) {
    const card = document.createElement('div');
    card.classList.add('pokemon-card');
    card.innerHTML = `
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <h2>${pokemon.name}</h2>
        <p>#${pokemon.id} | ${pokemon.types.map(type => type.type.name).join(', ')}</p>
        <button onclick="showDetails(${pokemon.id})">Mais detalhes</button>
    `;
    return card;
}

// Function to handle "Mais detalhes" button click (you'll need to implement this)
function showDetails(pokemonId) {
    // Implement logic to show details for the selected Pokémon
    console.log('Details clicked for Pokémon ID:', pokemonId);
}

// Event listeners for pagination buttons
previousPageButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayPokemon(currentPage);
    }
});

nextPageButton.addEventListener('click', () => {
    const totalPages = Math.ceil(allPokemonData.length / pokemonPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayPokemon(currentPage);
    }
});

// Event listeners for filtering and searching (you'll need to implement these)
typeFilter.addEventListener('change', () => {
    // Implement logic to filter Pokémon by type
});

nameSearch.addEventListener('input', () => {
    // Implement logic to search Pokémon by name
});

// Fetch initial Pokémon data
fetchPokemonData();
