import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { useState } from 'react';

// Contract ABI - this would be generated after compilation
const CONTRACT_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "_verifier", "type": "address"}
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "circleId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "creator", "type": "address"},
      {"indexed": false, "internalType": "string", "name": "name", "type": "string"}
    ],
    "name": "CircleCreated",
    "type": "event"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "_name", "type": "string"},
      {"internalType": "string", "name": "_description", "type": "string"},
      {"internalType": "bool", "name": "_isPrivate", "type": "bool"}
    ],
    "name": "createCircle",
    "outputs": [
      {"internalType": "uint256", "name": "", "type": "uint256"}
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "circleId", "type": "uint256"}
    ],
    "name": "getCircleInfo",
    "outputs": [
      {"internalType": "string", "name": "name", "type": "string"},
      {"internalType": "string", "name": "description", "type": "string"},
      {"internalType": "uint8", "name": "memberCount", "type": "uint8"},
      {"internalType": "uint8", "name": "messageCount", "type": "uint8"},
      {"internalType": "bool", "name": "isPrivate", "type": "bool"},
      {"internalType": "bool", "name": "isActive", "type": "bool"},
      {"internalType": "address", "name": "creator", "type": "address"},
      {"internalType": "uint256", "name": "createdAt", "type": "uint256"},
      {"internalType": "uint256", "name": "lastActivity", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "user", "type": "address"}
    ],
    "name": "getUserCircles",
    "outputs": [
      {"internalType": "uint256[]", "name": "", "type": "uint256[]"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x742d35Cc6634C5532C69bE16d4a7B5';

export const useCozyCircleContract = () => {
  const { address } = useAccount();

  return {
    address,
    contractAddress: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
  };
};

export const useCreateCircle = () => {
  const { contractAddress, abi } = useCozyCircleContract();
  
  const { writeContractAsync: createCircle, isPending: isLoading, error } = useWriteContract();

  const createCircleWithArgs = async (args: [string, string, boolean]) => {
    return createCircle({
      address: contractAddress as `0x${string}`,
      abi: abi,
      functionName: 'createCircle',
      args: args,
    });
  };

  return {
    createCircle: createCircleWithArgs,
    isLoading,
    error,
  };
};

export const useGetCircleInfo = (circleId: number) => {
  const { contractAddress, abi } = useCozyCircleContract();
  
  const { data, isLoading, error } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: abi,
    functionName: 'getCircleInfo',
    args: [BigInt(circleId)],
  });

  return {
    circleInfo: data,
    isLoading,
    error,
  };
};

export const useGetUserCircles = (userAddress?: string) => {
  const { address } = useAccount();
  const { contractAddress, abi } = useCozyCircleContract();
  
  const { data, isLoading, error } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: abi,
    functionName: 'getUserCircles',
    args: [userAddress || address],
    query: {
      enabled: !!(userAddress || address),
    },
  });

  return {
    userCircles: data,
    isLoading,
    error,
  };
};
