const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const courses = [ //array of objects
    { id: 1, name: 'course1' },
    { id: 2, name: 'course2' },
    { id: 3, name: 'course3' },
];

const port = process.env.PORT || 3000; //the the PORT environment variable has been set, we will use that, otherwise use 3000
app.listen(port, () => console.log(`Listening on port ${port}..`)); // when listening on port 3000, the lambda function will be called

app.get('/', (req, res) => { //callback function in get request that requires request and response
    res.send('Hello World!!!');
});

app.get('/api/courses', (req, res) => {
    res.send([1, 2, 3]); //returns an array of 3 numbers upon request
});
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

app.get('/api/courses/:id', (req, res) => { //with multiple parameters
    const course = courses.find(c => c.id === parseInt(req.params.id)); //finds the id where the id thats in the path matches the id that belongs to a course from our course array
    if (!course) return res.status(404).send('The course with given ID was not found'); //404 object not found, if we didnt match the ids from earlier, a course wont exist
    res.send(course); //else send the course
});

app.post('/api/courses', (req, res) => { // updating the course object
    const schemajoi = Joi.object({
        name: Joi.string().min(3).required() //must be a string with min of 3 characters and is required
    });
    const result = schemajoi.validate(req.body); //this body object comes from a client, namely, a json object
    // joi makes input validation really simple
    console.log(result);
    if (!req.body.name || req.body.name.length < 3) {
        //400 bad request
        res.status(400).send(result.error.details[0].message);
        return; //stop the rest of the code from being executed

    }
    const course = {
        id: courses.length + 1,
        name: req.body.name //must read from body of request, must use JSON parsing in body of objects by callin app.use(express.json()); in the top of our app
    };
    courses.push(course);
    res.send(course); //send back to client
});

app.put('/api/courses/:id', (req, res) => {
    //look up course
    //if doesnt exist, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id)); //finds the id where the id thats in the path matches the id that belongs to a course from our course array
    if (!course) {
        res.status(404).send('The course with given ID was not found'); //404 object not found, if we didnt match the ids from earlier, a course wont exist
        return;
    }
    //else validate
    //if invalid, return 400 bad request
    const result = validateCourse(req.body); //this body object comes from a client, namely, a json object
    if (result.error) { //if our result has an error
        //400 bad request
        res.status(400).send(result.error.details[0].message);
        return; //stop the rest of the code from being executed

    }

    //update course
    course.name = req.body.name;
    //return the updated course
    res.send(course);
});

//handling http delete requests
app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id)); //finds the id where the id thats in the path matches the id that belongs to a course from our course array
    if (!course) return res.status(404).send('The course with given ID was not found'); //404 object not found, if we didnt match the ids from earlier, a course wont exist

    const index = courses.indexOf(course);
    courses.splice(index, 1); //removes 1 object from our courses array at the index

    res.send(course);

});


function validateCourse(course) {
    const schemajoi = Joi.object({
        name: Joi.string().min(3).required() //must be a string with min of 3 characters and is required
    });
    return schemajoi.validate(course); //this body object comes from a client, namely, a json object

}