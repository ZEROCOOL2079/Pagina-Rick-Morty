import { Character, Episode } from "./classes";
import { ApiCharactersResponse, ApiEpisodesResponse, ApiCharacter, ApiEpisode, CreateFromApiFunction, CharacterFilters, EpisodeFilter, ApiResponse, ApiInfo} from "./types";

async function loadDataFromApi(url: string,createFromApi: CreateFromApiFunction<Character | Episode>,pageNumber: number){
    let dataList: (Character | Episode)[] = [];
    let paginationInfo: ApiInfo;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error HTTP! estado: ${response.status}`);
        }

        const data: ApiCharactersResponse | ApiEpisodesResponse = await response.json();
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

async function loadDataFromApiByIds(url: string, createFromApi: CreateFromApiFunction<Character | Episode>){
    let dataList: (Character | Episode)[] = [];
    let paginationInfo: ApiInfo = { count: 0, pages: 0, next: null, prev: null };

    try {
        const response: Response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error HTTP! estado: ${response.status}`);
        }
        const data = await response.json();

        const items = Array.isArray(data) ? data : [data];

        items.forEach((item: ApiCharacter | ApiEpisode) => {
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

function addName(url: string, name: string | undefined): string {
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
function addStatus(url: string, status: string | undefined): string {
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
export async function getCharacters(
    pageNumber: number,
    filters: CharacterFilters
): Promise<{ characters: Character[]; info: ApiInfo | null }> {
    let url: string = `https://rickandmortyapi.com/api/character/?page=${pageNumber}`;

    url = addName(url, filters.name);
    url = addStatus(url, filters.status);

    const { datas, info } = await loadDataFromApi(
        url,
        Character.createFromApi,
        pageNumber
    );
    return { characters: datas as Character[], info: info as ApiInfo | null };
}

/**
 * @param {number} pageNumber
 * @param {EpisodeFilter} filter
 * @returns {Promise<{episodes: Episode[], info: ApiInfo | null}>}
 */
export async function getEpisode(
    pageNumber: number,
    filter: EpisodeFilter
): Promise<{ episodes: Episode[]; info: ApiInfo | null }> {
    let url: string = `https://rickandmortyapi.com/api/episode?page=${pageNumber}`;
    url = addName(url, filter.name);

    const { datas, info } = await loadDataFromApi(
        url,
        Episode.createFromApi,
        pageNumber
    );
    return { episodes: datas as Episode[], info: info as ApiInfo | null };
}

/**
 * @param {string[]} arrayUrls
 * @returns {Promise<string[]>}
 */
export async function getNameUrl(arrayUrls: string[]): Promise<string[]> {
    const namePromises = arrayUrls.map(async (url: string) => {
        try {
            const response: Response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error HTTP! estado: ${response.status}`);
            }
            const data: { name: string } = await response.json();
            return data.name;
        } catch (error) {
            console.error("Error al obtener el nombre del personaje:", error);
            return "Error en personaje";
        }
    });

    const charactersName: string[] = await Promise.all(namePromises);
    console.log(`charactersNames: ${charactersName}`)
    return charactersName;
}

/**
 * @param {number | number[]} characterIds
 * @returns {Promise<{characters: Character[], info: ApiInfo}>}
 */
export async function getCharactersByIds(
    characterIds: number | number[]
): Promise<{ characters: Character[]; info: ApiInfo }> {
    if (!characterIds || (Array.isArray(characterIds) && characterIds.length === 0)) {
        return { characters: [], info: { count: 0, pages: 0, next: null, prev: null } };
    }

    const idsString: string = Array.isArray(characterIds) ? characterIds.join(',') : characterIds.toString();
    const url: string = `https://rickandmortyapi.com/api/character/${idsString}`;

    const { datas, info } = await loadDataFromApiByIds(url, Character.createFromApi);
    return { characters: datas as Character[], info: info as ApiInfo };
}

/**
 * @param {number | number[]} episodeIds
 * @returns {Promise<{episodes: Episode[], info: ApiInfo}>}
 */
export async function getEpisodesByIds(
    episodeIds: number | number[]
): Promise<{ episodes: Episode[]; info: ApiInfo }> {
    if (!episodeIds || (Array.isArray(episodeIds) && episodeIds.length === 0)) {
        return { episodes: [], info: { count: 0, pages: 0, next: null, prev: null } };
    }

    const idsString: string = Array.isArray(episodeIds) ? episodeIds.join(',') : episodeIds.toString();
    const url: string = `https://rickandmortyapi.com/api/episode/${idsString}`;

    const { datas, info } = await loadDataFromApiByIds(url, Episode.createFromApi);
    return { episodes: datas as Episode[], info: info as ApiInfo };
}