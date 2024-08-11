Docker run hello-world
docker run hello-world
docker version
clear
sudo apt-get update
sudo apt-get install   apt-transport-https   ca-certificates   curl   software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository  "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
 $(lsb_release -cs) \
 stable"
sudo apt-get update
sudo apt-get install -y docker-ce
sudo docker run hello-world
sudo groupadd docker
sudo usermod -aG docker $USER
docker version
curl -sL https://deb.nodesource.com/setup_16.x | sudo bash -
sudo apt-get install -y nodejs
curl -V
npm -v
docker-compose version
go version
node -v
clear
sudo apt-get install curl
sudo apt update
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh
source ~/.bashrc
nvm list-remote
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
source ~/.bashrc
nvm list-remote
nvm install v16.19.0
nvm list
sudo apt-get install npm
node -v
npm -v
sudo apt-get install python
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu/  $(lsb_release -cs)
stable"
sudo apt-get update
apt-cache policy docker-ce
sudo curl -L "https://github.com/docker/compose/releases/download/1.26.2/docker-compose-$(uname -
s)-$(uname -m)" -o /usr/local/bin/docker-compos
sudo chmod +x /usr/local/bin/docker-compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
docker-compose --version
sudo apt-get upgrade
docker run hello-world
sudo groupadd docker
sudo usermod -aG docker ${USER}
docker run hello-world
clear
curl -sSLO https://raw.githubusercontent.com/hyperledger/fabric/main/scripts/install-fabric.sh && chmod +x install-fabric.sh
./install-fabric.sh -h
./install-fabric.sh --fabric-version 2.5.5 -c 1.5.7
ls
cd fabric-samples/
cd bin/
ls
pwd
vim  ~/.bashrc
source ~/.bashrc
cd .. 
cd test-network
ls
./network.sh
./network.sh up createChannel -ca -c mychannel -s couchdb
sudo apt-get update
cd ..
sudo apt-get install -y jq
jq --version
cd /fabric-samples/test-network
cd fabric-samples/
cd test-network
./network.sh up createChannel -ca -c mychannel -s couchdb
ls
./network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-javascript/ -ccl javascript
docker ps
./network.sh
./network.sh down
docker ps
clear
cd --
sudo apt install unzip
unzip e-contract-main (1).zip
unzip e-contract-main.zip
cd blockchain/artifacts/channel/create-certificate-with-ca/
docker-compose up -d
docker ps
clear
docker ps | grep couchdb
docker exec -it couchdb0 sh -c 'grep bind_address /opt/couchdb/etc/local.ini'
docker inspect couchdb0 | grep '"Ports"'
docker exec -it couchdb0 sh
docker exec -it couchdb0 sh
docker ps
docker logs couchdb0
docker exec -it couchdb0 sh
curl http://34.122.101.24:6984
docker exec -it couchdb0 sh -c 'grep bind_address /opt/couchdb/etc/local.ini'
docker exec -it couchdb0 sh
docker exec -it couchdb1 sh
docker exec -it couchdb2 sh
docker exec -it couchdb0 sh -c 'grep bind_address /opt/couchdb/etc/local.ini'
curl http://34.122.101.24:5984
./deployChaincode.sh
docker logs peer0.org1.example.com -f
cd blockchain/Explorer
docker-compose up -d
docker ps
docker logs explorer.mynetwork.com
docker ps
cd blockchain/artifacts/channel/create-certificate-with-ca/
docker-compose up -d
docker ps
./create-certificate-with-ca.sh
clear
cd ..
ls
./create-artifacts.sh
cd ..
clear
docker ps 
docker-compose up -d
docker ps 
docker ps -a
docker logs orderer
docker logs hyperledger/fabric-orderer
docker logs orderer.example.com
clear
cd ..
cd scripts/
ls
./createChannel.sh
cleae
clear
./deployChaincode.sh
peer version
peer -h
clear
./deployChaincode.sh
clear
./deployChaincode.sh
docker ps
./deployChaincode.sh
clear
node -v
npm list express
mkdir fabric-api
cd fabric-api
npm install express body-parser
npm list express
npm install fabric-network
curl -X POST 34.70.10.73:/create-contract -H "Content-Type: application/json" -d '{"id":"1", "test":"Hello World"}'
clear
curl -X POST http://34.70.10.73:3000/create-contract -H "Content-Type: application/json" -d '{"id":"1", "test":"Hello World"}'
node your-script-file.js
cd fabric-api/server.js
cd fabric-api
node your-script-file.js
clear
node server.js
cd blockchain/scripts/
./deployChaincode.sh
cd fabric-api
node server.js
curl -X POST http://34.70.10.73:3000/create-contract -H "Content-Type: application/json" -d '{"id": "1", "test": "Hello World"}'
npm install axios
node test-api.js
cd fabric-api
node test-api.js
cd fabric-api/
ls
node server.js
clear
node enrollAdmin.js
npm install fabric-ca-client
node enrollAdmin.js
cd fabric-api/
ls
npm init -y
cd fabric-api/
curl http://<your-public-api>:3000/enrollAdmin
clear
curl http://34.70.10.73:3000/enrollAdmin
node src/app.js
cd fabric-api/src
node app.js
clear
node app.js
curl -X POST http://34.70.10.73:3000/invokeChaincode -H "Content-Type: application/json" -d '{
    "functionName": "CreateContract",
    "args": ["{\"id\":\"7\", \"test\":\"hello from api\"}"]
}'
clear
curl -X POST http://34.70.10.73:3000/invokeChaincode -H "Content-Type: application/json" -d '{
    "functionName": "CreateContract",
    "args": ["{\"id\":\"7\", \"test\":\"hello from api\"}"]
}'
cd fabric-api/
curl -X POST http://34.70.10.73:3000/invokeChaincode -H "Content-Type: application/json" -d '{
    "functionName": "CreateContract",
    "args": ["{\"id\":\"7\", \"test\":\"hello from api\"}"]
}'
curl -X POST http://34.70.10.73:3000/sendData -H "Content-Type: application/json" -d '{
    "org": "org1",
    "contractName": "agreement",
    "functionName": "CreateContract",
    "args": ["{\"id\":\"7\", \"test\":\"hello from API\"}"]
}'
curl -X POST http://localhost:3000/invokeChaincode -H "Content-Type: application/json" -d '{
    "functionName": "CreateContract",
    "args": ["{\"id\":\"7\", \"test\":\"hello from API\"}"]
}'
npm install express body-parser
clear
node app.js
cd fabric-api/
node app.js
cd blockchain/scripts/
./deployChaincode.sh
cd blockchain/scripts/
./deployChaincode.sh
cd blockchain/scripts/
./deployChaincode.sh
