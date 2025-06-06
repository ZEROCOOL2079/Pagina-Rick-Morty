import { getNameUrl } from "./apiService.js";

const modalDiv = document.querySelector("#modal-div");
const closeBtn = modalDiv.querySelector(".close-button");
const modalDetailsContainer = modalDiv.querySelector("#modal-details-container");

function showModal() {
    modalDiv.style.display = "flex";
}

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
