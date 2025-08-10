// src/utils/web3.js
import { ethers } from 'ethers';
import abi from '../abi.json';

const contractAddress = '0xD878Fa6c04d99654Fb38d1245Fc6Ec2acE8913f0';

export const connectWallet = async () => {
  if (!window.ethereum) throw new Error('No wallet detected');
  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send('eth_requestAccounts', []);
  const signer = await provider.getSigner();
  return { provider, signer };
};

export const mintNFT = async (signer, toAddress, tokenURI) => {
  const contract = new ethers.Contract(contractAddress, abi, signer);
  const tx = await contract.mintNFT(toAddress, tokenURI);
  await tx.wait();
  return tx.hash;
};
