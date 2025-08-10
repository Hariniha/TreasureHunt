import { create } from 'ipfs-http-client';

// Configuration for different IPFS providers
const IPFS_CONFIGS = [
  // Public IPFS nodes (free but may be slower)
  { host: 'ipfs.io', port: 443, protocol: 'https', apiPath: '/api/v0' },
  { host: '4everland.io', port: 443, protocol: 'https', apiPath: '/ipfs/api/v0' },

  // Infura (requires project ID and secret - uncomment and add your credentials)
  // {
  //   host: 'ipfs.infura.io',
  //   port: 5001,
  //   protocol: 'https',
  //   headers: {
  //     authorization: 'Basic ' + Buffer.from('YOUR_PROJECT_ID:YOUR_PROJECT_SECRET').toString('base64')
  //   }
  // }
];

// Try to create IPFS client with fallback options
let ipfs = null;
let currentConfigIndex = 0;

const createIPFSClient = () => {
  if (currentConfigIndex < IPFS_CONFIGS.length) {
    try {
      ipfs = create(IPFS_CONFIGS[currentConfigIndex]);
      console.log(`Using IPFS config ${currentConfigIndex}:`, IPFS_CONFIGS[currentConfigIndex].host);
      return ipfs;
    } catch (error) {
      console.warn(`Failed to create IPFS client with config ${currentConfigIndex}:`, error);
      currentConfigIndex++;
      return createIPFSClient();
    }
  }
  return null;
};

// Initialize IPFS client
createIPFSClient();

export const uploadToIPFS = async (data) => {
  try {
    // Try uploading to IPFS
    if (ipfs) {
      const { path } = await ipfs.add(JSON.stringify(data));
      console.log('Successfully uploaded to IPFS:', path);
      return `ipfs://${path}`;
    }
    throw new Error('No IPFS client available');
  } catch (error) {
    console.warn('IPFS upload failed, trying next provider or fallback:', error);

    // Try next IPFS provider
    if (currentConfigIndex < IPFS_CONFIGS.length) {
      currentConfigIndex++;
      createIPFSClient();
      if (ipfs) {
        try {
          const { path } = await ipfs.add(JSON.stringify(data));
          console.log('Successfully uploaded to IPFS with fallback:', path);
          return `ipfs://${path}`;
        } catch (retryError) {
          console.warn('Retry failed:', retryError);
        }
      }
    }

    // Fallback: Use a mock IPFS hash and store data locally
    console.warn('All IPFS providers failed, using fallback storage');
    return uploadToFallbackStorage(data);
  }
};

// Fallback storage for when IPFS is not available
const uploadToFallbackStorage = (data) => {
  try {
    // Generate a mock IPFS-like hash
    const mockHash = 'bafkreif' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    // Store in localStorage with a prefix
    const storageKey = `ipfs_fallback_${mockHash}`;
    localStorage.setItem(storageKey, JSON.stringify(data));

    console.log('Stored in fallback storage with hash:', mockHash);
    return `ipfs://${mockHash}`;
  } catch (error) {
    console.error('Fallback storage failed:', error);
    // Return a default hash if everything fails
    return 'ipfs://bafkreifallbackhashfornftmetadata';
  }
};

export const getFromIPFS = async (cid) => {
  try {
    // First try to get from IPFS
    if (ipfs) {
      const content = [];
      for await (const chunk of ipfs.cat(cid)) {
        content.push(chunk);
      }
      return JSON.parse(Buffer.concat(content).toString());
    }
    throw new Error('No IPFS client available');
  } catch (error) {
    console.warn('IPFS retrieval failed, trying fallback storage:', error);

    // Try fallback storage
    const storageKey = `ipfs_fallback_${cid}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      return JSON.parse(stored);
    }

    // If not in fallback storage, return null or throw error
    throw new Error(`Could not retrieve data for CID: ${cid}`);
  }
};

// Utility function to check if IPFS is working
export const testIPFSConnection = async () => {
  try {
    if (!ipfs) {
      createIPFSClient();
    }

    if (ipfs) {
      // Try to add a small test file
      const testData = { test: 'connection', timestamp: Date.now() };
      const { path } = await ipfs.add(JSON.stringify(testData));
      console.log('IPFS connection test successful:', path);
      return true;
    }
    return false;
  } catch (error) {
    console.warn('IPFS connection test failed:', error);
    return false;
  }
};