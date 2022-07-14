

function log(req, res, next) { // next is a reference to next middelware function in pipeline
    console.log('Logging..');
    next(); //if we dont call next, it will just hang here at logging
    //next calls the next middleware function
};

module.exports = log;
//exports a single function