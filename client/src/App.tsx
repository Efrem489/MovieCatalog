import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Listbox } from '@headlessui/react';
import axios from 'axios';
import './index.css';

interface Movie {
  id: number;
  title: string;
  genre: string;
  description: string;
  year: number;
}

const fetchMovies = async (): Promise<Movie[]> => {
  const response = await axios.get('/api/movies');
  return response.data;
};

const fetchGenres = async (): Promise<string[]> => {
  const response = await axios.get('/api/movies/genres');
  return response.data;
};

const MovieCard: React.FC<{ movie: Movie; onClick: (movie: Movie) => void }> = ({ movie, onClick }) => (
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

const MovieDetails: React.FC<{ movie: Movie; onClose: () => void }> = ({ movie, onClose }) => (
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

const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [moviesData, genresData] = await Promise.all([fetchMovies(), fetchGenres()]);
      setMovies(moviesData);
      setGenres(genresData);
    } catch (err) {
      setError('Failed to load movies or genres. Please try again later.');
      console.error('API error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredMovies = movies.filter(movie =>
    (!selectedGenre || movie.genre === selectedGenre) &&
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (error) {
    return (
      <div className="text-center text-red-500 mt-10">
        <p>{error}</p>
        <button
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          onClick={loadData}
        >
          Retry
        </button>
      </div>
    );
  }

  if (isLoading) return <div className="text-center text-gray-300">Loading...</div>;

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
        <Listbox value={selectedGenre} onChange={setSelectedGenre}>
          <Listbox.Button className="bg-gray-700 text-white p-2 rounded w-full md:w-1/4 text-left">
            {selectedGenre || 'All Genres'}
          </Listbox.Button>
          <Listbox.Options className="bg-gray-700 rounded mt-1 w-full md:w-1/4 max-h-60 overflow-auto">
            <Listbox.Option value="" className="p-2 hover:bg-gray-600 cursor-pointer">
              All Genres
            </Listbox.Option>
            {genres.map(genre => (
              <Listbox.Option key={genre} value={genre} className="p-2 hover:bg-gray-600 cursor-pointer">
                {genre}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Listbox>
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