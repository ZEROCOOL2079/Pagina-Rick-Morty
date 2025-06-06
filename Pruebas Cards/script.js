class Character {
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
}

async function getCharacter(pageNumber = 1, statusFilter = "") {
  let url = `https://rickandmortyapi.com/api/character/?page=${pageNumber}`;

  if (statusFilter) {
    url += `&status=${statusFilter}`;
  }

  let charactersList = [];
  let paginationInfo = null;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    paginationInfo = data.info;

    for (const innerHTML of data.results) {
      const id = innerHTML.id;
      const name = innerHTML.name;
      const status = innerHTML.status;
      const species = innerHTML.species;
      const location = innerHTML.location.name;
      const characterFirstEpisodeUrl = innerHTML.episode[0];
      const characterImageUrl = innerHTML.image;

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
    console.error(`Error en la pagina: ${pageNumber}:`, error);
    return { characters: [], info: null };
  }
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
    console.error("Error episode:", error);
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

function showNoCharactersMessage() {
  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML =
    "<p>No se encontraron personajes para este filtro.</p>";
}

function updatePaginationControls(info, currentPageNum) {
  const prevPage = document.getElementById("prevPage");
  const nextPage = document.getElementById("nextPage");
  const currentPage = document.getElementById("currentPage");

  prevPage.disabled = !info.prev;
  nextPage.disabled = !info.next;
  currentPage.textContent = `Página ${currentPageNum} de ${info.pages}`;
}

let currentPage = 1;
let totalPages = 1;
let currentStatusFilter = "";

async function renderCharacters(page) {
  disablePaginationButtons();
  const { characters, info } = await getCharacter(page, currentStatusFilter);

  clearCardContainer();
  for (const character of characters) {
    const firstEpisode = await getEpisode(character.firstEpisode);
    const cardElement = createCard(character, firstEpisode);
    document.getElementById("card-container").appendChild(cardElement);
  }
  totalPages = info.pages;
  updatePaginationControls(info, page);
  currentPage = page;
}

function disablePaginationButtons(disableAll = false) {
  const prevPage = document.getElementById("prevPage");
  const nextPage = document.getElementById("nextPage");

  prevPage.disabled = true;
  nextPage.disabled = true;
  if (disableAll) {
    prevPage.disabled = true;
    nextPage.disabled = true;
  }
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
    currentStatusFilter = event.target.value;
    currentPage = 1;
    renderCharacters(currentPage);
  });
}

async function initializeApp() {
  setupPagination();

  setupStatusFilterListener();
  await renderCharacters(currentPage);
}

document.addEventListener("DOMContentLoaded", initializeApp);
