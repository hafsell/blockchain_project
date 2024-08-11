const express = require('express');
const router = express.Router();
const org1Controller = require('../controllers/org1Controller');

router.post('/invoke', org1Controller.invoke);
router.get('/query', org1Controller.query);
router.get('/enrollAdmin', org1Controller.enrollAdmin);
router.get('/registerUser', org1Controller.registerUser);

module.exports = router;
