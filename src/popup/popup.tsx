import React, { useState, useEffect } from "react";
import { useSearchParams } from 'react-router-dom';
import { getAvaxBalance } from "../utils/web3.util";


interface Account {
    privateKey: string;
    address: string;
    balance: string;
  }

const Popup = () => {
   let [searchParams, setSearchParams] = useSearchParams();
   const [address, setAddress] = useState<any>()
   const [balance, setBalance] = useState<any>()
   const [activity, setActivity] = useState<any>([])
   

    useEffect(() => {

      async function getBalance(address) {
        return await getAvaxBalance(address);
      }
  
      const paramValue = searchParams.get('tabId');

      chrome.storage.local.get(['walletData'], async function(result) {
        if (chrome.runtime.lastError) {
         
        }
        setAddress(result['walletData'].address)
        const _balance = await getBalance(result.walletData.address);
                setBalance(_balance);
                console.log("balance", _balance);
    
        console.log("result of stored", result['walletData'].address);
    });


    chrome.storage.local.get(['activity'], async function(result) {
      const activityData = result['activityData'] || [];
      activityData.sort((a, b) => b.blockNumber - a.blockNumber);
      setActivity(result.activity)

    })

       
    }, []);



    return (
      <div className="bg-black text-white min-h-screen p-4">
        <div className="max-w-md mx-auto">
          {/* Profile Section */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <div className="bg-gray-700 rounded-full h-8 w-8"></div>
              <div>
                <p className="text-lg font-bold">Wallet1</p>
                <p className="text-xs">{ address }</p>
              </div>
            </div>
          
          </div>
  
          {/* Balance Section */}
          <div className="text-center mb-8">
            <p className="text-3xl font-bold">{+balance} AVAX</p>
            {/* <p className="text-gray-400">$41.68 USD</p> */}
          </div>
  
          {/* Activity Section */}
          <div>
          <h2 className="text-xl font-bold mb-4">Activity</h2>
          <div>
            {activity.map((item, index) => (
              <div key={index} className="mb-4">
                <p className="text-gray-400">{item.date}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-gray-700 h-6 w-6 rounded-full mr-2"></div>
                    <p>Contract Interaction</p>
                  </div>
                  <div className="flex items-center">
                    <p className="text-green-500 mr-2">{item.status}</p>
                    <p className="text-red-500 mr-2">0.001 Avax</p>
                    <a href={"https://testnet.snowtrace.io/tx/" + item.transactionHash} target="_blank" rel="noopener noreferrer" ><p className="text-gray-400">View</p></a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>


        </div>
      </div>
    );
  
};

export default Popup;