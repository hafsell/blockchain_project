const fabricService = require('../services/fabricService');

async function invokeChaincode(req, res) {
    try {
        const { functionName, args } = req.body;
        const result = await fabricService.invokeChaincode(functionName, args);
        res.send(result);
    } catch (error) {
        res.status(500).send(`Failed to invoke chaincode: ${error.message}`);
    }
}

module.exports = { invokeChaincode };
