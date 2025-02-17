import { useEffect } from "react";
import { useConnect } from "wagmi";

import { useIsConnected } from "../hooks/useIsConnected";

export const Reconnect = ({ children }: React.PropsWithChildren) => {
  const { wagmiIsConnected, web3AuthIsConnected } = useIsConnected()
  const { connect, connectors } = useConnect()

  useEffect(() => {
    if (!wagmiIsConnected && web3AuthIsConnected) {
      connect({ connector: connectors[0] });
    }
  }, [wagmiIsConnected, web3AuthIsConnected]);

  return (
    <div>
      {children}
    </div>
  );
};