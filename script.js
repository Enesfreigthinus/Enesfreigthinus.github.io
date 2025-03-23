const API_KEY = 'd31082ea26bb42abcb99440fae553eab';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const moviesContainer = document.getElementById('movies-container');
const searchInput = document.getElementById('search');
const genreSelect = document.getElementById('genre-select');

fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`)
  .then(response => response.json())
  .then(data => populateGenres(data.genres))
  .catch(error => console.error('Error fetching genres:', error));



  function populateGenres(genres) {
    genres.forEach(genre => {
      const option = document.createElement('option');
      option.value = genre.id;
      option.textContent = genre.name;
      genreSelect.appendChild(option);
    });
  }

  genreSelect.addEventListener('change', () => {
    const selectedGenre = genreSelect.value;
  
    if (selectedGenre === "") {
      fetchMovies(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
    } else {
      fetchMovies(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${selectedGenre}`);
    }
  });
  
// Load popular movies on page load
fetchMovies(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);

// Search on input
searchInput.addEventListener('keyup', (e) => {
  const searchTerm = e.target.value;

  if (searchTerm.trim() === '') {
    fetchMovies(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
  } else {
    fetchMovies(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${searchTerm}`);
  }
});

function fetchMovies(url) {
  fetch(url)
    .then(response => response.json())
    .then(data => displayMovies(data.results))
    .catch(error => console.error('Error fetching movies:', error));
}

function displayMovies(movies) {
  moviesContainer.innerHTML = '';

  if (movies.length === 0) {
    moviesContainer.innerHTML = '<p>No movies found.</p>';
    return;
  }

  movies.forEach(movie => {
    const movieCard = document.createElement('div');
    movieCard.className = 'movie-card';

    const posterPath = movie.poster_path
      ? `${IMAGE_BASE_URL}${movie.poster_path}`
      : 'https://via.placeholder.com/200x300?text=No+Image';

      movieCard.innerHTML = `
      <div class="movie-poster">
        <img src="${posterPath}" alt="${movie.title}">
      </div>
      <div class="movie-info">
        <h2>${movie.title}</h2>
        <p>⭐ ${movie.vote_average} / 10</p>
        <p>Release: ${movie.release_date}</p>
      </div>
    `;

    moviesContainer.appendChild(movieCard);
  });
}