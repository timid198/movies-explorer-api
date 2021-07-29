const router = require('express').Router();
const { createMovie, deleteMovieById } = require('../controllers/movies');
const { validateNumId, validateMovieCreateBody } = require('../middlewares/validation');

router.post('/movies', validateMovieCreateBody, createMovie);
router.delete('/movies/:movieId', validateNumId, deleteMovieById);

module.exports = router;
