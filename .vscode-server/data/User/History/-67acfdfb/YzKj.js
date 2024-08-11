const { enrollAdmin, registerUser } = require('../services/fabricService');

exports.enrollAdmin = async (req, res) => {
    try {
        await enrollAdmin('org1');
        await enrollAdmin('org2');
        res.send('Admins enrolled successfully');
    } catch (error) {
        res.status(500).send(`Error enrolling admin: ${error.message}`);
    }
};

exports.registerUser = async (req, res) => {
    const { orgName, userId, userType } = req.query;
    try {
        await registerUser(orgName, userId, userType);
        res.send('User registered successfully');
    } catch (error) {
        res.status(500).send(`Error registering user: ${error.message}`);
    }
};















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
