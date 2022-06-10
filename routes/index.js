const express = require('express');
const router = express.Router();

const ticketRouter = require('./tickets');
const flightRouter = require('./flights');

router.use('/tickets', ticketRouter)
router.use('/flights', flightRouter)

router.get('/', function(req, res, next) {
  res.render('index', { "api": `hi you've found me!` });
});

module.exports = router;
