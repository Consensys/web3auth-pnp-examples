import { useNavigate } from "react-router-dom";

import wlfiLogo from "../assets/wlfiLogo.png";
import DisconnectWeb3AuthButton from "./DisconnectButton";

const Header = () => {
  const navigate = useNavigate();

  function goToHome() {
    navigate("/");
  }

  return (
    <header className="sticky max-w-screen z-10">
      <div className="px-4 py-4 mx-auto sm:py-2 sm:px-6 md:px-8">
        <div className="justify-between items-center flex">
          <div className="flex justify-center py-3 flex-row" onClick={() => goToHome()}>
            <div className="flex flex-row justify-center items-center">
              <img
                src={wlfiLogo}
                style={{
                  height: "30px",
                  paddingRight: "15px",
                }}
              />
              <div className="text-lg sm:text-xl bg-[linear-gradient(134.84deg,#ffe898,#57370e_101.44%)] text-transparent bg-clip-text items-center">
                World Liberty Financial
              </div>
            </div>
          </div>
          <div className="flex-col flex-row mt-0 items-center lg:flex">
            <DisconnectWeb3AuthButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
