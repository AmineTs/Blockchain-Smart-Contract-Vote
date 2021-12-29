# Token Governance

This project has been realized in the framework of the final year Big Data course of the ECE Paris engineering school from December 1st to December 31st, 2021.

The project consists in the implementation of a private blockhain on which a decentralized application (dApp) must be deployed with which the user will be able to interact through a web interface, all this by setting up unit tests and isolating the elements in containers.

## Installation

To clone the repository :

1. Open Git Bash.
2. Change the current working directory to the location where you want the cloned directory.
3. Type `git clone` and paste the URL of the repo :

```bash
git clone https://github.com/AmineTs/Blockchain-Smart-Contract-Vote
```

## Usage

1. Make sure you installed [Nodejs](https://nodejs.org/en/download/) and [Docker Compose](https://docs.docker.com/compose/install/) on your machine
2. At the root of the projet (it will take 4 or 5 minutes depending on your machine) :

```bash
npm start
```

This command will **run containers** and **install all packages required**, then it will **deploy the smart contract on the blockhain** and **run the web app**.

If any error :

- Ensure that your account is the same displayed by the terminal and the one in [truffle/truffle-config.js](truffle/truffle-config.js):
  ![Alt text](img/error_1.PNG?raw=true 'error_1')

- Ensure that your contract adress is the same displayed by the terminal and the one in [web_page/index.js](web_page/index.js):
  ![Alt text](img/error_2.PNG?raw=true 'error_2')

If all is good, you should have this result :
![Alt text](img/npm_start.PNG?raw=true 'npm_start')

3. Then go to and create a Scrutin : [localhost:3300](http://localhost:3300/)
   To test the dApp, you should create a Scrutin :
   ![Alt text](img/create_scrutin.PNG?raw=true 'create_scrutin')
4. Then you should create minimum 2 proposal for the scrutin you just have created.
   ![Alt text](img/create_proposal.PNG?raw=true 'create_proposal')
5. You can now go to the Scrutin you just have created by selecting it and clicking on Go !
6. Finally you can vote for one of the proposition diplayed (Warning : you just have one vote per scrutin)
   ![Alt text](img/vote.PNG?raw=true 'vote')

## Description

### Private Blockchain

We chose the Ethereum network which is a peer to peer network made of several nodes that use an Ethereum client (Geth in our case).

Our private blockchain consists of:

- **Bootnode** : A node on which nodes that join the network connect first, it is constantly listening on port 30303 and used for peer discovery.
- **Miner** : The node that takes care of "mining" the blockchain, it creates new blocks in our blockchain.
- **Endpoint JSON-RPC** : A node that allows external interaction via http with our blockchain on port 8545.

To create the first block of the private blockchain, our ethereum client needs information (like the gas limit) which is stored in the file: [infra/genesis.json](infra/genesis.json)

To interconnect our 3 nodes, we set up the 172.16.254.0/28 subnet in a Docker network bridge using our [docker-compose.yaml](docker-compose.yaml) file

Once the 3 containers are deployed, we can verify that the miner is doing its job by connecting to the miner :
![Alt text](img/miner.PNG?raw=true 'miner')
If the miner manages to mine our blockchain then all the conditions are met to deploy our smart contract.

### Smart Contract & Tests

Our smart contract is in the file [truffle/contracts/Election.sol](truffle/contracts/Election.sol), our voting system is made of 5 main functionalities:

1. The creation of a ballot (createScrutin) which allows to create a ballot by indicating its name in parameter.
2. The creation of a voting proposal (createProposal) which creates a proposal assigned to a ballot, to create a proposal we must fill in the id of the ballot of the proposal and the description of the voting proposal.
3. Send a vote (submitVote) which allows you to vote for a given proposal by entering its id as a parameter.
4. The display of votes (getScrutins) which returns the list of existing votes.
5. The proposal display (getProposition) which returns the list of existing proposals.

We set up unit tests located in the file: [truffle/test/TestElection.js](truffle/test/TestElection.js) these tests allowing us to verify that our functions fulfill their role :
![Alt text](img/tests.PNG?raw=true 'tests')

This smart contract is then deployed on our blockchain.

### Web App

Once our blockchain is up and running and our smart contract is deployed, we can now access our dApp from a web interface made of :

- Javascript file : [web_page/index.js](web_page/index.js)
- Html file : [web_page/index.html](web_page/index.html)
- As well as an express server: [web_page/server.js](web_page/index.html)

Once the server is launched we can go to the link: http://localhost:3300/
![Alt text](img/web_home.PNG?raw=true 'web_home')

## Authors

Amine TSOULI & Akram Rekik

amine.tsouli@edu.ece.fr & akram.rekik@edu.ece.fr

ECE Paris - Engineering Students
