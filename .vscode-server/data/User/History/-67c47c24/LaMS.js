const express = require('express');
const { FileSystemWallet, Gateway } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Define the directory where the wallets will be stored
const walletPath = path.join(process.cwd(), '..', 'api-2.x', 'wallets');

async function enrollAdmin(orgName) {
    try {
        // Load the connection profile for the organization
        const ccpPath = path.resolve(__dirname, '..', 'api', 'connection-profiles', `connection-${orgName}.json`);
        const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
        const ccp = JSON.parse(ccpJSON);

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

// Define routes for enrolling admin for each organization
app.get('/enrollAdminOrg1', async (req, res) => {
    await enrollAdmin('org1');
    res.send('Admin enrolled successfully for Org1');
});

app.get('/enrollAdminOrg2', async (req, res) => {
    await enrollAdmin('org2');
    res.send('Admin enrolled successfully for Org2');
});

app.listen(port, () => {
    console.log(`API listening at http://34.70.10.73:${port}`);
});
