const express = require('express');
const bodyParser = require('body-parser');

const placesRoutes = require('./routes/places-routes');

const app = express();

app.use('/api/places',placesRoutes);  // calling api route fo place from another file

// this is special middl wear or handler which can take 4 arguments for error only express know that middlewar
app.use((error,req,res,next)=> {
    // if headerSent is 200 then its OK else run second part
    if(res.headerSent){
        return next(error);
    }
    
    // these error.code is comming from error route where it defined & message also
    res.status(error.code || 500 )
    res.json({message: error.message || 'An unknown error occured'});
})


app.listen(5000);