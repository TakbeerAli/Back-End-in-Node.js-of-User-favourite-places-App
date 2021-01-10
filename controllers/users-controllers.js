
const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');
const User =  require('../models/user');



//route method for return all users
const getUsers = async (req, res, next) => {

    let users;
    try {
         users = await User.find({},'-password');
    } catch (err) {
       const error = new HttpError('fetching error , please try again', 500);  
       return next(error);      
    }

  res.json({ users: users.map(user => user.toObject({ getters: true }))});

};


// route method for to signup user to database ++  This is SIGNUP ROUTE SETTING
const signup = async (req, res, next) => {
    //validation result shown according to rules define in routes module
    const errors = validationResult(req);
    
    //if validation is according to rules mean wrong then run IF block
    if(!errors.isEmpty()){
        const error = new  HttpError('Invalid inputs passed, please check your data',422);  
        return next(error);
    }

    const { name, email, password } = req.body;


    let existinguser;
    try {
        //this type of matching method id moongoose 
        existinguser = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError('Signup failed , please try again ', 500);
        return next(error);
    }

    if (existinguser) {
        const error = new HttpError('User already exist ,pleas login ',422);
        return next(error);
    };

    // creating record in database
    const createdUser = new User({
        name,
        email,
        image: 'https://picsum.photos/200/300',
        password,
        places:[]
    });

    //saving data to database
    try {
       await createdUser.save();
    } catch (err) {
         const error = new HttpError('Creating user failed, please try again',500);
         return next(error)
    };

    res.status(201).json({user: createdUser.toObject({ getters: true })});
};


//route method for to login user and check if credential is correct or not ++ THIS IS LOGIN ROUTE SETTING
const login = async (req, res, next) => {

    const { email, password } = req.body;

    let existinguser;
    try {
        //this type of matching method id moongoose  simple method is changed from this 
        existinguser = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError('login failed , please try again ', 500);
        return next(error);
    }

    if(!existinguser || existinguser.password !== password){

      const error = new HttpError('your provided email or password is wrong!',401);
      return next(error);
    }
     res.json({message:'loged in,', user: existinguser.toObject({getters: true })});
};


exports.getUsers = getUsers;
exports.login = login;
exports.signup = signup;
