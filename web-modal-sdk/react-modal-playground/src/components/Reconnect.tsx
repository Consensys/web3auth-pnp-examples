import { useEffect } from "react";
import { useAccount, useConnect, useReconnect } from "wagmi";

import { web3AuthInstance } from '../services/wagmi';

export const Reconnect = ({ children }: React.PropsWithChildren) => {
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect()

  useEffect(() => {
    console.log('Reconnect', isConnected, web3AuthInstance.connected);
    if (!isConnected) {
      // connect({ connector: connectors[0] });
    }
  }, [isConnected]);

  return (
    <div>
      {children}
    </div>
  );
};