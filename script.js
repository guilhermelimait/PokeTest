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

    async function displayPokemon(pokemonData) {
        pokemonGallery.innerHTML = '';

        if (!pokemonData || pokemonData.length === 0) {
            pokemonGallery.innerHTML = "<p>No Pokemon found.</p>";
            return;
        }

        const startIndex
