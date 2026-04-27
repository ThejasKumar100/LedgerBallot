// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {

    // ── Data structures ──────────────────────────────

    struct Candidate {
        uint    id;
        string  name;
        uint    voteCount;
    }

    address public admin;
    bool   public votingOpen;

    mapping(uint => Candidate) public candidates;
    mapping(address => bool)   public hasVoted;
    uint public candidateCount;
    uint public totalVotes;

    // ── Events (logged on-chain) ──────────────────────

    event VoteCast(address indexed voter, uint indexed candidateId);
    event CandidateAdded(uint id, string name);
    event VotingStatusChanged(bool isOpen);

    // ── Modifiers ─────────────────────────────────────

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can do this");
        _;
    }

    modifier whenOpen() {
        require(votingOpen, "Voting is not open");
        _;
    }

    // ── Constructor ───────────────────────────────────

    constructor() {
        admin = msg.sender;
        votingOpen = false;

        // Pre-load four candidates
        _addCandidate("Alice Chen");
        _addCandidate("Bob Rivera");
        _addCandidate("Carol Smith");
        _addCandidate("David Park");
    }

    // ── Internal helpers ──────────────────────────────

    function _addCandidate(string memory name) internal {
        candidateCount++;
        candidates[candidateCount] = Candidate(candidateCount, name, 0);
        emit CandidateAdded(candidateCount, name);
    }

    // ── Admin functions ───────────────────────────────

    /// Open or close the election
    function setVotingStatus(bool _open) external onlyAdmin {
        votingOpen = _open;
        emit VotingStatusChanged(_open);
    }

    /// Add a new candidate (admin only, before voting opens)
    function addCandidate(string calldata name) external onlyAdmin {
        require(!votingOpen, "Cannot add candidates during voting");
        _addCandidate(name);
    }

    // ── Voter functions ───────────────────────────────

    /// Cast a vote — each wallet address can only vote once
    function vote(uint candidateId) external whenOpen {
        require(!hasVoted[msg.sender],       "Already voted");
        require(candidateId >= 1 &&
                candidateId <= candidateCount, "Invalid candidate");

        hasVoted[msg.sender] = true;
        candidates[candidateId].voteCount++;
        totalVotes++;

        emit VoteCast(msg.sender, candidateId);
    }

    // ── View functions (free, no gas) ─────────────────

    /// Get full results for all candidates
    function getResults()
        external view
        returns (
            uint[]    memory ids,
            string[]  memory names,
            uint[]    memory votes
        )
    {
        ids   = new uint  [](candidateCount);
        names = new string[](candidateCount);
        votes = new uint  [](candidateCount);

        for (uint i = 1; i <= candidateCount; i++) {
            ids  [i-1] = candidates[i].id;
            names[i-1] = candidates[i].name;
            votes[i-1] = candidates[i].voteCount;
        }
    }

    /// Return the current winner (or leader during voting)
    function getWinner()
        external view
        returns (string memory winnerName, uint winnerVotes)
    {
        require(totalVotes > 0, "No votes cast yet");
        uint topId;
        for (uint i = 1; i <= candidateCount; i++) {
            if (candidates[i].voteCount > candidates[topId].voteCount) {
                topId = i;
            }
        }
        winnerName  = candidates[topId].name;
        winnerVotes = candidates[topId].voteCount;
    }
}