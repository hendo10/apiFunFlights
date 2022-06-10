const request = require('supertest');
const app = require('./app');

describe('Testing POST Request /api/tickets', () => {
  it('POST /api/tickets --> response body success, status 200', () => {
    return request(app)
      .post('/api/tickets')
      .send({
        "event": {
          "ticketId": 1,
          "flightDate": "2021-11-01",
          "flightNumber": "AC1",
          "seatNumber": "1A",
          "ticketCost": 100000
        }
      })
      .then((response) => {
        expect(response.status).toEqual(200)
        expect(response.body.status).toEqual('success');
      })
  });

  it('POST /api/tickets --> ticketId already exist, status 400', () => {
    return request(app)
      .post('/api/tickets')
      .send({
        "event": {
          "ticketId": 1,
          "flightDate": "2021-11-01",
          "flightNumber": "AC1",
          "seatNumber": "1A",
          "ticketCost": 100000
        }
      })
      .then((response) => {
        expect(response.status).toEqual(400)
        expect(response.body.status).toEqual('failed')
        expect(response.body.reason).toEqual('ticketId already exists')
      })
  });

  it('POST /api/tickets --> seat number already taken, status 400', () => {
    return request(app)
      .post('/api/tickets')
      .send({
        "event": {
          "ticketId": 2,
          "flightDate": "2021-11-01",
          "flightNumber": "AC1",
          "seatNumber": "1A",
          "ticketCost": 100000
        }
      })
      .then((response) => {
        expect(response.status).toEqual(400)
        expect(response.body.status).toEqual('failed')
        expect(response.body.reason).toEqual('seatNumber already taken')
      })
  });

  it('POST /api/tickets --> new seat number given, status 200', () => {
    return request(app)
      .post('/api/tickets')
      .send({
        "event": {
          "ticketId": 3,
          "flightDate": "2021-11-01",
          "flightNumber": "AC1",
          "seatNumber": "10A",
          "ticketCost": 100000
        }
      })
      .then((response) => {
        expect(response.status).toEqual(200)
        expect(response.body.status).toEqual('success');
      })
  });
})

describe('Testing GET Request /api/flights', () => {
  it('GET /api/flights --> response body failed, startDate is empty, status 400', () => {
    return request(app)
      .get('/api/flights')
      .then((response) => {
        expect(response.status).toEqual(400)
        expect(response.body.status).toEqual('failed')
        expect(response.body.reason).toEqual('startDate is empty');
      })
  });

  it('GET /api/flights --> response body failed, endDate is empty, status 400', () => {
    return request(app)
      .get('/api/flights?startDate=2021-11-01&endDate=')
      .then((response) => {
        expect(response.status).toEqual(400)
        expect(response.body.status).toEqual('failed')
        expect(response.body.reason).toEqual('endDate is empty');
      })
  });

  it('GET /api/flights --> response body failed, startDate not formatted correctly YYYY-MM-DD, status 400', () => {
    return request(app)
      .get('/api/flights?startDate=2021/11/01&endDate=2021-12-01')
      .then((response) => {
        expect(response.status).toEqual(400)
        expect(response.body.status).toEqual('failed')
        expect(response.body.reason).toEqual('startDate format is invalid');
      })
  });

  it('GET /api/flights --> response body failed, endDate not formatted correctly YYYY-MM-DD, status 400', () => {
    return request(app)
      .get('/api/flights?startDate=2021-11-01&endDate=2021-12/01')
      .then((response) => {
        expect(response.status).toEqual(400)
        expect(response.body.status).toEqual('failed')
        expect(response.body.reason).toEqual('endDate format is invalid');
      })
  });

  it('GET /api/flights --> response body failed, endDate cannot be before startDate, status 400', () => {
    return request(app)
      .get('/api/flights?startDate=2021-11-01&endDate=2021-10-01')
      .then((response) => {
        expect(response.status).toEqual(400)
        expect(response.body.status).toEqual('failed')
        expect(response.body.reason).toEqual('endDate cannot be before startDate');
      })
  });

 it('GET /api/flights --> status 200', () => {
    return request(app)
      .get('/api/flights?startDate=2021-10-01&endDate=2021-10-01')
      .then((response) => {
        expect(response.status).toEqual(200)
      })
  });
})

describe('Testing POST AND GET Request /api/flights', () => {
  it('GET /api/flights?startDate=2021-11-01&endDate=2021-11-03 --> status 200, response body', () => {
    return request(app)
      .get('/api/flights?startDate=2021-11-01&endDate=2021-11-03')
      .then((response) => {
        expect(response.status).toEqual(200)
        expect(response.body.dates.length).toEqual(3);
        expect(response.body.dates[0].date).toEqual('2021-11-01')
        expect(response.body.dates[0].flights[0].flightNumber).toEqual('AC1')
        expect(response.body.dates[0].flights[0].revenue).toEqual(200000)
        expect(response.body.dates[0].flights[0].occupiedSeats.length).toEqual(2)
      })
  });

  it('POST /api/tickets --> flight date changed, status 200', () => {
    return request(app)
      .post('/api/tickets')
      .send({
        "event": {
          "ticketId": 4,
          "flightDate": "2021-11-03",
          "flightNumber": "AC1",
          "seatNumber": "15A",
          "ticketCost": 50000
        }
      })
      .then((response) => {
        expect(response.status).toEqual(200)
        expect(response.body.status).toEqual('success');
    })
  });

  it('POST /api/tickets --> new flight added, status 200', () => {
    return request(app)
      .post('/api/tickets')
      .send({
        "event": {
          "ticketId": 5,
          "flightDate": "2021-11-03",
          "flightNumber": "AC2",
          "seatNumber": "5A",
          "ticketCost": 200000
        }
      })
      .then((response) => {
        expect(response.status).toEqual(200)
        expect(response.body.status).toEqual('success');
    })
  });

  it('GET /api/flights?startDate=2021-11-01&endDate=2021-11-03 --> status 200, response body ', () => {
    return request(app)
      .get('/api/flights?startDate=2021-11-01&endDate=2021-11-03')
      .then((response) => {
        expect(response.status).toEqual(200)
        expect(response.body.dates.length).toEqual(3);
        expect(response.body.dates[2].date).toEqual('2021-11-03')
        expect(response.body.dates[2].flights[0].flightNumber).toEqual('AC1')
        expect(response.body.dates[2].flights[1].flightNumber).toEqual('AC2')
        expect(response.body.dates[2].flights[0].revenue).toEqual(250000)
        expect(response.body.dates[2].flights[1].revenue).toEqual(200000)
        expect(response.body.dates[2].flights[0].occupiedSeats.length).toEqual(3)
        expect(response.body.dates[2].flights[1].occupiedSeats.length).toEqual(1)
      })
  });
})