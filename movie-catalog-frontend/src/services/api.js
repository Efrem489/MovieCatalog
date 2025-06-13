const API_URL = 'https://localhost:7162/api/movies';

export const fetchMovies = async () => {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error('Failed to fetch movies');
    }
    const data = await response.json();
    console.log('������ � API:', data); // �������� ��� ������
    return data;
};

export const fetchGenres = async () => {
    const response = await fetch(`${API_URL}/genres`);
    if (!response.ok) {
        throw new Error('Failed to fetch genres');
    }
    return await response.json();
};