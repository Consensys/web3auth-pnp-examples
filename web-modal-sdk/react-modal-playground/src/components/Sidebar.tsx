import { useLocation, useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { useAccount } from "wagmi";

const Sidebar = () => {
  const { chain, address } = useAccount();

  const navigate = useNavigate();
  function goToHome() {
    navigate("/");
  }
  function goToTransaction() {
    navigate("/transaction");
  }
  function goToNFT() {
    navigate("/nft");
  }

  const goToExplorer = useCallback(() => {
    window.open(`${chain.blockExplorers.default.url}/address/${address}#internaltx`);
  }, [chain, address]);

  const location = useLocation();
  function linktoGo(label: string, path: any, id: number) {
    return (
      <div onClick={() => path()} key={id} className="flex items-center px-4 py-2 mb-2 text-white rounded-lg hover:text-primary cursor-pointer">
        <span className="text-sm font-normal">{label}</span>
      </div>
    );
  }
  function activePage(label: string, id: number) {
    return (
      <div key={id} className="flex items-center px-4 py-2 mb-2 rounded-lg text-primary cursor-pointer">
        <span className="text-sm font-bold">{label}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between h-screen w-68 p-5 lg:flex">
      <div className="py-3">
        <strong className="px-4 block p-1 text-xs font-medium text-gray-400 uppercase">MENU</strong>
        <nav className="flex flex-col mt-6">
          {location.pathname === "/" ? activePage("My Account", 1) : linktoGo("My Account", goToHome, 1)}
          {location.pathname === "/nft" ? activePage("NFT", 2) : linktoGo("NFT", goToNFT, 2)}
          {location.pathname === "/transaction" ? activePage("Signing/ Transaction", 3) : linktoGo("Signing/ Transaction", goToTransaction, 3)}

          {linktoGo("Verify on Etherscan", goToExplorer, 9)}
        </nav>
      </div>
    </div>
  );
};
export default Sidebar;
