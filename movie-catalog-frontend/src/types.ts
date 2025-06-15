export interface Movie {
  id: number;
  title: string;
  genre: string;
  description: string;
  year: number;
  rating?: number;
  posterUrl?: string;
}

export interface ApiMovie {
  Id: number;
  Title: string;
  Genre: string;
  Description: string;
  Year: number;
}