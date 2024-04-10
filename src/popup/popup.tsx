import React, { useState, useEffect } from "react";
import './popup.css'
import { generateAccount } from "../wallet-utils/accountUtils";

interface Account {
    privateKey: string;
    address: string;
    balance: string;
  }

const Popup = () => {
    const [showInput, setShowInput] = useState(false);
    const [seedPhrase, setSeedPhrase] = useState("");
    const [account, setAccount] = useState<Account | null>(null);
  
    const createAccount = () => {
      const account = generateAccount();// account object contains--> address, privateKey, seedPhrase, balance
      console.log("Account created!", account);
      setSeedPhrase(account.seedPhrase);
      setAccount(account.account);
    };
  
    const showInputFunction = () => {
      setShowInput(true);
    };
  
    const handleSeedPhraseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSeedPhrase(e.target.value);
    };
  
    const handleSeedPhraseSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const account = generateAccount(seedPhrase);
      console.log("Recovery", account);
      setSeedPhrase(account.seedPhrase);
      setAccount(account.account);
    };
   
  
    return (
      <div className="bg-black min-h-screen flex items-center justify-center p-4">
      <div className="max-w-sm mx-auto bg-gray-900 text-white rounded-lg overflow-hidden">
        <div className="p-4 flex justify-between items-center border-b border-gray-800">
          <div>
            <p className="text-sm">Ethereum Mainnet</p>
            <h2 className="font-bold">Account 1</h2>
          </div>
          <div>
            <p className="text-sm">0x8C7Bd...91576</p>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-2xl font-bold">0 ETH</h3>
          <p className="text-sm mb-4">$0.00 USD</p>
          <div className="flex justify-around text-sm mb-4">
            <button className="px-2">Buy & Sell</button>
            <button className="px-2">Send</button>
            <button className="px-2">Swap</button>
            <button className="px-2">Bridge</button>
            <button className="px-2">Portfolio</button>
          </div>
          <div className="flex mb-4">
            <div className="flex-1 bg-blue-600 p-2 mr-2 rounded">
              <button className="w-full">Buy</button>
            </div>
            <div className="flex-1 bg-purple-600 p-2 rounded">
              <button className="w-full">Receive</button>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-sm mb-2">Tokens</p>
            <div className="flex items-center p-2 bg-blue-800 rounded mb-2">
              <img src="/path-to-your-ethereum-logo.svg" alt="ETH" className="h-6 w-6 mr-2" />
              <div>
                <p>ETH + Stake</p>
                <p className="text-sm">Ethereum</p>
              </div>
            </div>
            <p className="text-sm text-gray-400">0 ETH</p>
            <p className="text-sm text-gray-400">$0.00 USD</p>
          </div>
          <div>
            <button className="text-blue-500 hover:underline text-sm">Import tokens</button>
          </div>
          <div className="my-4">
            <button className="text-blue-500 hover:underline text-sm">Refresh list</button>
          </div>
          <div>
            <button className="text-blue-500 hover:underline text-sm">MetaMask support</button>
          </div>
        </div>
      </div>
    </div>
    
    );
};

export default Popup;