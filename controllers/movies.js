const Movie = require('../models/movie');

const {
  CAST_ERROR, BAD_REQUEST_MESSAGE, NOT_FOUND_MESSAGE,
  AUTHORIZED_BUT_FORBIDDEN_CODE, NOT_FOUND_CODE, AUTHORIZED_BUT_FORBIDDEN_MESSAGE,
} = require('../utils/messages');
const BadRequestError = require('../errors/bad-request-err');
const AuthorizedButForbiddenError = require('../errors/authorized-but-forbidden-err');
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
      .catch((err) => {
        if (err.name === CAST_ERROR) {
          throw new BadRequestError(BAD_REQUEST_MESSAGE);
        }
      })
      .catch(next);
  },

  deleteMovieById(req, res, next) {
    const { movieId } = req.params;
    Movie.findOne({ movieId })
      .then((movie) => {
        if (!movie) {
          throw new NotFoundError(NOT_FOUND_MESSAGE);
        }
        if (req.user._id === movie.owner._id.toString()) {
          Movie.findOneAndRemove(movieId)
            .then(() => res.send({ message: 'Фильм удалён из избранных.' }));
        } else {
          throw new AuthorizedButForbiddenError(AUTHORIZED_BUT_FORBIDDEN_MESSAGE);
        }
      })
      .catch((err) => {
        if (err.statusCode === NOT_FOUND_CODE || err.statusCode === AUTHORIZED_BUT_FORBIDDEN_CODE) {
          throw err;
        }
        if (err.name === CAST_ERROR) {
          throw new BadRequestError(BAD_REQUEST_MESSAGE);
        }
      })
      .catch(next);
  },
};
