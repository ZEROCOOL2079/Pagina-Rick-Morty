const favoritesKey = "rickAndMortyFavorites";
/**
 * @function
 * @returns {FavoriteList}
 */
export function getFavorites() {
    const favorites = localStorage.getItem(favoritesKey);
    return favorites ? JSON.parse(favorites) : { Character: [], Episode: [] };
}
/**
 * @function
 * @param {number} id
 * @param {'Character' | 'Episode'} type
 * @returns {boolean}
 */
export function isFavorite(id, type) {
    const favorites = getFavorites();
    return favorites[type] && favorites[type].includes(id);
}
/**
 * @function
 * @param {number} id
 * @param {'Character' | 'Episode'} type
 * @param {HTMLElement | undefined} [buttonElement]
 * @returns {void}
 */
export function changeFavorite(id, type, buttonElement) {
    let favorites = getFavorites();
    if (!favorites[type]) {
        favorites[type] = [];
    }
    const typeArray = favorites[type];
    const index = typeArray.indexOf(id);
    if (index > -1) {
        typeArray.splice(index, 1);
        if (buttonElement) {
            buttonElement.classList.remove('active');
        }
    }
    else {
        typeArray.push(id);
        if (buttonElement) {
            buttonElement.classList.add('active');
        }
    }
    saveFavorites(favorites);
}
/**
 * @function
 * @param {FavoriteList} favorites
 * @returns {void}
 */
function saveFavorites(favorites) {
    localStorage.setItem(favoritesKey, JSON.stringify(favorites));
}
