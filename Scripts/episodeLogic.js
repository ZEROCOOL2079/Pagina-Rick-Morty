import { getEpisode } from './apiService.js';
import { createEpisodeCard, clearCardContainer, updatePagination, disablePagination } from './viewBuilder.js';
import { modalEpisode } from './modalBuilder.js';
import { changeFavorite, isFavorite } from './favoriteStorage.js';

let currentPage = 1;
let totalPages = 1;
let currentNameFilter = "";
let showFavoritesOnly = false;

async function render(page) {
    const cardContainer = document.getElementById("card-container");
    if (!cardContainer) {
        console.error("No se encontró el contenedor de tarjetas de episodios.");
        return;
    }

    disablePagination();

    const filters = {
        name: currentNameFilter
    };

    const { episodes: allEpisodes, info } = await getEpisode(page, filters);

    let episodesToRender = allEpisodes;

    if (showFavoritesOnly) {
        episodesToRender = allEpisodes.filter(episode => isFavorite(episode.id, 'Episode'));
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

    if (episodesToRender && episodesToRender.length > 0) {
        for (const episode of episodesToRender) {
            const cardElement = createEpisodeCard(episode);

            const favBtn = cardElement.querySelector(".favorite-button");
            if (favBtn) {
                if (isFavorite(episode.id, "Episode")) {
                    favBtn.classList.add("active")
                }

                favBtn.addEventListener("click", e => {
                    e.stopPropagation()
                    changeFavorite(episode.id, "Episode", favBtn)
                    if (showFavoritesOnly) {
                        render(currentPage);
                    }
                })
            }

            cardElement.addEventListener("click", () => modalEpisode(episode));
            cardContainer.appendChild(cardElement);
        }
    } else {
        cardContainer.innerHTML = "<p>No se encontraron episodios con los filtros aplicados.</p>";
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

function setupEpisodeFilters() {
    const episodeNameFilterInput = document.getElementById("episodeNameFilter");
    const filterEpisodesByNameButton = document.getElementById("filterEpisodesByNameButton");
    const favoritesButton = document.querySelector(".favoritesBtnContainer .buttonShowFavorites");

    if (filterEpisodesByNameButton && episodeNameFilterInput) {
        filterEpisodesByNameButton.addEventListener("click", () => {
            currentNameFilter = episodeNameFilterInput.value.trim();
            showFavoritesOnly = false;
            currentPage = 1;
            render(currentPage);
        });

        episodeNameFilterInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                filterEpisodesByNameButton.click();
            }
        });
    }

    if (favoritesButton) {
        favoritesButton.addEventListener("click", () => {
            showFavoritesOnly = !showFavoritesOnly;
            currentPage = 1;
            currentNameFilter = "";
            if (episodeNameFilterInput) episodeNameFilterInput.value = "";
            render(currentPage);
        });
    }
}

async function initializeEpisodesPage() {
    setupPagination();
    setupEpisodeFilters();
    await render(currentPage);
}

document.addEventListener("DOMContentLoaded", initializeEpisodesPage);