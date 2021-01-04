//uuid is for random id generator
const { uuid } = require('uuidv4');
const {  validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const getCoordsForAddress =require('../util/location');
const Place = require('../models/place');



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

// this is part of search by place id and called in routes placeId route
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


// this is part of search by user id and called in routes userId route
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

// post method  async is for google api but we did't use bcz no money 
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

    // saving data to database
    try {
       await createPlace.save();
    } catch (err) {
         const error = new HttpError('Creating place failed, please try again',500);
         return next(error)
    };
    
    
  //inserting dummy data
    
    res.status(201).json({place: createPlace});
};

// api method for update
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

//api method for to delet place
const deletPlace = (req, res, next) => {
    const placeId = req.params.pid;

    //if there is no data then show no data found how can i delete if no data
    if(!DUMMY_PLACES.find(p => p.id === placeId)){
        throw new HttpError('Data is not found',404);
    }

    DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId);
    res.status(200).json({message:"place is deleted"});
};

exports.getPlacebyId = getPlacebyId; // exporting function to places-routes
exports.getPlacesbyUserId = getPlacesbyUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletPlace = deletPlace;