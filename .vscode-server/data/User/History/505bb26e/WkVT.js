const express = require('express');
const bodyParser = require('body-parser');
const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

// Load the network configuration
const ccpPath = path.resolve(__dirname, 'connection.json');
const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

app.post('/create-contract', async (req, res) => {
    const { id, test } = req.body;

    console.log(`Received request to create contract with id: ${id} and test: ${test}`);

    try {
        // Load wallet from filesystem
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // Check to see if we've already enrolled the user
        const identity = await wallet.get('user1');
        if (!identity) {
            console.log('An identity for the user "user1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network
        const contract = network.getContract('mycc');

        // Submit the specified transaction
        // CreateContract transaction - requires 1 argument, ex: ('CreateContract', '{"id":"1", "test":"Hello World"}')
        await contract.submitTransaction('CreateContract', JSON.stringify({ id, test }));
        console.log('Transaction has been submitted');
        
        // Disconnect from the gateway
        await gateway.disconnect();

        res.status(200).send({ transactionId: "Transaction has been submitted" });
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        res.status(500).send(error);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
