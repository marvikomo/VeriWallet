import React, { useState, useEffect } from "react";
import { useSearchParams } from 'react-router-dom';
import './popup.css'
import { generateAccount } from "../wallet-utils/accountUtils";
import transactionStore from '../controllers/transaction-store'

interface Account {
    privateKey: string;
    address: string;
    balance: string;
  }

const Popup = () => {
   let [searchParams, setSearchParams] = useSearchParams();
    const [showInput, setShowInput] = useState(false);
    const [seedPhrase, setSeedPhrase] = useState("");
    const [account, setAccount] = useState<Account | null>(null);


    //console.log("paramVal", paramValue)


    useEffect(() => {

      const paramValue = searchParams.get('tabId');

      console.log("transaction store", )

      console.log("param Value", paramValue)
  
  
      console.log("query param", transactionStore.getTransaction(paramValue))

       
    }, []);


    const handleSubmit = (event) => {
      event.preventDefault();
      // Logic to handle submission
    };

  
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
    
      <div className="bg-whit shadow-lg rounded-lg p-8  flex justify-center items-center h-full max-w-sm mx-auto " >
        <div >
        <h2 className="text-xl font-semibold mb-8">Testnet Transaction</h2>
        <div className="mb-12">
          <div className="text-sm font-semibold text-gray-700">Signature Address:</div>
          <div className="text-sm mb-4">0xf1C50D1D7585ac2B94BAD9ebde9e0b7Aa0225E20</div>
          <div className="text-sm font-semibold text-gray-700">Interact Contract:</div>
          <div className="text-sm mb-4">0xab83...eded</div>
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm font-semibold text-gray-700">Interacted before:</div>
            <div className="text-sm">Yes</div>
          </div>
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm font-semibold text-gray-700">Number of interactions:</div>
            <div className="text-sm">20</div>
          </div>
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm font-semibold text-gray-700">Audit Status:</div>
            <div className="text-sm text-blue-600 cursor-pointer hover:underline">Verified (click here)</div>
          </div>
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm font-semibold text-gray-700">Safe:</div>
            <div className="text-sm">Medium</div>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-4 mb-4">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm font-semibold text-gray-700">Operation:</div>
            <div className="text-sm">approve</div>
          </div>
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm font-semibold text-gray-700">Gas:</div>
            <div className="text-sm">0.00092417 ≈$0.05</div>
          </div>
        </div>
        <p className="text-xs text-gray-600 mb-4">It's important to be aware that some contracts are malicious and can potentially drain your funds. Carefully review the contract details before signing.</p>
        <div className="flex items-center justify-between">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Sign and Create
          </button>
          <button className="text-blue-500 hover:text-blue-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Cancel
          </button>
          </div>
        </div>
      </div>

    );

};

export default Popup;