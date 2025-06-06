import { Character, Episode } from "./classes.js";

async function loadDataFromApi(url, createFromApi, pageNumber) {
    let dataList = [];
    let paginationInfo = null;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            if (response.status === 404) {
                console.warn(`No se encontraron resultados para la URL: ${url}`);
                return { datas: [], info: null };
            }
            throw new Error(`Error HTTP! estado: ${response.status}`);
        }
        const data = await response.json();
        paginationInfo = data.info;
        data.results.forEach((item) => {
            dataList.push(createFromApi(item));
        });
        console.log("Datos obtenidos:", dataList);
        return { datas: dataList, info: paginationInfo };
    } catch (error) {
        console.error(`Error al obtener datos en la página ${pageNumber}:`, error);
        return { datas: [], info: null };
    }
}

export async function getCharacters(pageNumber = 1, filters = {}) {
    let url = `https://rickandmortyapi.com/api/character/?page=${pageNumber}`;

    if (filters.name && filters.name.trim() !== '') {
        url += `&name=${encodeURIComponent(filters.name.trim())}`;
    }

    if (filters.status && filters.status.trim() !== '') {
        url += `&status=${encodeURIComponent(filters.status.trim())}`;
    }

    console.log("URL de la API construida:", url);

    const { datas, info } = await loadDataFromApi(url, Character.createFromApi, pageNumber);
    return { characters: datas, info: info };
}

export async function getEpisodes(pageNumber = 1) {
    const url = `https://rickandmortyapi.com/api/episode/?page=${pageNumber}`;
    const { datas, info } = await loadDataFromApi(url, Episode.createFromApi, pageNumber);
    return { episodes: datas, info: info };
}

export async function getEpisodesByName(name, pageNumber = 1) {
    if (!name) {
        return getEpisodes(pageNumber);
    }
    const url = `https://rickandmortyapi.com/api/episode/?page=${pageNumber}&name=${encodeURIComponent(name)}`;
    const { datas, info } = await loadDataFromApi(url, Episode.createFromApi, pageNumber);
    return { episodes: datas, info: info };
}

export async function getFirstEpisode(episodeUrl) {
    try {
        const response = await fetch(episodeUrl);
        if (!response.ok) {
            throw new Error(`Error HTTP! estado: ${response.status}`);
        }
        const data = await response.json();
        return data.name;
    } catch (error) {
        console.error("Error al obtener el nombre del episodio:", error);
        return "Error en episode";
    }
}