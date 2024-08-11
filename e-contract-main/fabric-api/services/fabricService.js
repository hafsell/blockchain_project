const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

const ccpPath = path.resolve(__dirname, '..', 'connection-profiles', 'connection-org1.json');
const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

async function invokeChaincode(functionName, args) {
    try {
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'admin', discovery: { enabled: true, asLocalhost: true } });

        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('agreement');

        const result = await contract.submitTransaction(functionName, ...args);
        await gateway.disconnect();

        return result.toString();
    } catch (error) {
        console.error(`Failed to invoke chaincode: ${error}`);
        throw new Error(error);
    }
}

module.exports = { invokeChaincode };
