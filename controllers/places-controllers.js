const HttpError = require('../models/http-error');

//dummy data
const DUMMY_PLACES = [
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
const getPlacebyId =  (req,res,next) =>{
    const placeId = req.params.pid;
    const place = DUMMY_PLACES.find(p=> {
        return p.id === placeId;
    });
    if(!place){
      throw new HttpError('Could not found Place Id',404);
    }

    res.json({place});  // returning data in json form
};


// this is part of search by user id and called in routes userId route
const getPlacebyUserId =  (req,res,next) =>{
    const placeId = req.params.pid;
    const place = DUMMY_PLACES.find(p=> {
        return p.id === placeId;
    });
    if(!place){
      throw new HttpError('Could not found by user Id',404);
    }

    res.json({place});  // returning data in json form
};


exports.getPlacebyId = getPlacebyId; // exporting function to places-routes
exports.getPlacebyUserId = getPlacebyUserId;