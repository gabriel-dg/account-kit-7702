# EIP-7702 Demo

This is a simple demo of EIP-7702, which allows upgrading Externally Owned Accounts (EOAs) to smart contract accounts without changing the address or migrating assets.

## Prerequisites

- Node.js (v16+)
- npm or yarn
- An Alchemy API key (get one for free at [https://dashboard.alchemy.com/apps](https://dashboard.alchemy.com/apps))
- Some Sepolia testnet ETH (get from faucets listed below)

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
   - Edit the `.env` file and replace the placeholder values with your actual keys
     - Add your Alchemy API key
     - Add your wallet private key (with or without the 0x prefix)
     - **IMPORTANT**: Only use a test wallet with no real funds!
     - Make sure your wallet has some Sepolia ETH

## Using Your Own Account

By default, this demo uses the standard Hardhat test account which has no ETH. To use your own account:

1. Export your private key from your wallet (MetaMask, etc.)
   - **CAUTION**: Only use test accounts, never use accounts with real funds!
2. Add your private key to the `.env` file
3. Make sure your account has some Sepolia testnet ETH

## Getting Sepolia Testnet ETH

You can get free Sepolia ETH from these faucets:
- [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
- [Infura Sepolia Faucet](https://www.infura.io/faucet/sepolia)
- [QuickNode Sepolia Faucet](https://faucet.quicknode.com/ethereum/sepolia)

## How to Run

```bash
# Install TypeScript and ts-node if not already installed
npm install -g typescript ts-node

# Run the demo
npm run dev

# Or with a specific Alchemy API key
ALCHEMY_API_KEY=your_api_key npm run dev
```

## Troubleshooting

If you encounter any TypeScript errors or issues:

1. Make sure all dependencies are installed: `npm install`
2. Try running with the environment variable: `ALCHEMY_API_KEY=your_api_key npm run dev`
3. You might need Sepolia ETH to execute transactions - get some from [https://sepoliafaucet.com/](https://sepoliafaucet.com/)

## What This Demo Does

1. Creates a simple EOA using a local private key
2. Uses EIP-7702 to upgrade the EOA to a Modular Account v2 smart account
3. Sends a simple user operation to confirm the upgrade

## Important Notes

- This demo uses the Sepolia testnet
- You'll need some Sepolia ETH to pay for gas when sending transactions
- You can get Sepolia ETH from: [https://sepoliafaucet.com/](https://sepoliafaucet.com/)
- The private key in `signer.ts` is a test key - NEVER use it with real funds

## How EIP-7702 Works

EIP-7702 enables an EOA to delegate its account authority to a smart contract account implementation. When a user signs a special authorization signature, the Ethereum protocol recognizes this delegation, and future transactions from that address can use smart contract account features like:

- Batching multiple actions in a single transaction
- Gas sponsorship
- Session keys for temporary access
- And more!

The key benefit is that you maintain your existing address and don't need to migrate assets.

## Learn More

- [EIP-7702 Specification](https://eips.ethereum.org/EIPS/eip-7702)
- [Account Kit Documentation](https://accountkit.alchemy.com) 