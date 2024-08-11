const express = require('express');
const { FileSystemWallet, Gateway } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Define the connection options for the Fabric network
const ccpPath = path.resolve(__dirname, '..', 'api', 'connection-profiles', 'connection-org1.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

// Define the directory where the wallets will be stored
const walletPath = path.join(process.cwd(), '..', 'api-2.x', 'wallets');

async function enrollAdmin(orgName) {
    try {
        // Create a new CA client for the organization
        const caInfo = ccp.certificateAuthorities[`ca.${orgName}.example.com`];
        const caTLSCACertsPath = path.resolve(__dirname, '..', 'crypto-config', 'peerOrganizations', `${orgName}.example.com`, 'tlsca', `tlsca.${orgName}.example.com-cert.pem`);
        const caTLSCACerts = fs.readFileSync(caTLSCACertsPath);
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

        // Create a new file system based wallet
        const wallet = new FileSystemWallet(walletPath);

        // Check if the admin exists
        const adminExists = await wallet.exists('admin');
        if (adminExists) {
            console.log('An identity for the admin user already exists in the wallet');
            return;
        }

        // Enroll the admin user
        const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
        const identity = {
            label: 'admin',
            certificate: enrollment.certificate,
            privateKey: enrollment.key.toBytes(),
            mspId: `${orgName}.msp`
        };
        await wallet.import('admin', identity);
        console.log('Successfully enrolled admin user and imported it into the wallet');
    } catch (error) {
        console.error(`Failed to enroll admin user: ${error}`);
        process.exit(1);
    }
}

async function registerUser(orgName, userId, userType) {
    try {
        // Create a new CA client for the organization
        const caInfo = ccp.certificateAuthorities[`ca.${orgName}.example.com`];
        const caTLSCACertsPath = path.resolve(__dirname, '..', 'crypto-config', 'peerOrganizations', `${orgName}.example.com`, 'tlsca', `tlsca.${orgName}.example.com-cert.pem`);
        const caTLSCACerts = fs.readFileSync(caTLSCACertsPath);
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

        // Create a new file system based wallet
        const wallet = new FileSystemWallet(walletPath);

        // Check if the user already exists
        const userExists = await wallet.exists(userId);
        if (userExists) {
            console.log(`An identity for the user ${userId} already exists in the wallet`);
            return;
        }

        // Enroll the admin user
        const adminExists = await wallet.exists('admin');
        if (!adminExists) {
            console.log('An identity for the admin user does not exist in the wallet');
            console.log('Run the enrollAdmin.js script before retrying');
            return;
        }

        // Create a new enrollment request for the user
        const enrollment = await ca.register({
            affiliation: `org1.department1`,
            enrollmentID: userId,
            role: userType,
        }, await wallet.export('admin'));

        const userIdentity = {
            label: userId,
            certificate: enrollment.certificate,
            privateKey: enrollment.key.toBytes(),
            mspId: `${orgName}.msp`
        };
        await wallet.import(userId, userIdentity);
        console.log(`Successfully registered and enrolled user ${userId} and imported it into the wallet`);
    } catch (error) {
        console.error(`Failed to register user ${userId}: ${error}`);
        process.exit(1);
    }
}

app.get('/enrollAdmin', async (req, res) => {
    await enrollAdmin('org1');
    await enrollAdmin('org2');
    res.send('Admins enrolled successfully');
});

app.get('/registerUser', async (req, res) => {
    await registerUser('org1', 'user1', 'client');
    await registerUser('org2', 'user2', 'client');
    res.send('Users registered successfully');
});

app.listen(port, () => {
    console.log(`API listening at http://localhost:${port}`);
});
