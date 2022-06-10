const express = require('express');
const router = express.Router();

const { validateQuery, getDatesInRange } = require('../utils/functions');
const fields = ['startDate', 'endDate'];

/* GET flight info. */
router.get('/', validateQuery(fields), async (req, res, next) => {
  let startDate = req.query.startDate;
  let endDate = req.query.endDate;
  let rangeOfDates = getDatesInRange(startDate, endDate);

  try {
    let results = { "dates": [] };
    let flightData = req.app.locals.flightData;

    // search flights for all the dates inside range
    for (const date of rangeOfDates) {
      let dataModel = {
        "date": date,
        "flights": []
      }
      results["dates"].push(dataModel);
      for (const flightNum in flightData) {
        if (flightData[flightNum]["date"] === date) {
          results["dates"][results["dates"].length - 1]["flights"].push({
            "flightNumber": flightNum,
            "revenue": flightData[flightNum]["revenue"],
            "occupiedSeats": [...flightData[flightNum]["occupiedSeats"]]
          })
        }
      }
    }

    res
      .status(200)
      .send(results);
  } catch (error) {
    return res.status(400).send({ 'error': error })
  }
});

module.exports = router;
