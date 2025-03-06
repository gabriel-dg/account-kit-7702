import { LocalAccountSigner } from "@aa-sdk/core";
import dotenv from 'dotenv';
dotenv.config();

// Use private key from .env file for better security
// Never hardcode private keys in your code!
const privateKeyEnv = process.env.WALLET_PRIVATE_KEY;

if (!privateKeyEnv) {
  throw new Error("Missing WALLET_PRIVATE_KEY in .env file. Please add your private key to the .env file.");
}

// Ensure private key has 0x prefix
let privateKey = privateKeyEnv;
if (!privateKey.startsWith("0x")) {
  privateKey = `0x${privateKey}`;
}

export const signer = LocalAccountSigner.privateKeyToAccountSigner(privateKey as `0x${string}`); 