import React from 'react';

const MovieCard = ({ movie, onSelect }) => {
    return (
        <div className="movie-card" onClick={() => onSelect(movie)}>
            <h3>{movie.title}</h3>
            <p>{movie.year} • {movie.genre}</p>
        </div>
    );
};

export default MovieCard;