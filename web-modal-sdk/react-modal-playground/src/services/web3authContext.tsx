import { AuthAdapter, LOGIN_PROVIDER, MFA_LEVELS } from "@web3auth/auth-adapter";
import { UX_MODE, WEB3AUTH_NETWORK } from "@web3auth/base";
import { getDefaultExternalAdapters } from "@web3auth/default-evm-adapter";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3AuthOptions } from "@web3auth/modal";
import { BUTTON_POSITION, CONFIRMATION_STRATEGY, WalletServicesPlugin } from "@web3auth/wallet-services-plugin";

import { chain } from "../config/chainConfig";

const clientId = import.meta.env.VITE_WEB3AUTH_CLIENT_ID || '';
const pimlicoAPIKey = import.meta.env.VITE_PIMLICO_API_KEY || '';

const chainConfig = chain.sepolia;
const chainId = parseInt(chainConfig.chainId, 10);

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: {
    chainConfig,
  },
});

const web3AuthOptions: Web3AuthOptions = {
  chainConfig,
  clientId,
  uiConfig: {
    loginMethodsOrder: [LOGIN_PROVIDER.GOOGLE, LOGIN_PROVIDER.APPLE, LOGIN_PROVIDER.FACEBOOK, LOGIN_PROVIDER.GITHUB],
  },
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  privateKeyProvider,
};

const authAdapter = new AuthAdapter({
  loginSettings: {
    mfaLevel: MFA_LEVELS.MANDATORY,
  },
  adapterSettings: {
    clientId,
    uxMode: UX_MODE.REDIRECT,
    mfaSettings: {
      passwordFactor: {
        enable: true,
        mandatory: true,
        priority: 1,
      },
      socialBackupFactor: {
        enable: true,
        mandatory: true,
        priority: 2,
      },
      passkeysFactor: {
        enable: true,
        mandatory: false,
        priority: 3,
      },
      authenticatorFactor: {
        enable: true,
        mandatory: false,
      },
      deviceShareFactor: {
        enable: false,
        mandatory: false,
      },
      backUpShareFactor: {
        enable: false,
        mandatory: false,
      },
    },
  },
});

const walletServicesPlugin = new WalletServicesPlugin({
  wsEmbedOpts: {},
  walletInitOptions: {
    whiteLabel: { showWidgetButton: true, buttonPosition: BUTTON_POSITION.BOTTOM_RIGHT },
    confirmationStrategy: CONFIRMATION_STRATEGY.MODAL,
  },
});

const adapters = await getDefaultExternalAdapters({ options: web3AuthOptions });

const web3AuthContextConfig = {
  web3AuthOptions,
  adapters: [authAdapter, ...adapters],
  plugins: [walletServicesPlugin],
};

export default web3AuthContextConfig;
