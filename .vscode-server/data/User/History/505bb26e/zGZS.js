const express = require('express');
const bodyParser = require('body-parser');
const { Wallets, Gateway } = require('fabric-network');
const path = require('path');
const fs = require('fs');

// Path to the connection profile
const ccpPath = path.resolve(__dirname, './blockchain/Explorer/connection-profile/first-network.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

const app = express();
app.use(bodyParser.json());

app.post('/create-contract', async (req, res) => {
    const { id, test } = req.body;

    try {
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        const userExists = await wallet.get('user1');
        if (!userExists) {
            res.status(400).send('An identity for the user "user1" does not exist in the wallet. Please run the registerUser.js application before retrying.');
            return;
        }

        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });

        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('mycc');

        const result = await contract.submitTransaction('CreateContract', JSON.stringify({ id, test }));
        console.log(`Transaction has been submitted: ${result.toString()}`);
        res.status(200).send({ transactionId: result.toString() });

        await gateway.disconnect();
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        res.status(500).send(error);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
