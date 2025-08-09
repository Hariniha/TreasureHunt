import { create } from 'ipfs-http-client';

const ipfs = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }); // Use Infura or your node

export const uploadToIPFS = async (data) => {
  const { path } = await ipfs.add(JSON.stringify(data));
  return `ipfs://${path}`;
};

export const getFromIPFS = async (cid) => {
  const content = [];
  for await (const chunk of ipfs.cat(cid)) {
    content.push(chunk);
  }
  return JSON.parse(Buffer.concat(content).toString());
};