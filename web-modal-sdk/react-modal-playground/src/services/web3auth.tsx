import { AuthAdapter, LOGIN_PROVIDER, MFA_LEVELS } from "@web3auth/auth-adapter";
import { Web3AuthConnector } from "@web3auth/web3auth-wagmi-connector";
import { Web3Auth } from "@web3auth/modal";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { CHAIN_NAMESPACES, UX_MODE, WEB3AUTH_NETWORK, WALLET_ADAPTERS } from "@web3auth/base";
import { Chain } from "wagmi/chains";
import {
  AccountAbstractionProvider,
  SafeSmartAccount,
} from "@web3auth/account-abstraction-provider";

export function getWeb3AuthConnectorInstance(chains: Chain[]) {
  const chainId = chains[0].id;

  const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x" + chains[0].id.toString(16),
    rpcTarget: chains[0].rpcUrls.default.http[0], // This is the public RPC we have added, please pass on your own endpoint while creating an app
    displayName: chains[0].name,
    tickerName: chains[0].nativeCurrency?.name,
    ticker: chains[0].nativeCurrency?.symbol,
    blockExplorerUrl: chains[0].blockExplorers?.default.url[0] as string,
  };

  const clientId = import.meta.env.VITE_WEB3AUTH_CLIENT_ID || '';
  const pimlicoAPIKey = import.meta.env.VITE_PIMLICO_API_KEY || '';

  const privateKeyProvider = new EthereumPrivateKeyProvider({
    config: {
      chainConfig,
    },
  });

  const accountAbstractionProvider = new AccountAbstractionProvider({
    config: {
      chainConfig,
      bundlerConfig: {
        url: `https://api.pimlico.io/v2/${chainId}/rpc?apikey=${pimlicoAPIKey}`,
      },
      smartAccountInit: new SafeSmartAccount(),
      paymasterConfig: {
        url: `https://api.pimlico.io/v2/${chainId}/rpc?apikey=${pimlicoAPIKey}`,
      }
    }
  });

  const web3AuthInstance = new Web3Auth({
    chainConfig,
    clientId,
    uiConfig: {
      loginMethodsOrder: [LOGIN_PROVIDER.GOOGLE, LOGIN_PROVIDER.APPLE, LOGIN_PROVIDER.FACEBOOK, LOGIN_PROVIDER.GITHUB],
    },
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    privateKeyProvider,
    accountAbstractionProvider,
    useAAWithExternalWallet: true,
  });

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
  web3AuthInstance.configureAdapter(authAdapter)

  // const modalConfig = {
  //   [WALLET_ADAPTERS.AUTH]: {
  //     label: "openlogin",
  //     loginMethods: {
  //       [LOGIN_PROVIDER.GOOGLE]: {
  //         name: `${LOGIN_PROVIDER.GOOGLE} login`,
  //         showOnModal: true,
  //       },
  //       [LOGIN_PROVIDER.FACEBOOK]: {
  //         name: `${LOGIN_PROVIDER.FACEBOOK} login`,
  //         showOnModal: true,
  //       },
  //       [LOGIN_PROVIDER.REDDIT]: {
  //         name: `${LOGIN_PROVIDER.REDDIT} login`,
  //         showOnModal: false,
  //       },
  //       [LOGIN_PROVIDER.DISCORD]: {
  //         name: `${LOGIN_PROVIDER.DISCORD} login`,
  //         showOnModal: false,
  //       },
  //       [LOGIN_PROVIDER.TWITCH]: {
  //         name: `${LOGIN_PROVIDER.TWITCH} login`,
  //         showOnModal: false,
  //       },
  //       [LOGIN_PROVIDER.APPLE]: {
  //         name: `${LOGIN_PROVIDER.APPLE} login`,
  //         showOnModal: true,
  //       },
  //       [LOGIN_PROVIDER.LINE]: {
  //         name: `${LOGIN_PROVIDER.LINE} login`,
  //         showOnModal: false,
  //       },
  //       [LOGIN_PROVIDER.GITHUB]: {
  //         name: `${LOGIN_PROVIDER.GITHUB} login`,
  //         showOnModal: true,
  //       },
  //       [LOGIN_PROVIDER.KAKAO]: {
  //         name: `${LOGIN_PROVIDER.KAKAO} login`,
  //         showOnModal: false,
  //       },
  //       [LOGIN_PROVIDER.LINKEDIN]: {
  //         name: `${LOGIN_PROVIDER.LINKEDIN} login`,
  //         showOnModal: false,
  //       },
  //       [LOGIN_PROVIDER.TWITTER]: {
  //         name: `${LOGIN_PROVIDER.TWITTER} login`,
  //         showOnModal: false,
  //       },
  //       [LOGIN_PROVIDER.WEIBO]: {
  //         name: `${LOGIN_PROVIDER.WEIBO} login`,
  //         showOnModal: false,
  //       },
  //       [LOGIN_PROVIDER.WECHAT]: {
  //         name: `${LOGIN_PROVIDER.WECHAT} login`,
  //         showOnModal: false,
  //       },
  //       [LOGIN_PROVIDER.FARCASTER]: {
  //         name: `${LOGIN_PROVIDER.FARCASTER} login`,
  //         showOnModal: false,
  //       },
  //     },
  //     showOnModal: true,
  //   },
  // }

  const web3AuthConnector = Web3AuthConnector({
    id: 'web3auth',
    name: 'Web3Auth',
    web3AuthInstance,
    // modalConfig,
  });

  return { web3AuthConnector, web3AuthInstance };
}