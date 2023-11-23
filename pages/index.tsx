import { ConnectWallet } from "@thirdweb-dev/react";
import React, {useState} from "react";
import { embeddedWallet, useAddress, useConnect } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
//import Image from "next/image";
import { NextPage } from "next";
import { ACCOUNT_FACTORY_ADDRESS } from "../constants/addresses";

const embeddedWalletConfig = embeddedWallet({
  styles: {
    borderRadius: "10px",
    colorBackground: "#232323",
    colorPrimary: "lightseagreen",
    colorText: "#FFFFFFF",
  }
});

const smartWalletConfig = {
  factoryAddress: ACCOUNT_FACTORY_ADDRESS,
  gasless: true,
}



const Home: NextPage = () => {
  const address = useAddress();
  const connect = useConnect();

  const [emailInput, setEmailInput] = useState("");
  const [personalWalletAddress, setPersonalWalletAddress] = useState<string | undefined>(undefined);
  const [smartWalletAddress, setSmartlWalletAddress] = useState<string | undefined>(undefined);

  const handleLogin = async () => {
    try {
      const personalWallet = await connect(embeddedWalletConfig, {
        chainId: 80001,
        loginType: "ui_email_otp",
        email: emailInput,
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {address ? (
          <></>
        ) : (
          <div className={styles.centeredContainer}>
            <div className={styles.centeredCard}>
              <h1>Login</h1>
              <p>Enter your email to login.</p>
              <input
                type="email"
                placeholder="Enter your email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                />
                <button>Login</button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Home;
