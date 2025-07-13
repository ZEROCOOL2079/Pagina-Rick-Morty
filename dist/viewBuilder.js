export function clearCardContainer() {
    const cardContainer = document.getElementById("card-container");
    if (cardContainer) {
        cardContainer.innerHTML = "";
    }
    else {
        console.warn("Element with ID 'card-container' not found.");
    }
}
export function updatePagination(info, pageNumber) {
    const prevPage = document.getElementById("prevPage");
    const nextPage = document.getElementById("nextPage");
    const currentPageSpan = document.getElementById("currentPage");
    if (prevPage) {
        prevPage.disabled = info.prev === null;
    }
    else {
        console.warn("Element with ID 'prevPage' not found.");
    }
    if (nextPage) {
        nextPage.disabled = info.next === null;
    }
    else {
        console.warn("Element with ID 'nextPage' not found.");
    }
    if (currentPageSpan) {
        currentPageSpan.textContent = `Página ${pageNumber} de ${info.pages}`;
    }
    else {
        console.warn("Element with ID 'currentPage' not found.");
    }
}
export function disablePagination() {
    const prevPage = document.getElementById("prevPage");
    const nextPage = document.getElementById("nextPage");
    if (prevPage instanceof HTMLButtonElement) {
        prevPage.disabled = true;
    }
    else {
        console.warn("Element with ID 'prevPage' not found.");
    }
    if (nextPage instanceof HTMLButtonElement) {
        nextPage.disabled = true;
    }
    else {
        console.warn("Element with ID 'nextPage' not found.");
    }
}
export function createCharacterCard(character, firstEpisode) {
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card");
    cardDiv.dataset.id = character.id.toString();
    let statusClass = "";
    if (character.status === "Alive") {
        statusClass = "circle-status alive";
    }
    else if (character.status === "Dead") {
        statusClass = "circle-status dead";
    }
    else {
        statusClass = "circle-status unknown";
    }
    cardDiv.innerHTML = `
        <div class="img-container">
            <img src="${character.imageUrl}" alt="${character.name}" />
        </div>
        <div class="card-details">
            <div class="detail-section">
                <h3 class="text-name">${character.name}</h3>
                <button class="favorite-button" aria-label="Marcar como favorito">
                    <i class="fa-solid fa-star"></i>
                </button>
                <span class="status-character text-gray">
                    <span class="${statusClass}"></span>
                    ${character.status} - ${character.species}
                </span>
            </div>
            <div class="detail-section">
                <span class="text-grey">Last known location:</span>
                <h3 class="text-detail">${character.locationName}</h3>
            </div>
            <div class="detail-section">
                <span class="text-grey">First seen in:</span>
                <h3 class="text-detail">${firstEpisode}</h3>
            </div>
        </div>
    `;
    return cardDiv;
}
export function createEpisodeCard(episode) {
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card");
    cardDiv.dataset.id = episode.id.toString();
    cardDiv.innerHTML = `
        <div class="card-details">
            <div class="detail-section">
                <h3 class="text-name">${episode.name}</h3>
                <button class="favorite-button" aria-label="Marcar como favorito">
                    <i class="fa-solid fa-star"></i>
                </button>
                <span class="text-gray">${episode.episode}</span>
            </div>
            <div class="detail-section">
                <span class="text-grey">Air date:</span>
                <h3 class="text-detail">${episode.air_date}</h3>
            </div>
        </div>
    `;
    return cardDiv;
}
