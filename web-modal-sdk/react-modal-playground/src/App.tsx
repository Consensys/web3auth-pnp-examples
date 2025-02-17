import "./App.css";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { wagmiConfig } from './services/wagmi'
import HomePage from "./pages/HomePage";
import Transaction from "./pages/Transaction";
import { Reconnect } from "./components/Reconnect";

const queryClient = new QueryClient()

function App() {
  return (
    <div>
      <WagmiProvider config={wagmiConfig} reconnectOnMount={true}>
        <QueryClientProvider client={queryClient}>
          <Reconnect>
            <BrowserRouter>
              <Routes>
                <Route path="/">
                  <Route index element={<HomePage />} />
                  <Route path="transaction" element={<Transaction />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </Reconnect>
        </QueryClientProvider>
      </WagmiProvider>
    </div>
  );
}

export default App;
