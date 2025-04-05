# EIP-7702 Demo with Sponsored Transactions

This demo project demonstrates how to use EIP-7702 to enable smart account capabilities for an existing EOA (Externally Owned Account) while maintaining its original address, using Alchemy's Account Kit.

## What is EIP-7702?

EIP-7702 is a groundbreaking Ethereum protocol feature that enables:
- Using an existing EOA as a smart account without changing its address
- Keeping all existing assets and transaction history
- Adding advanced features like gas sponsorship and transaction batching
- Maintaining full backward compatibility with existing infrastructure

Unlike traditional account abstraction, EIP-7702 doesn't create a new account or migrate assets. Instead, it allows your existing EOA to temporarily act as a smart account through a special authorization signature.

## Demo Contract

The demo uses a simple `TestMe.sol` contract to demonstrate EIP-7702 capabilities:

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

This contract:
- Maintains a simple counter
- Emits events when the counter is updated
- Provides a simple way to verify EIP-7702 functionality
- Demonstrates how UserOps interact with smart contracts

## Important Note About Initialization

Before using sponsored transactions, your EOA needs to be initialized as an EIP-7702 account. This requires:
- A small amount of ETH (around 0.001 ETH) for the one-time initialization
- This initialization transaction cannot be sponsored
- After initialization, all subsequent transactions can be sponsored

Get test ETH from [Sepolia Faucet](https://sepoliafaucet.com/) before running the demo.

## Features

- Enable smart account capabilities for an existing EOA using EIP-7702
- Maintain the same address throughout the process
- Send transactions with optional gas sponsorship
- Automatic verification of transaction sponsorship
- Detailed transaction status reporting
- Event log decoding for contract interactions
- Interact with the TestMe contract to demonstrate functionality

## Prerequisites

- Node.js (v16 or later)
- An Alchemy account with API key
- A gas policy ID from Alchemy (for sponsored transactions)
- At least 0.001 ETH in your EOA for initialization (subsequent transactions can be sponsored)
- A deployed instance of the TestMe contract (or use the provided address)

## Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Configure your `.env` file:
```
ALCHEMY_API_KEY=your_api_key
ALCHEMY_GAS_POLICY_ID=your_gas_policy_id
WALLET_PRIVATE_KEY=your_private_key
TARGET_ADDRESS=your_target_contract_address
```

## Getting Started

1. **Get Test ETH**
   - Visit [Sepolia Faucet](https://sepoliafaucet.com/)
   - Request ETH for your EOA address
   - Wait for the transaction to confirm

2. **Deploy TestMe Contract** (optional)
   - Compile and deploy `TestMe.sol` to Sepolia
   - Or use the provided test contract address

3. **Get a Gas Policy ID**
   - Go to [Alchemy Dashboard](https://dashboard.alchemy.com/)
   - Navigate to Gas Manager
   - Create a new gas policy
   - Copy the policy ID to your `.env` file

4. **Run the Demo**
   ```bash
   npm start
   ```

## How EIP-7702 Works

1. **Initialization** (requires ETH):
   - One-time setup to enable EIP-7702 capabilities
   - Deploys necessary smart contract code
   - Cannot be sponsored

2. **Authorization**:
   - Your EOA signs a special EIP-7702 authorization
   - Enables smart account features
   - Can be sponsored after initialization

3. **Transaction Processing**:
   - Creates a UserOp to call `incrementCounter()`
   - Processes the transaction with smart account capabilities
   - Can be sponsored after initialization
   - Verifies the counter was incremented

4. **Address Preservation**:
   - Your EOA address remains unchanged throughout

## Transaction Verification

The script automatically verifies:
- Transaction sponsorship status
- Counter increment success
- Event emission
- Gas payment source

You'll see:
- ✅ Transaction sponsorship status
- ✅ Counter value after increment
- ✅ Event emission details
- ✅ Gas payment verification

## Troubleshooting

If you encounter issues:

1. **Initialization Error**
   - Ensure your EOA has at least 0.001 ETH
   - Get test ETH from [Sepolia Faucet](https://sepoliafaucet.com/)
   - This is required only once for initialization

2. **Contract Interaction Error**
   - Verify the TestMe contract is deployed
   - Check the TARGET_ADDRESS in .env
   - Ensure the contract is on Sepolia

3. **Missing Gas Policy ID**
   - Check if `ALCHEMY_GAS_POLICY_ID` is set in `.env`
   - Verify the policy is active in Alchemy Dashboard

4. **Transaction Not Sponsored**
   - Verify gas policy is active and has sufficient funds
   - Check if transaction type is covered by policy
   - Ensure API key has correct permissions

5. **Transaction Timeout**
   - Check network connection
   - Verify API key has access to Sepolia
   - Ensure account has sufficient ETH for initialization

## Security Notes

- Never commit your `.env` file
- Keep your private keys secure
- Use test networks for development
- Monitor gas policy usage in Alchemy Dashboard
- Remember that EIP-7702 authorizations are temporary and can be revoked

## License

MIT 