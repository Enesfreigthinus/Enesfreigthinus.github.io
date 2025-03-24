const API_KEY = 'b6a173191d193e627460b6e96afb6748';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const moviesContainer = document.getElementById('movies-container');
const searchInput = document.getElementById('search');
const genreSelect = document.getElementById('genre-select');
const trendingButton = document.getElementById('trending-btn');


fetchTrendingMovies();


fetchGenres();

// Event Listeners
searchInput.addEventListener('keyup', (e) => {
  const searchTerm = e.target.value.trim();

  if (searchTerm === '') {
    fetchTrendingMovies();
  } else {
    fetchMovies(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchTerm)}`);
  }
});

genreSelect.addEventListener('change', () => {
  const selectedGenre = genreSelect.value;

  if (selectedGenre === '') {
    fetchTrendingMovies();
  } else {
    fetchMovies(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${selectedGenre}`);
  }
});

trendingButton.addEventListener('click', () => {
  fetchTrendingMovies();
});

// Functions

function fetchTrendingMovies() {
  fetchMovies(`${BASE_URL}/trending/movie/day?api_key=${API_KEY}`);
}

function fetchGenres() {
  fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`)
    .then(response => response.json())
    .then(data => populateGenres(data.genres))
    .catch(error => console.error('Error fetching genres:', error));
}

function populateGenres(genres) {
  genreSelect.innerHTML = `<option value="">Select a Genre</option>`; // Reset options first
  genres.forEach(genre => {
    const option = document.createElement('option');
    option.value = genre.id;
    option.textContent = genre.name;
    genreSelect.appendChild(option);
  });
}

function fetchMovies(url) {
  fetch(url)
    .then(response => response.json())
    .then(data => displayMovies(data.results))
    .catch(error => console.error('Error fetching movies:', error));
}

function fetchMovieTrailer(movieId, movieTitle) {
  const url = `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const trailers = data.results.filter(video => video.type === 'Trailer' && video.site === 'YouTube');

      if (trailers.length > 0) {
        const trailerKey = trailers[0].key;
        const youtubeUrl = `https://www.youtube.com/watch?v=${trailerKey}`;
        window.open(youtubeUrl, '_blank');
      } else {
        alert(`Sorry! No trailer found for "${movieTitle}".`);
      }
    })
    .catch(error => {
      console.error('Error fetching trailer:', error);
    });
}


function displayMovies(movies) {
  moviesContainer.innerHTML = '';

  if (!movies || movies.length === 0) {
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
        <p>⭐ ${movie.vote_average || 'N/A'} / 10</p>
        <p>Release: ${movie.release_date || 'N/A'}</p>
      </div>
    `;

    movieCard.addEventListener('click', () => {
      fetchMovieTrailer(movie.id, movie.title);
    });

    moviesContainer.appendChild(movieCard);

  });
}