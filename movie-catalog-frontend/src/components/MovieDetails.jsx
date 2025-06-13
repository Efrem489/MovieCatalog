import React from 'react';

const MovieDetails = ({ movie, onClose }) => {
    return (
        <div className="movie-details">
            <button className="close-btn" onClick={onClose}>×</button>
            <h2>{movie.title}</h2>
            <p><strong>Год:</strong> {movie.year}</p>
            <p><strong>Жанр:</strong> {movie.genre}</p>
            <p><strong>Описание:</strong> {movie.description}</p>
        </div>
    );
};

export default MovieDetails;