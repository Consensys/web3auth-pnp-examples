import { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import NotConnectedPage from "../components/NotConnectedPage";
import { useIsConnected } from "../hooks/useIsConnected";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import { Address, erc721Abi } from "viem";
import { fakeErc721Abi } from "../abis/fakeErc721.abi";
import { LoaderButton } from "../components/LoaderButton";

type NFT = {
  address: Address;
  tokenId: bigint;
};

type Metadata = {
  name: string;
  image: string;
}

const collectionAddress: Address = import.meta.env.VITE_NFT_ADDRESS;
const ipfsGatewayUrl = "https://ipfs.io/ipfs/";

export function NFTList() {
  const { address, chain } = useAccount();
  const { isConnected } = useIsConnected();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [minting, setMinting] = useState(false);
  const { writeContractAsync } = useWriteContract()
  const publicClient = usePublicClient()

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isConnected) {
      void fetchUserNFTs();
      interval = setInterval(() => fetchUserNFTs(), 5000);
    }

    return () => clearInterval(interval);
  }, [isConnected]);

  const fetchUserNFTs = async (): Promise<void> => {
    const nftsTmp: NFT[] = [];

    const fetchedNFTs = await publicClient
      .readContract({
        address: collectionAddress,
        abi: fakeErc721Abi,
        functionName: 'balanceOf',
        args: [address],
      })
      .then(async (balanceOf) => {
        await Promise.all(
          Array.from({ length: Number(balanceOf) }).map(async (_, i) => {
            const tokenId = await publicClient.readContract({
              address: collectionAddress,
              abi: fakeErc721Abi,
              functionName: 'tokenOfOwnerByIndex',
              args: [address, BigInt(i)],
            });

            nftsTmp.push({
              address: collectionAddress,
              tokenId,
            });
          }),
        );

        return nftsTmp.sort((a, b) => Number(a.tokenId) - Number(b.tokenId));
      });
    setNfts(fetchedNFTs);
  };

  const handleMintNFT = async () => {
    setMinting(true);
    try {
      await writeContractAsync({
        chain,
        account: address,
        address: collectionAddress,
        abi: fakeErc721Abi,
        functionName: 'mintOne',
        args: [],
        value: 0n as undefined,
      });
    } catch (error) {
      console.error(error);
    }

    await fetchUserNFTs();
    setMinting(false);
  };

  return (
    <main className="flex flex-col h-screen z-0">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {isConnected ? (
          <>
            <Sidebar />
            <div className="w-full h-full flex flex-1 flex-col items-center justify-flex-start overflow-y-auto">
              <div className="py-16 w-11/12 px-4 sm:px-6 lg:px-8 z-0">
                <div className="flex flex-col space-y-2 md:flex-row md:justify-between md:space-y-0">
                  <h1 className="text-lg font-bold text-gray-400">Mint NFT</h1>
                </div>

                <div className="md:p-8 p-4 mt-6 space-y-4 rounded-lg bg-dark overflow-hidden w-full">
                  <div className="flex flex-wrap gap-4 p-4">
                    {nfts.map((nft, index) => (
                      <NFTItem key={index} nft={nft} />
                    ))}
                    <div className="w-32 h-32 bg-gray-200 flex items-center justify-center">
                      <LoaderButton
                        disabled={minting}
                        className="w-full h-full flex items-center text-black justify-center bg-primary"
                        onClick={handleMintNFT}
                        loading={minting}
                      >
                        Mint NFT
                      </LoaderButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <NotConnectedPage />
        )}
      </div>
    </main>
  );
};


const NFTItem = ({ nft }: { nft: NFT }) => {
  const publicClient = usePublicClient()
  const [metadata, setMetadata] = useState<Metadata | null>(null);

  const getHttpIpfsUri = async (ipfsUri: string): Promise<string> => {
    return ipfsUri.replace('ipfs://', ipfsGatewayUrl);
  }

  const getTokenMetadata = async (address: Address, tokenId: bigint): Promise<Metadata> => {
    const ipfsUri = await publicClient.readContract({
      address,
      abi: erc721Abi,
      functionName: 'tokenURI',
      args: [tokenId],
    });

    const httpUri = await getHttpIpfsUri(ipfsUri);
    const metadata = await (await fetch(httpUri)).json();

    return {
      ...metadata,
      image: await getHttpIpfsUri(metadata.image),
    };
  }

  useEffect(() => {
    getTokenMetadata(nft.address, nft.tokenId).then(setMetadata);
  }, [nft]);

  return <div className="w-32 h-32 bg-gray-200 flex items-center justify-center">
    <img src={metadata?.image} alt={`NFT ${nft.tokenId}`} className="w-full h-full object-cover" />
  </div>
}