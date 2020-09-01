//DOM Variables
const mainScreen = document.querySelector('.main-screen');
const pokeName = document.querySelector('.poke-name');
const pokeID = document.querySelector('.poke-id');
const pokeFront = document.querySelector('.poke-front-image');
const pokeBack = document.querySelector('.poke-back-image');
const pokeTypeOne = document.querySelector('.poke-type-one');
const pokeTypeTwo = document.querySelector('.poke-type-two');
const pokeAbilityOne = document.querySelector('.poke-ability-one');
const pokeAbilityTwo = document.querySelector('.poke-ability-two');
const pokeWeight = document.querySelector('.poke-weight');
const pokeHeight = document.querySelector('.poke-height');
const pokeListItems = document.querySelectorAll('.list-item');
const leftButton = document.querySelector('.left-button');
const rightButton = document.querySelector('.right-button');

//Pokemon Types
const TYPES = [
    'normal', 'fighting', 'flying',
    'poison', 'ground', 'rock', 
    'bug', 'ghost', 'steel', 
    'fire', 'water', 'grass', 
    'electric', 'psychic', 'ice',
    'dragon', 'dark', 'fairy'
]

let prevUrl = null;
let nextUrl = null;

//Functions
const capitalize = (str) => str[0].toUpperCase() + str.substr(1);

const resetScreen = () =>{
    mainScreen.classList.remove('hide');
    for(type of TYPES){
        mainScreen.classList.remove(type);
    }
}

const fetchPokeList = (url) =>{
    fetch(url)
    .then(res=> res.json())
    .then(data =>{
        console.log(data);

        const { results, next, previous } = data;
        prevUrl = previous;
        nextUrl = next;

        for(let i = 0; i < pokeListItems.length; i++){
            const pokeListItem = pokeListItems[i];
            const resultData = results[i];

            if(resultData){
                const { name, url } = resultData;
                const urlArray = url.split('/');
                const id = urlArray[urlArray.length - 2];
                pokeListItem.textContent = id + '. ' + capitalize(name);
            }
            else{
                pokeListItem = '';
            }
        }

    });
};

const fetchPokeData = (id) =>{
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then(res => res.json())
    .then(data =>{
        //console.log(data);
        resetScreen();

        const pokeTypes = data['types'];
        const pokeFirstType = pokeTypes[0];
        const pokeSecondType = pokeTypes[1];
        pokeTypeOne.textContent = capitalize(pokeFirstType['type']['name']);

        const pokeAbilities = data['abilities'];
        const pokeFirstAbility = pokeAbilities[0];
        const pokeSecondAbility = pokeAbilities[1];
        pokeAbilityOne.textContent = capitalize(pokeFirstAbility['ability']['name']);

        if(pokeSecondType){
            pokeTypeTwo.classList.remove('hide');
            pokeTypeTwo.textContent = capitalize(pokeSecondType['type']['name']);
        }
        else{
            pokeTypeTwo.classList.add('hide');
            pokeTypeTwo.textContent = '';
        }

        if(pokeSecondAbility){
            pokeAbilityTwo.classList.remove('hide');
            pokeAbilityTwo.textContent = capitalize(pokeSecondAbility['ability']['name']);
        }
        else{
            pokeAbilityTwo.classList.add('hide');
            pokeAbilityTwo.textContent = '';
        }

        mainScreen.classList.add(pokeFirstType['type']['name']);

        pokeName.textContent = capitalize(data['name']);
        pokeID.textContent = "#" + data['id'].toString().padStart(3, '0');
        pokeWeight.textContent = data['weight'];
        pokeHeight.textContent = data['height'];
        pokeFront.src = data['sprites']['front_default'] || '';
        pokeBack.src = data['sprites']['back_default'] || '';

    })
}

const handleRightButton = () =>{
    if(nextUrl){
        fetchPokeList(nextUrl);
    }
}

const handleLeftButton = () =>{
    if(prevUrl){
        fetchPokeList(prevUrl);
    }
}

const handleListItem = (e) =>{
    if(!e.target){
        return; 
    }

    const listItem = e.target;
    if(!listItem.textContent){
        return; 
    }

    const id = listItem.textContent.split('.')[0];
    fetchPokeData(id);
}

//Event listeners
leftButton.addEventListener('click', handleLeftButton);
rightButton.addEventListener('click', handleRightButton);

for(pokeListItem of pokeListItems){
    pokeListItem.addEventListener('click', handleListItem);
}

//Initialize
fetchPokeList('https://pokeapi.co/api/v2/pokemon?offset=0limit=20');
