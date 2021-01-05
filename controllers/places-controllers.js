//uuid is for random id generator
const { uuid } = require('uuidv4');
const {  validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const getCoordsForAddress =require('../util/location');
const Place = require('../models/place');
const  User = require('../models/user');
const mongoose = require('mongoose')


//dummy data
let DUMMY_PLACES = [
    {
        id:'p1',
        title:'Empire state buildings',
        description: 'one of the greate ',
        location:{
            lat:40.999999,
            lng:-73.33333
        },
        address: '20 W 34th st, New York,Ny 10001',
        creator:'u1'
    }
];

// this is part of search by place id and called in routes placeId route  ++ THIS IS GETPLACEBYID ROUTE
const getPlacebyId = async (req,res,next) =>{
    const placeId = req.params.pid;
   
    
    let place;
    try {
         place = await Place.findById(placeId);
    } catch (err) {
        const error = new HttpError('could not find place by id ',500);
        return next(error);
    };

    if(!place){
      const error = new HttpError('Could not found Place Id',404);
      return next(error); // this is same as throw new httpError const error then next(error)
    }

    res.json({place: place.toObject({ getter:true }) });  //  getter:true  = removing underscore from id which is by default MongoDb conact
};


// this is part of search by user id and called in routes userId route ++ GETUSERBYID ROUTE
const getPlacesbyUserId = async (req,res,next) =>{
    const userId = req.params.uid;
    

    let places;
    try {
     places = await Place.find({ creator: userId });
    } catch (err) {
        const error = new HttpError('could not find place by id ',500);
        return next(error);
    }
      
    if(!places || places.length === 0){
      const error = new HttpError('Could not found by user Id',404);
      return next(error);
    }

    res.json({places: places.map(place => place.toObject({ getter: true })) });  // returning data in json form
};


// post method  async is for google api but we did't use bcz no money   ++      THIS IS CREATEPLACE ROUTE
const createPlace = async (req,res,next) =>{

    //validation result shown according to rules define in routes module
     const errors = validationResult(req);
     if(!errors.isEmpty()){
         return next(new HttpError('Invalid inputs passed, please check your data',422));  
     }

    //const  title = req.body.title;
    const { title, description, address, creator } = req.body;
    
    // defineing for to get coords from google but we did hard code in locaton.js due to non-budget
    let coordinates;
    try {
        coordinates = await getCoordsForAddress(address);
    } catch (error) {
        return next(error);
    }

    //coming data from form and orgainzating according to schema 
    const createPlace = new Place({
        title,
        description,
        address,
        location: coordinates,
        image:'https://picsum.photos/200/300',
        creator
    });

    let user;
    try {
        //check for the user if creator user id exsist or not
          user = await User.findById(creator);
    } catch (err) {
        const error = new HttpError('Creating place failed ,please try again',500);
        return next(error);   
    }

    // if user creator id doesn't exist 
    if(!user){
        const error = new HttpError('Could not find user for provided id', 404);
        return next(error);
    }

    // saving data to database
    try {
        const sess = await mongoose.startSession(); //session check is all uper method Ok there is no error 
        sess.startTransaction();  // here we start trasaction saveing one by one things
        await createPlace.save({ session: sess });  // first we save place in DB
        user.places.push(createPlace);  // then we insert place to specifiec User  to relat place with them
        await user.save({ session: sess });  // then we save user detail + insert place for this user
        await sess.commitTransaction(); // at least when all process complet without error then trasaction save all data other wise it remove
    } catch (err) {
         const error = new HttpError('Creating place failed, please try again',500);
         return next(error)
    };
    
    
  //inserting dummy data
    
    res.status(201).json({place: createPlace});
};


// api method for update    ++                                 THIS IS UPDATE ROUTE
const updatePlace = async (req, res, next)=>{

     //validation result shown according to rules define in routes module
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        throw new HttpError('Invalid inputs passed, please check your data',422);  
    }

    const { title, description } = req.body;
    const placeId = req.params.pid;

    let place;
    try {
        place = await Place.findById(placeId);
    } catch (err) {
        const error = new HttpError('Creating place failed, please try again',500);
         return next(error);
    }

    //when data id matched then go to that ID data and change title,discription with new title , desc
    place.title = title;
    place.description = description;

   try {
        await place.save();
   } catch (err) {
       const error = new HttpError('Something went gone, could not update place', 500);
       return next(error);
   }

    res.status(200).json({place: place.toObject({ getters:true }) });

};


//api method for to delet place                       ++ THIS IS DELET ROUTE
const deletPlace = async (req, res, next) => {
    const placeId = req.params.pid;

    let place;
    //first recgognized which place need to delet
    try {
        place = await Place.findById(placeId).populate('creator');  // populate work only when we have relation btw ( ref: place)
    } catch (err) {
        const error = new HttpError('Something went gone, could not be deleted', 500);
        return next(error);
    }

    //check is this Id have place or not
    if(!place){
        const error = new HttpError('Could not find place for this Id', 404);
        return next(error);
    }

 // then it delete that place
    try {
         const sess = await mongoose.startSession();
         sess.startTransaction();
         await place.remove({ session: sess }); // remove that place
         place.creator.places.pull(place);  //go to place then that place creator then that user places then delete that place
         await place.creator.save({ session: sess }); // save 
         await sess.commitTransaction(); // finlly save permenantly
    } catch (err) {
        const error = new HttpError('Something went gone, could not delet place', 500);
        return next(error);
    }
    res.status(200).json({message:"place is deleted"});
};

exports.getPlacebyId = getPlacebyId; // exporting function to places-routes
exports.getPlacesbyUserId = getPlacesbyUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletPlace = deletPlace;