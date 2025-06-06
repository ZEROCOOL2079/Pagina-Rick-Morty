export class Character {
    constructor(id, name, status, species, locationName, episodes, imageUrl, gender, origin) {
        this.id = id;
        this.name = name;
        this.status = status;
        this.species = species;
        this.location = locationName;
        this.episodes = episodes;
        this.imageUrl = imageUrl;
        this.gender = gender
        this.origin = origin
    }

    /**
     * Funcion estatica para obtener y crear los personajes
     * @param {object} data -Objeto JSON con los datos de un personaje obtenidos de la API
     * @returns 
     */
    static createFromApi(data) {
        return new Character(data.id, data.name, data.status, data.species, data.location.name, data.episode, data.image, data.gender, data.origin.name);
    }
}

export class Episode {
    constructor(id, name, air_date, episode, characters) {
        this.id = id
        this.name = name
        this.air_date = air_date
        this.episode = episode
        this.characters = characters
    }

    /**
     * Funcion estatica para obtener y crear los episodios
     * @param {object} data -Objeto que tiene los datos para los episodios
     * @returns 
     */
    static createFromApi(data) {
        return new Episode(data.id, data.name, data.air_date, data.episode, data.characters)
    }
}