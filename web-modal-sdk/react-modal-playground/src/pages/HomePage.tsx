import AccountDetails from "../components/AccountDetails";
import Header from "../components/Header";
import NotConnectedPage from "../components/NotConnectedPage";
import Sidebar from "../components/Sidebar";
import { useIsConnected } from "../hooks/useIsConnected";

export function HomePage() {
  const { isConnected } = useIsConnected();

  return (
    <main className="flex flex-col h-screen z-0">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {isConnected ? (
          <>
            <Sidebar />
            <div className="w-full h-full flex flex-1 flex-col items-center justify-flex-start overflow-y-auto">
              <AccountDetails />
            </div>
          </>
        ) : (
          <NotConnectedPage />
        )}
      </div>
    </main>
  );
}
