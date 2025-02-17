import { useCallback, useState } from "react";

import Form from "../components/Form";
import Header from "../components/Header";
import NotConnectedPage from "../components/NotConnectedPage";
import Sidebar from "../components/Sidebar";
import Tabs from "../components/Tabs";
import { useAccount, useSendTransaction, useSignMessage } from "wagmi";
import { Address, parseEther } from "viem";
import { useIsConnected } from "../hooks/useIsConnected";
import { LoaderButton } from "../components/LoaderButton";

export function Transaction() {
  const { isConnected } = useIsConnected();
  const { sendTransactionAsync } = useSendTransaction()
  const { signMessageAsync } = useSignMessage()
  const { address: userAddress } = useAccount()

  const [message, setMessage] = useState("Welcome to WLFI");
  const [address, setAddress] = useState("0xe9962bF08A23C5Bf7967bd59CB35C95E24fB6ce0");
  const [amount, setAmount] = useState("0.0001");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("sendTransaction");

  const handleSendTransaction = useCallback(async (to: Address, value: string) => {
    setLoading(true);
    const result = await sendTransactionAsync({
      to,
      value: parseEther(value),
    });
    alert(`Transaction: ${result}`);
    setLoading(false);
  }, [sendTransactionAsync]);

  const handleSignMessage = useCallback(async (message: string) => {
    setLoading(true);
    const signature = await signMessageAsync({
      account: userAddress,
      message,
    });
    alert(`Signature: ${signature}`);
    setLoading(false);
  }, [signMessageAsync]);

  const formDetailsSignMessage = [
    {
      label: "Message",
      input: message as string,
      onChange: setMessage,
    },
  ];

  const formDetailsDestinationAddress = [
    {
      label: "Destination address",
      input: address as string,
      onChange: setAddress,
    },
    {
      label: `Amount`,
      input: amount as string,
      onChange: setAmount,
    },
  ];

  const TabData = [
    {
      tabName: "Send Transaction",
      onClick: () => setTab("sendTransaction"),
      active: tab === "sendTransaction",
    },
    {
      tabName: "Sign Message",
      onClick: () => setTab("signMessage"),
      active: tab === "signMessage",
    },
  ];

  return (
    <main className="flex flex-col h-screen z-0">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {isConnected ? (
          <>
            <Sidebar />
            <div className=" w-full h-full flex flex-1 flex-col items-center justify-flex-start overflow-y-auto">
              <Tabs tabData={TabData} />
              {tab === "signMessage" ? (
                <Form formDetails={formDetailsSignMessage}>
                  <LoaderButton
                    className="w-full mt-10 mb-0 text-center justify-center items-center flex rounded-full px-6 py-3 text-black bg-primary hover:bg-secondary"
                    onClick={async () => handleSignMessage(message)}
                    loading={loading}
                  >
                    Sign Message
                  </LoaderButton>
                </Form>
              ) : (
                <Form formDetails={formDetailsDestinationAddress}>
                  <LoaderButton
                    className="w-full mt-10 mb-0 text-center justify-center items-center flex rounded-full px-6 py-3 text-black bg-primary hover:bg-secondary"
                    onClick={async () => handleSendTransaction(address as Address, amount)}
                    loading={loading}
                  >
                    Send Transaction
                  </LoaderButton>
                </Form>
              )}
            </div>
          </>
        ) : (
          <NotConnectedPage />
        )}
      </div>
    </main>
  );
}
