import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiStar } from 'react-icons/fi';
import { Movie } from '../types';

interface MovieDetailsProps {
  movie: Movie;
  onClose: () => void;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ movie, onClose }) => {
  return (
    <AnimatePresence>
      <motion.div
        className="movie-details"
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 300, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
      >
        <button className="close-btn" onClick={onClose}>
          <FiX />
        </button>
        <div className="details-header">
          <img src={movie.posterUrl} alt={movie.title} />
          <div className="details-title">
            <h2>{movie.title}</h2>
            <div className="movie-rating">
              <FiStar />
              <span>{movie.rating}/5</span>
            </div>
            <p>{movie.year} • {movie.genre}</p>
          </div>
        </div>
        <div className="details-content">
          <h3>Описание</h3>
          <p>{movie.description}</p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MovieDetails;