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

// Add generation ranges
const generationRanges = {
    '1': { start: 1, end: 151 },    // Kanto
    '2': { start: 152, end: 251 },  // Johto
    '3': { start: 252, end: 386 },  // Hoenn
    '4': { start: 387, end: 493 },  // Sinnoh
    '5': { start: 494, end: 649 },  // Unova
    '6': { start: 650, end: 721 },  // Kalos
    '7': { start: 722, end: 809 },  // Alola
    '8': { start: 810, end: 905 },  // Galar
    '9': { start: 906, end: 1010 }  // Paldea
};

// Initialize variables
let currentPokemonList = [];
const pokemonGallery = document.getElementById('pokemon-gallery');
const generationFilter = document.getElementById('generation-filter');
const typeFilter = document.getElementById('type-filter');
const sortBySelect = document.getElementById('sort-by');
const numberFilterMin = document.getElementById('number-filter-min');
const numberFilterMax = document.getElementById('number-filter-max');

// Add event listeners
generationFilter.addEventListener('change', updateDisplay);
typeFilter.addEventListener('change', updateDisplay);
sortBySelect.addEventListener('change', updateDisplay);
numberFilterMin.addEventListener('input', function() {
    let value = this.value;
    // Only validate if there's a complete number
    if (value.length > 0) {
        let numValue = parseInt(value);
        if (numValue < 1) this.value = 1;
        if (numValue > 1010) this.value = 1010;
    }
    debouncedUpdateDisplay();
});
numberFilterMax.addEventListener('input', function() {
    let value = this.value;
    // Only validate if there's a complete number
    if (value.length > 0) {
        let numValue = parseInt(value);
        if (numValue < 1) this.value = 1;
        if (numValue > 1010) this.value = 1010;
    }
    debouncedUpdateDisplay();
});

// Increase debounce delay to 2000ms (2 seconds)
const debouncedUpdateDisplay = debounce(updateDisplay, 2000);

// Update the fetchPokemonByGeneration function to handle ranges
async function fetchPokemonByRange(start, end) {
    const pokemonList = [];
    try {
        for (let i = start; i <= end; i++) {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
            const data = await response.json();
            pokemonList.push({
                id: data.id,
                name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
                types: data.types.map(type => type.type.name),
                image: data.sprites.other['official-artwork'].front_default
            });
        }
        return pokemonList;
    } catch (error) {
        console.error('Error fetching Pokémon:', error);
        return [];
    }
}

// Add loading indicator functions
function showLoading() {
    const loadingContainer = document.createElement('div');
    loadingContainer.className = 'loading-container';
    loadingContainer.id = 'loading-screen';
    loadingContainer.innerHTML = `
        <div class="loading-spinner"></div>
        <div class="loading-text">Loading Pokémon...</div>
    `;
    document.body.appendChild(loadingContainer);
}

function hideLoading() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.remove();
    }
}

// Update the updateDisplay function to use loading indicator
async function updateDisplay() {
    showLoading(); // Show loading at the start

    const selectedGeneration = generationFilter.value;
    const selectedType = typeFilter.value;
    const minNumber = numberFilterMin.value === '' ? 1 : parseInt(numberFilterMin.value);
    const maxNumber = numberFilterMax.value === '' ? 1010 : parseInt(numberFilterMax.value);

    try {
        let pokemonList = [];
        
        // Fetch Pokémon based on generation or number range
        if (selectedGeneration === 'all') {
            pokemonList = await fetchPokemonByRange(minNumber, maxNumber);
        } else {
            const range = generationRanges[selectedGeneration];
            const start = Math.max(range.start, minNumber);
            const end = Math.min(range.end, maxNumber);
            pokemonList = await fetchPokemonByRange(start, end);
        }

        // Filter by type if needed
        if (selectedType !== 'all') {
            pokemonList = pokemonList.filter(pokemon => 
                pokemon.types.includes(selectedType)
            );
        }

        // Sort Pokemon
        const sortBy = sortBySelect.value;
        pokemonList.sort((a, b) => {
            switch(sortBy) {
                case 'number':
                    return a.id - b.id;
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'type':
                    return a.types[0].localeCompare(b.types[0]);
                default:
                    return a.id - b.id;
            }
        });

        // Display filtered and sorted Pokemon
        displayPokemon(pokemonList);
    } catch (error) {
        console.error('Error updating display:', error);
        pokemonGallery.innerHTML = '<div class="error">Error loading Pokémon. Please try again.</div>';
    } finally {
        hideLoading(); // Hide loading when done
    }
}

// Function to display Pokémon in the gallery
function displayPokemon(pokemonList) {
    const pokemonGallery = document.getElementById('pokemon-gallery');
    pokemonGallery.innerHTML = '';
    
    pokemonList.forEach(pokemon => {
        const pokemonCard = document.createElement('div');
        pokemonCard.className = 'pokemon-card';
        pokemonCard.setAttribute('data-types', pokemon.types.join(' '));
        
        const formattedNumber = `#${String(pokemon.id).padStart(3, '0')}`;
        
        pokemonCard.innerHTML = `
            <div class="pokemon-number">${formattedNumber}</div>
            <img src="${pokemon.image}" alt="${pokemon.name}">
            <h3>${pokemon.name}</h3>
            <div class="types">
                ${pokemon.types.map(type => 
                    `<span class="type ${type}">${type}</span>`
                ).join('')}
            </div>
        `;
        
        // Add click event listener for popup
        pokemonCard.addEventListener('click', async () => {
            showLoadingPopup();
            const details = await fetchPokemonDetails(pokemon.id);
            if (details) {
                showPokemonDetails(details);
            }
        });

        pokemonGallery.appendChild(pokemonCard);
    });
}

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    updateDisplay();
});

// Add to your existing fetch function to get more details
async function fetchPokemonDetails(id) {
    try {
        // Fetch basic pokemon data
        const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const pokemon = await pokemonResponse.json();

        // Fetch species data (for evolution chain and flavor text)
        const speciesResponse = await fetch(pokemon.species.url);
        const species = await speciesResponse.json();

        // Fetch evolution chain
        const evolutionResponse = await fetch(species.evolution_chain.url);
        const evolution = await evolutionResponse.json();

        return {
            pokemon,
            species,
            evolution
        };
    } catch (error) {
        console.error('Error fetching Pokémon details:', error);
        return null;
    }
}

function showLoadingPopup() {
    const popup = document.getElementById('popup');
    popup.style.display = 'flex';
    document.getElementById('popup-content').innerHTML = `
        <div class="loading">Loading Pokémon details...</div>
    `;
}

async function showPokemonDetails({ pokemon, species, evolution }) {
    const popup = document.getElementById('popup');
    const popupContent = document.getElementById('popup-content');
    const flavorText = species.flavor_text_entries
        .find(entry => entry.language.name === 'en')?.flavor_text.replace(/\f/g, ' ') || 'No description available.';

    // Process evolution chain
    const evolutionChain = processEvolutionChain(evolution.chain);
    
    // Get abilities with descriptions
    const abilities = await Promise.all(pokemon.abilities.map(async (ability) => {
        const abilityResponse = await fetch(ability.ability.url);
        const abilityData = await abilityResponse.json();
        const description = abilityData.effect_entries.find(entry => entry.language.name === 'en')?.effect || 'No description available.';
        return {
            name: ability.ability.name,
            description,
            isHidden: ability.is_hidden
        };
    }));

    // Calculate max stat for relative bar widths
    const maxStat = Math.max(...pokemon.stats.map(stat => stat.base_stat));

    popupContent.innerHTML = `
        <span class="close-button">&times;</span>
        <div class="pokemon-details">
            <div class="detail-header">
                <h2>#${String(pokemon.id).padStart(3, '0')} ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
                <div class="types">
                    ${pokemon.types.map(type => 
                        `<span class="type ${type.type.name}">${type.type.name}</span>`
                    ).join('')}
                </div>
            </div>

            <div class="basic-info">
                <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}">
                <p>${flavorText}</p>
            </div>

            <div class="stats">
                <h3>Base Stats</h3>
                ${pokemon.stats.map(stat => `
                    <div class="stat-bar">
                        <span class="stat-name">${stat.stat.name.replace('-', ' ')}</span>
                        <div class="stat-value-bar">
                            <div class="stat-value" style="width: ${(stat.base_stat / 255) * 100}%">
                                ${stat.base_stat}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="evolution-chain">
                <h3>Evolution Chain</h3>
                <div class="evolution-tree">
                    ${renderEvolutionChain(evolutionChain)}
                </div>
            </div>

            <div class="abilities">
                <h3>Abilities</h3>
                ${abilities.map(ability => `
                    <div class="ability">
                        <h4>${ability.name.replace('-', ' ')} ${ability.isHidden ? '(Hidden)' : ''}</h4>
                        <p>${ability.description}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    popup.style.display = 'flex';

    const closeButton = document.querySelector('.close-button');
    closeButton.addEventListener('click', () => {
        popup.style.display = 'none';
    });
}

function processEvolutionChain(chain) {
    const evolution = {
        name: chain.species.name,
        id: getIdFromUrl(chain.species.url),
        evolvesTo: [],
        evolutionDetails: chain.evolution_details
    };

    if (chain.evolves_to.length > 0) {
        chain.evolves_to.forEach(evo => {
            evolution.evolvesTo.push(processEvolutionChain(evo));
        });
    }

    return evolution;
}

function getIdFromUrl(url) {
    const matches = url.match(/\/(\d+)\//);
    return matches ? matches[1] : null;
}

function renderEvolutionChain(evolution) {
    let html = `
        <div class="evolution-stage">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evolution.id}.png" 
                 alt="${evolution.name}">
            <p>${evolution.name}</p>
    `;

    if (evolution.evolutionDetails && evolution.evolutionDetails.length > 0) {
        const detail = evolution.evolutionDetails[0];
        html += `<div class="evolution-details">`;
        if (detail.min_level) {
            html += `<p>Level ${detail.min_level}</p>`;
        }
        if (detail.item) {
            html += `<p>Use ${detail.item.name}</p>`;
        }
        if (detail.trigger) {
            html += `<p>${detail.trigger.name}</p>`;
        }
        html += `</div>`;
    }

    html += `</div>`;

    if (evolution.evolvesTo.length > 0) {
        html += `<div class="evolution-arrow">→</div>`;
        evolution.evolvesTo.forEach(evo => {
            html += renderEvolutionChain(evo);
        });
    }

    return html;
}

// Add this debounce function at the top of your script
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add reset button functionality
const resetButton = document.getElementById('reset-filters');

resetButton.addEventListener('click', () => {
    // Reset all filters to default values
    numberFilterMin.value = '';
    numberFilterMax.value = '';
    typeFilter.value = 'all';
    generationFilter.value = 'all';
    sortBySelect.value = 'number';

    // Update the display
    updateDisplay();
});
