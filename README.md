# Alchemy Account Kit - EIP-7702 Demo

This demo showcases how to upgrade a regular Ethereum account (EOA) to a Smart Wallet using EIP-7702, without changing the address or migrating assets. Using Alchemy's Account Kit, we demonstrate how to:
1. Upgrade an EOA to support Smart Wallet features via EIP-7702
2. Use the EIP-7702-enabled Smart Wallet to interact with smart contracts
3. Maintain the same address while gaining powerful wallet capabilities through EIP-7702

## What is EIP-7702?

EIP-7702 is a groundbreaking Ethereum protocol feature that enables:
- Upgrading regular EOAs to Smart Wallets **without changing their address**
- Keeping all existing assets and history in place
- Adding advanced features like batching, gas sponsorship, and session keys
- Maintaining full backward compatibility

When you sign a special EIP-7702 authorization signature, the Ethereum protocol recognizes this delegation and allows your address to use Smart Wallet features.

## Prerequisites

- Node.js (v16+)
- npm or yarn
- An Alchemy API key (get one for free at [https://dashboard.alchemy.com/apps](https://dashboard.alchemy.com/apps))
- A test wallet with some Sepolia testnet ETH (get from faucets listed below)
- A deployed Counter smart contract (used to demonstrate the EIP-7702 upgraded wallet's capabilities)

## Setup

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. **Set up your `.env` file**:
   - Copy `.env.example` to `.env`: 
     ```
     cp .env.example .env
     ```
   - Edit the `.env` file and replace the placeholder values:
     - `ALCHEMY_API_KEY`: Your Alchemy API key
     - `PRIVATE_KEY`: Your test wallet's private key (with or without 0x prefix)
     - `TARGET_ADDRESS`: Your deployed Counter contract address
     - **⚠️ IMPORTANT**: Only use a test wallet! Never use a wallet with real funds!

## Getting Sepolia Testnet ETH

You'll need some Sepolia ETH in your test wallet to pay for transaction fees. Get it for free from:
- [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)

## Demo Flow

When you run this demo, it will:

1. **EIP-7702 Account Upgrade (Main Focus)**:
   - Start with your regular EOA (Externally Owned Account)
   - Generate the EIP-7702 authorization signature
   - Upgrade the account to a Smart Wallet using EIP-7702
   - All while keeping the same address!

2. **Demonstration of EIP-7702 Smart Wallet Features**:
   - To show the upgraded wallet in action, we interact with a simple counter contract
   - This proves the EIP-7702 upgrade was successful
   - Future interactions can use advanced features enabled by EIP-7702 like batching or session keys

## Example Smart Contract

To demonstrate the EIP-7702 upgraded wallet's capabilities, we use a simple Counter contract:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TestMe {
    uint256 public counter;
    
    event CounterUpdated(uint256 newCounterValue);
    
    function incrementCounter() public {
        counter++;
        emit CounterUpdated(counter);
    }
}
```

Deploy this contract to Sepolia and add its address to your `.env` file as `TARGET_ADDRESS`.

## How to Run

```bash
# Install TypeScript and ts-node if not already installed
npm install -g typescript ts-node

# Run the demo
npm run dev
```

## What Happens During Execution

1. **EIP-7702 Wallet Upgrade**:
   - Your regular wallet is upgraded to a Smart Wallet via EIP-7702
   - The address stays exactly the same
   - No asset migration needed

2. **Verification of EIP-7702 Upgrade**:
   - The demo sends a transaction through the EIP-7702 upgraded Smart Wallet
   - Uses the counter contract to prove the upgrade worked
   - Shows events and confirmations

Each execution will:
- Generate a new EIP-7702 authorization signature
- Send a transaction through the EIP-7702 upgraded Smart Wallet
- Show the transaction results

## Troubleshooting

If you encounter any issues:

1. Make sure all dependencies are installed: `npm install`
2. Ensure your test wallet has enough Sepolia ETH - get some from [https://sepoliafaucet.com/](https://sepoliafaucet.com/)
3. Check that your Alchemy API key has access to Sepolia network
4. Verify your Counter contract is properly deployed (this is just for demonstration)

## Learn More About EIP-7702

- [EIP-7702 Specification](https://eips.ethereum.org/EIPS/eip-7702)
- [Alchemy Account Kit - Using 7702](https://accountkit.alchemy.com/smart-contracts/modular-account-v2/using-7702)
- [Account Kit Documentation](https://accountkit.alchemy.com) 