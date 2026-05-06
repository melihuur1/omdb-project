const API_KEY = "b617dfb6";
const BASE_URL = "https://www.omdbapi.com/";

const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const typeFilter = document.getElementById("type-filter");
const yearFilter = document.getElementById("year-filter");

const loadingIndicator = document.getElementById("loading");
const errorMessage = document.getElementById("error-message");
const errorText = document.getElementById("error-text");
const movieCard = document.getElementById("movie-card");

const elements = {
  poster: document.getElementById("movie-poster"),
  title: document.getElementById("movie-title"),
  year: document.getElementById("movie-year"),
  genre: document.getElementById("movie-genre"),
  director: document.getElementById("movie-director"),
  actors: document.getElementById("movie-actors"),
  plot: document.getElementById("movie-plot"),
};

document.addEventListener("DOMContentLoaded", () => {
  const savedData = localStorage.getItem("lastMovieSearchObj");

  if (savedData) {
    const { query, type, year } = JSON.parse(savedData);

    searchInput.value = query || "";
    typeFilter.value = type || "";
    yearFilter.value = year || "";

    if (query) {
      fetchMovieData(query, type, year);
    }
  }
});

searchButton.addEventListener("click", handleSearch);
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleSearch();
  }
});

function handleSearch() {
  const query = searchInput.value.trim();
  const type = typeFilter.value;
  const year = yearFilter.value.trim();

  if (query === "") return;

  fetchMovieData(query, type, year);
}

async function fetchMovieData(query, type, year) {
  hideAll();
  loadingIndicator.classList.remove("hidden");
  searchButton.disabled = true;

  try {
    let fetchUrl = `${BASE_URL}?t=${encodeURIComponent(query)}&apikey=${API_KEY}`;
    if (type) fetchUrl += `&type=${type}`;
    if (year) fetchUrl += `&y=${year}`;

    const response = await fetch(fetchUrl);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    if (data.Response === "False") {
      throw new Error(data.Error);
    }

    renderMovie(data);

    const searchState = { query, type, year };
    localStorage.setItem("lastMovieSearchObj", JSON.stringify(searchState));
  } catch (error) {
    showError(
      error.message || "An unexpected error occurred. Please try again.",
    );
  } finally {
    searchButton.disabled = false;
  }
}

function renderMovie(movie) {
  loadingIndicator.classList.add("hidden");

  elements.title.textContent = movie.Title;
  elements.year.textContent = movie.Year;
  elements.genre.textContent = movie.Genre;
  elements.director.textContent = movie.Director;
  elements.actors.textContent = movie.Actors;
  elements.plot.textContent = movie.Plot;

  if (movie.Poster !== "N/A") {
    elements.poster.src = movie.Poster;
  } else {
    elements.poster.src =
      "https://via.placeholder.com/300x450?text=No+Poster+Available";
  }

  movieCard.classList.remove("hidden");
}

function showError(message) {
  hideAll();
  errorText.textContent = message;
  errorMessage.classList.remove("hidden");
}

function hideAll() {
  loadingIndicator.classList.add("hidden");
  errorMessage.classList.add("hidden");
  movieCard.classList.add("hidden");
}
