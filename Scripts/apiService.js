import { Character, Episode } from "./classes.js";

/**
 * Carga datos desde la API.
 * @function
 * @param {string} url - URL de la API de donde se obtendrán los datos.
 * @param {typeof Character.createFromApi | typeof Episode.createFromApi} createFromApi - Función estática para crear objetos a partir de los datos de la API.
 * @param {number} pageNumber - Número de la página de donde se obtendrán los datos.
 * @returns {Promise<{datas: Array, info: Object | null}>} Un objeto con un array de datos obtenidos y un objeto con la información de paginación.
 */
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
    } catch (error) {
        console.error(`Error al obtener datos en la página ${pageNumber}:`, error);
        return { datas: [], info: null };
    }
}

/**
 * Carga datos desde la API por IDs.
 * Gestiona la respuesta de la API cuando devuelve un array de objetos o un solo objeto,
 * y adapta la información de paginación para este caso.
 * @function
 * @param {string} url - URL de la API donde se obtendrán los datos por ID.
 * @param {typeof Character.createFromApi | typeof Episode.createFromApi} createFromApi - Función estática para crear objetos a partir de los datos de la API.
 * @returns {Promise<{datas: Array, info: Object}>} Un objeto con un array de datos obtenidos y un objeto con la información de paginación (simplificada para IDs).
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
    } catch (error) {
        console.error(`Error al obtener datos por ID desde ${url}:`, error);
        return { datas: [], info: paginationInfo };
    }
}

/**
 * Agrega un filtro de nombre a la URL.
 * @param {string} url - La URL base.
 * @param {string} name - El nombre a filtrar.
 * @returns {string} La URL con el filtro de nombre añadido.
 */
function addName(url, name) {
    if (name && name.trim() !== "") {
        return `${url}&name=${name.trim()}`;
    }
    return url;
}

/**
 * Agrega un filtro de estado a la URL.
 * @param {string} url - La URL base.
 * @param {string} status - El estado a filtrar.
 * @returns {string} La URL con el filtro de estado añadido.
 */
function addStatus(url, status) {
    if (status && status.trim() !== "") {
        return `${url}&status=${status.trim()}`;
    }
    return url;
}

/**
 * Obtiene personajes y su información de paginación, aplicando filtros si es necesario.
 * @param {number} pageNumber - Número de la página de donde se obtendrán los datos.
 * @param {object} filters - Objeto que contendrá los filtros a aplicar (name, status).
 * @param {string} [filters.name] - Nombre del personaje a filtrar.
 * @param {string} [filters.status] - Estado del personaje a filtrar.
 * @returns {Promise<{characters: Character[], info: Object | null}>} Un objeto con un array de objetos Character y la información de paginación.
 */
export async function getCharacters(pageNumber, filters) {
    let url = `https://rickandmortyapi.com/api/character/?page=${pageNumber}`;

    url = addName(url, filters.name);
    url = addStatus(url, filters.status);

    const { datas, info } = await loadDataFromApi(
        url,
        Character.createFromApi,
        pageNumber
    );
    return { characters: datas, info: info };
}

/**
 * Obtiene episodios y su información de paginación, aplicando filtros si es necesario.
 * @param {number} pageNumber - Número de la página de donde se obtendrán los datos.
 * @param {object} filter - Objeto que contendrá el filtro de nombre.
 * @param {string} [filter.name] - Nombre del episodio a filtrar.
 * @returns {Promise<{episodes: Episode[], info: Object | null}>} Un objeto con un array de objetos Episode y la información de paginación.
 */
export async function getEpisode(pageNumber, filter) {
    let url = `https://rickandmortyapi.com/api/episode?page=${pageNumber}`;
    url = addName(url, filter.name);

    const { datas, info } = await loadDataFromApi(
        url,
        Episode.createFromApi,
        pageNumber
    );
    return { episodes: datas, info: info };
}

/**
 * Obtiene los nombres de los elementos (personajes/episodios) a partir de un array de URLs.
 * @param {string[]} arrayUrls - Un array de URLs de la API.
 * @returns {Promise<string[]>} Un array con los nombres de los elementos.
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
        } catch (error) {
            console.error("Error al obtener el nombre del personaje:", error);
            return "Error en personaje";
        }
    });

    const charactersName = await Promise.all(namePromises);
    console.log(`charactersNames: ${charactersName}`)
    return charactersName;
}

/**
 * Obtiene uno o varios personajes por sus IDs.
 * @param {number | number[]} characterIds - Un solo ID o un array de IDs de personajes.
 * @returns {Promise<{characters: Character[], info: Object}>} Un objeto con un array de objetos Character y un objeto de información (simplificado).
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
 * Obtiene uno o varios episodios por sus IDs.
 * @param {number | number[]} episodeIds - Un solo ID o un array de IDs de episodios.
 * @returns {Promise<{episodes: Episode[], info: Object}>} Un objeto con un array de objetos Episode y un objeto de información (simplificado).
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