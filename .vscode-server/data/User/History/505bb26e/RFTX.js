const express = require('express');
const bodyParser = require('body-parser');
const { FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');
const ccpPath = path.resolve(__dirname, 'connection.json');

const app = express();
app.use(bodyParser.json());

app.post('/create-contract', async (req, res) => {
    const { id, test } = req.body;

    try {
        const wallet = new FileSystemWallet('./wallet');
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });

        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('mycc');

        const result = await contract.submitTransaction('CreateContract', JSON.stringify({ id, test }));
        res.status(200).send({ transactionId: result.toString() });
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        res.status(500).send(error);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
