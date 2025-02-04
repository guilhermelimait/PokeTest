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
    const card = document.createElement('div');
    card.classList.add('pokemon-card');
    card.innerHTML = `
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <h2>${pokemon.name}</h2>
        <p>#${pokemon.id} | ${pokemon.types.map(type => type.type.name).join(', ')}</p>
        <p>Height: ${pokemon.height / 10} m | Weight: ${pokemon.weight / 10} kg</p>
        <button onclick="showDetails(${pokemon.id})">More Details</button>
    `;
    return card;
}

async function showDetails(pokemonId) {
    const modal = document.getElementById('pokemon-details-modal');
    const modalContent = document.getElementById('modal-content');
    modal.style.display = 'block';

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        const pokemonDetails = await response.json();

        modalContent.innerHTML = `
            <img src="${pokemonDetails.sprites.front_default}" alt="${pokemonDetails.name}">
            <h2>${pokemonDetails.name}</h2>
            <p>ID: ${pokemonDetails.id}</p>
            <p>Type: ${pokemonDetails.types.map(type => type.type.name).join(', ')}</p>
            <p>Height: ${pokemonDetails.height / 10} m</p>
            <p>Weight: ${pokemonDetails.weight / 10} kg</p>
            <p>Abilities: ${pokemonDetails.abilities.map(ability => ability.ability.name).join(', ')}</p>
            <p>Stats: ${pokemonDetails.stats.map(stat => `${stat.stat.name}: ${stat.base_stat}`).join('<br>')}</p>
            `;

    } catch (error) {
        console.error("Error fetching details:", error);
        modalContent.innerHTML = "<p>Error fetching details. Please try again later.</p>";
    }
}

const closeButton = document.querySelector('.close-button');
const modal = document.getElementById('pokemon-details-modal');

closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
});

nameSearch.addEventListener('input', () => {
    const searchTerm = nameSearch.value.toLowerCase();
    const filteredPokemon = allPokemonData.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchTerm)
    );
    displayFilteredPokemon(filteredPokemon);
});

typeFilter.addEventListener('change', () => {
    const selectedType = typeFilter.value;
    let filteredPokemon = allPokemonData;

    if (selectedType) {
        filteredPokemon = allPokemonData.filter(pokemon =>
            pokemon.types.some(type => type.type.name === selectedType)
        );
    }

    displayFilteredPokemon(filteredPokemon);
});

function displayFilteredPokemon(filteredPokemon) {
    pokemonList.innerHTML = '';
    filteredPokemon.forEach(pokemon => {
        const card = createPokemonCard(pokemon);
        pokemonList.appendChild(card);
    });
}

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


fetchPokemonTypes();
fetchPokemonData();
