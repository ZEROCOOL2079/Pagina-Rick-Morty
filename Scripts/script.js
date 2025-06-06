/**
 * Clase para la creacion del personaje
 * @class
 */
class Character {
    /**
     * @constructor - Este constructor aceptara:
     * @param {number} id 
     * @param {string} name 
     * @param {string} status 
     * @param {string} species 
     * @param {string} locationName 
     * @param {string} firstEpisodeUrl 
     * @param {string} imageUrl 
     */
    constructor(
        id,
        name,
        status,
        species,
        locationName,
        firstEpisodeUrl,
        imageUrl
    ) {
        this.id = id;
        this.name = name;
        this.status = status;
        this.species = species;
        this.location = locationName;
        this.firstEpisode = firstEpisodeUrl;
        this.image = imageUrl;
    }

    static fromApiResponse(itemData) {
        return new Character(
            itemData.id,
            itemData.name,
            itemData.status,
            itemData.species,
            itemData.location.name,
            itemData.episode[0],
            itemData.image
        );
    }
}

async function fetchAndProcess(url, pageNumber) {
    let charactersList = [];
    let paginationInfo = null;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        paginationInfo = data.info;

        for (const character of data.results) {
            const id = character.id;
            const name = character.name;
            const status = character.status;
            const species = character.species;
            const location = character.location.name;
            const characterFirstEpisodeUrl = character.episode[0];
            const characterImageUrl = character.image;

            charactersList.push(
                new Character(
                    id,
                    name,
                    status,
                    species,
                    location,
                    characterFirstEpisodeUrl,
                    characterImageUrl
                )
            );
        }
        return { characters: charactersList, info: paginationInfo };
    } catch (error) {
        console.error(`Error en la página ${pageNumber}:`, error);
        return { characters: [], info: null };
    }
}


async function getCharacter(pageNumber = 1) {
    const url = `https://rickandmortyapi.com/api/character/?page=${pageNumber}`;
    return fetchAndProcess(url, pageNumber);
}

async function getCharactersByStatus(status, pageNumber = 1) {
    if (!status) {
        console.warn("Se llamó a getCharactersByStatus sin un estado. Se buscarán todos los personajes sin filtro.");
        return getCharacter(pageNumber);
    }
    const url = `https://rickandmortyapi.com/api/character/?page=${pageNumber}&status=${status}`;
    return fetchAndProcess(url, pageNumber);
}


async function getEpisode(episodeUrl) {
    try {
        const response = await fetch(episodeUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.name;
    } catch (error) {
        console.error("Error en episode:", error);
        return "Error en episode";
    }
}

function createCard(character, firstEpisode) {
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card");

    let statusClass = "";
    if (character.status === "Alive") {
        statusClass = "circle-status alive";
    } else if (character.status === "Dead") {
        statusClass = "circle-status dead";
    } else {
        statusClass = "circle-status unknown";
    }

    cardDiv.innerHTML = `
    <div class="img-container">
      <img src="${character.image}" alt="${character.name}" />
    </div>
    <div class="card-details">
      <div class="detail-section">
        <h3 class="text-name">${character.name}</h3>
        <span class="status-character text-gray">
          <span class="${statusClass}"></span>
          ${character.status} - ${character.species}
        </span>
      </div>
      <div class="detail-section">
        <span class="text-grey">Last known location:</span>
        <h3 class="text-detail">${character.location}</h3>
      </div>
      <div class="detail-section">
        <span class="text-grey">First seen in:</span>
        <h3 class="text-detail">${firstEpisode}</h3>
      </div>
    </div>
  `;
    return cardDiv;
}

function clearCardContainer() {
    const cardContainer = document.getElementById("card-container");
    cardContainer.innerHTML = "";
}

function updatePagination(info, currentPageNum) {
    const prevPage = document.getElementById("prevPage");
    const nextPage = document.getElementById("nextPage");
    const currentPage = document.getElementById("currentPage");

    prevPage.disabled = !info.prev;
    nextPage.disabled = !info.next;
    currentPage.textContent = `Página ${currentPageNum} de ${info.pages}`;
}

function disablePaginationButtons(disableAll = false) {
    const prevPage = document.getElementById("prevPage");
    const nextPage = document.getElementById("nextPage");

    prevPage.disabled = true;
    nextPage.disabled = true;
    if (disableAll) { // Este 'if' ahora es redundante si siempre deshabilitas arriba. Puedes quitarlo si solo quieres deshabilitar siempre.
        prevPage.disabled = true;
        nextPage.disabled = true;
    }
}

let currentPage = 1;
let totalPages = 1;
let currentFilter = "";

async function renderCharacters(page) {
    disablePaginationButtons();
    let result;

    if (currentFilter) {
        result = await getCharactersByStatus(currentFilter, page);
    } else {
        result = await getCharacter(page);
    }

    const { characters, info } = result;

    clearCardContainer();
    for (const character of characters) {
        const firstEpisode = await getEpisode(character.firstEpisode);
        const cardElement = createCard(character, firstEpisode);
        document.getElementById("card-container").appendChild(cardElement);
    }
    totalPages = info.pages;
    updatePagination(info, page);
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

function setupStatusFilterListener() {
    const statusFilterSelect = document.getElementById("statusFilter");
    statusFilterSelect.addEventListener("change", (event) => {
        currentFilter = event.target.value;
        currentPage = 1;
        renderCharacters(currentPage);
    });
}

async function initialize() {
    setupPagination();
    setupStatusFilterListener();
    await renderCharacters(currentPage);
}

document.addEventListener("DOMContentLoaded", initialize);