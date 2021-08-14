const router = require('express').Router();
const { createMovie, getAllMovies, deleteMovie } = require('../controllers/movies');
const { validateObjId, validateMovieBody } = require('../middlewares/validation');

router.get('/movies', getAllMovies);
router.post('/movies', validateMovieBody, createMovie);
router.delete('/movies/:movieId', validateObjId, deleteMovie);

module.exports = router;
