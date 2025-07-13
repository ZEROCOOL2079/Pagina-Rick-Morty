import { getEpisode, getEpisodesByIds } from './apiService.js';
import { createEpisodeCard, clearCardContainer, updatePagination, disablePagination } from './viewBuilder.js';
import { modalEpisode } from './modalBuilder.js';
import { changeFavorite, isFavorite, getFavorites } from './favoriteStorage.js';
let currentPage = 1;
let totalPages = 1;
let currentNameFilter = "";
let showFavoritesOnly = false;
const ITEMS_PER_PAGE_FAVORITES = 20;
let allFavoriteEpisodes = [];
/**
 * @async
 * @param {number} page
 * @returns {Promise<void>}
 */
async function render(page) {
    const cardContainer = document.getElementById("card-container");
    if (!cardContainer) {
        console.error("No se encontró el contenedor de tarjetas de episodios.");
        return;
    }
    disablePagination();
    let episodesToRender = [];
    let info = null;
    if (showFavoritesOnly) {
        const favoriteEpisodeIds = getFavorites().Episode;
        if (favoriteEpisodeIds && favoriteEpisodeIds.length > 0) {
            const response = await getEpisodesByIds(favoriteEpisodeIds);
            allFavoriteEpisodes = response.episodes;
            const startIndex = (page - 1) * ITEMS_PER_PAGE_FAVORITES;
            const endIndex = startIndex + ITEMS_PER_PAGE_FAVORITES;
            episodesToRender = allFavoriteEpisodes.slice(startIndex, endIndex);
            totalPages = Math.ceil(allFavoriteEpisodes.length / ITEMS_PER_PAGE_FAVORITES);
            updatePagination({
                count: allFavoriteEpisodes.length,
                pages: totalPages,
                prev: page > 1 ? "some-url" : null,
                next: page < totalPages ? "some-url" : null
            }, page);
        }
        else {
            allFavoriteEpisodes = [];
            episodesToRender = [];
            totalPages = 1;
            updatePagination({ count: 0, pages: 1, prev: null, next: null }, 1);
        }
    }
    else {
        const filters = {
            name: currentNameFilter
        };
        const apiResponse = await getEpisode(page, filters);
        episodesToRender = apiResponse.episodes;
        info = apiResponse.info;
        if (info) {
            totalPages = info.pages;
            updatePagination(info, page);
        }
        else {
            totalPages = 1;
            updatePagination({ prev: null, next: null, pages: 1, count: 0 }, page);
        }
    }
    clearCardContainer();
    if (episodesToRender && episodesToRender.length > 0) {
        for (const episode of episodesToRender) {
            const cardElement = createEpisodeCard(episode);
            const favBtn = cardElement.querySelector(".favorite-button");
            if (favBtn) {
                if (isFavorite(episode.id, "Episode")) {
                    favBtn.classList.add("active");
                }
                else {
                    favBtn.classList.remove("active");
                }
                favBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    changeFavorite(episode.id, "Episode", favBtn);
                    if (showFavoritesOnly) {
                        render(currentPage);
                    }
                });
            }
            cardElement.addEventListener("click", () => modalEpisode(episode));
            cardContainer.appendChild(cardElement);
        }
    }
    else {
        cardContainer.innerHTML = "<p>No se encontraron episodios con los filtros aplicados.</p>";
    }
    currentPage = page;
}
/**
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
 * @function
 * @returns {void}
 */
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
    else {
        if (!filterEpisodesByNameButton)
            console.warn("Filter Episodes By Name Button not found.");
        if (!episodeNameFilterInput)
            console.warn("Episode Name Filter Input not found.");
    }
    if (favoritesButton) {
        favoritesButton.addEventListener("click", () => {
            showFavoritesOnly = !showFavoritesOnly;
            currentPage = 1;
            currentNameFilter = "";
            if (episodeNameFilterInput)
                episodeNameFilterInput.value = "";
            render(currentPage);
        });
    }
    else {
        console.warn("Favorites button not found for episodes.");
    }
}
/**
 * @async
 * @function
 * @returns {Promise<void>}
 */
async function initializeEpisodesPage() {
    setupPagination();
    setupEpisodeFilters();
    await render(currentPage);
}
document.addEventListener("DOMContentLoaded", initializeEpisodesPage);
