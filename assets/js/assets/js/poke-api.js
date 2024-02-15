
const pokeApi = {}
const official_artwork = ['official_artwork']

function convertPokeApiDetailToPokemon(pokeDetail){
    const pokemon = new Pokemon()
    pokemon.name = pokeDetail.name;
    pokemon.number = pokeDetail.id;
    pokemon.height = pokeDetail.height;
    pokemon.weight = pokeDetail.weight;
    pokemon.baseExp = pokeDetail.base_experience;
    pokemon.photo = pokeDetail.sprites.other['official-artwork'].front_default
    
    const abilities = pokeDetail.abilities.map((abilitieSlot) => abilitieSlot.ability.name)
    const [ability] = abilities;

    pokemon.abilities = abilities
    pokemon.ability = ability

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type
    
    return pokemon
}

pokeApi.getPokemonDetail = (pokemon) =>{
    return fetch(pokemon.url)
            .then((response) => response.json())
            .then(convertPokeApiDetailToPokemon)
            .then(convertPokeApiEspecialDetailsToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonDetails) => pokemonDetails)
        .catch((error) => console.error(error))
}

function convertPokeApiEspecialDetailsToPokemon(pokemon){
    const url = `https://pokeapi.co/api/v2/pokemon-species/${pokemon.number}`
    return fetch(url)
    .then((response) => response.json())
    .then((data) => {
        const filteredFlavorTextEntries = data.flavor_text_entries.filter(
            (element) => element.language.name === "en"
        );
        
        //Cria as variáveis da informações
        let description = filteredFlavorTextEntries[0].flavor_text;
        let generation = data.generation.name;
        let generationSplit = generation.split('-');
        let generationUpper = generationSplit[0].charAt(0).toUpperCase() + generationSplit[0].substring(1) + ' ' + generationSplit[1].toUpperCase();
        let evolutionSplit = data.evolution_chain.url.split('/', 7);
        let evolution = evolutionSplit[6];

        let eggsNames = data.egg_groups.map((e) => {
            return e.name;
        });

        let eggsUpper = eggsNames.map ((e) => {
            return e.charAt(0).toUpperCase() + e.substring(1);
        })

        //Insere as informações tratadas dentro da classe Pokemon
        pokemon.eggGroups = eggsUpper.join(', ');
        pokemon.generation = generationUpper;         
        pokemon.description = description.replace('', ' ');
        pokemon.evolutionChain = evolution;

        return pokemon;
    })
}
