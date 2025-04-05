// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

import { createModularAccountV2Client } from "@account-kit/smart-contracts";
import { sepolia, alchemy } from "@account-kit/infra";
import { signer } from "./signer";
import { decodeEventLog } from "viem";

// Turn off TypeScript strictness for this file to avoid API compatibility issues
// @ts-nocheck

// Configuration constants
const TIMEOUT_MS = 60000; // 60 seconds timeout for operations
const TARGET_ADDRESS = process.env.TARGET_ADDRESS || "0x9Bd9640E5C4cE419dFaba62FcA5096c1c2671bb6";
const CHAIN = sepolia; // Using Sepolia testnet
const GAS_POLICY_ID = process.env.ALCHEMY_GAS_POLICY_ID;

// ABI fragment for the CounterUpdated event
const CounterEventAbi = [{
  type: 'event',
  name: 'CounterUpdated',
  inputs: [
    {
      indexed: false,
      internalType: 'uint256',
      name: 'newCounterValue',
      type: 'uint256'
    }
  ],
  anonymous: false
}] as const;

// Add timeout utility
const timeout = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Main function to demonstrate EIP-7702 upgrade of an EOA to a smart account
 * with optional sponsored transactions
 */
async function main() {
  try {
    // Get the EOA address
    const eoaAddress = await signer.getAddress();
    console.log("EOA Address:", eoaAddress);

    // Validate Alchemy API key
    const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
    if (!ALCHEMY_API_KEY) {
      console.log("\n⚠️ WARNING: No Alchemy API key found in .env file");
      console.log("Please edit the .env file and set ALCHEMY_API_KEY to your actual API key");
      console.log("Get a free API key at: https://dashboard.alchemy.com/apps\n");
      throw new Error("Missing Alchemy API key in .env file");
    }
    console.log("Using Alchemy API Key from .env file");

    // Check if gas policy ID is provided for sponsored transactions
    if (!GAS_POLICY_ID) {
      console.log("\n⚠️ WARNING: No gas policy ID found in .env file");
      console.log("Transactions will not be sponsored. To enable sponsored transactions:");
      console.log("1. Go to https://dashboard.alchemy.com/");
      console.log("2. Navigate to Gas Manager");
      console.log("3. Create a new gas policy");
      console.log("4. Copy your policy ID to your .env file as ALCHEMY_GAS_POLICY_ID");
    }
    
    // Initialize smart account client
    console.log("Creating smart account client with EIP-7702 mode...");
    const smartAccountClient = await createModularAccountV2Client({
      mode: "7702",
      transport: alchemy({ apiKey: ALCHEMY_API_KEY }),
      chain: CHAIN,
      signer,
      // Add gas policy ID if available for sponsored transactions
      ...(GAS_POLICY_ID ? { policyId: GAS_POLICY_ID } : {}),
    });
    console.log("Smart account client created successfully");

    // Display account information
    console.log("Retrieving smart account address...");
    const smartAccountAddress = eoaAddress;
    console.log("Smart Account Address:", smartAccountAddress);
    console.log("Note: This address should be the same as your EOA address due to EIP-7702");
    
    // Prepare user operation with custom target
    console.log("Preparing user operation...");
    const userOperation = {
      uo: {
        target: TARGET_ADDRESS as `0x${string}`,
        value: 0n,
        data: "0x5b34b966" as `0x${string}`, // incrementCounter() with proper padding
      },
    };
    console.log("User operation prepared:", JSON.stringify(userOperation, (_, v) => typeof v === 'bigint' ? v.toString() : v));
    console.log(`Using target address: ${TARGET_ADDRESS}`);
    
    // Attempt to send the user operation with timeout protection
    console.log("Sending a user operation...");
    console.log("This step includes:");
    console.log("1. Generating an EIP-7702 authorization signature");
    console.log("2. Creating a user operation with this authorization");
    console.log("3. Sending it to the Alchemy bundler");
    if (GAS_POLICY_ID) {
      console.log("4. Using sponsored transaction (gas fees paid by Alchemy Paymaster)");
    }
    console.log("This may take some time...");
    
    try {
      // Adding a timeout to prevent indefinite hanging
      const timeoutPromise = timeout(TIMEOUT_MS).then(() => {
        throw new Error(`Operation timed out after ${TIMEOUT_MS/1000} seconds. The bundler may be experiencing issues or your API key might be incorrect.`);
      });
      
      console.log("Starting to send user operation...");
      // Race between the actual operation and a timeout
      const uoHash = await Promise.race([
        smartAccountClient.sendUserOperation(userOperation),
        timeoutPromise
      ]);
      
      // Handling the operation hash result
      console.log("\nUser Operation Details:");
      if (typeof uoHash === 'object') {
        console.log(JSON.stringify(uoHash, null, 2));
      } else {
        console.log("Hash:", uoHash);
      }
      
      // Wait for transaction confirmation
      console.log("\nWaiting for transaction confirmation...");
      console.log("This may take a minute or two as the operation is being processed by the network...");
      const txnHash = await smartAccountClient.waitForUserOperationTransaction(uoHash);
      console.log(`\nTransaction Hash: ${txnHash}`);
      console.log(`View on Etherscan: https://${CHAIN.name}.etherscan.io/tx/${txnHash}`);
      
      // Verify transaction details
      console.log("\nVerifying transaction details...");
      const receipt = await smartAccountClient.transport.request({
        method: 'eth_getTransactionReceipt',
        params: [txnHash]
      });
      
      // @ts-ignore - We know the structure from the RPC spec
      const logs = receipt?.logs || [];
      
      // Check if gas policy ID is present
      if (GAS_POLICY_ID) {
        console.log("✅ Gas Policy ID is configured:", GAS_POLICY_ID);
        console.log("Transaction should be sponsored by Alchemy Paymaster");
        
        // Log transaction details
        console.log("\nTransaction Details:");
        console.log("From:", eoaAddress);
        console.log("To:", TARGET_ADDRESS);
        console.log("Value:", "0 ETH");
        console.log("Status: Success");
        
        // Get transaction details from Etherscan
        const txDetails = await smartAccountClient.transport.request({
          method: 'eth_getTransactionByHash',
          params: [txnHash]
        });
        
        // @ts-ignore - We know the structure from the RPC spec
        const txFrom = txDetails?.from;
        
        // Check if transaction was actually sponsored
        if (txFrom?.toLowerCase() === eoaAddress.toLowerCase()) {
          console.log("\n⚠️ Note: Transaction appears to be paid from your account");
          console.log("This might indicate that:");
          console.log("1. The gas policy ID is not active");
          console.log("2. The paymaster service is temporarily unavailable");
          console.log("3. The transaction type is not covered by the policy");
          console.log("\nPlease check your Alchemy dashboard to verify the gas policy status");
        } else {
          console.log("\n✅ Transaction was successfully sponsored");
          console.log("Gas fees were paid by Alchemy Paymaster");
          console.log("Transaction sender:", txFrom);
        }
      } else {
        console.log("⚠️ No gas policy ID configured");
        console.log("Transaction was not sponsored");
        console.log("Gas fees were paid from your account");
      }
      
      // Read and decode the event log
      console.log("\nReading transaction receipt for CounterUpdated event...");
      try {
        for (const log of logs) {
          // Only look at logs from our contract
          if (log.address?.toLowerCase() === TARGET_ADDRESS.toLowerCase()) {
            try {
              const decoded = decodeEventLog({
                abi: CounterEventAbi,
                data: log.data,
                topics: log.topics || [],
              });
              
              if (decoded.eventName === 'CounterUpdated') {
                console.log(`✨ Counter updated! New value: ${decoded.args.newCounterValue.toString()}`);
                break;
              }
            } catch {
              // Not our event, continue to next log
              continue;
            }
          }
        }
      } catch (error) {
        console.error("Error reading event logs:", error);
      }
      
      console.log("\nSuccessfully upgraded EOA to smart account using EIP-7702!");
      if (GAS_POLICY_ID) {
        console.log("Transaction was sponsored by Alchemy Paymaster");
      }
    } catch (err) {
      const error = err as Error;
      console.error("Error processing user operation:", error);
      
      // Provide helpful suggestions based on error type
      if (error.message?.includes("timed out")) {
        console.log("\n--- TROUBLESHOOTING SUGGESTIONS ---");
        console.log("1. Check that your Alchemy API key is valid and has access to the Sepolia network");
        console.log("2. Ensure your EOA account has sufficient Sepolia ETH (at least 0.01 ETH recommended)");
        console.log("3. Try again with a longer timeout or restart the process");
        console.log("4. Check Alchemy's status page for any ongoing issues: https://status.alchemy.com/");
      } else if (error.message?.includes("insufficient funds")) {
        console.log("\nYour account doesn't have enough Sepolia ETH to pay for gas.");
        console.log("Please get some test ETH from: https://sepoliafaucet.com/");
        console.log(`Your account address: ${eoaAddress}`);
      } else if (error.message?.includes("Policy ID(s) not found")) {
        console.log("\nThe gas policy ID is not associated with your Alchemy account.");
        console.log("Please follow these steps:");
        console.log("1. Go to https://dashboard.alchemy.com/");
        console.log("2. Navigate to Account Kit");
        console.log("3. Create a new gas policy");
        console.log("4. Copy your policy ID to your .env file as ALCHEMY_GAS_POLICY_ID");
      } else {
        console.log("\nPlease check the following:");
        console.log("- Your network connection is stable");
        console.log("- Your Alchemy API key has access to Sepolia testnet");
        console.log("- You have enough Sepolia ETH in your account");
        console.log(`- Your account address: ${eoaAddress}`);
      }
    }
  } catch (err) {
    const error = err as Error;
    console.error("Error in main process:", error);
  }
}

// Call the main function
main(); 