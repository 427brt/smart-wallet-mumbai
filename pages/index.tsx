import { ConnectWallet, Web3Button, embeddedWallet, metamaskWallet, smartWallet, useAddress, useConnect, useContract, useOwnedNFTs } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import { NextPage } from "next";
import { ACCOUNT_FACTORY_ADDRESS, NFT_CONTRACT_ADDRESS } from "../constants/addresses";
import { useState } from "react";

const OPENSEA_LINK = `https://testnets.opensea.io/ja/account`;

const embeddedWalletConfig = embeddedWallet({
  
});


const metamaskWalletConfig = metamaskWallet();

const smartWalletConfig = smartWallet(embeddedWalletConfig, {
  factoryAddress: ACCOUNT_FACTORY_ADDRESS,
  gasless: true,
  //clientId: process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID,
  //bundlerUrl: "https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44",
  //paymasterUrl: "https://paymaster.biconomy.io/api/v1/80001/0lHU2YoNt.2440bbe3-9fe1-442e-b2a4-1125dee3059c",
});

const Home: NextPage = () => {
  const address = useAddress();
  const connect = useConnect();

  const [emailInput, setEmailInput] = useState("");
  const [personalWalletAddress, setPersonalWalletAddress] = useState<string | undefined>(undefined);
  const [smartWalletAddress, setSmartWalletAddress] = useState<string | undefined>(undefined);

  const handleLogin = async () => {
    try {
      const personalWallet = await connect(metamaskWalletConfig);
      const personalWalletAddress = await personalWallet.getAddress();
      setPersonalWalletAddress(personalWalletAddress);

      const smartWallet = await connect(smartWalletConfig, {
        personalWallet: personalWallet,
        chainId: 80001,
      });
      const smartWalletAddress = await smartWallet.getAddress();
      setSmartWalletAddress(smartWalletAddress);
      setEmailInput("");
    } catch (error) {
      console.error(error);
    }
  };

  const {
    contract
  } = useContract(NFT_CONTRACT_ADDRESS);

  const {
    data: personalOwnedNFTs,
    isLoading: isPersonalOwnedNFTsLoading,
  } = useOwnedNFTs(contract, personalWalletAddress);

  const {
    data: smartOwnedNFTs,
    isLoading: isSmartOwnedNFTsLoading,
  } = useOwnedNFTs(contract, smartWalletAddress);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {address ? (
          <div className={styles.centeredContainer}>
            <div className={styles.centeredCard}>
              <ConnectWallet />
              <h1>Connected to Mumbai</h1>
              <p>Your Personal Wallet: {personalWalletAddress}</p>
              <p><a href="https://testnets.opensea.io/ja/account" target="_blank">Here is the URL to your NFT</a></p>
              <Web3Button
                contractAddress={NFT_CONTRACT_ADDRESS}
                action={(contract) => contract.erc1155.claimTo(personalWalletAddress!, 0, 1)}
              >Claim NFT</Web3Button>
              <div style={{ width: "100%", margin: "0 auto", textAlign: "center" }}>
                {!isPersonalOwnedNFTsLoading && (
                  personalOwnedNFTs && personalOwnedNFTs.length > 0 ? (
                    personalOwnedNFTs.map((nft) => (
                      <p key={nft.metadata.id}>Number of possessions: {nft.quantityOwned}</p>
                    ))
                  ) : (
                    <p>No NFTs owned.</p>
                  )
                )}
              </div>
              <p>Smart Wallet: {smartWalletAddress}</p>
              <Web3Button
                contractAddress={NFT_CONTRACT_ADDRESS}
                action={(contract) => contract.erc1155.claim(0, 1)}
              >Claim NFT</Web3Button>
              <div style={{ width: "100%", margin: "0 auto", textAlign: "center" }}>
                {!isSmartOwnedNFTsLoading && (
                  smartOwnedNFTs && smartOwnedNFTs.length > 0 ? (
                    smartOwnedNFTs.map((nft) => (
                      <p key={nft.metadata.id}>Number of possessions: {nft.quantityOwned}</p>
                    ))
                  ) : (
                    <p>No NFTs owned.</p>
                  )
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.centeredContainer}>
            <div className={styles.centeredCard}>
              <h1>Login</h1>
              <p>Enter text to login.</p>
              <input
                type="email"
                placeholder="Enter text"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
              />
              <button
                onClick={handleLogin}
              >Login</button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Home;
