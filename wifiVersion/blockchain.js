const crypto = require('crypto');

class Block {
  constructor(index, votes, previousHash) {
    this.index = index;
    this.timestamp = Date.now();
    this.votes = votes;           // array of vote objects
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return crypto.createHash('sha256')
      .update(this.index + this.timestamp + JSON.stringify(this.votes) + this.previousHash)
      .digest('hex');
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesis()];
    this.pendingVotes = [];
    this.usedVoterIds = new Set(); // prevent double voting
  }

  createGenesis() {
    return new Block(0, [], "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  castVote(voterId, candidate) {
    if (this.usedVoterIds.has(voterId)) {
      return { success: false, message: "Already voted!" };
    }
    this.usedVoterIds.add(voterId);
    this.pendingVotes.push({ voterId, candidate, timestamp: Date.now() });
    this.minePendingVotes();
    return { success: true, message: "Vote recorded!" };
  }

  minePendingVotes() {
    const block = new Block(
      this.chain.length,
      [...this.pendingVotes],
      this.getLatestBlock().hash
    );
    this.chain.push(block);
    this.pendingVotes = [];
  }

  getTally() {
    const tally = {};
    for (const block of this.chain) {
      for (const vote of block.votes) {
        tally[vote.candidate] = (tally[vote.candidate] || 0) + 1;
      }
    }
    return tally;
  }

  isValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const current = this.chain[i];
      const previous = this.chain[i - 1];
      if (current.hash !== current.calculateHash()) return false;
      if (current.previousHash !== previous.hash) return false;
    }
    return true;
  }

  replaceChain(newChain) {
    if (newChain.length > this.chain.length) {
      this.chain = newChain;
      // Rebuild usedVoterIds from new chain
      this.usedVoterIds = new Set();
      for (const block of this.chain) {
        for (const vote of block.votes) {
          this.usedVoterIds.add(vote.voterId);
        }
      }
    }
  }
}

module.exports = Blockchain;