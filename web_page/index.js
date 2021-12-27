var web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545/'));

var contractAddress = '0x6c93e8375735080fca567572537516FFa76964d9';
var abi = JSON.parse(
  '[    {      "inputs": [],      "stateMutability": "nonpayable",      "type": "constructor"    },    {      "anonymous": false,      "inputs": [        {          "indexed": false,          "internalType": "uint256",          "name": "_propositionId",          "type": "uint256"        },        {          "indexed": false,          "internalType": "uint256",          "name": "_scrutinId",          "type": "uint256"        },        {          "indexed": false,          "internalType": "string",          "name": "_description",          "type": "string"        }      ],      "name": "ProposalCreated",      "type": "event"    },    {      "anonymous": false,      "inputs": [        {          "indexed": false,          "internalType": "uint256",          "name": "_scrutinId",          "type": "uint256"        },        {          "indexed": false,          "internalType": "string",          "name": "_name",          "type": "string"        },        {          "indexed": false,          "internalType": "address",          "name": "_scrutinOwner",          "type": "address"        }      ],      "name": "ScrutinCreated",      "type": "event"    },    {      "anonymous": false,      "inputs": [        {          "indexed": false,          "internalType": "uint256",          "name": "_scrutinId",          "type": "uint256"        },        {          "indexed": false,          "internalType": "uint256",          "name": "_propositionId",          "type": "uint256"        },        {          "indexed": false,          "internalType": "uint256",          "name": "_counter",          "type": "uint256"        }      ],      "name": "VoteSubmitted",      "type": "event"    },    {      "inputs": [],      "name": "errorMessage",      "outputs": [        {          "internalType": "string",          "name": "",          "type": "string"        }      ],      "stateMutability": "view",      "type": "function"    },    {      "inputs": [],      "name": "owner",      "outputs": [        {          "internalType": "address payable",          "name": "",          "type": "address"        }      ],      "stateMutability": "view",      "type": "function"    },    {      "inputs": [        {          "internalType": "uint256",          "name": "",          "type": "uint256"        }      ],      "name": "propositions",      "outputs": [        {          "internalType": "uint256",          "name": "scrutinId",          "type": "uint256"        },        {          "internalType": "string",          "name": "description",          "type": "string"        },        {          "internalType": "uint256",          "name": "counter",          "type": "uint256"        }      ],      "stateMutability": "view",      "type": "function"    },    {      "inputs": [        {          "internalType": "uint256",          "name": "",          "type": "uint256"        }      ],      "name": "scrutins",      "outputs": [        {          "internalType": "string",          "name": "name",          "type": "string"        },        {          "internalType": "address",          "name": "scrutinOwner",          "type": "address"        },        {          "internalType": "bool",          "name": "isStarted",          "type": "bool"        }      ],      "stateMutability": "view",      "type": "function"    },    {      "inputs": [],      "name": "kill",      "outputs": [],      "stateMutability": "nonpayable",      "type": "function"    },    {      "inputs": [        {          "internalType": "string",          "name": "_name",          "type": "string"        }      ],      "name": "createScrutin",      "outputs": [],      "stateMutability": "nonpayable",      "type": "function"    },    {      "inputs": [        {          "internalType": "uint256",          "name": "_scrutinId",          "type": "uint256"        },        {          "internalType": "string",          "name": "_description",          "type": "string"        }      ],      "name": "createProposal",      "outputs": [],      "stateMutability": "nonpayable",      "type": "function"    },    {      "inputs": [        {          "internalType": "uint256",          "name": "_propositionId",          "type": "uint256"        }      ],      "name": "submitVote",      "outputs": [],      "stateMutability": "nonpayable",      "type": "function"    },    {      "inputs": [],      "name": "getScrutins",      "outputs": [        {          "components": [            {              "internalType": "string",              "name": "name",              "type": "string"            },            {              "internalType": "address",              "name": "scrutinOwner",              "type": "address"            },            {              "internalType": "bool",              "name": "isStarted",              "type": "bool"            }          ],          "internalType": "struct Election.Scrutin[]",          "name": "",          "type": "tuple[]"        }      ],      "stateMutability": "view",      "type": "function"    },    {      "inputs": [],      "name": "getProposition",      "outputs": [        {          "components": [            {              "internalType": "uint256",              "name": "scrutinId",              "type": "uint256"            },            {              "internalType": "string",              "name": "description",              "type": "string"            },            {              "internalType": "uint256",              "name": "counter",              "type": "uint256"            }          ],          "internalType": "struct Election.Proposition[]",          "name": "",          "type": "tuple[]"        }      ],      "stateMutability": "view",      "type": "function"    }  ]'
);

contract = new web3.eth.Contract(abi, contractAddress);

var account;
var loading = false;

web3.eth.getAccounts(function (err, accounts) {
  if (err != null) {
    alert('Error retrieving accounts.');
    return;
  }
  if (accounts.length == 0) {
    alert('No account found! Make sure the Ethereum client is configured properly.');
    return;
  }
  account = accounts[0];
  console.log('Account: ' + account);
  console.log('methods : ' + contract.methods);
  web3.eth.defaultAccount = account;
});

function createScrutin() {
  info = $('#createScrutinName').val();
  contract.methods
    .createScrutin(info)
    .send({ from: account })
    .then(function (tx) {
      console.log('Transaction: ', tx);
      registerGetInfo();
    });
  $('#createScrutinName').val('');
}

function createProposal() {
  proposalName = $('#createProposalName').val();
  scrutinChoosed = $('#inputGroupSelectScrutin option:selected').text();
  scrutinChoosedId = parseInt($('#inputGroupSelectScrutin option:selected').val());
  if (scrutinChoosed !== 'Choose...') {
    contract.methods
      .createProposal(scrutinChoosedId, proposalName)
      .send({ from: account })
      .then(function (tx) {
        console.log('Transaction: ', tx);
        registerGetInfo();
      });
    $('#createProposalName').val('');
  } else {
    Alert('hendek');
  }
}

function registerGetInfo() {
  contract.methods
    .getScrutins()
    .call()
    .then(function (info) {
      document.getElementById('scrutinPage').style.visibility = 'hidden';
      var goToScrutinList = document.getElementById('inputGroupGoToScrutin');
      var createProposalScrutinChoice = document.getElementById('inputGroupSelectScrutin');
      while (goToScrutinList.firstChild) {
        goToScrutinList.removeChild(goToScrutinList.firstChild);
      }
      while (createProposalScrutinChoice.firstChild) {
        createProposalScrutinChoice.removeChild(createProposalScrutinChoice.firstChild);
      }
      isLoading();

      for (var i = 0; i < info.length; i++) {
        var opt = info[i].name;
        var textChoice_proposal = document.createTextNode(opt);
        var option_proposal = document.createElement('option');
        option_proposal.appendChild(textChoice_proposal);
        option_proposal.value = i;
        createProposalScrutinChoice.appendChild(option_proposal);
        var textChoice_scrutin = document.createTextNode(opt);
        var option_scrutin = document.createElement('option');
        option_scrutin.appendChild(textChoice_scrutin);
        option_scrutin.value = i;
        goToScrutinList.appendChild(option_scrutin);
      }
    });
}

document.onreadystatechange = function () {
  var state = document.readyState;
  if (state == 'interactive') {
    document.getElementById('contents').style.visibility = 'hidden';
  } else if (state == 'complete') {
    setTimeout(function () {
      document.getElementById('interactive');
      document.getElementById('load').style.visibility = 'hidden';
      document.getElementById('contents').style.visibility = 'visible';
    }, 1000);
  }
};

function isLoading() {
  if (loading) {
    document.getElementById('contents').style.visibility = 'hidden';
    document.getElementById('load').style.visibility = 'visible';
    loading = false;
  } else {
    document.getElementById('load').style.visibility = 'hidden';
    document.getElementById('contents').style.visibility = 'visible';
    loading = true;
  }
}

function switchPage(isGoingToScrutin) {
  if (isGoingToScrutin) {
    document.getElementById('home').style.visibility = 'hidden';
    document.getElementById('scrutinPage').style.visibility = 'visible';
  } else {
    document.getElementById('home').style.visibility = 'visible';
    document.getElementById('scrutinPage').style.visibility = 'hidden';
  }
}

function goToSrutin() {
  contract.methods
    .getProposition()
    .call()
    .then(function (propositions) {
      contract.methods
        .getScrutins()
        .call()
        .then(function (scrutins) {
          scrutinBody = document.getElementById('scrutinBody');
          while (scrutinBody.firstChild) {
            scrutinBody.removeChild(scrutinBody.lastChild);
          }
          var scrutinTitle = document.createElement('h1');
          scrutinTitle.id = 'scrutinTitle';
          scrutinTitle.classList.add('page-header');
          scrutinTitle.style = 'text-align: center;';

          var goHomeButton = document.createElement('button');
          goHomeButton.type = 'button';
          goHomeButton.classList.add('btn', 'btn-outline-dark');
          goHomeButton.style = 'margin-left: 150px;';
          goHomeButton.onclick = function () {
            window.location.href = 'http://localhost:3300/';
          };
          var textHomeButton = document.createTextNode('Go back to the home page');
          goHomeButton.appendChild(textHomeButton);

          var cardDeck = document.createElement('div');
          cardDeck.id = 'cardDeck';
          cardDeck.classList.add('row', 'row-cols-1', 'row-cols-md-3', 'g-4');

          scrutinBody.appendChild(scrutinTitle);
          scrutinBody.appendChild(goHomeButton);
          scrutinBody.appendChild(cardDeck);

          document.getElementById('scrutinPage').style.visibility = 'hidden';
          switchPage(true);
          scrutinChoosed = $('#inputGroupGoToScrutin option:selected').text();
          document.getElementById('scrutinTitle').innerHTML = scrutinChoosed;
          var cardList = document.getElementById('cardDeck');

          for (var i = 0; i < propositions.length; i++) {
            if (scrutins[propositions[i].scrutinId].name == scrutinChoosed) {
              var opt = propositions[i].description;
              var propositionID = i;

              var cardCol = document.createElement('div');
              cardCol.classList.add('col');

              var card = document.createElement('div');
              card.classList.add('card-body');

              var cardCenter = document.createElement('div');
              cardCenter.classList.add('card', 'text-center');
              cardCenter.style = 'width: 16rem; margin-top: 3rem';

              var cardTitle = document.createElement('h5');
              cardTitle.classList.add('card-title');
              var text = document.createTextNode(opt);
              cardTitle.appendChild(text);

              var cardCount = document.createElement('div');
              cardCount.classList.add('card-body');
              var text2 = document.createTextNode('Number of votes : ' + propositions[i].counter);
              cardCount.appendChild(text2);

              var voteButton = document.createElement('a');
              voteButton.classList.add('btn', 'btn-primary');
              voteButton.id = '' + i;

              voteButton.onclick = function () {
                submitVote(parseInt(this.id));
              };

              var textButton = document.createTextNode('Vote !');
              voteButton.appendChild(textButton);
              card.appendChild(cardTitle);

              card.appendChild(cardCount);

              card.appendChild(voteButton);
              cardCenter.appendChild(card);

              cardCol.appendChild(cardCenter);
              cardList.appendChild(cardCol);
            }
          }
        });
    });
}
function submitVote(propositionId) {
  document.getElementById('scrutinPage').style.visibility = 'hidden';
  document.getElementById('load').style.visibility = 'visible';
  contract.methods
    .submitVote(propositionId)
    .send({ from: account })
    .then(function (info) {
      console.log(info);
      goToSrutin();
      document.getElementById('scrutinPage').style.visibility = 'visible';
      document.getElementById('load').style.visibility = 'hidden';
    })
    .catch((error) => {
      console.log(error);
      goToSrutin();
      document.getElementById('scrutinPage').style.visibility = 'visible';
      document.getElementById('load').style.visibility = 'hidden';
      alert('You already voted');
    });
}
registerGetInfo();
