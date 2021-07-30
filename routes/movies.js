const router = require('express').Router();
const { createMovie, deleteMovieById } = require('../controllers/movies');
const { validateObjId, validateMovieCreateBody } = require('../middlewares/validation');

router.post('/movies', validateMovieCreateBody, createMovie);
router.delete('/movies/:movieId', validateObjId, deleteMovieById);

module.exports = router;
