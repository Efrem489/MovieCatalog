import React from 'react';
import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';
import { Movie } from '../types';

interface MovieCardProps {
    movie: Movie;
    onSelect: (movie: Movie) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onSelect }) => {
    return (
        <motion.div
            className="movie-card"
            onClick={() => onSelect(movie)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
        >
            <div className="movie-poster">
                <img src={movie.posterUrl} alt={movie.title} />
                <div className="movie-rating">
                    {React.createElement(FiStar, { size: 16 })}
                    <span>{movie.rating}/5</span>
                </div>
            </div>
            <div className="movie-info">
                <h3>{movie.title}</h3>
                <p>{movie.year} • {movie.genre}</p>
            </div>
        </motion.div>
    );
};

export default MovieCard;