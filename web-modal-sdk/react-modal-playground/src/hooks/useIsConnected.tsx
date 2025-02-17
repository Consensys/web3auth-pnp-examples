import { useAccount } from "wagmi";

import { ADAPTER_EVENTS } from "@web3auth/base";
import { useEffect, useState } from "react";
import { useWeb3Auth } from "./useWeb3Auth";

export const useIsConnected = () => {
  const { web3Auth } = useWeb3Auth();
  const [web3AuthIsConnected, setWeb3AuthConnected] = useState(web3Auth.connected);
  const [web3AuthIsConnecting, setWeb3AuthConnecting] = useState(false);
  const { isConnected, isConnecting } = useAccount();

  const onConnecting = () => {
    setWeb3AuthConnecting(true);
  };

  const onConnected = () => {
    setWeb3AuthConnected(true);
    setWeb3AuthConnecting(false);
  };

  const onDisconnected = () => {
    setWeb3AuthConnected(false);
    setWeb3AuthConnecting(false);
  };

  useEffect(() => {
    web3Auth.on(ADAPTER_EVENTS.CONNECTING, onConnecting);
    web3Auth.on(ADAPTER_EVENTS.CONNECTED, onConnected);
    web3Auth.on(ADAPTER_EVENTS.DISCONNECTED, onDisconnected);

    return () => {
      web3Auth.off(ADAPTER_EVENTS.CONNECTING, onConnecting);
      web3Auth.off(ADAPTER_EVENTS.CONNECTED, onConnected);
      web3Auth.off(ADAPTER_EVENTS.DISCONNECTED, onDisconnected);
    };
  }, [web3Auth.connected]);

  return {
    isConnected: isConnected && web3AuthIsConnected,
    isConnecting: isConnecting || web3AuthIsConnecting,
    wagmiIsConnected: isConnected,
    wagmiIsConnecting: isConnecting,
    web3AuthIsConnected,
    web3AuthIsConnecting,
  };
}