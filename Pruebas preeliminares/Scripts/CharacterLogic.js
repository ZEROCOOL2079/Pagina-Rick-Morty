import { getCharacters, getFirstEpisode } from './apiService.js';
import { createCharacterCard, clearCardContainer, updatePagination, disablePagination } from './viewBuilder.js';

let currentPage = 1;
let totalPages = 1;
let currentStatusFilter = "";
let currentNameFilter = "";

let favoriteCharacterIds = [];

function loadFavorites() {
    const favoritesJSON = localStorage.getItem('favoriteCharacters');
    if (favoritesJSON) {
        favoriteCharacterIds = JSON.parse(favoritesJSON);
    }
}

function saveFavorites() {
    localStorage.setItem('favoriteCharacters', JSON.stringify(favoriteCharacterIds));
}

function toggleFavorite(characterId) {
    const id = parseInt(characterId, 10);
    const index = favoriteCharacterIds.indexOf(id);

    if (index === -1) {
        favoriteCharacterIds.push(id);
        console.log(`Personaje con ID ${id} añadido a favoritos.`);
    } else {
        favoriteCharacterIds.splice(index, 1);
        console.log(`Personaje con ID ${id} quitado de favoritos.`);
    }
    saveFavorites();
    renderCharacters(currentPage);
}


async function renderCharacters(page) {
    disablePagination();

    const filters = {
        name: currentNameFilter,
        status: currentStatusFilter
    };

    const { characters, info } = await getCharacters(page, filters);

    clearCardContainer();

    if (characters && characters.length > 0) {
        const episodePromises = characters.map(character => getFirstEpisode(character.firstEpisodeUrl));
        const firstEpisodeNames = await Promise.all(episodePromises);

        characters.forEach((character, index) => {
            const firstEpisode = firstEpisodeNames[index];
            // NUEVO: Verifica si el personaje actual es favorito
            const isFavorite = favoriteCharacterIds.includes(character.id);
            const cardElement = createCharacterCard(character, firstEpisode, isFavorite); // Pasa isFavorite a la función de creación de tarjeta
            document.getElementById("card-container").appendChild(cardElement);
        });

        // NUEVO: Añadir event listeners a los botones de favorito después de que las tarjetas se han renderizado
        document.querySelectorAll('.favorite-toggle').forEach(button => {
            button.addEventListener('click', (event) => {
                const characterId = event.target.dataset.characterId;
                toggleFavorite(characterId);
            });
        });

    } else {
        document.getElementById("card-container").innerHTML = "<p>No se encontraron personajes con los filtros aplicados.</p>";
    }

    if (info) {
        totalPages = info.pages;
        updatePagination(info, page);
    } else {
        totalPages = 1;
        updatePagination({ prev: null, next: null, pages: 1 }, page);
    }
    currentPage = page;
}

function setupPagination() {
    const prevPage = document.getElementById("prevPage");
    const nextPage = document.getElementById("nextPage");

    prevPage.addEventListener("click", () => {
        if (currentPage > 1) {
            renderCharacters(currentPage - 1);
        }
    });

    nextPage.addEventListener("click", () => {
        if (currentPage < totalPages) {
            renderCharacters(currentPage + 1);
        }
    });
}

function setupCharacterFilters() {
    const statusFilterSelect = document.getElementById("statusFilter");
    const characterNameFilterInput = document.getElementById("characterNameFilter");
    const filterCharactersByNameButton = document.getElementById("filterCharactersByNameButton");

    if (statusFilterSelect) {
        statusFilterSelect.addEventListener("change", (event) => {
            currentStatusFilter = event.target.value;
            currentPage = 1;
            renderCharacters(currentPage);
        });
    }

    if (filterCharactersByNameButton && characterNameFilterInput) {
        filterCharactersByNameButton.addEventListener("click", () => {
            currentNameFilter = characterNameFilterInput.value.trim();
            currentPage = 1;
            renderCharacters(currentPage);
        });

        characterNameFilterInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                filterCharactersByNameButton.click();
            }
        });
    }
}

async function initializeCharactersPage() {
    loadFavorites(); // Carga los favoritos al iniciar la página
    setupPagination();
    setupCharacterFilters();
    await renderCharacters(currentPage);
}

document.addEventListener("DOMContentLoaded", initializeCharactersPage);