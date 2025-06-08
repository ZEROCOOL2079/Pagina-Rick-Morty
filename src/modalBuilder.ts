import { getNameUrl } from "./apiService.js";

const modalDiv = document.querySelector("#modal-div");
const closeBtn = modalDiv.querySelector(".close-button");
const modalDetailsContainer = modalDiv.querySelector("#modal-details-container");

/**
 * Muestra el modal haciendo que su estilo de visualización sea "flex".
 * @function
 * @returns {void}
 */
function showModal() {
    modalDiv.style.display = "flex";
}

/**
 * Oculta el modal y limpia su contenido.
 * Establece el estilo de visualización del modal a "none" y vacía el HTML de su contenedor de detalles.
 * @function
 * @returns {void}
 */
function hideModal() {
    modalDiv.style.display = "none";
    modalDetailsContainer.innerHTML = "";
}

closeBtn.addEventListener("click", hideModal);

window.addEventListener("click", (e) => {
    if (e.target === modalDiv) {
        hideModal();
    }
});

/**
 * Muestra un modal con los detalles de un personaje específico.
 * Incluye información como nombre, estado, especie, género, origen, última ubicación conocida
 * y una lista de los episodios en los que aparece.
 * @async
 * @function
 * @param {object} character - El objeto personaje con sus propiedades.
 * @param {string} character.name - El nombre del personaje.
 * @param {string} character.imageUrl - La URL de la imagen del personaje.
 * @param {string} character.status - El estado del personaje (Alive, Dead, Unknown).
 * @param {string} character.species - La especie del personaje.
 * @param {string} character.gender - El género del personaje.
 * @param {string} character.origin - El origen del personaje.
 * @param {string} character.location - La última ubicación conocida del personaje.
 * @param {string[]} character.episodes - Un array de URLs de los episodios en los que aparece el personaje.
 * @returns {Promise<void>}
 */
export async function modalCharacters(character) {
    let statusCharacter;
    if (character.status === "Alive") {
        statusCharacter = "circle-status alive";
    } else if (character.status === "Dead") {
        statusCharacter = "circle-status dead";
    } else {
        statusCharacter = "circle-status unknown";
    }

    const allEpisodesNames = await getNameUrl(character.episodes);
    const episodesNames = allEpisodesNames
        .map(name => `<span class="character-chip">${name}</span>`)
        .join("");

    modalDetailsContainer.innerHTML = `
        <div class="modal-header">
            <h2>${character.name}</h2>
        </div>
        <div class="modal-body">
            <div class="modal-img-container">
                <img src="${character.imageUrl}" alt="${character.name}" />
            </div>
            <div class="modal-info-details">
                <p><strong class="text-grey">Status:</strong> <span class="${statusCharacter}" style="margin-bottom: 2.5px;"></span>${character.status}</p>
                <p><strong class="text-grey">Species:</strong> ${character.species}</p>
                <p><strong class="text-grey">Gender:</strong> ${character.gender}</p>
                <p><strong class="text-grey">Origin:</strong> ${character.origin}</p>
                <p><strong class="text-grey">Last known location:</strong> ${character.location}</p>
                <div class="modal-episode-section">
                    <h3 class="text-grey">Appears in the episodes:</h3>
                    <div class="characters-list-container modal-characters-list">
                        ${episodesNames}
                    </div>
                </div>
            </div>
        </div> `;
    showModal();
}

/**
 * Muestra un modal con los detalles de un episodio específico.
 * Incluye información como el nombre del episodio, su código, fecha de emisión
 * y una lista de los personajes que aparecen en él.
 * @async
 * @function
 * @param {object} episode - El objeto episodio con sus propiedades.
 * @param {string} episode.name - El nombre del episodio.
 * @param {string} episode.episode - El código del episodio (ej. "S01E01").
 * @param {string} episode.air_date - La fecha de emisión del episodio.
 * @param {string[]} episode.characters - Un array de URLs de los personajes que aparecen en el episodio.
 * @returns {Promise<void>}
 */
export async function modalEpisode(episode) {
    const allCharactersNames = await getNameUrl(episode.characters);
    const charactersNames = allCharactersNames.map(name => `<span class="character-chip">${name}</span>`).join("");

    modalDetailsContainer.innerHTML = `
        <div class="modal-header">
            <h2>${episode.name}</h2>
        </div>
        <div class="modal-body">
            <p><strong class="text-grey">Episode:</strong> ${episode.episode}</p>
            <p><strong class="text-grey">Air date:</strong> ${episode.air_date}</p>
            <div class="modal-characters-section">
                <h3 class="text-grey">Characters in episode:</h3>
                <div id="modal-characters-list" class="characters-list-container modal-characters-list">
                    ${charactersNames}
                </div>
            </div>
        </div>
    `;
    showModal();
}