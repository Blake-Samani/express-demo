const express = require('express');
const router = express.Router();



const courses = [ //array of objects
    { id: 1, name: 'course1' },
    { id: 2, name: 'course2' },
    { id: 3, name: 'course3' },
];


router.get('/', (req, res) => {
    res.send([1, 2, 3]); //returns an array of 3 numbers upon request
});


router.get('/:id', (req, res) => { //with multiple parameters
    const course = courses.find(c => c.id === parseInt(req.params.id)); //finds the id where the id thats in the path matches the id that belongs to a course from our course array
    if (!course) return res.status(404).send('The course with given ID was not found'); //404 object not found, if we didnt match the ids from earlier, a course wont exist
    res.send(course); //else send the course
});

router.post('/', (req, res) => { // updating the course object
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

router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id)); //finds the id where the id thats in the path matches the id that belongs to a course from our course array
    if (!course) return res.status(404).send('The course with given ID was not found'); //404 object not found, if we didnt match the ids from earlier, a course wont exist

    const index = courses.indexOf(course);
    courses.splice(index, 1); //removes 1 object from our courses array at the index

    res.send(course);

});


module.exports = router;

