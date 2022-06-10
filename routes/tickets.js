const express = require('express');
const router = express.Router();

const {TICKETID_ERROR, SEATNUM_ERROR} = require('../utils/constants');

/* GET ticket info. */
router.get('/', (req, res, next) => {
  res
  .status(200)
  // expected payload in JSON
  .send(req.app.locals.ticket);
});

/* POST ticket info to flights data */
router.post('/', async (req, res, next) => {
  try {
    const ticket = req.body.event;
    let localTicketNumbers = req.app.locals.ticketNumbers; 
    let localFlightsData = req.app.locals.flightData;

    let flightData = { 
      "date": ticket.flightDate,
      "flightNumber": ticket.flightNumber,
      "revenue": ticket.ticketCost,
      "occupiedSeats": [ ticket.seatNumber ]
    }

    // check if ticketId exists
    if (localTicketNumbers.has(ticket.ticketId)) {
      throw new Error(TICKETID_ERROR);
    } else {
      localTicketNumbers.add(ticket["ticketId"]);
    }

    let newFlightIndicator = false;

    // if data is empty, update with ticket info
    // else iterate through flight data to check if existing flight exist and update attributes or 
    // update flight data with new flight number if it does not exist
    if (JSON.stringify(localFlightsData) === '{}') {
      localFlightsData[ticket["flightNumber"]] = flightData;
    } else {
      for (const flightNum in localFlightsData) {
        if (ticket["flightNumber"] === flightNum) {
          // if seat is unavailable, send error message
          for (const seat of localFlightsData[flightNum]["occupiedSeats"]) {
            if (seat === ticket.seatNumber) throw new Error(SEATNUM_ERROR);
          }
          flightData["revenue"] += localFlightsData[flightNum]["revenue"];
          flightData["occupiedSeats"] = [...localFlightsData[flightNum]["occupiedSeats"], ...flightData["occupiedSeats"]];
          localFlightsData[flightNum] = flightData;
        }
        newFlightIndicator = true;
      }
      if (newFlightIndicator) {
        localFlightsData[ticket["flightNumber"]] = flightData;
        newFlightIndicator = false;
      }
    }

    res.status(200)
      .send({ "status": "success" })
  } catch (error) {
    switch(error.message) { 
      case(TICKETID_ERROR): {
        res
        .status(400)
        .send({
          "status": "failed",
          "reason": TICKETID_ERROR
        })
        break;
      }
      case(SEATNUM_ERROR): {
        res
        .status(400)
        .send({
          "status": "failed",
          "reason": SEATNUM_ERROR
        })
        break;
      }
      default:
        res
        .status(400)
        .send({
          "status": "failed",
          "reason": req.body.event
        })
      break;
    }
  }
})

module.exports = router;