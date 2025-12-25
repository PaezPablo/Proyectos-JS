

const listaPokemon = document.querySelector('#listaPokemon');
const botonesHeader = document.querySelectorAll('.btn-header')
botonesHeader.forEach(boton => boton.disabled = true);

let URL = "https://pokeapi.co/api/v2/pokemon/"

let pokemons = [];

Promise.all(
    Array.from({ length: 151 }, (_, i) =>
        fetch(URL + (i + 1)).then(response => response.json())
    )
).then(data => {
    pokemons = data.sort((a, b) => a.id - b.id);
    botonesHeader.forEach(boton => boton.disabled = false);
    listaPokemon.innerHTML = '';
    pokemons.forEach(mostrarPokemon);
});



const mostrarPokemon = (data) => {

    let tipos = data.types.map((type) => `<p class="${type.type.name} tipo">${type.type.name}</p>`);
    tipos = tipos.join('')

    let pokeId = data.id.toString();
    if (pokeId.length === 1) {
        pokeId = "00" + pokeId;
    } else if (pokeId.length === 2) {
        pokeId = "0" + pokeId;
    }


    const div = document.createElement("div");
    div.classList.add("pokemon")
    div.innerHTML = `
                    <p class="pokemon-id-back">#${pokeId}</p>
                    <div class="pokemon-imagen">
                        <img src="${data.sprites.other['official-artwork'].front_default}"
                            alt="${data.name}">
                    </div>
                    <div class="pokemon-info">
                        <div class="nombre-contenedor">
                            <p class="pokemon-id">#${pokeId}</p>
                            <h2 class="pokemon-nombre">${data.name}</h2>
                            <p> </p>
                        </div>
                        <div class="pokemon-tipos">
                            ${tipos}
                        </div>
                        <div class="pokemon-stats">
                            <p class="stat">${(data.height * 0.1).toFixed(1)} m</p>
                            <p class="stat">${(data.weight * 0.1).toFixed(1)} kg</p>
                        </div>

                    </div>
        `;
    listaPokemon.append(div)
}

botonesHeader.forEach(boton => boton.addEventListener('click', (event) => {
    const botonId = event.currentTarget.id;
    listaPokemon.innerHTML = '';

    pokemons.forEach(pokemon => {
        if (botonId === 'ver-todos') {
            mostrarPokemon(pokemon);
        } else {
            const tipos = pokemon.types.map(t => t.type.name);
            if (tipos.includes(botonId)) {
                mostrarPokemon(pokemon);
            }
        }
    });
}));
