const express = require('express');
const router = express.Router();
const org1Routes = require('./org1');
const org2Routes = require('./org2');

router.use('/org1', org1Routes);
router.use('/org2', org2Routes);

module.exports = router;
