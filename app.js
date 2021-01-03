const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const HttpError = require('./models/http-error');
const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');

const app = express();
app.use(bodyParser.json());

app.use('/api/places',placesRoutes);  // calling api route fo place from another file

app.use('/api/users',usersRoutes);

//this route is for if client put wroong API link in url
app.use((req,res,next) => {
    const error = new HttpError('Could not found this route',404);
    throw error;

});

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

// connecteing application with database
mongoose.connect('mongodb+srv://ali:alikhan123@cluster0.op4vg.mongodb.net/places?retryWrites=true&w=majority')
.then(() => {
    app.listen(5000);
})
.catch(err => {
    console.log(err);
});
