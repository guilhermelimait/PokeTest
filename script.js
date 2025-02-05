document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.getElementById('pokemon-gallery');
    const searchBox = document.getElementById('search-box');
    const typeFilter = document.getElementById('type-filter');
    const popup = document.getElementById('popup');
    const closeButton = document.querySelector('.close-button');
    const popupContent = document.getElementById('popup-content');

    let allPokemon = [];
    let filteredPokemon = [];
    const pokemonTypes = new Set();

    fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
        .then(response => response.json())
        .then(data => {
            const pokemonPromises = data.results.map(pokemon =>
                fetch(pokemon.url).then(response => response.json())
            );

            Promise.all(pokemonPromises)
                .then(pokemons => {
                    allPokemon = pokemons;
                    filteredPokemon = pokemons;
                    populateGallery(pokemons);

                    pokemons.forEach(pokemon => {
                        pokemon.types.forEach(type => pokemonTypes.add(type.type.name));
                    });

                    pokemonTypes.forEach(type => {
                        const option = document.createElement('option');
                        option.value = type;
                        option.text = type.charAt(0).toUpperCase() + type.slice(1);
                        typeFilter.appendChild(option);
                    });
                })
                .catch(error => console.error("Error fetching Pokémon data:", error)); // Error handling
        });

    searchBox.addEventListener('input', () => {
        filterPokemon();
    });

    typeFilter.addEventListener('change', () => {
        filterPokemon();
    });

    closeButton.addEventListener('click', () => {
        popup.style.display = 'none';
    });

    function populateGallery(pokemonData) {
        gallery.innerHTML = '';

        pokemonData.forEach(pokemon => {
            const card = document.createElement('div');
            card.classList.add('pokemon-card');
            card.style.background = `linear-gradient(to bottom, ${getTypeColor(pokemon.types[0].type.name)}, #f0f0f0)`;

            card.innerHTML = `
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                <h2>${pokemon.name}</h2>
                <div class="type-box type-${pokemon.types[0].type.name}">${pokemon.types[0].type.name}</div>
            `;

            card.addEventListener('click', () => {
                showPopup(pokemon);
            });

            gallery.appendChild(card);
        });
    }

    function filterPokemon() {
        const searchTerm = searchBox.value.toLowerCase();
        const selectedType = typeFilter.value;

        filteredPokemon = allPokemon.filter(pokemon => {
            const nameMatch = pokemon.name.toLowerCase().includes(searchTerm);
            const typeMatch = selectedType === 'all' || pokemon.types.some(type => type.type.name === selectedType);
            return nameMatch && typeMatch;
        });

        populateGallery(filteredPokemon);
    }

    function showPopup(pokemon) {
        const flavorTextEntry = pokemon.flavor_text_entries.find(entry => entry.language.name === 'en');
        const flavorText = flavorTextEntry ? flavorTextEntry.flavor_text : "No description available."; // Handle missing descriptions

        popupContent.innerHTML = `
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <h2>${pokemon.name}</h2>
            <p><strong>Type:</strong> ${pokemon.types.map(type => type.type.name).join(', ')}</p>
            <p><strong>Height:</strong> ${pokemon.height / 10} m</p>
            <p><strong>Weight:</strong> ${pokemon.weight / 10} kg</p>
            <p>${flavorText}</p>
        `;
        popup.style.display = 'flex';
    }

    function getTypeColor(type) {
        switch (type) {
            case 'fire': return '#FF6B6B'; // Lighter red
            case 'water': return '#63B5F6'; // Lighter blue
            case 'grass': return '#4CAF50';
            case 'poison': return '#9C27B0';
            case 'electric': return '#FFEB3B';
            case 'ground': return '#795548';
            case 'rock': return '#A1887F';
            case 'bug': return '#8BC34A';
            case 'ghost': return '#673AB7';
            case 'steel': return '#BDBDBD';
            case 'psychic': return '#E91E63';
            case 'ice': return '#00BCD4';
            case 'dragon': return '#9575CD';
            case 'dark': return '#424242';
            case 'fairy': return '#F06292';
            case 'fighting': return '#FF5722';
            case 'flying': return '#90CAF9';
            case 'normal': return '#A0A0A0';
            default: return '#CCCCCC'; // Default color
        }
    }
});
