const express = require('express');
const router = express.Router();
const org2Controller = require('../controllers/org2Controller');

router.post('/invoke', org2Controller.invoke);
router.get('/query', org2Controller.query);
router.get('/enrollAdmin', org2Controller.enrollAdmin);
router.get('/registerUser', org2Controller.registerUser);

module.exports = router;
