const express = require('express');

const placeControllers = require('../controllers/places-controllers');


const router = express.Router();


// addding api route for specific place id
router.get('/:pid',placeControllers.getPlacebyId);


// api for to get place by creator Id
router.get('/user/:uid', placeControllers.getPlacebyUserId);

module.exports = router;