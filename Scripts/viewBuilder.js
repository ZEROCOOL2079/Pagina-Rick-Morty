/**
 * Limpia el contenido del contenedor de tarjetas.
 * Elimina todos los elementos hijos del contenedor con el ID "card-container".
 * @function
 * @returns {void}
 */
export function clearCardContainer() {
  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = "";
}

/**
 * Actualiza el estado visual de la paginación.
 * Habilita o deshabilita los botones de página anterior y siguiente
 * y actualiza el texto del número de página actual.
 * @function
 * @param {object} info - Objeto con información de paginación (prev, next, pages).
 * @param {string | null} info.prev - URL de la página anterior o `null` si no hay.
 * @param {string | null} info.next - URL de la página siguiente o `null` si no hay.
 * @param {number} info.pages - Número total de páginas disponibles.
 * @param {number} pageNumber - El número de la página actual.
 * @returns {void}
 */
export function updatePagination(info, pageNumber) {
  const prevPage = document.getElementById("prevPage");
  const nextPage = document.getElementById("nextPage");
  const currentPageSpan = document.getElementById("currentPage");

  prevPage.disabled = !info.prev;
  nextPage.disabled = !info.next;
  currentPageSpan.textContent = `Página ${pageNumber} de ${info.pages}`;
}

/**
 * Deshabilita los botones de paginación (anterior y siguiente).
 * @function
 * @returns {void}
 */
export function disablePagination() {
  const prevPage = document.getElementById("prevPage");
  const nextPage = document.getElementById("nextPage");
  prevPage.disabled = true;
  nextPage.disabled = true;
}

/**
 * Crea y devuelve un elemento HTML de tarjeta para un personaje.
 * @function
 * @param {object} character - Objeto que representa un personaje.
 * @param {string} character.id - El ID único del personaje.
 * @param {string} character.name - El nombre del personaje.
 * @param {string} character.imageUrl - La URL de la imagen del personaje.
 * @param {string} character.status - El estado de vida del personaje (Alive, Dead, Unknown).
 * @param {string} character.species - La especie del personaje.
 * @param {string} character.location - La última ubicación conocida del personaje.
 * @param {string} firstEpisode - El nombre del primer episodio en el que apareció el personaje.
 * @returns {HTMLElement} El elemento `div` que representa la tarjeta del personaje.
 */
export function createCharacterCard(character, firstEpisode) {
  const cardDiv = document.createElement("div");
  cardDiv.classList.add("card");
  cardDiv.dataset.id = character.id;

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
      <img src="${character.imageUrl}" alt="${character.name}" /> </div>
    <div class="card-details">
      <div class="detail-section">
        <h3 class="text-name">${character.name}</h3>
        <button class="favorite-button" aria-label="Marcar como favorito">
          <i class="fa-solid fa-star"></i> </button>
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

/**
 * Crea y devuelve un elemento HTML de tarjeta para un episodio.
 * @function
 * @param {object} episode - Objeto que representa un episodio.
 * @param {string} episode.id - El ID único del episodio.
 * @param {string} episode.name - El nombre del episodio.
 * @param {string} episode.episode - El código del episodio (ej. "S01E01").
 * @param {string} episode.air_date - La fecha de emisión del episodio.
 * @returns {HTMLElement} El elemento `div` que representa la tarjeta del episodio.
 */
export function createEpisodeCard(episode) {
  const cardDiv = document.createElement("div");
  cardDiv.classList.add("card");
  cardDiv.dataset.id = episode.id;
  cardDiv.innerHTML = `
        <div class="card-details">
            <div class="detail-section">
              <h3 class="text-name">${episode.name}</h3>
              <button class="favorite-button" aria-label="Marcar como favorito">
                <i class="fa-solid fa-star"></i> </button>
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