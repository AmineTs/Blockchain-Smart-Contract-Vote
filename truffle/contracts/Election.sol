// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Election {
    address payable public owner;

    struct Scrutin {
        string name;
        address scrutinOwner;
        bool isStarted;
    }

    struct Proposition {
        uint256 scrutinId;
        string description;
        uint256 counter;
    }

    Scrutin[] public scrutins;
    Proposition[] public propositions;
    string public errorMessage;

    mapping(address => mapping(uint256 => bool)) private isScrutinVoted;

    event VoteSubmitted(
        uint256 _scrutinId,
        uint256 _propositionId,
        uint256 _counter
    );
    event ScrutinCreated(
        uint256 _scrutinId,
        string _name,
        address _scrutinOwner
    );
    event ProposalCreated(
        uint256 _propositionId,
        uint256 _scrutinId,
        string _description
    );

    constructor() {
        owner = payable(msg.sender);
    }

    function kill() external {
        require(
            payable(msg.sender) == owner,
            "You are not allowed to kill this contract, you are not the owner"
        );
        selfdestruct(owner);
    }

    function createScrutin(string memory _name) public {
        scrutins.push(Scrutin(_name, msg.sender, false));
        uint256 _scrutinId = scrutins.length - 1;
        emit ScrutinCreated(_scrutinId, _name, msg.sender);
    }

    function createProposal(uint256 _scrutinId, string memory _description)
        public
    {
        Scrutin storage scrutin = scrutins[_scrutinId];

        require(scrutin.scrutinOwner == msg.sender);

        propositions.push(Proposition(_scrutinId, _description, 0));
        uint256 _propositionId = propositions.length - 1;
        emit ProposalCreated(_propositionId, _scrutinId, _description);
    }

    function submitVote(uint256 _propositionId) public {
        Proposition storage proposition = propositions[_propositionId];

        require(isScrutinVoted[msg.sender][proposition.scrutinId] == false);

        proposition.counter++;

        propositions[_propositionId] = proposition;
        isScrutinVoted[msg.sender][proposition.scrutinId] = true;

        emit VoteSubmitted(
            proposition.scrutinId,
            _propositionId,
            proposition.counter
        );
    }

    function getScrutins() public view returns (Scrutin[] memory) {
        return scrutins;
    }

    function getProposition() public view returns (Proposition[] memory) {
        return propositions;
    }
}
