# 🚀 TreasureHuntNFT Contract Deployment Guide

This guide will help you deploy the TreasureHuntNFT contract and enable real NFT minting in your application.

## 📋 Prerequisites

- MetaMask wallet with some ETH for gas fees
- Access to Remix IDE or Hardhat/Foundry setup
- Your wallet address (will be the contract owner)

## 🎯 Quick Deployment (Recommended)

### Option 1: Using Remix IDE (Easiest)

1. **Open Remix IDE**
   - Go to [https://remix.ethereum.org/](https://remix.ethereum.org/)

2. **Create Contract File**
   - Create a new file: `TreasureHuntNFT.sol`
   - Copy the contract code from `src/contract/TreasureHuntNFT.sol`

3. **Install Dependencies**
   - In Remix, go to the "File Explorer" tab
   - Create a new folder: `@openzeppelin/contracts`
   - The dependencies will be auto-imported when you compile

4. **Compile Contract**
   - Go to "Solidity Compiler" tab
   - Select compiler version: `0.8.20` or higher
   - Click "Compile TreasureHuntNFT.sol"

5. **Deploy Contract**
   - Go to "Deploy & Run Transactions" tab
   - Select Environment: "Injected Provider - MetaMask"
   - Connect your MetaMask wallet
   - Select Contract: "TreasureHuntNFT"
   - In the constructor parameters, enter your wallet address
   - Click "Deploy"
   - Confirm the transaction in MetaMask

6. **Copy Contract Address**
   - After deployment, copy the contract address
   - Update `CONTRACT_ADDRESS` in `src/integration.js`

### Option 2: Using Hardhat (Advanced)

1. **Install Hardhat**
   ```bash
   npm install --save-dev hardhat @openzeppelin/contracts
   npx hardhat init
   ```

2. **Create Deployment Script**
   ```javascript
   // scripts/deploy.js
   const { ethers } = require("hardhat");

   async function main() {
     const [deployer] = await ethers.getSigners();
     console.log("Deploying with account:", deployer.address);

     const TreasureHuntNFT = await ethers.getContractFactory("TreasureHuntNFT");
     const contract = await TreasureHuntNFT.deploy(deployer.address);
     
     await contract.waitForDeployment();
     console.log("Contract deployed to:", await contract.getAddress());
   }

   main().catch((error) => {
     console.error(error);
     process.exitCode = 1;
   });
   ```

3. **Deploy**
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```

## 🔧 Configuration After Deployment

### Update Integration File

1. **Open `src/integration.js`**

2. **Update Contract Address**
   ```javascript
   // Replace this line:
   const CONTRACT_ADDRESS = '0xD878Fa6c04d99654Fb38d1245Fc6Ec2acE8913f0';
   
   // With your deployed contract address:
   const CONTRACT_ADDRESS = 'YOUR_DEPLOYED_CONTRACT_ADDRESS';
   ```

3. **Disable Mock Mode**
   ```javascript
   // Change this:
   const MOCK_MODE = false; // Already set to false
   const AUTO_DETECT_MOCK = true; // Will auto-detect if contract is deployed
   ```

## 🌐 Recommended Networks

### Testnets (Free - Recommended for Testing)
- **Sepolia**: Fast, reliable testnet
- **Goerli**: Alternative testnet
- **Mumbai (Polygon)**: Low-cost alternative

### Mainnets (Real Money - Production)
- **Ethereum**: Most secure, higher gas fees
- **Polygon**: Lower fees, fast transactions
- **Arbitrum**: Layer 2, lower fees

## 💰 Getting Test ETH

For testnets, you'll need test ETH:

- **Sepolia Faucet**: [https://sepoliafaucet.com/](https://sepoliafaucet.com/)
- **Goerli Faucet**: [https://goerlifaucet.com/](https://goerlifaucet.com/)
- **Mumbai Faucet**: [https://faucet.polygon.technology/](https://faucet.polygon.technology/)

## 🔍 Verification Steps

After deployment, verify everything works:

1. **Check Contract on Explorer**
   - Sepolia: [https://sepolia.etherscan.io/](https://sepolia.etherscan.io/)
   - Search for your contract address

2. **Test NFT Minting**
   - Complete a game in your application
   - Try to claim an NFT
   - Check the console for real transaction logs

3. **Verify NFT Creation**
   - Check your wallet for the new NFT
   - Verify on OpenSea testnet or the block explorer

## 🚨 Troubleshooting

### Common Issues:

1. **"Only owner can mint" Error**
   - Make sure you deployed with your wallet address as owner
   - Use the same wallet that deployed the contract

2. **"Contract not deployed" Error**
   - Verify the contract address is correct
   - Check that the contract exists on the blockchain

3. **Gas Estimation Failed**
   - Ensure you have enough ETH for gas fees
   - Try increasing gas limit manually

4. **Transaction Reverted**
   - Check contract owner permissions
   - Verify token URI is valid

## 📞 Support

If you encounter issues:

1. Check the browser console for detailed error messages
2. Verify your wallet is connected to the correct network
3. Ensure the contract address is correctly updated
4. Check that you have sufficient gas fees

## 🎉 Success!

Once deployed and configured:
- ✅ Real NFTs will be minted on the blockchain
- ✅ NFTs will appear in your wallet
- ✅ Transaction hashes will link to real blockchain transactions
- ✅ NFTs can be traded on OpenSea and other marketplaces

Your Treasure Hunt game will now create real, valuable NFT rewards for players!
