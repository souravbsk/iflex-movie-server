const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const axios = require("axios");
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

app.get("/movies", async (req, res) => {
  const searchStatus = req.query;
  console.log(searchStatus);
  if (searchStatus?.serachText) {
    const response = await axios.get(
      `https://www.omdbapi.com/?apikey=${process.env.APIKEY}&s=${searchStatus?.serachText}&page=${searchStatus?.pageNumber}`
    );
    const data = response.data;
    console.log(data);
    return res.json(data);
  } else {
    const response = await axios.get(
      `https://www.omdbapi.com/?apikey=${process.env.APIKEY}&s=man&page=${searchStatus?.pageNumber}`
    );
    const data = response.data;
    res.json(data);
  }
});

app.get(`/api/movies/:id`, async (req, res) => {
  const paramsId = req.params.id;
  `https://www.omdbapi.com/?apikey=${process.env.APIKEY}&i=${paramsId}&plot=full`;
  const response = await axios.get(
    `https://www.omdbapi.com/?apikey=${process.env.APIKEY}&i=${paramsId}&plot=full`
  );
  const data = response.data;
  res.json(data);
});
let favoriteMovies = [];

app.post("/api/movies/favorites", async (req, res) => {
  const movie = req.body;

  const existingMovie = favoriteMovies.find(
    (favorite) => favorite.imdbID === movie.imdbID
  );

  if (existingMovie) {
    favoriteMovies = favoriteMovies.filter(
      (favorite) => favorite.imdbID !== movie.imdbID
    );
    console.log("Movie removed from favorites.");
  } else {
    favoriteMovies.push(movie);
    console.log("Movie added to favorites.");
  }
});

app.get("/api/movies/favorites", (req, res) => {
  res.json(favoriteMovies);
});

console.log(favoriteMovies);
app.get("/", (req, res) => {
  res.send("iflx-movie-server");
});

app.listen(port, () => {
  console.log(`iflx-movie-server http://localhost:${port}`);
});
