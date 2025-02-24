# Pokémon Database Explorer

A dynamic web application that allows users to explore the Pokémon universe using the PokéAPI. This interactive tool provides detailed information about Pokémon, including their stats, abilities, evolutions, and more.

![Pokémon Database Explorer Screenshot](screenshot.png)

## Features

### 1. Filtering System
- **Generation Filter**: Browse Pokémon by their generation (Gen 1 to Gen 9)
- **Type Filter**: Filter Pokémon by their type (Fire, Water, Grass, etc.)
- **Number Range**: Search for Pokémon within specific Pokédex number ranges
- **Multiple Filters**: Combine different filters for precise results

### 2. Sorting Options
- Sort by Pokédex Number
- Sort Alphabetically by Name
- Sort by Pokémon Type

### 3. Detailed Pokémon Information
Each Pokémon card displays:
- Official Artwork
- Pokédex Number
- Name
- Type(s)

### 4. Interactive Popup Details
Clicking on a Pokémon reveals:
- High-resolution Official Artwork
- Pokédex Entry/Description
- Base Stats with Visual Bars
- Type Advantages/Disadvantages
- Evolution Chain with Requirements
- Abilities with Detailed Descriptions

### 5. User Interface Features
- Responsive Design: Works on desktop and mobile devices
- Loading Animations: Visual feedback during data fetching
- Dynamic Updates: Real-time filter application
- Smooth Transitions: Enhanced user experience

## Technical Details

### Technologies Used
- HTML5
- CSS3
- JavaScript (ES6+)
- PokéAPI (https://pokeapi.co/)

### API Integration
The application uses the following PokéAPI endpoints:
- `/pokemon`: Basic Pokémon data
- `/pokemon-species`: Species information and Pokédex entries
- `/evolution-chain`: Evolution data
- `/ability`: Detailed ability descriptions

## Setup and Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/pokemon-database.git
```

2. Navigate to the project directory:
```bash
cd pokemon-database
```

3. Open `index.html` in your web browser or use a local server:
```bash
python -m http.server 8000
```


## Usage Guide

1. **Basic Navigation**
   - Scroll through the gallery to browse Pokémon
   - Click on any Pokémon card to view detailed information

2. **Using Filters**
   - Select a generation from the dropdown to view Pokémon from specific regions
   - Choose a type to filter Pokémon by their elemental type
   - Enter number ranges to find specific Pokémon by their Pokédex numbers

3. **Sorting**
   - Use the sort dropdown to organize Pokémon by number, name, or type
   - Sorting is applied while maintaining current filters

4. **Viewing Details**
   - Click any Pokémon to open the detailed view
   - Scroll through the popup to see all information
   - Click the close button or outside the popup to return to the gallery

## Performance Considerations

- The application implements debouncing for search inputs
- Images are lazy-loaded to improve initial load time
- API requests are optimized to minimize data usage

## Browser Support

Tested and compatible with:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

- Data provided by [PokéAPI](https://pokeapi.co/)
- Pokémon and all related properties are trademarks of Nintendo

## Contact

GuilhermeLimaIT - [@yourtwitter](https://twitter.com/guilhermelima)
Project Link: [https://github.com/guilhermelimait/pokemon-database](https://github.com/guilhermelimait/pokemon-database)