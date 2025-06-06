import { Character, Episode } from "./classes.js";

/**
 * @function - Esta funcion hara el proceso de cargar los datos que vienen desde la api
 * @param {string} url - url de la api donde se obtendran los datos
 * @param {typeof Character.createFromApi | typeof Episode.createFromApi} createFromApi - funcion estatica que viene de las clases y creara los objetos
 * @param {number} pageNumber - Numero de la pagina de donde se obtendran los datos
 * @returns - Un objeto que contendra lo siguiente: un array con los datos obtenidos y un objeto con la informacion de paginacion (info)
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

function addName(url, name) {
    if (name && name.trim() !== "") {
        return `${url}&name=${name.trim()}`;
    }
    return url;
}

function addStatus(url, status) {
    if (status && status.trim() !== "") {
        return `${url}&status=${status.trim()}`;
    }
    return url;
}

/**
 * Funcion para obtener los personajes y la informacion de paginacion que venga, ademas se usaran funciones auxiliares para agregar cualquier filtro necesario
 * @param {number} pageNumber - numero de la pagina, de donde se obtendran los datos, de manera predeterminada, se obtendran los datos de la primera pagina
 * @param {object} filters - Objeto que obtendra los filtros que se usaran por si habra un proceso de filtrado
 * @returns - Un objeto que tendra: un array donde estan los objetos character y  la informacion de paginacion
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
