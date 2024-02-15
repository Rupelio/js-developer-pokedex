const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');
const pokemonPage = document.getElementById('pokemonPage');
let modal = document.querySelector('.modal')
let pokedexList = [];
const maxRecords = 151
const limit = 10;
let offset = 0;


function loadPokemonItens(offset, limit){
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        pokedexList.push(pokemons)
        pokemonList.innerHTML += pokemons.map((pokemon) => `
        <button id="${pokemon.number}" class="pokemon-card" onclick="openModal(${pokemon.number})">
            <li class="pokemon ${pokemon.type}">
                <span class="number ">#${pokemon.number}</span>
                <span class="name">${pokemon.name}</span>
                <div class="detail">
                    <ol class="types">
                        ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                    </ol>
                    <img src="${pokemon.photo}" alt="${pokemon.name} image">
                </div>
            </li>
        </button>
        `).join('')
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit;
    const qtdRecordNextPage = offset + limit;

    if (qtdRecordNextPage >= maxRecords){
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }

})

function catchPokemon(pokemonId){
    let page = parseInt((pokemonId-1) / limit);
    let index = (pokemonId-1) % limit;
    let pokemon = pokedexList[page][index];
    return pokemon
}

function openModal(pokemonId) {
    let page = parseInt((pokemonId-1) / limit);
    let index = (pokemonId-1) % limit;
    let pokemon = catchPokemon(pokemonId);
    const newModal = buildModal(pokemon);
    modal.style.display = 'block';
    modal.classList.add(`${pokemon.type}`);    
    modal.innerHTML += newModal;

    //Monta informações iniciais menu
    let menuInfo = document.querySelector('.infoModal');
    let elements = document.querySelectorAll('.menuModal button');
    let id;

    elements.forEach (e => {
        if (e.classList.contains("selected")) 
            id = e.id
    })
    
    let msg = details(pokemonId);
    menuInfo.innerHTML = msg;

    //Esconde a barra de rolagem do corpo da página
    let content = document.querySelector('body');
    content.style.overflowY  = 'hidden';
}

//Função fechar botão mensagem de alerta do favorito
function showPopUp(){
	popup.style.display="flex";

    setTimeout(closePopUp, 4000)
}

function closePopUp(){
	popup.style.display="none";    
}

//Fecha janela Modal
function closeModal(pokemonId) {
    let pokemon = catchPokemon(pokemonId);

    modal.classList.remove(`${pokemon.type}`);
    modal.style.display = "none";
    modal.innerHTML = "";

    closePopUp();

    //Volta a barra de rolagem do corpo da página
    let content = document.querySelector('body');
    content.style.overflowY  = 'scroll';
}

//Constrói a janela modal
function buildModal(pokemon) {
    return `
    <div class="header">
        <div class="buttons">
        <div class="back">
            <button onclick="closeModal(${pokemon.number})">
                <img src="./assets/img/arrow.png" alt="Voltar">
            </button>
        </div>
        </div>
        <div class="infos">
            <div class="detail">
                <span class="name">${pokemon.name}</span>
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>
            </div>

            <span class="number">#${pokemon.number}</span>
        </div>

        <div class="photo">
            <img src="${pokemon.photo}" alt="${pokemon.name}">
        </div>
    </div>

    <div class="detailsModal">
        <ul class="menuModal">
            <button id="menu1" class="selected" onclick="menuSelector('menu1', '${pokemon.number}')">
                <li>About</li>
            </button>
        </ul>

        <hr>
        <div class="infoModal">
        </div>
    </div>
    `
}

function details(pokemonId){
    let pokemon = catchPokemon(pokemonId);
    return `
    <div class="infosPokemon">
    <div class="about1">
        <div><label class="text-gray">Base. Exp.</label> <label>${pokemon.baseExp} exp.</label></div>
        <div><label class="text-gray">Height</label> <label class="height">${pokemon.height}</label></div>
        <div><label class="text-gray">Weight</label> <label class="weight">${pokemon.weight}</label></div>
        <div><label class="text-gray">Abilities</label> <label class="abilities">${pokemon.abilities}</label></div>
        <div><label class="text-gray">Egg Groups</label> <label class="eggs">${pokemon.eggGroups}</label></div>
        <div><label class="text-gray">Generation</label> <label class="generation">${pokemon.generation}</label></div>
    </div>

    <div class="about2">
    <h4> Description </h4>
        <label>${pokemon.description}</label>
    </div>
    </div>
    `
}