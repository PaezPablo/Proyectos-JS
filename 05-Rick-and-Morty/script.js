
const container = document.querySelector('.allCharacters');
const navList = document.querySelector('.nav-list');
const searchInput = document.querySelector('#search-input');
const loader = document.querySelector('#loader');
const btnNext = document.querySelector('#btn-next');
const btnPrev = document.querySelector('#btn-prev');
const pageText = document.querySelector('#page-info');

let currentPage = 1;
let nextURL = '';
let prevURL = '';
let searchTimer;

let characters = [];

const cargarPersonajes = async (url = 'https://rickandmortyapi.com/api/character') => {
    try {

        loader.style.display = 'block';
        container.style.display = 'none';

        const res = await fetch(url);

        if (!res.ok) throw new Error('No se encontro nada...')

        const data = await res.json();

        characters = data.results;

        nextURL = data.info.next;
        prevURL = data.info.prev;

        loader.style.display = 'none';
        container.style.display = 'grid';

        mostrarPersonajes(characters);
        actualizarBtn();
    } catch (error) {
        console.error('Error cargando la API:', error);
        loader.style.display = 'none';
        container.style.display = 'grid';

        nextURL = null;
        prevURL = null;
        mostrarPersonajes([]);
        actualizarBtn()
    }
}

const mostrarPersonajes = (lista) => {

    if (lista.length === 0) {
        container.innerHTML = `
            <div style = 'grid-column: 1/-1; text-align: center; padding: 3rem;'>
                <h2 style = 'color: var(--morty-yellow);'>No se Encontraron personajes.....</h2>
                <p>Intenta con otra busqueda o categoria.</p>
            </div>
        `;
        return;
    };

    const cardsHTML = lista.map(personaje => {
        const statusClass = personaje.status.toLowerCase()

        return `
            <div class="character-card">
                <div class="card-image">
                    <img src='${personaje.image}' alt='${personaje.name}'>
                </div>
                <div class="card-info">
                    <h3>${personaje.name}</h3>
                    <p class="status"><span class='circle ${statusClass}'></span>
                    ${personaje.status} - ${personaje.species}
                    </p>
                    <p class="label">Last known location: </p>
                    <p class="value">${personaje.location.name}</p>
                </div>
            </div>
        `
    }).join('')

    container.innerHTML = cardsHTML;
}


navList.addEventListener('click', (event) => {
    if (!event.target.classList.contains('btn')) return;
    searchInput.value = ''
    event.preventDefault();

    const claseFiltro = event.target.classList[1].toLowerCase();

    if (claseFiltro === 'all') return mostrarPersonajes(characters);

    const mapEspecies = {
        'humans': 'human',
        'aliens': 'alien',
        'animals': 'animal'
    };

    const especieBuscada = mapEspecies[claseFiltro] || claseFiltro;

    const filtrados = characters.filter(p => p.species.toLowerCase() === especieBuscada)
    mostrarPersonajes(filtrados)
})

searchInput.addEventListener('input', (event) => {
    const valor = event.target.value.toLowerCase();

    clearTimeout(searchTimer);

    searchTimer = setTimeout(() => {
        currentPage = 1;

        if (valor === '') {
            cargarPersonajes();
        } else {

            cargarPersonajes(`https://rickandmortyapi.com/api/character/?name=${valor}`);
        }
    }, 500);
});


btnNext.addEventListener('click', (evernt) => {
    if (nextURL) {
        currentPage++;
        cargarPersonajes(nextURL)
        window.scrollTo(0, 0)
    }
});

btnPrev.addEventListener('click', (evernt) => {
    if (prevURL) {
        currentPage--;
        cargarPersonajes(prevURL)
        window.scrollTo(0, 0)
    }
});

const actualizarBtn = () => {
    pageText.innerText = `Pagina ${currentPage}`;
    btnPrev.disabled = !prevURL;
    btnNext.disabled = !nextURL;
}


cargarPersonajes();
