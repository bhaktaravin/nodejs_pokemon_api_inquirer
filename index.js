import inquirer from 'inquirer';
import dotenv from 'dotenv';
import terminalImage from 'terminal-image';

dotenv.config({ path: './.env' });

const API_URL = process.env.API_URL || 'https://pokeapi.co/api/v2';

async function viewAllPokemon() {
    const response = await fetch(`${API_URL}/pokemon?limit=100`);
    const data = await response.json();
    return data.results;
}

// Function to display the main menu
async function mainMenu() {
    const choices = [
        'View All Pokémon',
        'Search Pokémon by Name',
        'Search by Region or Game',
        'Filter Pokémon by Type',
        'Add New Pokémon',
        'Update Existing Pokémon',
        'Delete Pokémon',
        'Exit'
    ];

    const answer = await inquirer.prompt([
        {
            type: 'list',
            name: 'menuChoice',
            message: 'Select an option:',
            choices: choices
        }
    ]);

    return answer.menuChoice;
}

// Main function to run the application
async function runApp() {
    let exit = false;

    while (!exit) {
        const choice = await mainMenu();

        switch (choice) {
            case 'View All Pokémon':
                console.log('Viewing all Pokémon...');
                // Call function to view all Pokémon
                const allPokemon = await viewAllPokemon();
                console.log(allPokemon);
                break;
            case 'Search Pokémon by Name':
                console.log('Searching Pokémon by name...');
                await searchPokemonByName();
                break;
            case 'Search by Region or Game':
                console.log('Searching by region or game...');
                await searchByRegionOrGame();
                break;
            case 'Filter Pokémon by Type':
                console.log('Filtering Pokémon by type...');
                await filterPokemonByType();
                break;
            case 'Add New Pokémon':
                console.log('Adding new Pokémon...');
                // Call function to add new Pokémon
                break;
            case 'Update Existing Pokémon':
                console.log('Updating existing Pokémon...');
                // Call function to update existing Pokémon
                break;
            case 'Delete Pokémon':
                console.log('Deleting Pokémon...');
                // Call function to delete Pokémon
                break;
            case 'Exit':
                exit = true;
                console.log('Exiting application. Goodbye!');
                break;
            default:
                console.log('Invalid choice. Please try again.');
        }
    }
}

// Function to search Pokemon by region or game
async function searchByRegionOrGame() {
    try {
        const searchChoice = await inquirer.prompt([
            {
                type: 'list',
                name: 'searchType',
                message: 'What would you like to search by?',
                choices: [
                    'Region (Generation)',
                    'Game Version',
                    'Back to Main Menu'
                ]
            }
        ]);

        if (searchChoice.searchType === 'Back to Main Menu') {
            return;
        }

        if (searchChoice.searchType === 'Region (Generation)') {
            await searchByRegion();
        } else if (searchChoice.searchType === 'Game Version') {
            await searchByGame();
        }
    } catch (error) {
        console.error('Error in search menu:', error);
    }
}

// Function to search Pokemon by region/generation
async function searchByRegion() {
    try {
        const regions = [
            { name: 'Kanto (Generation I)', value: 1 },
            { name: 'Johto (Generation II)', value: 2 },
            { name: 'Hoenn (Generation III)', value: 3 },
            { name: 'Sinnoh (Generation IV)', value: 4 },
            { name: 'Unova (Generation V)', value: 5 },
            { name: 'Kalos (Generation VI)', value: 6 },
            { name: 'Alola (Generation VII)', value: 7 },
            { name: 'Galar (Generation VIII)', value: 8 },
            { name: 'Paldea (Generation IX)', value: 9 }
        ];

        const regionChoice = await inquirer.prompt([
            {
                type: 'list',
                name: 'selectedRegion',
                message: 'Select a region to explore:',
                choices: regions.map(region => region.name)
            }
        ]);

        const selectedRegion = regions.find(region => region.name === regionChoice.selectedRegion);
        
        console.log(`\n🌍 Searching for Pokémon from ${selectedRegion.name}...`);
        
        // Fetch generation data from PokeAPI
        const response = await fetch(`${API_URL}/generation/${selectedRegion.value}`);
        const generationData = await response.json();
        
        console.log(`\n📊 Generation ${selectedRegion.value} Information:`);
        console.log(`Region: ${generationData.main_region.name}`);
        console.log(`Total Pokémon species: ${generationData.pokemon_species.length}`);
        
        // Display Pokemon species from this generation
        console.log(`\n🎮 Pokémon from ${selectedRegion.name}:`);
        console.log('=' .repeat(50));
        
        for (let i = 0; i < Math.min(20, generationData.pokemon_species.length); i++) {
            const species = generationData.pokemon_species[i];
            console.log(`${i + 1}. ${species.name.charAt(0).toUpperCase() + species.name.slice(1)}`);
        }
        
        if (generationData.pokemon_species.length > 20) {
            console.log(`... and ${generationData.pokemon_species.length - 20} more Pokémon!`);
        }

        // Ask if user wants to see detailed info for a specific Pokemon
        const detailChoice = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'showDetails',
                message: 'Would you like to see detailed information for a specific Pokémon?',
                default: false
            }
        ]);

        if (detailChoice.showDetails) {
            const pokemonChoice = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'pokemonName',
                    message: 'Enter the Pokémon name:',
                    validate: input => input.trim() !== '' || 'Pokémon name cannot be empty'
                }
            ]);

            await getPokemonDetails(pokemonChoice.pokemonName.toLowerCase());
        }

    } catch (error) {
        console.error('Error searching by region:', error);
    }
}

// Function to search Pokemon by game version
async function searchByGame() {
    try {
        const games = [
            { name: 'Red/Blue/Yellow', value: 'red-blue' },
            { name: 'Gold/Silver/Crystal', value: 'gold-silver' },
            { name: 'Ruby/Sapphire/Emerald', value: 'ruby-sapphire' },
            { name: 'Diamond/Pearl/Platinum', value: 'diamond-pearl' },
            { name: 'Black/White', value: 'black-white' },
            { name: 'X/Y', value: 'x-y' },
            { name: 'Sun/Moon', value: 'sun-moon' },
            { name: 'Sword/Shield', value: 'sword-shield' },
            { name: 'Scarlet/Violet', value: 'scarlet-violet' }
        ];

        const gameChoice = await inquirer.prompt([
            {
                type: 'list',
                name: 'selectedGame',
                message: 'Select a game version:',
                choices: games.map(game => game.name)
            }
        ]);

        const selectedGame = games.find(game => game.name === gameChoice.selectedGame);
        
        console.log(`\n🎮 Searching for Pokémon from ${selectedGame.name}...`);
        
        try {
            // Try to fetch version group data
            const response = await fetch(`${API_URL}/version-group/${selectedGame.value}`);
            
            if (response.ok) {
                const versionData = await response.json();
                
                console.log(`\n📱 Game Information:`);
                console.log(`Version Group: ${versionData.name}`);
                console.log(`Generation: ${versionData.generation.name}`);
                console.log(`Versions: ${versionData.versions.map(v => v.name).join(', ')}`);
                
                // Get Pokedex for this version group
                if (versionData.pokedexes && versionData.pokedexes.length > 0) {
                    const pokedexResponse = await fetch(versionData.pokedexes[0].url);
                    const pokedexData = await pokedexResponse.json();
                    
                    console.log(`\n📖 ${pokedexData.name.toUpperCase()} Pokédex:`);
                    console.log(`Total entries: ${pokedexData.pokemon_entries.length}`);
                    console.log('=' .repeat(50));
                    
                    // Show first 20 Pokemon from this game's Pokedex
                    for (let i = 0; i < Math.min(20, pokedexData.pokemon_entries.length); i++) {
                        const entry = pokedexData.pokemon_entries[i];
                        console.log(`#${entry.entry_number.toString().padStart(3, '0')} ${entry.pokemon_species.name.charAt(0).toUpperCase() + entry.pokemon_species.name.slice(1)}`);
                    }
                    
                    if (pokedexData.pokemon_entries.length > 20) {
                        console.log(`... and ${pokedexData.pokemon_entries.length - 20} more entries!`);
                    }
                } else {
                    console.log('No specific Pokédex found for this version group.');
                }
            } else {
                console.log(`⚠️  Version group '${selectedGame.value}' not found in API.`);
                console.log('Showing generation-based results instead...');
                
                // Fallback to generation search
                const genNumber = games.indexOf(selectedGame) + 1;
                if (genNumber <= 9) {
                    const response = await fetch(`${API_URL}/generation/${genNumber}`);
                    const generationData = await response.json();
                    
                    console.log(`\n🌍 Generation ${genNumber} Pokémon (includes ${selectedGame.name}):`);
                    for (let i = 0; i < Math.min(15, generationData.pokemon_species.length); i++) {
                        const species = generationData.pokemon_species[i];
                        console.log(`${i + 1}. ${species.name.charAt(0).toUpperCase() + species.name.slice(1)}`);
                    }
                }
            }
            
        } catch (error) {
            console.error('Error fetching game data:', error);
        }

        // Ask if user wants to see detailed info for a specific Pokemon
        const detailChoice = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'showDetails',
                message: 'Would you like to see detailed information for a specific Pokémon?',
                default: false
            }
        ]);

        if (detailChoice.showDetails) {
            const pokemonChoice = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'pokemonName',
                    message: 'Enter the Pokémon name:',
                    validate: input => input.trim() !== '' || 'Pokémon name cannot be empty'
                }
            ]);

            await getPokemonDetails(pokemonChoice.pokemonName.toLowerCase());
        }

    } catch (error) {
        console.error('Error searching by game:', error);
    }
}

// Function to get detailed Pokemon information
async function getPokemonDetails(pokemonName) {
    try {
        console.log(`\n🔍 Fetching details for ${pokemonName}...`);
        
        const response = await fetch(`${API_URL}/pokemon/${pokemonName}`);
        
        if (!response.ok) {
            console.log(`❌ Pokémon '${pokemonName}' not found.`);
            return;
        }

        const pokemon = await response.json(); // Fetch once!

        // 🖼 Display Pokémon image in terminal
        const imageUrl = pokemon.sprites.front_default;
        if (imageUrl) {
            const imageResponse = await fetch(imageUrl);
            if (imageResponse.ok) {
                const arrayBuffer = await imageResponse.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                const image = await terminalImage.buffer(buffer, { width: '50%' });
                console.log(image);
            } else {
                console.log("⚠️ Couldn't fetch image.");
            }
        }

        console.log(`\n✨ ${pokemon.name.toUpperCase()} Details:`);
        console.log("=".repeat(40));
        console.log(`ID: #${pokemon.id}`);
        console.log(`Height: ${pokemon.height / 10} m`);
        console.log(`Weight: ${pokemon.weight / 10} kg`);
        console.log(`Types: ${pokemon.types.map(t => t.type.name).join(", ")}`);
        console.log(`Base Experience: ${pokemon.base_experience}`);

        console.log(`\n📊 Base Stats:`);
        pokemon.stats.forEach(stat => {
            console.log(`  ${stat.stat.name}: ${stat.base_stat}`);
        });

        console.log(`\n🎯 Abilities:`);
        pokemon.abilities.forEach(ability => {
            const hidden = ability.is_hidden ? " (Hidden)" : "";
            console.log(`  - ${ability.ability.name}${hidden}`);
        });

    } catch (error) {
        console.error("Error fetching Pokemon details:", error);
    }
}

// Function to search Pokemon by name
async function searchPokemonByName() {
    try {
        const nameChoice = await inquirer.prompt([
            {
                type: 'input',
                name: 'pokemonName',
                message: 'Enter Pokémon name to search:',
                validate: input => input.trim() !== '' || 'Name cannot be empty'
            }
        ]);

        await getPokemonDetails(nameChoice.pokemonName.toLowerCase());
    } catch (error) {
        console.error('Error searching Pokemon by name:', error);
    }
}

// Function to filter Pokemon by type
async function filterPokemonByType() {
    try {
        const types = [
            'normal', 'fire', 'water', 'electric', 'grass', 'ice',
            'fighting', 'poison', 'ground', 'flying', 'psychic',
            'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
        ];

        const typeChoice = await inquirer.prompt([
            {
                type: 'list',
                name: 'selectedType',
                message: 'Select a Pokémon type:',
                choices: types.map(type => type.charAt(0).toUpperCase() + type.slice(1))
            }
        ]);

        const selectedType = typeChoice.selectedType.toLowerCase();
        console.log(`\n🔥 Searching for ${selectedType.toUpperCase()} type Pokémon...`);
        
        const response = await fetch(`${API_URL}/type/${selectedType}`);
        const typeData = await response.json();
        
        console.log(`\n📊 Found ${typeData.pokemon.length} ${selectedType.toUpperCase()} type Pokémon:`);
        console.log('=' .repeat(50));
        
        // Show first 20 Pokemon of this type
        for (let i = 0; i < Math.min(20, typeData.pokemon.length); i++) {
            const pokemon = typeData.pokemon[i];
            console.log(`${i + 1}. ${pokemon.pokemon.name.charAt(0).toUpperCase() + pokemon.pokemon.name.slice(1)}`);
        }
        
        if (typeData.pokemon.length > 20) {
            console.log(`... and ${typeData.pokemon.length - 20} more ${selectedType} type Pokémon!`);
        }

        // Ask if user wants details for a specific Pokemon
        const detailChoice = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'showDetails',
                message: 'Would you like to see detailed information for a specific Pokémon?',
                default: false
            }
        ]);

        if (detailChoice.showDetails) {
            const pokemonChoice = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'pokemonName',
                    message: 'Enter the Pokémon name:',
                    validate: input => input.trim() !== '' || 'Pokémon name cannot be empty'
                }
            ]);

            await getPokemonDetails(pokemonChoice.pokemonName.toLowerCase());
        }
        
    } catch (error) {
        console.error('Error filtering by type:', error);
    }
}

// Start the application
runApp();