import { getCharacters, getNameUrl, getCharactersByIds } from "./apiService.js";
import { createCharacterCard, clearCardContainer, updatePagination, disablePagination, } from "./viewBuilder.js";
import { modalCharacters } from "./modalBuilder.js";
import { isFavorite, changeFavorite, getFavorites } from "./favoriteStorage.js";

let currentPage = 1;
let totalPages = 1;
let currentStatusFilter = "";
let currentNameFilter = "";
let showFavoritesOnly = false;

const ITEMS_PER_PAGE_FAVORITES = 20;
let allFavoriteCharacters = [];

/**
 * Renderiza las tarjetas de personajes en el contenedor principal.
 * Gestiona la visualización de personajes normales con filtros o solo personajes favoritos con paginación local.
 * @async
 * @param {number} page - El número de página actual a renderizar.
 * @returns {Promise<void>}
 */
async function render(page) {
    const cardContainer = document.getElementById("card-container");
    if (!cardContainer) {
        console.error("No se encontró el contenedor de tarjetas de personajes.");
        return;
    }

    disablePagination();

    let charactersToRender = [];
    let info = null;

    if (showFavoritesOnly) {
        const favoriteCharacterIds = getFavorites().Character;

        if (favoriteCharacterIds && favoriteCharacterIds.length > 0) {
            const response = await getCharactersByIds(favoriteCharacterIds);
            allFavoriteCharacters = response.characters;

            const startIndex = (page - 1) * ITEMS_PER_PAGE_FAVORITES;
            const endIndex = startIndex + ITEMS_PER_PAGE_FAVORITES;
            charactersToRender = allFavoriteCharacters.slice(startIndex, endIndex);

            totalPages = Math.ceil(allFavoriteCharacters.length / ITEMS_PER_PAGE_FAVORITES);
            updatePagination({
                count: allFavoriteCharacters.length,
                pages: totalPages,
                prev: page > 1,
                next: page < totalPages
            }, page);
        } else {
            allFavoriteCharacters = [];
            charactersToRender = [];
            totalPages = 1;
            updatePagination({ count: 0, pages: 1, prev: null, next: null }, 1);
        }

    } else {
        const filters = {
            name: currentNameFilter,
            status: currentStatusFilter,
        };
        const apiResponse = await getCharacters(page, filters);
        charactersToRender = apiResponse.characters;
        info = apiResponse.info;

        if (info) {
            totalPages = info.pages;
            updatePagination(info, page);
        } else {
            totalPages = 1;
            updatePagination({ prev: null, next: null, pages: 1 }, page);
        }
    }

    clearCardContainer();

    if (charactersToRender && charactersToRender.length > 0) {
        for (const character of charactersToRender) {
            let firstEpisodeNameForCard;
            if (character.episode && character.episode.length > 0) {
                const firstEpisodeNames = await getNameUrl([character.episode[0]]);
                firstEpisodeNameForCard = firstEpisodeNames[0];
            } else {
                firstEpisodeNameForCard = "Unknown";
            }

            const cardElement = createCharacterCard(character, firstEpisodeNameForCard);

            const favBtn = cardElement.querySelector(".favorite-button");
            if (favBtn) {
                if (isFavorite(character.id, "Character")) {
                    favBtn.classList.add("active");
                } else {
                    favBtn.classList.remove("active");
                }

                favBtn.addEventListener("click", e => {
                    e.stopPropagation();
                    changeFavorite(character.id, "Character", favBtn);
                    if (showFavoritesOnly) {
                        render(currentPage);
                    }
                });
            }

            cardElement.addEventListener("click", () => modalCharacters(character));
            cardContainer.appendChild(cardElement);
        }
    } else {
        cardContainer.innerHTML =
            "<p>No se encontraron personajes con los filtros aplicados.</p>";
    }
    currentPage = page;
}

/**
 * Configura los event listeners para los botones de paginación (anterior y siguiente).
 * @function
 * @returns {void}
 */
function setupPagination() {
    const prevPage = document.getElementById("prevPage");
    const nextPage = document.getElementById("nextPage");

    if (prevPage) {
        prevPage.addEventListener("click", () => {
            if (currentPage > 1) {
                render(currentPage - 1);
            }
        });
    }

    if (nextPage) {
        nextPage.addEventListener("click", () => {
            if (currentPage < totalPages) {
                render(currentPage + 1);
            }
        });
    }
}

/**
 * Configura los event listeners para los filtros de personajes y el botón de favoritos.
 * @function
 * @returns {void}
 */
function setupCharacterFilters() {
    const statusFilterSelect = document.getElementById("statusFilter");
    const characterNameFilterInput = document.getElementById(
        "characterNameFilter"
    );
    const filterCharactersByNameButton = document.getElementById(
        "filterCharactersByNameButton"
    );
    const favoritesButton = document.querySelector(".favoritesBtnContainer .buttonShowFavorites");


    if (statusFilterSelect) {
        statusFilterSelect.addEventListener("change", (event) => {
            currentStatusFilter = event.target.value;
            showFavoritesOnly = false;
            if (characterNameFilterInput) characterNameFilterInput.value = "";
            currentPage = 1;
            render(currentPage);
        });
    }

    if (filterCharactersByNameButton && characterNameFilterInput) {
        filterCharactersByNameButton.addEventListener("click", () => {
            currentNameFilter = characterNameFilterInput.value.trim();
            showFavoritesOnly = false;
            if (statusFilterSelect) statusFilterSelect.value = "";
            currentPage = 1;
            render(currentPage);
        });

        characterNameFilterInput.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                filterCharactersByNameButton.click();
            }
        });
    }

    if (favoritesButton) {
        favoritesButton.addEventListener("click", () => {
            showFavoritesOnly = !showFavoritesOnly;
            currentPage = 1;
            currentStatusFilter = "";
            currentNameFilter = "";
            if (statusFilterSelect) statusFilterSelect.value = "";
            if (characterNameFilterInput) characterNameFilterInput.value = "";
            render(currentPage);
        });
    }
}

/**
 * Inicializa la página de personajes al configurar la paginación, los filtros y realizar el renderizado inicial.
 * @async
 * @function
 * @returns {Promise<void>}
 */
async function initializeCharactersPage() {
    setupPagination();
    setupCharacterFilters();
    await render(currentPage);
}

document.addEventListener("DOMContentLoaded", initializeCharactersPage);