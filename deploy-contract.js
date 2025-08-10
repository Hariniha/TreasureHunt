// deploy-contract.js - Script to deploy the TreasureHuntNFT contract
const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// Contract deployment configuration
const DEPLOYMENT_CONFIG = {
  // Update these with your network details
  RPC_URL: 'https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID', // or your preferred testnet
  PRIVATE_KEY: 'YOUR_PRIVATE_KEY', // Your wallet private key (keep this secure!)
  NETWORK_NAME: 'Sepolia Testnet' // or your chosen network
};

async function deployContract() {
  try {
    console.log('🚀 Starting TreasureHuntNFT contract deployment...');
    
    // Read the contract source code
    const contractPath = path.join(__dirname, 'src/contract/TreasureHuntNFT.sol');
    const contractSource = fs.readFileSync(contractPath, 'utf8');
    
    console.log('📄 Contract source loaded');
    
    // Setup provider and wallet
    const provider = new ethers.JsonRpcProvider(DEPLOYMENT_CONFIG.RPC_URL);
    const wallet = new ethers.Wallet(DEPLOYMENT_CONFIG.PRIVATE_KEY, provider);
    
    console.log('🔗 Connected to network:', DEPLOYMENT_CONFIG.NETWORK_NAME);
    console.log('👛 Deployer address:', wallet.address);
    
    // Check balance
    const balance = await provider.getBalance(wallet.address);
    console.log('💰 Deployer balance:', ethers.formatEther(balance), 'ETH');
    
    if (balance === 0n) {
      throw new Error('❌ Insufficient balance for deployment. Please add funds to your wallet.');
    }
    
    // For this example, we'll use a simplified deployment approach
    // In a real scenario, you'd use Hardhat or Foundry for compilation and deployment
    
    console.log('\n📋 DEPLOYMENT INSTRUCTIONS:');
    console.log('='.repeat(50));
    console.log('Since this is a React project without Hardhat setup, please follow these steps:');
    console.log('');
    console.log('1. Go to Remix IDE (https://remix.ethereum.org/)');
    console.log('2. Create a new file called TreasureHuntNFT.sol');
    console.log('3. Copy the contract code from src/contract/TreasureHuntNFT.sol');
    console.log('4. Compile the contract (Solidity version 0.8.20+)');
    console.log('5. Deploy with the following parameters:');
    console.log('   - initialOwner:', wallet.address);
    console.log('6. Copy the deployed contract address');
    console.log('7. Update the CONTRACT_ADDRESS in src/integration.js');
    console.log('');
    console.log('Alternative: Use this automated deployment script below');
    console.log('='.repeat(50));
    
    return {
      deployerAddress: wallet.address,
      networkName: DEPLOYMENT_CONFIG.NETWORK_NAME,
      balance: ethers.formatEther(balance)
    };
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    throw error;
  }
}

// Alternative: Quick deployment using ethers (requires contract bytecode)
async function quickDeploy() {
  console.log('\n🔧 QUICK DEPLOYMENT OPTION:');
  console.log('If you have the compiled contract bytecode, uncomment and use this function');
  
  // Uncomment and modify this section when you have the compiled bytecode
  /*
  const provider = new ethers.JsonRpcProvider(DEPLOYMENT_CONFIG.RPC_URL);
  const wallet = new ethers.Wallet(DEPLOYMENT_CONFIG.PRIVATE_KEY, provider);
  
  // You would need the compiled contract ABI and bytecode here
  const contractFactory = new ethers.ContractFactory(ABI, BYTECODE, wallet);
  const contract = await contractFactory.deploy(wallet.address);
  await contract.waitForDeployment();
  
  console.log('✅ Contract deployed to:', await contract.getAddress());
  return await contract.getAddress();
  */
}

// Run the deployment
if (require.main === module) {
  deployContract()
    .then((result) => {
      console.log('\n✅ Deployment preparation completed!');
      console.log('Next steps: Deploy via Remix and update integration.js');
    })
    .catch((error) => {
      console.error('❌ Error:', error.message);
      process.exit(1);
    });
}

module.exports = { deployContract, quickDeploy };
