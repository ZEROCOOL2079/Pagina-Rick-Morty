function getFavoritesfromLocalStorage(type) {
    const favorites = localStorage.getItem(`favorite${type}s`)
    return favorites ? JSON.parse(favorites) : {}
}

function saveFavoritesInLocalStorage(type, favorites) {
    localStorage.setItem(`favorite${type}s`, JSON.stringify(favorites))
}

let favoriteCharacters = getFavoritesfromLocalStorage("Character")
let favoriteEpisodes = getFavoritesfromLocalStorage("Episode")

export function isFavorite(id, type) {
    if (type === "Character") {
        return !!favoriteCharacters[id]
    } else {
        return !!favoriteEpisodes[id]
    }
}

export function changeFavorite(id, type, buttonFav) {
    let currentFavorites
    let storageKey

    if (type === "Character") {
        currentFavorites = favoriteCharacters
        storageKey = "Character"
    } else {
        currentFavorites = favoriteEpisodes
        storageKey = "Episode"
    }

    if (!currentFavorites[id]) {
        currentFavorites[id] = true
        buttonFav.classList.add("active")
        console.log(`${type} ${id} añadido a favoritos.`);
    } else {
        delete currentFavorites[id]
        buttonFav.classList.remove("active")
        console.log(`${type} ${id} quitado de favoritos.`);
    }
    saveFavoritesInLocalStorage(storageKey, currentFavorites);
}