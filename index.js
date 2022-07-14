const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const config = require('config'); //get settings for our application from config folder
const helmet = require('helmet'); //allows us to set HTTP headers
const morgan = require('morgan');//for logging http requests 
const Joi = require('joi');
const logger = require('./middleware/logger');
const express = require('express');
const authenticate = require('./authenticator');
const app = express();
const courses = require('./routes/courses');
const home = require('./routes/home');


app.set('view engine', 'pug'); //express will load this module, dont need to use require
app.set('views', './views');// all views and templates will go here
//config
console.log('Application name: ' + config.get('name'));
console.log('Mail server: ' + config.get('mail.host'));
// console.log('Mail password: ' + config.get('mail.password')); //should read from an env variable

app.use(express.json());
app.use(express.urlencoded({ extended: true })); //key=value&key=value for html forms to be parsed into req.body json object
//extended true passed to the urlencoded function allows us to pass complex objects such as arrays using urlencoded format
app.use(express.static('public'));
//public is a folder we pass to use static objects such as CSS
app.use(logger);
app.use(authenticate);
app.use('/api/courses', courses); //for any routes that start with /api/courses, use our courses router
app.use('/', home);


if (app.get('env') === 'development') { // this is how we check if we are in production, or development, if in devlopment, log
    app.use(morgan('tiny'));// tiny is a format for morgan for logging time and status code
    startupDebugger('Morgan enabled');//replaces console.log

}

dbDebugger('Connected to the database...');
app.use(helmet());


const port = process.env.PORT || 3000; //the the PORT environment variable has been set, we will use that, otherwise use 3000
app.listen(port, () => console.log(`Listening on port ${port}..`)); // when listening on port 3000, the lambda function will be called



// if we type localhost:3000/api/courses we will get an array of three numbers on the screen

// /api/courses/1 if 1 is course id
//the colon should be followed by a parameter, in our case, id
// app.get('/api/courses/:id', (req, res) => {
//     //req.params.id allows us to read the parameter we gave
//     res.send(req.params.id);// here, we are sending the id to the client
// });
app.get('/api/posts/:year/:month', (req, res) => { //with multiple parameters

    res.send(req.params);// here, we are sending all params to the client
});
app.get('/api/posts/:year/:month', (req, res) => { //with multiple parameters

    res.send(req.query);// this is used for whatever comes after our path with a ?
});

// app.get('/api/courses', (req, res) => {

//     res.send(courses);// here, we are sending all courses from our courses array
// });

function validateCourse(course) {
    const schemajoi = Joi.object({
        name: Joi.string().min(3).required() //must be a string with min of 3 characters and is required
    });
    return schemajoi.validate(course); //this body object comes from a client, namely, a json object

}