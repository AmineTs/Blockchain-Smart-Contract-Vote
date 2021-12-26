const Election = artifacts.require('Election');
const truffleAssert = require('truffle-assertions');

contract('Election', (accounts) => {
  let contract;
  const ownerAccount = accounts[0];

  console.log(accounts);

  // build up and tear down a new Vote contract before each test
  beforeEach(async () => {
    contract = await Election.new({ from: ownerAccount });
  });

  it('Create a Scrutin', async () => {
    let newScrutinName = 'new scrutin';
    tx = await contract.createScrutin(newScrutinName);
    truffleAssert.eventEmitted(tx, 'ScrutinCreated', (ev) => {
      return ev._scrutinId.words[0] === 0 && ev._scrutinOwner === ownerAccount && ev._name === 'new scrutin';
    });
  });

  it('Create Proposal on existing Scrutin', async () => {
    const newScrutinName = 'Best French city ?';
    let newScrutinId;

    const tx = await contract.createScrutin(newScrutinName);
    truffleAssert.eventEmitted(tx, 'ScrutinCreated', (ev) => {
      newScrutinId = ev._scrutinId.words[0];
      return newScrutinId === 0 && ev._scrutinOwner === ownerAccount && ev._name === newScrutinName;
    });
    const newProposalDescription = 'Paris';
    const txProposal = await contract.createProposal(newScrutinId, newProposalDescription);
    truffleAssert.eventEmitted(txProposal, 'ProposalCreated', (ev) => {
      return ev._propositionId.words[0] === 0 && ev._scrutinId.words[0] === newScrutinId && ev._description === newProposalDescription;
    });
  });

  async function scrutinCreated(newScrutinName, scrutinOwner, newScrutinId) {
    const tx = await contract.createScrutin(newScrutinName, { from: scrutinOwner });
    truffleAssert.eventEmitted(tx, 'ScrutinCreated', (ev) => {
      newScrutinId = ev._scrutinId.words[0];
      return newScrutinId === 0 && ev._scrutinOwner === scrutinOwner && ev._name === newScrutinName;
    });
    return newScrutinId;
  }

  it('Submit vote on an Existing Proposal', async () => {
    const newScrutinName = 'Best French city ?';
    let newScrutinId;
    let newProposalId;

    newScrutinId = await scrutinCreated(newScrutinName, ownerAccount);
    const newProposalDescription = 'Paris';
    newProposalId = await proposalCreated(newScrutinId, newProposalDescription);
    const txVoteSubmission = await contract.submitVote(newProposalId);
    truffleAssert.eventEmitted(txVoteSubmission, 'VoteSubmitted', (ev) => {
      return ev._scrutinId.words[0] === newScrutinId && ev._propositionId.words[0] === newProposalId && ev._counter.words[0] === 1;
    });
  });

  async function scrutinCreated(newScrutinName, scrutinOwner) {
    let newScrutinId;
    const tx = await contract.createScrutin(newScrutinName, { from: scrutinOwner });
    truffleAssert.eventEmitted(tx, 'ScrutinCreated', (ev) => {
      newScrutinId = ev._scrutinId.words[0];
      return newScrutinId === 0 && ev._scrutinOwner === scrutinOwner && ev._name === newScrutinName;
    });
    return newScrutinId;
  }

  async function proposalCreated(newScrutinId, newProposalDescription) {
    let newProposalId;
    const txProposal = await contract.createProposal(newScrutinId, newProposalDescription);
    truffleAssert.eventEmitted(txProposal, 'ProposalCreated', (ev) => {
      newProposalId = ev._propositionId.words[0];
      return ev._propositionId.words[0] === 0 && ev._scrutinId.words[0] === newScrutinId && ev._description === newProposalDescription;
    });
    return newProposalId;
  }

  it('Vote fails if the user has already voted for this scrutin', async () => {
    const newScrutinName = 'Best French city ?';
    let newScrutinId;
    let newProposalId;

    newScrutinId = await scrutinCreated(newScrutinName, ownerAccount);
    const newProposalDescription = 'Paris';
    newProposalId = await proposalCreated(newScrutinId, newProposalDescription);
    await contract.submitVote(newProposalId);
    truffleAssert.fails(contract.submitVote(newProposalId));
  });

  afterEach(async () => {
    await contract.kill({ from: ownerAccount });
  });
});
