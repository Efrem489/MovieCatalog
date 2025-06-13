import React, { useState, useEffect } from 'react';
import { fetchMovies, fetchGenres } from './services/api';
import SearchBar from './components/SearchBar';
import GenreFilter from './components/GenreFilter';
import MovieCard from './components/MovieCard';
import MovieDetails from './components/MovieDetails';
import './App.css';

function App() {
    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const moviesData = await fetchMovies();
                const genresData = await fetchGenres();
                const formattedMovies = moviesData.map(movie => ({
                    id: movie.Id,
                    title: movie.Title,
                    genre: movie.Genre,
                    description: movie.Description,
                    year: movie.Year
                }));
                setMovies(formattedMovies);
                setFilteredMovies(formattedMovies);
                setGenres(['All', ...genresData]);
                setLoading(false);
            } catch (error) {
                console.error('Error loading data:', error);
                setLoading(false);
            }
        };

        loadData();
    }, []);

    useEffect(() => {
        console.log('Фильтруемые фильмы:', filteredMovies); // Добавьте эту строку
        let result = [...movies];

        if (selectedGenre !== 'All') {
            result = result.filter(movie =>
                movie.genre.toLowerCase() === selectedGenre.toLowerCase()
            );
        }

        if (searchTerm.trim() !== '') {
            result = result.filter(movie =>
                movie.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredMovies(result);
    }, [selectedGenre, searchTerm, movies]);

    const handleMovieSelect = (movie) => {
        setSelectedMovie(movie);
    };

    const handleCloseDetails = () => {
        setSelectedMovie(null);
    };

    if (loading) {
        return <div className="loading">Загрузка...</div>;
    }

    return (
        <div className="app">
            <header className="app-header">
                <h1>Каталог фильмов</h1>
            </header>

            <div className="filters">
                <SearchBar onSearch={setSearchTerm} />
                <GenreFilter
                    genres={genres}
                    selectedGenre={selectedGenre}
                    onSelect={setSelectedGenre}
                />
            </div>

            <div className="content">
                <div className="movie-list">
                    {filteredMovies.length > 0 ? (
                        filteredMovies.map(movie => (
                            <MovieCard
                                key={movie.id}
                                movie={movie}
                                onSelect={handleMovieSelect}
                            />
                        ))
                    ) : (
                        <div className="no-results">Фильмы не найдены</div>
                    )}
                </div>

                {selectedMovie && (
                    <MovieDetails
                        movie={selectedMovie}
                        onClose={handleCloseDetails}
                    />
                )}
            </div>
        </div>
    );
}

export default App;