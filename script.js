document.addEventListener('DOMContentLoaded', () => {
    const typeFilter = document.getElementById('type-filter');
    const searchBox = document.getElementById('search-box');
    const searchButton = document.getElementById('search-button');
    const pokemonGallery = document.getElementById('pokemon-gallery');
    const prevPageButton = document.getElementById('prev-page');
    const nextPageButton = document.getElementById('next-page');

    let allPokemonData = [];
    let filteredPokemon = [];
    let currentPage = 1;
    const pokemonPerPage = 9;

    // Fetch Pokemon types for the filter
    fetch('https://pokeapi.co/api/v2/type')
        .then(response => response.json())
        .then(data => {
            data.results.forEach(type => {
                const option = document.createElement('option');
                option.value = type.name;
                option.textContent = type.name;
                typeFilter.appendChild(option);
            });
        });

    // Fetch Pokemon data (Corrected)
    async function fetchPokemonData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.results || [data]; // Handle both list and single Pokemon responses
        } catch (error) {
            console.error("Error fetching Pokemon data:", error);
            pokemonGallery.innerHTML = "<p>Error loading Pokemon data. Please try again later.</p>";
            return [];
        }
    }

    // Display Pokemon cards (Corrected)
    async function displayPokemon(pokemonData) {
        pokemonGallery.innerHTML = ''; // Clear previous cards

        if (!pokemonData || pokemonData.length === 0) {
            pokemonGallery.innerHTML = "<p>No Pokemon found.</p>";
            return;
        }

        const startIndex = (currentPage - 1) * pokemonPerPage;
        const endIndex = Math.min(startIndex + pokemonPerPage, pokemonData.length);

        for (let i = startIndex; i < endIndex; i++) {
            const pokemon = pokemonData[i];
            const details = await fetchPokemonData(pokemon.url || `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
            if (details.length === 0) continue;

            const card = createPokemonCard(details[0] || details);
            pokemonGallery.appendChild(card);
        }
    }

    function createPokemonCard(pokemon) {
        const card = document.createElement('div');
        card.classList.add('pokemon-card');

        const image = document.createElement('img');
        image.src = pokemon.sprites.front_default;
        image.alt = pokemon.name;
        card.appendChild(image);

        const name = document.createElement('h3');
        name.textContent = pokemon.name;
        card.appendChild(name);

        if (pokemon.types && pokemon.types.length > 0) {
            const type = document.createElement('span');
            type.classList.add('type-badge', `${pokemon.types[0].type.name}-type`);
            type.textContent = pokemon.types[0].type.name;
            card.appendChild(type);
        }

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

    // Initial Pokemon fetch (Corrected)
    fetchPokemonData('https://pokeapi.co/api/v2/pokemon?limit=1000')
        .then(data => {
            if (data.length === 0) return;
            allPokemonData = data;

            // *** KEY FIX: Filter and display AFTER allPokemonData is set ***
            filteredPokemon = allPokemonData; // Initialize filteredPokemon
            displayPokemon(filteredPokemon);   // Display initial Pokemon

        });

    // Filter by type (Corrected)
    typeFilter.addEventListener('change', () => {
        const selectedType = typeFilter.value;
        filteredPokemon = allPokemonData.filter(pokemon => {
            if (!selectedType) return true;
            return pokemon.types.some(type => type.type.name === selectedType);
        });
        currentPage = 1; // Reset page to 1 when filtering
        displayPokemon(filteredPokemon);
    });

    // Search functionality (Corrected)
    searchButton.addEventListener('click', () => {
        const searchTerm = searchBox.value.toLowerCase();
        filteredPokemon = allPokemonData.filter(pokemon =>
            pokemon.name.toLowerCase().includes(searchTerm)
        );
        currentPage = 1; // Reset page to 1 when searching
        displayPokemon(filteredPokemon);
    });

    // Pagination (Corrected)
    prevPageButton.addEventListener('click', () => {
        currentPage--;
        if (currentPage < 1) currentPage = 1;
        displayPokemon(filteredPokemon);
    });

    nextPageButton.addEventListener('click', () => {
        currentPage++;
        const maxPages = Math.ceil(filteredPokemon.length / pokemonPerPage);
        if (currentPage > maxPages) currentPage = maxPages;
        displayPokemon(filteredPokemon);
    });
});
