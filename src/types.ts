export interface ApiLocation {
  name: string;
  url: string;
}

export type CharacterStatus = 'Alive' | 'Dead' | 'unknown';
export type CharacterGender = 'Female' | 'Male' | 'Genderless' | 'unknown';

export interface ApiCharacter {
  id: number;
  name: string;
  status: CharacterStatus
  species: string;
  type: string;
  gender: CharacterGender
  origin: ApiLocation;
  location: ApiLocation;
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface ApiEpisode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
  url: string;
  created: string;
}

export interface ApiInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface ApiCharactersResponse {
  info: ApiInfo;
  results: ApiCharacter[];
}

export interface ApiEpisodesResponse {
  info: ApiInfo;
  results: ApiEpisode[];
}

export interface CharacterClass {
  id: number;
  name: string;
  status: CharacterStatus;
  species: string;
  locationName: string;
  episodes: string[];
  imageUrl: string;
  gender: CharacterGender;
  originName: string;
}

export interface EpisodeClass {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
}

export type CreateFromApiFunction<T> = (data: any) => T;

export interface CharacterFilters {
  name?: string;
  status?: string;
}

export interface EpisodeFilter {
  name?: string;
}


export interface ApiResponse<T> {
  datas: T[];
  info: ApiInfo | null;
}

export interface FavoriteList {
  Character: number[];
  Episode: number[];
}

export interface CurrentPageState {
  currentPage: number;
  totalPages: number;
  nameFilter: string;
  statusFilter: string;
}