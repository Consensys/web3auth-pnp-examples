import { web3AuthInstance } from '../services/wagmi';

export const useWeb3Auth = () => {
  return { web3Auth: web3AuthInstance };
}