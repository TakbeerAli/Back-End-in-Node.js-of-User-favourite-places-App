const { uuid } = require('uuidv4');
const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');

// dummy data for users
const DUMMY_USER =[ {
    id:'u1',
    name:"Ali",
    email:"ali@ali.com",
    password:"ali"
}
];

//route method for return all users
const getUsers = (req, res, next) => {

    res.json({users: DUMMY_USER});

};


// route method for to signup user to database
const signup = (req, res, next) => {
    //validation result shown according to rules define in routes module
    const errors = validationResult(req);
    
    //if validation is according to rules mean wrong then run IF block
    if(!errors.isEmpty()){
        throw new HttpError('Invalid inputs passed, please check your data',422);  
    }

    const { name, email, password } = req.body;

    const hasUser = DUMMY_USER.find(u => u.email === email);
    if(hasUser){
        throw new HttpError('email already exist', 422);
    };

    const createdUser = {
        id:uuid(),
        name,  // this automatically know that put name in (  name : name )
        email,
        password
    };

    DUMMY_USER.push(createdUser);
    res.status(201).json({user: createdUser});
};


//route method for to login user and check if credential is correct or not
const login = (req, res, next) => {

    const { email, password } = req.body;

    const identifiedUser = DUMMY_USER.find(u => u.email === email);

    if(!identifiedUser || identifiedUser.password !== password){

        throw new HttpError('your provided email or password is wrong!',401);
    }
     res.json({message:'loged in '});
};


exports.getUsers = getUsers;
exports.login = login;
exports.signup = signup;
