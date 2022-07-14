const express = require('express');
const router = express.Router();

router.get('/', (req, res) => { //callback function in get request that requires request and response
    res.render('index', { title: 'My express app', message: 'Hello' }); //render replaces res.send by using our pug html file in ./views/index.pug
});

module.exports = router;