import { useAccount } from "wagmi";

import { web3AuthInstance } from '../services/wagmi';

export const useIsConnected = () => {
  const { isConnected } = useAccount();

  return { isConnected: isConnected && web3AuthInstance.connected };
}