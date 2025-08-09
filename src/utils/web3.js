
import { ethers } from 'ethers';
import abi from '../abi.json';

const contractAddress = '0xD878Fa6c04d99654Fb38d1245Fc6Ec2acE8913f0'; // Replace with actual address

export const connectWallet = async () => {
  if (window.ethereum) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = await provider.getSigner();
    return { provider, signer };
  }
  throw new Error('No wallet detected');
};

export const mintNFT = async (signer, toAddress) => {
  const contract = new ethers.Contract(contractAddress, abi, signer);
  const tx = await contract.mintNFT(toAddress);
  await tx.wait();
  return tx.hash;
};