const express = require('express');
const { check } = require('express-validator');

const placeControllers = require('../controllers/places-controllers');


const router = express.Router();


// addding api route for specific place id
router.get('/:pid',placeControllers.getPlacebyId);


// api for to get place by creator Id
router.get('/user/:uid', placeControllers.getPlacesbyUserId);

//this api is for to post data
router.post('/',
//alidtion on post request from express-validator library
[
 check('title').not().isEmpty(),
 check('description').isLength({min:5}),
 check('address').not().isEmpty()
],
 placeControllers.createPlace);   

 
//this api is for to update places
router.patch('/:pid',
//validation rules
[
    check('title').not().isEmpty(),
    check('description').isLength({min:5})
], placeControllers.updatePlace);

//this api is for to delet place by pid
router.delete('/:pid', placeControllers.deletPlace);


module.exports = router;