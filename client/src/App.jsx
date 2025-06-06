import { useState, useEffect } from 'react'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import axios from 'axios';
import './App.css'

const MovieCard = ({ movie, onClick }) => (
    <motion.div
        className="bg-gray-800 rounded-lg p-4 m-2 hover:bg-gray-700 hover:scale-105 cursor-pointer transition duration-300 transform"
        onClick={() => onClick(movie)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
    >
        <h3 className="text-lg font-semibold">{movie.title}</h3>
        <p className="text-sm text-gray-400">{movie.genre} • {movie.year}</p>
    </motion.div>
);

const MovieDetails = ({ movie, onClose }) => (
    <div>
        <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        />
        <motion.div
            className="fixed top-0 right-0 h-full w-full md:w-1/3 bg-gray-800 p-6 overflow-y-auto shadow-lg"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3 }}
            onClick={e => e.stopPropagation()}
        >
            <h2 className="text-2xl font-bold mb-2">{movie.title}</h2>
            <p className="text-gray-300 mb-2"><strong>Genre:</strong> {movie.genre}</p>
            <p className="text-gray-300 mb-2"><strong>Year:</strong> {movie.year}</p>
            <p className="text-gray-300 mb-4">{movie.description}</p>
            <button
                className="bg-blue-600 hover:bg-blue-700 hover:shadow-lg text-white px-4 py-2 rounded transition duration-300"
                onClick={onClose}
            >
                Close
            </button>
        </motion.div>
    </div>
);

const App = () => {
    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMovie, setSelectedMovie] = useState(null);

    useEffect(() => {
        axios.get('/api/movies').then(response => setMovies(response.data));
        axios.get('/api/movies/genres').then(response => setGenres(response.data));
    }, []);

    const filteredMovies = movies.filter(movie =>
        (!selectedGenre || movie.genre === selectedGenre) &&
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="relative">
            <h1 className="text-3xl font-bold text-center my-6">Movie Catalog</h1>
            <div className="mb-4 flex flex-col md:flex-row gap-4">
                <input
                    type="text"
                    placeholder="Search movies..."
                    className="bg-gray-700 text-white p-2 rounded w-full md:w-1/4"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
                <select
                    className="bg-gray-700 text-white p-2 rounded w-full md:w-1/4"
                    value={selectedGenre}
                    onChange={e => setSelectedGenre(e.target.value)}
                >
                    <option value="">All Genres</option>
                    {genres.map(genre => (
                        <option key={genre} value={genre}>{genre}</option>
                    ))}
                </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMovies.map(movie => (
                    <MovieCard key={movie.id} movie={movie} onClick={setSelectedMovie} />
                ))}
            </div>
            {selectedMovie && (
                <MovieDetails movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
            )}
        </div>
    );
};

export default App;
