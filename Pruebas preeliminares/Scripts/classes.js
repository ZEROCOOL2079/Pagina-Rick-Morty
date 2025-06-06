export class Character {
    constructor(id, name, status, species, locationName, firstEpisodeUrl, imageUrl) {
        this.id = id;
        this.name = name;
        this.status = status;
        this.species = species;
        this.location = locationName;
        this.firstEpisodeUrl = firstEpisodeUrl;
        this.imageUrl = imageUrl;
    }

    /**
     * Funcion estatica para obtener y crear los personajes
     * @param {Array} data -Objeto que tiene los datos para los personajes
     * @returns 
     */
    static createFromApi(data) {
        return new Character(data.id, data.name, data.status, data.species, data.location.name, data.episode[0], data.image);
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
     * @param {Array} data -Objeto que tiene los datos para los episodios
     * @returns 
     */
    static createFromApi(data) {
        return new Episode(data.id, data.name, data.air_date, data.episode, data.characters)
    }
}