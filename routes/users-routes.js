const express = require('express');
const { check } = require('express-validator');

const userControllers = require('../controllers/users-controllers');



const router = express.Router();


// addding api route for specific place id
router.get('/',userControllers.getUsers);

//this api is for to post data
router.post('/singup',
[
    check('name').not().isEmpty(),
    check('email').normalizeEmail()  // check for if it is normal email like: takbeeralikhan@gmail.com
    .isEmail(), //check for email validation
    check('password').isLength({min:'6'})
]
,userControllers.signup);  

// api for to get place by creator Id
router.post('/login',userControllers.login);

 



module.exports = router;