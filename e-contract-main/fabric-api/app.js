const express = require('express');
const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Define the connection options for the Fabric network
const ccpPath = path.resolve(__dirname, '..', 'api', 'connection-profiles', 'connection-org1.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

app.use(express.json());

// Define route to handle chaincode invocation
app.post('/invokeChaincode', async (req, res) => {
    try {
        const { functionName, args } = req.body;
        const contractName = "agreement"; // Modify this if your contract name is different

        // Load the network configuration
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet: Wallets.newFileSystemWallet('../api-2.x/wallets'),
            identity: 'admin',
            discovery: { enabled: true, asLocalhost: true }
        });

        // Get the network and contract context
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract(contractName);

        // Submit the transaction
        const response = await contract.submitTransaction(functionName, ...args);
        
        // Disconnect from the gateway
        await gateway.disconnect();

        res.json({ txId: response.toString() });
    } catch (error) {
        console.error('Failed to invoke chaincode:', error);
        res.status(500).json({ error: 'Failed to invoke chaincode' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`API listening at http://localhost:${port}`);
});
