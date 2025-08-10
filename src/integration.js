// src/integration.js
import { ethers } from 'ethers';
import treasureHuntABI from './contract/treasureHunt.json';

// Contract configuration
// Your deployed contract address on Avalanche C-Chain Testnet
const CONTRACT_ADDRESS = '0xb803940f2394834faa0f7f6e465b07f71ccccd97'; // Deployed on Avalanche C-Chain Testnet
const CONTRACT_ABI = treasureHuntABI;

// Flag to enable mock mode when contract is not properly deployed
const MOCK_MODE = false; // Set to true for testing, false for real NFT minting

// Auto-detect if we need mock mode based on contract deployment
const AUTO_DETECT_MOCK = true;

// Web3 Provider and Signer utilities
export const getProvider = () => {
  if (!window.ethereum) {
    throw new Error('MetaMask or another Web3 wallet is required');
  }
  return new ethers.BrowserProvider(window.ethereum);
};

export const getSigner = async () => {
  const provider = getProvider();
  await provider.send('eth_requestAccounts', []);
  return await provider.getSigner();
};

export const getContract = async (withSigner = true) => {
  if (withSigner) {
    const signer = await getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  } else {
    const provider = getProvider();
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
  }
};

// Wallet connection functions
export const connectWallet = async () => {
  try {
    const provider = getProvider();
    await provider.send('eth_requestAccounts', []);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    const network = await provider.getNetwork();
    
    return {
      provider,
      signer,
      address,
      network: {
        name: network.name,
        chainId: network.chainId
      }
    };
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
};

export const disconnectWallet = () => {
  // Note: MetaMask doesn't have a programmatic disconnect method
  // This is more of a state reset in your application
  return true;
};

export const getWalletAddress = async () => {
  try {
    const signer = await getSigner();
    return await signer.getAddress();
  } catch (error) {
    console.error('Error getting wallet address:', error);
    throw error;
  }
};

// Contract interaction functions

// Contract deployment detection
export const isContractDeployed = async () => {
  try {
    const provider = getProvider();
    console.log('🔍 Checking contract deployment at:', CONTRACT_ADDRESS);
    const code = await provider.getCode(CONTRACT_ADDRESS);
    console.log('📄 Contract code length:', code.length);
    console.log('📄 Contract code preview:', code.substring(0, 20) + '...');

    const isDeployed = code !== '0x' && code !== '0x0' && code.length > 2;
    console.log('✅ Contract deployed:', isDeployed);
    return isDeployed;
  } catch (error) {
    console.error('❌ Error checking contract deployment:', error);
    return false;
  }
};

// Check if contract address is same as wallet address
export const isContractAddressValid = async () => {
  try {
    const signer = await getSigner();
    const signerAddress = await signer.getAddress();
    const isValid = CONTRACT_ADDRESS.toLowerCase() !== signerAddress.toLowerCase();
    console.log('🔍 Wallet address:', signerAddress);
    console.log('🔍 Contract address:', CONTRACT_ADDRESS);
    console.log('✅ Address validation:', isValid);
    return isValid;
  } catch (error) {
    console.error('❌ Error validating contract address:', error);
    return false;
  }
};

// Test contract functionality
export const testContract = async () => {
  try {
    console.log('🧪 Testing contract functionality...');
    const contract = await getContract(false); // Read-only

    // Try to call basic contract methods
    const name = await contract.name();
    const symbol = await contract.symbol();
    const owner = await contract.owner();

    console.log('✅ Contract name:', name);
    console.log('✅ Contract symbol:', symbol);
    console.log('✅ Contract owner:', owner);

    return { name, symbol, owner, isWorking: true };
  } catch (error) {
    console.error('❌ Contract test failed:', error);
    return { isWorking: false, error: error.message };
  }
};

// Minting functions
export const mintNFT = async (recipient, tokenURI) => {
  try {
    console.log('🎯 Starting NFT minting process...');
    console.log('📍 Contract Address:', CONTRACT_ADDRESS);
    console.log('👤 Recipient:', recipient);
    console.log('🔗 Token URI:', tokenURI);

    // Auto-detect if we should use mock mode
    let shouldUseMock = MOCK_MODE;

    if (AUTO_DETECT_MOCK) {
      const isValidAddress = await isContractAddressValid();
      const isDeployed = await isContractDeployed();

      console.log('🔍 Contract validation:');
      console.log('  - Valid address (not wallet):', isValidAddress);
      console.log('  - Contract deployed:', isDeployed);

      // If basic checks pass, test contract functionality
      if (isValidAddress && isDeployed) {
        console.log('🧪 Running contract functionality test...');
        const contractTest = await testContract();
        if (contractTest.isWorking) {
          console.log('✅ Contract is fully functional!');
          shouldUseMock = false;
        } else {
          console.log('❌ Contract test failed:', contractTest.error);
          shouldUseMock = true;
        }
      } else {
        shouldUseMock = true;
      }
    }

    if (shouldUseMock) {
      console.log('⚠️  Using mock NFT minting (contract not properly deployed)');
      console.log('💡 To use real NFT minting:');
      console.log('   1. Deploy the contract using Remix or Hardhat');
      console.log('   2. Update CONTRACT_ADDRESS in integration.js');
      console.log('   3. Set MOCK_MODE = false');
      return mockMintNFT(recipient, tokenURI);
    }

    console.log('✅ Using real contract for NFT minting');
    const contract = await getContract(true);

    // Check if the current wallet is the owner of the contract
    try {
      const contractOwner = await contract.owner();
      const signer = await getSigner();
      const signerAddress = await signer.getAddress();

      if (contractOwner.toLowerCase() !== signerAddress.toLowerCase()) {
        throw new Error(`Only the contract owner (${contractOwner}) can mint NFTs. Current wallet: ${signerAddress}`);
      }
    } catch (ownerError) {
      console.warn('Could not verify contract ownership:', ownerError.message);
    }

    const tx = await contract.mintNFT(recipient, tokenURI);
    console.log('📤 Minting transaction sent:', tx.hash);

    const receipt = await tx.wait();
    console.log('✅ NFT minted successfully!');
    console.log('📋 Transaction receipt:', receipt);

    // Extract token ID from the Transfer event
    let tokenId = null;
    for (const log of receipt.logs) {
      try {
        const parsedLog = contract.interface.parseLog(log);
        if (parsedLog.name === 'Transfer') {
          tokenId = parsedLog.args.tokenId.toString();
          break;
        }
      } catch (e) {
        // Skip logs that can't be parsed
      }
    }

    return {
      transactionHash: tx.hash,
      receipt,
      tokenId: tokenId || 'Unknown',
      isReal: true
    };
  } catch (error) {
    console.error('❌ Error minting NFT:', error);

    // If the error suggests contract issues and auto-detect is enabled, fall back to mock
    if (AUTO_DETECT_MOCK && (
        error.message.includes('External transactions to internal accounts') ||
        error.message.includes('could not coalesce error') ||
        error.message.includes('contract not deployed')
      )) {
      console.log('🔄 Contract error detected, falling back to mock NFT minting');
      return mockMintNFT(recipient, tokenURI);
    }

    throw error;
  }
};

// Mock NFT minting for testing purposes
const mockMintNFT = async (recipient, tokenURI) => {
  console.log('🎭 MOCK MODE: Simulating NFT minting');
  console.log('📍 Recipient:', recipient);
  console.log('🔗 Token URI:', tokenURI);
  console.log('⚠️  This is a simulation - no real blockchain transaction will occur');

  // Simulate transaction delay
  console.log('⏳ Simulating blockchain transaction delay...');
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Generate mock transaction data
  const mockTokenId = Math.floor(Math.random() * 10000) + 1;
  const mockTxHash = '0x' + Math.random().toString(16).substring(2, 66);

  console.log('✅ Mock NFT minted successfully!');
  console.log('🎫 Mock Token ID:', mockTokenId);
  console.log('📝 Mock Transaction Hash:', mockTxHash);
  console.log('💡 To mint real NFTs, deploy the contract and update the configuration');

  return {
    transactionHash: mockTxHash,
    receipt: {
      transactionHash: mockTxHash,
      blockNumber: Math.floor(Math.random() * 1000000),
      gasUsed: '21000',
      status: 1,
      isMock: true
    },
    tokenId: mockTokenId.toString(),
    isReal: false,
    isMock: true
  };
};

// Read functions (view functions)
export const getTokenURI = async (tokenId) => {
  try {
    const contract = await getContract(false);
    return await contract.tokenURI(tokenId);
  } catch (error) {
    console.error('Error getting token URI:', error);
    throw error;
  }
};

export const getOwnerOf = async (tokenId) => {
  try {
    const contract = await getContract(false);
    return await contract.ownerOf(tokenId);
  } catch (error) {
    console.error('Error getting token owner:', error);
    throw error;
  }
};

export const getBalanceOf = async (address) => {
  try {
    const contract = await getContract(false);
    const balance = await contract.balanceOf(address);
    return balance.toString();
  } catch (error) {
    console.error('Error getting balance:', error);
    throw error;
  }
};

export const getContractName = async () => {
  try {
    const contract = await getContract(false);
    return await contract.name();
  } catch (error) {
    console.error('Error getting contract name:', error);
    throw error;
  }
};

export const getContractSymbol = async () => {
  try {
    const contract = await getContract(false);
    return await contract.symbol();
  } catch (error) {
    console.error('Error getting contract symbol:', error);
    throw error;
  }
};

export const getContractOwner = async () => {
  try {
    const contract = await getContract(false);
    return await contract.owner();
  } catch (error) {
    console.error('Error getting contract owner:', error);
    throw error;
  }
};

export const getApproved = async (tokenId) => {
  try {
    const contract = await getContract(false);
    return await contract.getApproved(tokenId);
  } catch (error) {
    console.error('Error getting approved address:', error);
    throw error;
  }
};

export const isApprovedForAll = async (owner, operator) => {
  try {
    const contract = await getContract(false);
    return await contract.isApprovedForAll(owner, operator);
  } catch (error) {
    console.error('Error checking approval for all:', error);
    throw error;
  }
};

// Transfer and approval functions
export const approve = async (to, tokenId) => {
  try {
    const contract = await getContract(true);
    const tx = await contract.approve(to, tokenId);
    console.log('Approval transaction sent:', tx.hash);
    
    const receipt = await tx.wait();
    console.log('Approval successful:', receipt);
    
    return {
      transactionHash: tx.hash,
      receipt
    };
  } catch (error) {
    console.error('Error approving:', error);
    throw error;
  }
};

export const setApprovalForAll = async (operator, approved) => {
  try {
    const contract = await getContract(true);
    const tx = await contract.setApprovalForAll(operator, approved);
    console.log('Set approval for all transaction sent:', tx.hash);
    
    const receipt = await tx.wait();
    console.log('Set approval for all successful:', receipt);
    
    return {
      transactionHash: tx.hash,
      receipt
    };
  } catch (error) {
    console.error('Error setting approval for all:', error);
    throw error;
  }
};

export const transferFrom = async (from, to, tokenId) => {
  try {
    const contract = await getContract(true);
    const tx = await contract.transferFrom(from, to, tokenId);
    console.log('Transfer transaction sent:', tx.hash);
    
    const receipt = await tx.wait();
    console.log('Transfer successful:', receipt);
    
    return {
      transactionHash: tx.hash,
      receipt
    };
  } catch (error) {
    console.error('Error transferring token:', error);
    throw error;
  }
};

export const safeTransferFrom = async (from, to, tokenId, data = '0x') => {
  try {
    const contract = await getContract(true);
    const tx = data === '0x' 
      ? await contract['safeTransferFrom(address,address,uint256)'](from, to, tokenId)
      : await contract['safeTransferFrom(address,address,uint256,bytes)'](from, to, tokenId, data);
    
    console.log('Safe transfer transaction sent:', tx.hash);
    
    const receipt = await tx.wait();
    console.log('Safe transfer successful:', receipt);
    
    return {
      transactionHash: tx.hash,
      receipt
    };
  } catch (error) {
    console.error('Error safe transferring token:', error);
    throw error;
  }
};

// Owner functions
export const transferOwnership = async (newOwner) => {
  try {
    const contract = await getContract(true);
    const tx = await contract.transferOwnership(newOwner);
    console.log('Transfer ownership transaction sent:', tx.hash);
    
    const receipt = await tx.wait();
    console.log('Ownership transferred successfully:', receipt);
    
    return {
      transactionHash: tx.hash,
      receipt
    };
  } catch (error) {
    console.error('Error transferring ownership:', error);
    throw error;
  }
};

export const renounceOwnership = async () => {
  try {
    const contract = await getContract(true);
    const tx = await contract.renounceOwnership();
    console.log('Renounce ownership transaction sent:', tx.hash);
    
    const receipt = await tx.wait();
    console.log('Ownership renounced successfully:', receipt);
    
    return {
      transactionHash: tx.hash,
      receipt
    };
  } catch (error) {
    console.error('Error renouncing ownership:', error);
    throw error;
  }
};

// Utility functions
export const formatEther = (value) => ethers.formatEther(value);
export const parseEther = (value) => ethers.parseEther(value);
export const formatUnits = (value, units) => ethers.formatUnits(value, units);
export const parseUnits = (value, units) => ethers.parseUnits(value, units);

// Contract constants
export const CONTRACT_INFO = {
  address: CONTRACT_ADDRESS,
  abi: CONTRACT_ABI,
  name: 'Treasure Hunt NFT',
  symbol: 'THUNT'
};

// Event listening functions
export const listenToTransferEvents = (callback) => {
  const contract = getContract(false);
  contract.on('Transfer', (from, to, tokenId, event) => {
    callback({
      from,
      to,
      tokenId: tokenId.toString(),
      event
    });
  });

  return () => contract.removeAllListeners('Transfer');
};

export const listenToApprovalEvents = (callback) => {
  const contract = getContract(false);
  contract.on('Approval', (owner, approved, tokenId, event) => {
    callback({
      owner,
      approved,
      tokenId: tokenId.toString(),
      event
    });
  });

  return () => contract.removeAllListeners('Approval');
};

export const listenToApprovalForAllEvents = (callback) => {
  const contract = getContract(false);
  contract.on('ApprovalForAll', (owner, operator, approved, event) => {
    callback({
      owner,
      operator,
      approved,
      event
    });
  });

  return () => contract.removeAllListeners('ApprovalForAll');
};

// Export all functions as default object for convenience
export default {
  // Connection
  connectWallet,
  disconnectWallet,
  getWalletAddress,
  getProvider,
  getSigner,
  getContract,

  // Contract interactions
  mintNFT,
  getTokenURI,
  getOwnerOf,
  getBalanceOf,
  getContractName,
  getContractSymbol,
  getContractOwner,
  getApproved,
  isApprovedForAll,
  approve,
  setApprovalForAll,
  transferFrom,
  safeTransferFrom,
  transferOwnership,
  renounceOwnership,

  // Events
  listenToTransferEvents,
  listenToApprovalEvents,
  listenToApprovalForAllEvents,

  // Utilities
  formatEther,
  parseEther,
  formatUnits,
  parseUnits,

  // Constants
  CONTRACT_INFO
};
