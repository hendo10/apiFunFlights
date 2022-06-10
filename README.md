# Backend Fun - Saving Flight Information without a database

Tech stack = Node.js, Express, Jest 

This API exercise is meant to replicate the process of receiving requests to save flight information from tickets without using a database.

## Setup
Ensure you have `Node.js` and `npm` ( or `yarn` ) installed. <br />
Confirm that the following commands can output their versions without error on your machine:
```
node -v
npm -v # or yarn -v
```

Next, install the project dependencies:

```
npm install # or yarn install
```

Then start the server:
```
npm run start # or yarn run start
```
Open http://localhost:3000/api/tickets with your browser to test out APIs.
(Refer to Routes Section for more details) 

## Routes

POST /api/tickets
GET /api/flights?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD

## Testing

Please run the following test cases written to test the APIs:
```
npm run test # or yarn run test
