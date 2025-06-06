import { getCharacters, getNameUrl } from "./apiService.js";
import {
    createCharacterCard,
    clearCardContainer,
    updatePagination,
    disablePagination,
} from "./viewBuilder.js";
import { modalCharacters } from "./modalBuilder.js";
import { isFavorite, changeFavorite } from "./favoriteStorage.js";

let currentPage = 1;
let totalPages = 1;
let currentStatusFilter = "";
let currentNameFilter = "";
let showFavoritesOnly = false;

async function render(page) {
    const cardContainer = document.getElementById("card-container");
    if (!cardContainer) {
        console.error("No se encontró el contenedor de tarjetas de personajes.");
        return;
    }

    disablePagination();

    const filters = {
        name: currentNameFilter,
        status: currentStatusFilter,
    };

    const { characters: allCharacters, info } = await getCharacters(page, filters);

    let charactersToRender = allCharacters;

    if (showFavoritesOnly) {
        charactersToRender = allCharacters.filter(character => isFavorite(character.id, 'Character'));
        totalPages = 1;
        updatePagination({ prev: null, next: null, pages: 1 }, page);
    } else {
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
            if (character.episodes && character.episodes.length > 0) {
                const firstEpisodeNames = await getNameUrl([character.episodes[0]]);
                firstEpisodeNameForCard = firstEpisodeNames[0];
            } else {
                firstEpisodeNameForCard = "Unknown";
            }

            const cardElement = createCharacterCard(character, firstEpisodeNameForCard);

            const favBtn = cardElement.querySelector(".favorite-button");
            if (favBtn) {
                if (isFavorite(character.id, "Character")) {
                    favBtn.classList.add("active")
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

async function initializeCharactersPage() {
    setupPagination();
    setupCharacterFilters();
    await render(currentPage);
}

document.addEventListener("DOMContentLoaded", initializeCharactersPage);