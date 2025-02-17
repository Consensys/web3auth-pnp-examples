import { createConfig, http } from "wagmi";
import { sepolia, mainnet, polygon, arbitrum } from "wagmi/chains";

import { getWeb3AuthConnectorInstance } from "./web3auth";

export const availableChains = [arbitrum] as const;

export const { web3AuthConnector, web3AuthInstance } = getWeb3AuthConnectorInstance([...availableChains]);

// Set up client
export const wagmiConfig = createConfig({
  chains: availableChains,
  multiInjectedProviderDiscovery: false,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
  },
  connectors: [
    web3AuthConnector,
  ],
});