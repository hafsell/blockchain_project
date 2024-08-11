const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const fs = require('fs');

const connectToGateway = async (orgMsp) => {
    const ccpPath = path.resolve(__dirname, '..', '..', 'connection-profiles', `connection-${orgMsp}.json`);
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    const walletPath = path.join(process.cwd(), 'wallets', orgMsp);
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const gateway = new Gateway();
    await gateway.connect(ccp, {
        wallet,
        identity: 'admin',  // Adjust as necessary
        discovery: { enabled: true, asLocalhost: true },
    });

    return gateway;
};

exports.invoke = async (orgMsp, fcn, args) => {
    const gateway = await connectToGateway(orgMsp);
    const network = await gateway.getNetwork('mychannel');  // Adjust channel name as necessary
    const contract = network.getContract('mycc');  // Adjust chaincode name as necessary

    const result = await contract.submitTransaction(fcn, ...args);
    await gateway.disconnect();

    return result.toString();
};

exports.query = async (orgMsp, fcn, args) => {
    const gateway = await connectToGateway(orgMsp);
    const network = await gateway.getNetwork('mychannel');  // Adjust channel name as necessary
    const contract = network.getContract('mycc');  // Adjust chaincode name as necessary

    const result = await contract.evaluateTransaction(fcn, ...args);
    await gateway.disconnect();

    return result.toString();
};

exports.enrollAdmin = async (orgName) => {
    try {
        const ccpPath = path.resolve(__dirname, '..', '..', 'connection-profiles', `connection-${orgName}.json`);
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        const caInfo = ccp.certificateAuthorities[`ca.${orgName}.example.com`];
        const caTLSCACertsPath = path.resolve(__dirname, '..', '..', 'crypto-config', 'peerOrganizations', `${orgName}.example.com`, 'tlsca', `tlsca.${orgName}.example.com-cert.pem`);
        const caTLSCACerts = fs.readFileSync(caTLSCACertsPath);
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

        const walletPath = path.join(process.cwd(), 'wallets', `${orgName}MSP`);
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        const adminExists = await wallet.get('admin');
        if (adminExists) {
            console.log('An identity for the admin user already exists in the wallet');
            return;
        }

        const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
        const identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: `${orgName}MSP`,
            type: 'X.509',
        };
        await wallet.put('admin', identity);
        console.log('Successfully enrolled admin user and imported it into the wallet');
    } catch (error) {
        console.error(`Failed to enroll admin user: ${error}`);
        throw new Error(`Failed to enroll admin user: ${error}`);
    }
};

exports.registerUser = async (orgName, userId, userType) => {
    try {
        const ccpPath = path.resolve(__dirname, '..', '..', 'connection-profiles', `connection-${orgName}.json`);
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        const caInfo = ccp.certificateAuthorities[`ca.${orgName}.example.com`];
        const caTLSCACertsPath = path.resolve(__dirname, '..', '..', 'crypto-config', 'peerOrganizations', `${orgName}.example.com`, 'tlsca', `tlsca.${orgName}.example.com-cert.pem`);
        const caTLSCACerts = fs.readFileSync(caTLSCACertsPath);
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

        const walletPath = path.join(process.cwd(), 'wallets', `${orgName}MSP`);
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        const userExists = await wallet.get(userId);
        if (userExists) {
            console.log(`An identity for the user ${userId} already exists in the wallet`);
            return;
        }

        const adminIdentity = await wallet.get('admin');
        if (!adminIdentity) {
            console.log('An identity for the admin user does not exist in the wallet');
            console.log('Enroll the admin user before retrying');
            return;
        }

        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, 'admin');

        const secret = await ca.register({
            affiliation: `${orgName}.department1`,
            enrollmentID: userId,
            role: userType,
        }, adminUser);

        const enrollment = await ca.enroll({
            enrollmentID: userId,
            enrollmentSecret: secret,
        });

        const userIdentity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: `${orgName}MSP`,
            type: 'X.509',
        };
        await wallet.put(userId, userIdentity);
        console.log(`Successfully registered and enrolled user ${userId} and imported it into the wallet`);
    } catch (error) {
        console.error(`Failed to register user ${userId}: ${error}`);
        throw new Error(`Failed to register user ${userId}: ${error}`);
    }
};
