export function clearCardContainer() {
  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = "";
}

export function updatePagination(info, pageNumber) {
  const prevPage = document.getElementById("prevPage");
  const nextPage = document.getElementById("nextPage");
  const currentPageSpan = document.getElementById("currentPage");

  prevPage.disabled = !info.prev;
  nextPage.disabled = !info.next;
  currentPageSpan.textContent = `Página ${pageNumber} de ${info.pages}`;
}

export function disablePagination() {
  const prevPage = document.getElementById("prevPage");
  const nextPage = document.getElementById("nextPage");
  prevPage.disabled = true;
  nextPage.disabled = true;
}

export function createCharacterCard(character, firstEpisode, isFavorite = false) {
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

  const favoriteClass = isFavorite ? 'favorite' : '';

  cardDiv.innerHTML = `
    <div class="img-container">
      <img src="${character.imageUrl}" alt="${character.name}" />
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
      <button class="favorite-toggle ${favoriteClass}" data-character-id="${character.id}">
        <i class="fa-solid fa-star"></i>
      </button>
    </div>
  `;
  return cardDiv;
}