const fabricService = require('../services/fabricService');

// Function to enroll admin
async function enrollAdmin(req, res) {
    try {
        const orgName = req.body.orgName;
        await fabricService.enrollAdmin(orgName);
        res.send(`Admin enrolled successfully for ${orgName}`);
    } catch (error) {
        res.status(500).send(`Failed to enroll admin: ${error.message}`);
    }
}

// Function to register user
async function registerUser(req, res) {
    try {
        const { orgName, userId, userType } = req.body;
        await fabricService.registerUser(orgName, userId, userType);
        res.send(`User ${userId} registered successfully for ${orgName}`);
    } catch (error) {
        res.status(500).send(`Failed to register user: ${error.message}`);
    }
}

module.exports = { enrollAdmin, registerUser };
















// const fabricService = require('../services/fabricService');

// exports.invoke = async (req, res) => {
//     const { fcn, args } = req.body;
//     try {
//         const result = await fabricService.invoke('Org1MSP', fcn, args);
//         res.status(200).json({ result });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// exports.query = async (req, res) => {
//     const { fcn, args } = req.query;
//     try {
//         const result = await fabricService.query('Org1MSP', fcn, args);
//         res.status(200).json({ result });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// exports.enrollAdmin = async (req, res) => {
//     try {
//         await fabricService.enrollAdmin('Org1');
//         res.send('Admin enrolled successfully for Org1');
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// exports.registerUser = async (req, res) => {
//     try {
//         await fabricService.registerUser('Org1', 'user1', 'client');
//         res.send('User registered successfully for Org1');
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };
