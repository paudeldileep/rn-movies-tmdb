import { TMDB_API_KEY } from "../config/config";
const genres = {
  12: "Adventure",
  14: "Fantasy",
  16: "Animation",
  18: "Drama",
  27: "Horror",
  28: "Action",
  35: "Comedy",
  36: "History",
  37: "Western",
  53: "Thriller",
  80: "Crime",
  99: "Documentary",
  878: "Science Fiction",
  9648: "Mystery",
  10402: "Music",
  10749: "Romance",
  10751: "Family",
  10752: "War",
  10770: "TV Movie",
};

//url with page number
const API_URL_POPULAR = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&sort_by=popularity.desc&page=`;
const API_URL_TOP_RATED = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&sort_by=vote_average.desc&page=`;
const API_URL_QUERY = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=`;
//const API_URL_POPULAR = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&sort_by=popularity.desc`;
//const API_URL_TOP_RATED = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&sort_by=vote_average.desc`;
//let API_URL_QUERY = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=`;
//get casts
const API_URL_CASTS = `https://api.themoviedb.org/3/movie/`;

const getImagePath = (path) =>
  `https://image.tmdb.org/t/p/w440_and_h660_face${path}`;

export const getMovies = async (query, page) => {
  try {
    let API_URL = API_URL_POPULAR + page;

    if (query !== "") {
      API_URL = API_URL_QUERY + query + "&page=" + page;
      //API_URL = API_URL_QUERY + query;
      console.log(API_URL);
    }

    //get results with total pages
    const { results, total_pages } = await fetch(API_URL).then((movies) =>
      movies.json()
    );
    //fetch movie casts

    //const { results } = await fetch(API_URL).then((movies) => movies.json());

    const movies = results.slice(0, 20).map((movie) => {
      return {
        id: movie.id,
        title: movie.title,
        poster: getImagePath(movie.poster_path),
        genres: movie.genre_ids.map((id) => genres[id]),
        releaseDate: movie.release_date,
        rating: movie.vote_average,
      };
    });
    return { movies, total_pages };
  } catch (e) {
    return { movies: [], total_pages: 0 };
  }
};

export const getMovie = async (id) => {
  try {
    const movie = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}`
    ).then((movie) => movie.json());

    const casts = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${TMDB_API_KEY}`
    ).then((casts) => casts.json());

    const cast = casts.cast.slice(0, 5).map((cast) => {
      return {
        id: cast.id,
        name: cast.name,
        profileImage: getImagePath(cast.profile_path),
        character: cast.character,
      };
    });

    return {
      id: movie.id,
      title: movie.title,
      poster: getImagePath(movie.poster_path),
      genres: movie.genres.map((genre) => genre.name),
      releaseYear: movie.release_date.split("-")[0],
      rating: movie.vote_average,
      overview: movie.overview,
      runtime: movie.runtime,
      cast: cast,
      backdrop: getImagePath(movie.backdrop_path),
    };
  } catch (e) {
    console.log(e);
    return {};
  }
};
