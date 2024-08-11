const express = require('express');
const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

const ccpPathOrg1 = path.resolve(__dirname, '..', 'api', 'connection-profiles', 'connection-org1.json');
const ccpOrg1 = JSON.parse(fs.readFileSync(ccpPathOrg1, 'utf8'));

const ccpPathOrg2 = path.resolve(__dirname, '..', 'api', 'connection-profiles', 'connection-org2.json');
const ccpOrg2 = JSON.parse(fs.readFileSync(ccpPathOrg2, 'utf8'));

async function sendTransaction(org, contractName, functionName, args) {
    try {
        const ccp = org === 'org1' ? ccpOrg1 : ccpOrg2;

        const walletPath = path.join(process.cwd(), '..', 'api-2.x', 'wallets', org);
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: 'admin',
            discovery: { enabled: true, asLocalhost: true }
        });

        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract(contractName);

        await contract.submitTransaction(functionName, ...args);
        console.log(`Transaction submitted successfully to ${org}.`);
        await gateway.disconnect();
        return true;
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        return false;
    }
}

app.post('/sendData', async (req, res) => {
    const { org, contractName, functionName, args } = req.body;
    if (!org || !contractName || !functionName || !args) {
        res.status(400).json({ error: 'Missing required parameters.' });
        return;
    }

    const success = await sendTransaction(org, contractName, functionName, args);
    if (success) {
        res.status(200).json({ message: 'Transaction submitted successfully.' });
    } else {
        res.status(500).json({ error: 'Failed to submit transaction.' });
    }
});

app.listen(port, () => {
    console.log(`API listening at http://34.70.10.73:${port}`);
});
