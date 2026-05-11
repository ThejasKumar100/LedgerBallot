# LedgerBallot

Authors:
- Charitha Sarraju
- Sravya Kotamraju
- Thejaswin Kumaran
- Vindhya Kaushal

# Project Description

BlockVote is a blockchain-based voting application built using Solidity, MetaMask, Remix IDE, and Ethereum Sepolia Testnet. The system allows an admin to register voters and create elections, while registered users can securely cast votes through their MetaMask wallets.

The project uses smart contracts to ensure transparency, security, and fairness throughout the voting process. All voting transactions are stored on the blockchain, preventing tampering, duplicate voting, and unauthorized access.

# BlockVote — Blockchain Voting System

## Project Description

BlockVote is a blockchain-based voting application built using Solidity, MetaMask, Remix IDE, and the Ethereum Sepolia Testnet. The system allows an admin to register voters and create elections, while registered users can securely cast votes through their MetaMask wallets.

The project uses smart contracts to ensure transparency, security, and fairness throughout the voting process. All voting transactions are stored on-chain, preventing tampering, duplicate voting, and unauthorized access.

## Technologies Used

- Solidity
- Ethereum Sepolia Testnet
- Remix IDE
- MetaMask
- HTML
- CSS
- JavaScript

---

# Setup Instructions

## Prerequisites

Before running the project, make sure you have:

- MetaMask installed in your browser
- At least 3 MetaMask accounts
  - Account 1 → Admin/Owner
  - Account 2 & 3 → Voters
- Sepolia testnet ETH in Account 1 for gas fees
- Remix IDE open at https://remix.ethereum.org

---

## Smart Contract Setup

### 1. Open Remix IDE

Create a new file called:

```solidity
VotingSystem.sol
```

### 2. Paste the smart contract code

Paste the full smart contract code into the file.

### 3. Compile the Contract

Open the Solidity Compiler tab and:

- Select compiler version `0.8.0`
- Click `Compile VotingSystem.sol`

Make sure the contract compiles successfully without errors.

### 4. Deploy the Contract

Open the Deploy & Run Transactions tab.

Set the environment to:

```text
Injected Provider - MetaMask
```

MetaMask will open automatically. Make sure Account 1 is selected since it will become the admin account.

Click `Deploy` and confirm the transaction in MetaMask.

### 5. Copy the Contract Address

After deployment, copy the deployed contract address shown under **Deployed Contracts**.

---

## Frontend Setup

### 1. Open the Frontend

Open the `index.html` file using a live server, CodePen, JSFiddle, or any online HTML compiler.

### 2. Update the Contract Address

Find the following line inside the JavaScript section:

```javascript
const CONTRACT_ADDRESS = "........";
```

Replace the placeholder address with the deployed smart contract address copied from Remix.

Save the file.

---

# Execution Instructions

## 1. Connect MetaMask

Open the frontend page in your browser.

Make sure MetaMask is connected to the **Sepolia Testnet** and Account 1 is active.

Click `Connect MetaMask`.

The application should display the connected wallet address.

---

## 2. Register Voters

Using Account 1:

- Copy the wallet address of Account 2
- Paste it into the Register Voter field
- Click `Register Voter`
- Confirm the transaction in MetaMask

Repeat the same process for Account 3.

---

## 3. Create an Election

Fill in:
- Election Name
- Candidate 1
- Candidate 2

Click `Create Election` and confirm the transaction in MetaMask.

---

## 4. Cast Votes

- Switch MetaMask to Account 2 or Account 3
- Reconnect the wallet
- Select the election
- Choose a candidate
- Click `Cast Vote`
- Confirm the transaction

---

## 5. Close the Election

- Switch back to Account 1
- Select the election under `Close Election`
- Click `Close Election`
- Confirm the transaction

The election status will update to closed and the winner will be displayed.

---

# Testing & Expected Behavior

The application was tested for the following cases:

- Only the admin account can register voters and create elections
- Duplicate voter registration is blocked
- Registered voters can cast votes successfully
- Double voting is prevented
- Unregistered accounts cannot vote
- Only the admin can close elections
