export class Character {
    id;
    name;
    status;
    species;
    locationName;
    episodes;
    imageUrl;
    gender;
    originName;
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.status = data.status;
        this.species = data.species;
        this.locationName = data.locationName;
        this.episodes = data.episodes;
        this.imageUrl = data.imageUrl;
        this.gender = data.gender;
        this.originName = data.originName;
    }
    static createFromApi(dataApi) {
        return new Character({
            id: dataApi.id,
            name: dataApi.name,
            status: dataApi.status,
            species: dataApi.species,
            locationName: dataApi.location.name,
            episodes: dataApi.episode,
            imageUrl: dataApi.image,
            gender: dataApi.gender,
            originName: dataApi.origin.name
        });
    }
}
export class Episode {
    id;
    name;
    air_date;
    episode;
    characters;
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.air_date = data.air_date;
        this.episode = data.episode;
        this.characters = data.characters;
    }
    static createFromApi(dataApi) {
        return new Episode({
            id: dataApi.id,
            name: dataApi.name,
            air_date: dataApi.air_date,
            episode: dataApi.episode,
            characters: dataApi.characters
        });
    }
}
