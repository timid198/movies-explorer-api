const Movie = require('../models/movie');
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
        if (err.name === 'CastError') {
          throw new BadRequestError('Переданы некорректные данные в метод создания карточки.');
        }
      })
      .catch(next);
  },

  deleteMovieById(req, res, next) {
    const movieIdentificator = req.params.movieId;
    Movie.findById(req.params.movieId)
      .then((movie) => {
        if (!movie) {
          throw new NotFoundError('Карточка не найдена.');
        }
        if (req.user._id === movie.owner._id.toString()) {
          Movie.findByIdAndRemove(movieIdentificator)
            .then(() => res.send({ message: 'Фильм удалён из избранных.' }));
        } else {
          throw new AuthorizedButForbiddenError('Вы пытаетесь изменить не свои данные.');
        }
      })
      .catch((err) => {
        if (err.statusCode === 404 || err.statusCode === 403) {
          throw err;
        }
        if (err.name === 'CastError') {
          throw new BadRequestError('Переданы некорректные данные.');
        }
      })
      .catch(next);
  },
};
