import { Character, Episode } from "./classes.js";
async function loadDataFromApi(url, createFromApi, pageNumber) {
    let dataList = [];
    let paginationInfo = null;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error HTTP! estado: ${response.status}`);
        }
        const data = await response.json();
        paginationInfo = data.info;
        data.results.forEach((item) => {
            dataList.push(createFromApi(item));
        });
        return { datas: dataList, info: paginationInfo };
    }
    catch (error) {
        console.error(`Error al obtener datos en la página ${pageNumber}:`, error);
        return { datas: [], info: null };
    }
}
/**
 * @function
 * @param {string} url
 * @param {CreateFromApiFunction<Character | Episode>} createFromApi
 * @returns {Promise<ApiResponse<Character | Episode>>}
 */
async function loadDataFromApiByIds(url, createFromApi) {
    let dataList = [];
    let paginationInfo = { count: 0, pages: 0, next: null, prev: null };
    try {
        const response = await fetch(url);
        if (!response.ok) {
            if (response.status === 404) {
                console.warn(`No se encontraron elementos para la URL: ${url}`);
                return { datas: [], info: paginationInfo };
            }
            throw new Error(`Error HTTP! estado: ${response.status}`);
        }
        const data = await response.json();
        const items = Array.isArray(data) ? data : [data];
        items.forEach((item) => {
            dataList.push(createFromApi(item));
        });
        paginationInfo = {
            count: dataList.length,
            pages: 1,
            next: null,
            prev: null
        };
        return { datas: dataList, info: paginationInfo };
    }
    catch (error) {
        console.error(`Error al obtener datos por ID desde ${url}:`, error);
        return { datas: [], info: paginationInfo };
    }
}
/**
 * @param {string} url
 * @param {string | undefined} name
 * @returns {string}
 */
function addName(url, name) {
    if (name && name.trim() !== "") {
        return `${url}&name=${name.trim()}`;
    }
    return url;
}
/**
 * @param {string} url
 * @param {string | undefined} status
 * @returns {string}
 */
function addStatus(url, status) {
    if (status && status.trim() !== "") {
        return `${url}&status=${status.trim()}`;
    }
    return url;
}
/**
 * @param {number} pageNumber
 * @param {CharacterFilters} filters
 * @returns {Promise<{characters: Character[], info: ApiInfo | null}>}
 */
export async function getCharacters(pageNumber, filters) {
    let url = `https://rickandmortyapi.com/api/character/?page=${pageNumber}`;
    url = addName(url, filters.name);
    url = addStatus(url, filters.status);
    const { datas, info } = await loadDataFromApi(url, Character.createFromApi, pageNumber);
    return { characters: datas, info: info };
}
/**
 * @param {number} pageNumber
 * @param {EpisodeFilter} filter
 * @returns {Promise<{episodes: Episode[], info: ApiInfo | null}>}
 */
export async function getEpisode(pageNumber, filter) {
    let url = `https://rickandmortyapi.com/api/episode?page=${pageNumber}`;
    url = addName(url, filter.name);
    const { datas, info } = await loadDataFromApi(url, Episode.createFromApi, pageNumber);
    return { episodes: datas, info: info };
}
/**
 * @param {string[]} arrayUrls
 * @returns {Promise<string[]>}
 */
export async function getNameUrl(arrayUrls) {
    const namePromises = arrayUrls.map(async (url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error HTTP! estado: ${response.status}`);
            }
            const data = await response.json();
            return data.name;
        }
        catch (error) {
            console.error("Error al obtener el nombre del personaje:", error);
            return "Error en personaje";
        }
    });
    const charactersName = await Promise.all(namePromises);
    console.log(`charactersNames: ${charactersName}`);
    return charactersName;
}
/**
 * @param {number | number[]} characterIds
 * @returns {Promise<{characters: Character[], info: SimplifiedPaginationInfo}>}
 */
export async function getCharactersByIds(characterIds) {
    if (!characterIds || (Array.isArray(characterIds) && characterIds.length === 0)) {
        return { characters: [], info: { count: 0, pages: 0, next: null, prev: null } };
    }
    const idsString = Array.isArray(characterIds) ? characterIds.join(',') : characterIds.toString();
    const url = `https://rickandmortyapi.com/api/character/${idsString}`;
    const { datas, info } = await loadDataFromApiByIds(url, Character.createFromApi);
    return { characters: datas, info: info };
}
/**
 * @param {number | number[]} episodeIds
 * @returns {Promise<{episodes: Episode[], info: SimplifiedPaginationInfo}>}
 */
export async function getEpisodesByIds(episodeIds) {
    if (!episodeIds || (Array.isArray(episodeIds) && episodeIds.length === 0)) {
        return { episodes: [], info: { count: 0, pages: 0, next: null, prev: null } };
    }
    const idsString = Array.isArray(episodeIds) ? episodeIds.join(',') : episodeIds.toString();
    const url = `https://rickandmortyapi.com/api/episode/${idsString}`;
    const { datas, info } = await loadDataFromApiByIds(url, Episode.createFromApi);
    return { episodes: datas, info: info };
}
