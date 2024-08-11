const fabricService = require('../services/fabricService');

exports.invoke = async (req, res) => {
    const { fcn, args } = req.body;
    try {
        const result = await fabricService.invoke('Org2MSP', fcn, args);
        res.status(200).json({ result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.query = async (req, res) => {
    const { fcn, args } = req.query;
    try {
        const result = await fabricService.query('Org2MSP', fcn, args);
        res.status(200).json({ result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.enrollAdmin = async (req, res) => {
    try {
        await fabricService.enrollAdmin('Org2');
        res.send('Admin enrolled successfully for Org2');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.registerUser = async (req, res) => {
    try {
        await fabricService.registerUser('Org2', 'user2', 'client');
        res.send('User registered successfully for Org2');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
