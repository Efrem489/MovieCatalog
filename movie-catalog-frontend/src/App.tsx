import * as React from 'react';
import { useState, useEffect } from 'react';
import { fetchMovies, fetchGenres } from './services/api';
import SearchBar from './components/SearchBar';
import GenreFilter from './components/GenreFilter';
import MovieCard from './components/MovieCard';
import MovieDetails from './components/MovieDetails';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';
import { Movie, ApiMovie } from './types';



function App() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
    const [genres, setGenres] = useState<string[]>([]);
    const [selectedGenre, setSelectedGenre] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [moviesData, genresData] = await Promise.all([
                    fetchMovies(),
                    fetchGenres()
                ]);

                const formattedMovies = moviesData.map((movie: ApiMovie) => ({
                    id: movie.Id,
                    title: movie.Title,
                    genre: movie.Genre,
                    description: movie.Description,
                    year: movie.Year,
                    rating: Math.floor(Math.random() * 5) + 1,
                    posterUrl: `https://picsum.photos/200/300?random=${movie.Id}`
                }));

                setMovies(formattedMovies);
                setFilteredMovies(formattedMovies);
                setGenres(['All', ...Array.from(new Set(genresData as string[]))]);
                setLoading(false);
            } catch (err) {
                setError('Не удалось загрузить данные');
                console.error('Error loading data:', err instanceof Error ? err.message : String(err));
                setLoading(false);
            }
        };

        loadData();
    }, []);

    useEffect(() => {
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

    const handleMovieSelect = (movie: Movie) => {
        setSelectedMovie(movie);
    };

    const handleCloseDetails = () => {
        setSelectedMovie(null);
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="spinner"
                />
                <p>Загрузка данных...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-screen">
                <h2>{error}</h2>
                <button onClick={() => window.location.reload()}>Попробовать снова</button>
            </div>
        );
    }

    return (
        <div className="app">
            <header className="app-header">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Каталог фильмов
                </motion.h1>
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
                <AnimatePresence>
                    {filteredMovies.length > 0 ? (
                        <motion.div
                            className="movie-list"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ staggerChildren: 0.1 }}
                        >
                            {filteredMovies.map(movie => (
                                <MovieCard
                                    key={movie.id}
                                    movie={movie}
                                    onSelect={handleMovieSelect}
                                />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            className="no-results"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            {searchTerm ? `По запросу "${searchTerm}" ничего не найдено` : 'Нет фильмов для отображения'}
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {selectedMovie && (
                        <MovieDetails
                            movie={selectedMovie}
                            onClose={handleCloseDetails}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default App;