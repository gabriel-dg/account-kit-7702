// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

import { createModularAccountV2Client } from "@account-kit/smart-contracts";
import { sepolia, alchemy } from "@account-kit/infra";
import { signer } from "./signer";

// Turn off TypeScript strictness for this file to avoid API compatibility issues
// @ts-nocheck

// Configuration constants
const TIMEOUT_MS = 60000; // 60 seconds timeout for operations
const TARGET_ADDRESS = process.env.TARGET_ADDRESS || "0x9D3c19e01FBF90a7883396B5BBc5dbF7a1142531";
const CHAIN = sepolia; // Using Sepolia testnet

// Add timeout utility
const timeout = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Main function to demonstrate EIP-7702 upgrade of an EOA to a smart account
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
    
    // Initialize smart account client
    console.log("Creating smart account client with EIP-7702 mode...");
    const smartAccountClient = await createModularAccountV2Client({
      mode: "7702",
      transport: alchemy({ apiKey: ALCHEMY_API_KEY }),
      chain: CHAIN,
      signer,
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
        data: "0x" as `0x${string}`,
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
      console.log("User operation sent successfully");
      
      // Handling the operation hash result
      console.log("User Operation Hash (detailed):");
      if (typeof uoHash === 'object') {
        console.log(JSON.stringify(uoHash, null, 2));
      } else {
        console.log(uoHash);
      }
      
      // Wait for transaction confirmation
      console.log("Waiting for user operation transaction...");
      console.log("This may take a minute or two as the operation is being processed by the network...");
      const txnHash = await smartAccountClient.waitForUserOperationTransaction(uoHash);
      console.log(`Transaction Hash: ${txnHash}`);
      console.log(`View transaction: https://${CHAIN.name}.etherscan.io/tx/${txnHash}`);
      
      console.log("Successfully upgraded EOA to smart account using EIP-7702!");
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