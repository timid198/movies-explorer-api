const Movie = require('../models/movie');

const {
  CAST_ERROR, BAD_REQUEST_MESSAGE, NOT_FOUND_MESSAGE,
  FORBIDDEN_CODE, NOT_FOUND_CODE, FORBIDDEN_MESSAGE, RESPONCE_FILM_DELETED,
} = require('../utils/messages');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');
const NotFoundError = require('../errors/not-found-err');

module.exports = {
  createMovie(req, res, next) {
    const {
      country, director, duration, year, description,
      image, trailer, thumbnail, movieId, nameRU, nameEN,
    } = req.body;
    Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
      owner: req.user._id,
    })
      .then((movie) => {
        res.send(movie);
      })
      .catch(next);
  },

  getAllMovies(req, res, next) {
    Movie.find({})
      .then((movies) => res.send(movies))
      .catch(next);
  },

  deleteMovie(req, res, next) {
    const { movieId } = req.params;
    Movie.findById(movieId)
      .orFail(new NotFoundError(NOT_FOUND_MESSAGE))
      .then((movie) => {
        if (req.user._id.toString() === movie.owner._id.toString()) {
          return movie.remove().then(() => Movie.find({})
          .then((movies) => res.send({ message: RESPONCE_FILM_DELETED, movies })));
        }
        throw new ForbiddenError(FORBIDDEN_MESSAGE);
      })
      .catch((err) => {
        if (err.statusCode === NOT_FOUND_CODE || err.statusCode === FORBIDDEN_CODE) {
          throw err;
        }
        if (err.name === CAST_ERROR) {
          throw new BadRequestError(BAD_REQUEST_MESSAGE);
        }
      })
      .catch(next);
  },
};
