import { useDisconnect } from "wagmi";
import { useIsConnected } from "../hooks/isConnected";

const DisconnectButton = () => {
  const { isConnected } = useIsConnected();
  const { disconnect } = useDisconnect()

  if (isConnected) {
    return (
      <div
        className="flex flex-row rounded-full px-6 py-3 bg-primary text-black justify-center align-center cursor-pointer hover:bg-secondary"
        onClick={() => disconnect()}
      >
        Disconnect
      </div>
    );
  }
  return null;
};
export default DisconnectButton;
