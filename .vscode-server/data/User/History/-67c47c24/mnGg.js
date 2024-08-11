const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const { FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

const ccpPath = path.resolve(__dirname, 'connection.json');
const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

app.use(bodyParser.json());

// Enroll Admin
app.post('/enrollAdmin', async (req, res) => {
    try {
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);

        const adminExists = await wallet.exists('admin');
        if (adminExists) {
            res.json({ message: 'Admin identity already exists in the wallet' });
            return;
        }

        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: 'admin',
            discovery: { enabled: true, asLocalhost: true }
        });

        const ca = gateway.getClient().getCertificateAuthority();
        const adminIdentity = gateway.getCurrentIdentity();

        const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes()
            },
            mspId: 'Org1MSP',
            type: 'X.509'
        };

        await wallet.import('admin', x509Identity);
        res.json({ message: 'Admin enrolled successfully' });
    } catch (error) {
        res.status(500).json({ error: `Failed to enroll admin: ${error}` });
    }
});

// Register User
app.post('/registerUser', async (req, res) => {
    try {
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);

        const userExists = await wallet.exists('user1');
        if (userExists) {
            res.json({ message: 'User identity already exists in the wallet' });
            return;
        }

        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: 'admin',
            discovery: { enabled: true, asLocalhost: true }
        });

        const ca = gateway.getClient().getCertificateAuthority();
        const adminIdentity = gateway.getCurrentIdentity();

        const secret = await ca.register({
            enrollmentID: 'user1',
            role: 'client'
        }, adminIdentity);

        const enrollment = await ca.enroll({ enrollmentID: 'user1', enrollmentSecret: secret });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes()
            },
            mspId: 'Org1MSP',
            type: 'X.509'
        };

        await wallet.import('user1', x509Identity);
        res.json({ message: 'User registered and enrolled successfully' });
    } catch (error) {
        res.status(500).json({ error: `Failed to register user: ${error}` });
    }
});

// Invoke Chaincode
app.post('/invokeChaincode', async (req, res) => {
    const { functionName, args } = req.body;
    try {
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);

        const userExists = await wallet.exists('user1');
        if (!userExists) {
            res.status(400).json({ error: 'User identity not found in the wallet' });
            return;
        }

        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: 'user1',
            discovery: { enabled: true, asLocalhost: true }
        });

        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('agreement');

        const result = await contract.submitTransaction(functionName, ...args);
        res.json({ result: result.toString() });
    } catch (error) {
        res.status(500).json({ error: `Failed to invoke chaincode: ${error}` });
    }
});

app.listen(port, () => {
    console.log(`API listening at http://localhost:${port}`);
});
