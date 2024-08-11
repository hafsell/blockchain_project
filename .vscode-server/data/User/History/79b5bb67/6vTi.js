const express = require('express');
const app = express();
const port = 3000;

// Import controllers
const org1Controller = require('./controllers/org1Controller');
const org2Controller = require('./controllers/org2Controller');

// Define routes
app.get('/enrollAdmin', org1Controller.enrollAdmin);
app.get('/registerUser', org1Controller.registerUser);

app.listen(port, () => {
    console.log(`API listening at http://localhost:${port}`);
});

