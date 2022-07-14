function authenticate(req, res, next) { // next is a reference to next middelware function in pipeline
    console.log('Authenticating..');
    next();

};

module.exports = authenticate;