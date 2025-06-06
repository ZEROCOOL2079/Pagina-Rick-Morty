const favoritesKey = "rickAndMortyFavorites";

/**
 * Obtiene los elementos favoritos almacenados en el localStorage.
 * Si no hay favoritos, devuelve un objeto con arrays vacíos para 'Character' y 'Episode'.
 * @function
 * @returns {object} Un objeto que contiene arrays de IDs de personajes y episodios favoritos.
 */
function getFavorites() {
    const favorites = localStorage.getItem(favoritesKey);
    return favorites ? JSON.parse(favorites) : { Character: [], Episode: [] };
}

export { getFavorites };

/**
 * Verifica si un elemento es favorito.
 * @function
 * @param {number} id - El ID del elemento a verificar.
 * @param {string} type - El tipo de elemento ('Character' o 'Episode').
 * @returns {boolean} `true` si el elemento es favorito, `false` en caso contrario.
 */
export function isFavorite(id, type) {
    const favorites = getFavorites();
    return favorites[type] && favorites[type].includes(id);
}

/**
 * Agrega o quita un elemento de la lista de favoritos y actualiza visualmente un botón.
 * @function
 * @param {number} id - El ID del elemento a cambiar.
 * @param {string} type - El tipo de elemento ('Character' o 'Episode').
 * @param {HTMLElement} [buttonElement] - Opcional. El elemento del botón HTML para aplicar o quitar la clase 'active'.
 * @returns {void}
 */
export function changeFavorite(id, type, buttonElement) {
    let favorites = getFavorites();

    if (!favorites[type]) {
        favorites[type] = [];
    }

    const index = favorites[type].indexOf(id);

    if (index > -1) {
        favorites[type].splice(index, 1);
        if (buttonElement) {
            buttonElement.classList.remove('active');
        }
    } else {
        favorites[type].push(id);
        if (buttonElement) {
            buttonElement.classList.add('active');
        }
    }
    saveFavorites(favorites);
}

/**
 * Guarda el objeto de favoritos en el localStorage.
 * @function
 * @param {object} favorites - El objeto de favoritos a guardar.
 * @returns {void}
 */
function saveFavorites(favorites) {
    localStorage.setItem(favoritesKey, JSON.stringify(favorites));
}