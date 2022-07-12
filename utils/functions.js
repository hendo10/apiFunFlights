const { 
  STARTDATE_EMPTY_ERROR, 
  ENDDATE_EMPTY_ERROR, 
  STARTDATE_INVALID_ERROR, 
  ENDDATE_INVALID_ERROR, 
  ENDDATE_BEFORE_STARTDATE_ERROR 
} = require("./constants");

function dateIsValid(date) {
  return new Date(date) instanceof Date && date.split("-").length === 3 && date.length === 10;
}

// handle error conditions if query parameters are invalid
exports.validateQuery = () => {
  return (req, res, next) => {
      if (!req.query['startDate']) {
        return res
          .status(400)
          .send({ 
            "status": "failed",
            "reason": STARTDATE_EMPTY_ERROR
          })
      }
      if (!req.query['endDate']) {
        return res
          .status(400)
          .send({ 
            "status": "failed",
            "reason": ENDDATE_EMPTY_ERROR
          })
      }
      if (!dateIsValid(req.query['startDate'])) {
        return res
          .status(400)
          .send({
            "status": "failed",
            "reason": STARTDATE_INVALID_ERROR
          })
      }
      if (!dateIsValid(req.query['endDate'])) {
        return res
          .status(400)
          .send({
            "status": "failed",
            "reason": ENDDATE_INVALID_ERROR
          })
      }
      if (req.query['startDate'] > req.query['endDate']) {
        return res
          .status(400)
          .send({
            "status": "failed",
            "reason": ENDDATE_BEFORE_STARTDATE_ERROR
          })
      }
    next();
  }
}

exports.getDatesInRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dates = [];

  while (start <= end) {
    dates.push(new Date(start).toISOString().substring(0,10));
    start.setDate(start.getDate() + 1);
  }

  return dates;
}
