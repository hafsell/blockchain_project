const express = require('express');
const bodyParser = require('body-parser');
const transactionController = require('./controllers/transactionController');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/invokeChaincode', transactionController.invokeChaincode);

app.listen(port, () => {
    console.log(`API listening at http://34.70.10.73:${port}`);
});
