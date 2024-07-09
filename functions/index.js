/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// The Firebase Admin SDK to access Firestore.
const {initializeApp} = require("firebase-admin/app");

initializeApp();
const axios = require("axios");
axios.defaults.headers.common["Authorization"] = "Bearer " + process.env.TMDB_TOKEN;

exports.search = onRequest({ cors: true }, async (req, res) => {
  logger.log("searching:" + req.query.title + (req.query.page ? `(page ${req.query.page})` : ""));

  // let endpoint = `https://www.omdbapi.com/?apikey=${process.env.OMDB_KEY}&s=${title}`;
  let endpoint = `https://api.themoviedb.org/3/search/movie?query=${req.query.title}&include_adult=false` + (req.query.page ? `&page=${req.query.page}` : "");

  const result = await axios.get(endpoint)
    .then(res => res.data)
    .catch(error => {
      logger.log(error)
    })

  result.results = result.results.map((movie) => {
    return {
      ...movie,
      poster_path: movie.poster_path == null ? null : ("https://image.tmdb.org/t/p/w500" + movie.poster_path)
    }
  })
  
  res.json({
      ...result
  })
});

exports.movie = onRequest({ cors: true }, async (req, res) => {
  const movie_id = req.query.id;

  logger.log("Searching for " + movie_id);

  // 1. Retrieve information about movie with the matching id
  let movie = await axios.get(`https://api.themoviedb.org/3/movie/${movie_id}?language=en-US&append_to_response=credits`)
    .then(res => res.data)
    .catch(error => {logger.log(error)});

  // 2. Alter the result of poster_path and backdrop_path so urls are completely ready for frontend
  movie.poster_path = (!movie.poster_path ? null : ("https://image.tmdb.org/t/p/w300" + movie.poster_path));
  movie.backdrop_path_w780 = (!movie.backdrop_path ? null : "https://image.tmdb.org/t/p/w780" + movie.backdrop_path);
  movie.backdrop_path_w1280 = (!movie.backdrop_path ? null : "https://image.tmdb.org/t/p/w1280" + movie.backdrop_path);

  // 3. Retrieve data about "similar" movies and update their poster_path 's
  let similar = await axios.get(`https://api.themoviedb.org/3/movie/${movie_id}/similar`)
    .then(res => res.data)
    .catch(error => { logger.log(error) });

  similar.results.forEach((movie) => {
    movie.poster_path = (!movie.poster_path ? null : ("https://image.tmdb.org/t/p/w154" + movie.poster_path))
  })

  movie.similar = similar.results;

  // 4. Retrieve watch providers for the movie (only CA)
  let watch_providers = await axios.get(`https://api.themoviedb.org/3/movie/${movie_id}/watch/providers`)
    .then(res => res.data)
    .catch(error => { logger.log(error) });

  let ca_watch_providers;

  if (watch_providers.results.CA) {
    if ("rent" in watch_providers.results.CA) {
      watch_providers.results.CA.rent.forEach((provider) => {
        provider.logo_path = "https://image.tmdb.org/t/p/original" + provider.logo_path;
      })
    }

    if ("buy" in watch_providers.results.CA) {
      watch_providers.results.CA.buy.forEach((provider) => {
        provider.logo_path = "https://image.tmdb.org/t/p/original" + provider.logo_path;
      })
    }

    if ("flatrate" in watch_providers.results.CA) {
      watch_providers.results.CA.flatrate.forEach((provider) => {
        provider.logo_path = "https://image.tmdb.org/t/p/original" + provider.logo_path;
      })
    }
    ca_watch_providers = watch_providers.results.CA;
  }

  movie.watch_providers_ca = ca_watch_providers;

  res.json(movie);
});

exports.now_playing = onRequest({ cors: true }, async (req, res) => {
  logger.log("Searching now playing movies" + (req.query.page ? `(page ${req.query.page})` : ""));

  let endpoint = `https://api.themoviedb.org/3/movie/now_playing?language=en-US&region=US&include_adult=false` + (req.query.page ? `&page=${req.query.page}` : "");

  const result = await axios.get(endpoint)
    .then(res => res.data)
    .catch(error => {logger.log(error)})

    result.results = result.results.map((movie) => {
      return {
        ...movie,
        poster_path: movie.poster_path == null ? null : ("https://image.tmdb.org/t/p/w154" + movie.poster_path),
      }
    })

  res.json({
      ...result
  })
});

exports.popular = onRequest({ cors: true }, async (req, res) => {
  logger.log("Searching popular movies" + (req.query.page ? `(page ${req.query.page})` : ""));

  let endpoint = `https://api.themoviedb.org/3/movie/popular?language=en-US&region=US&include_adult=false` + (req.query.page ? `&page=${req.query.page}` : "");

  const result = await axios.get(endpoint)
    .then(res => res.data)
    .catch(error => {
      logger.log(error)
    })

    result.results = result.results.map((movie) => {
      return {
        ...movie,
        poster_path: movie.poster_path == null ? null : ("https://image.tmdb.org/t/p/w154" + movie.poster_path),
      }
    })

  res.json({
      ...result
  })
});

exports.upcoming = onRequest({ cors: true }, async (req, res) => {
  logger.log("Searching upcoming movies");

  let endpoint = `https://api.themoviedb.org/3/movie/upcoming?language=en-US&region=US&include_adult=false` + (req.query.page ? `&page=${req.query.page}` : "");

  const result = await axios.get(endpoint)
    .then(res => res.data)
    .catch(error => {
      logger.log(error)
    })

    result.results = result.results.map((movie) => {
      return {
        ...movie,
        poster_path: movie.poster_path == null ? null : ("https://image.tmdb.org/t/p/w154" + movie.poster_path),
      }
    })

  res.json({
      ...result
  })
});