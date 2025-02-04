document.addEventListener('DOMContentLoaded', () => {
    const typeFilter = document.getElementById('type-filter');
    const searchBox = document.getElementById('search-box');
    const searchButton = document.getElementById('search-button');
    const pokemonGallery = document.getElementById('pokemon-gallery');
    const prevPageButton = document.getElementById('prev-page');
    const nextPageButton = document.getElementById('next-page');

    let allPokemonData = []; // Store all fetched Pokemon data
    let filteredPokemon = []; // Store filtered Pokemon data
    let currentPage = 1;
    const pokemonPerPage = 10; // Adjust as needed

    // Fetch Pokemon types and populate the filter dropdown
    fetch('https://pokeapi.co/api/v2/type') // Replace with your API endpoint
        .then(response => response.json())
        .then(data => {
            data.results.forEach(type => {
                const option = document.createElement('option');
                option.value = type.name;
                option.textContent = type.name;
                typeFilter.appendChild(option);
            });
        });

    // Function to fetch and display Pokemon data
    async function fetchPokemonData(url) {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }

    async function displayPokemon(pokemonData) {
        pokemonGallery.innerHTML = ''; // Clear previous cards
        pokemonData.forEach(async pokemon => {
            const pokemonDetails = await fetchPokemonData(pokemon.url);
            const card = createPokemonCard(pokemonDetails);
            pokemonGallery.appendChild(card);
        });
    }

    function createPokemonCard(pokemon) {
        const card = document.createElement('div');
        card.classList.add('pokemon-card');

        const image = document.createElement('img');
        image.src = pokemon.sprites.front_default; // Or other sprite as needed
        image.alt = pokemon.name;
        card.appendChild(image);

        const name = document.createElement('h3');
        name.textContent = pokemon.name;
        card.appendChild(name);

        const type = document.createElement('span');
        type.classList.add('type-badge', `${pokemon.types[0].type.name}-type`); // Add type-specific class
        type.textContent = pokemon.types[0].type.name; // Display the first type
        card.appendChild(type);

        // Add other details (number, weight, height) as needed
        const number = document.createElement('p');
        number.textContent = ` #${pokemon.id}`;
        card.appendChild(number);
        const weight = document.createElement('p');
        weight.textContent = `Weight: ${pokemon.weight / 10} kg`;
        card.appendChild(weight);
        const height = document.createElement('p');
        height.textContent = `Height: ${pokemon.height / 10} m`;
        card.appendChild(height);

        return card;
    }

    // Initial Pokemon fetch and display (you'll need to adapt this to your API)
    fetchPokemonData('https://pokeapi.co/api/v2/pokemon?limit=1000') // Fetch a reasonable number of Pokemon
        .then(data => {
            allPokemonData = data.results;
            filteredPokemon = allPokemonData;
            displayPokemon(filteredPokemon.slice(0, pokemonPerPage));
        });

    // Event listeners for filtering and search (to be implemented)
    typeFilter.addEventListener('change', () => { /* Filter by type */ });
    searchButton.addEventListener('click', () => { /* Search by name */ });

    // Pagination logic (to be implemented)
    prevPageButton.addEventListener('click', () => { /* Go to previous page */ });
    nextPageButton.addEventListener('click', () => { /* Go to next page */ });
});
