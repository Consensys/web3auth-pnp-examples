import { useConnect } from "wagmi";
import { useIsConnected } from "../hooks/isConnected";

const ConnectButton = () => {
  const { isConnected } = useIsConnected();
  const { connect, connectors } = useConnect();

  if (isConnected) {
    return null;
  }

  return (
    <div
      className="flex flex-row rounded-full px-14 py-4 bg-primary text-black hover:bg-secondary justify-center align-center cursor-pointer"
      onClick={() => connect({ connector: connectors[0] })}
    >
      Connect to WLFI
    </div>
  );
};
export default ConnectButton;
