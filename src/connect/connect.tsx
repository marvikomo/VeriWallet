import React, { useState, useEffect } from "react";
import { useSearchParams } from 'react-router-dom';
import './connect.css'




const Connect = () => {

    useEffect(() => {

       
    }, []);

    let [searchParams, setSearchParams] = useSearchParams();
    const paramValue = searchParams.get('tabId');

    console.log("paramValue", paramValue)
    const accounts = [
        { address: '0xc01bf7...a90d0', label: 'Account 1' },
        { address: '0xcd8b7...4ce71', label: 'Account 2' },
      ];

      const handleSubmit = () => {
        // const port = chrome.runtime.connect({name: 'connect'});
        // port.postMessage({type: 'REQUEST_CONNECT', id: paramValue});
        window.close(); 
      }

    return (
        <div className="bg-whit shadow-lg rounded-lg p-8  flex justify-center items-center h-full max-w-sm mx-auto ">
          <div className="w-full max-w-md">
            <h1 className="text-2xl font-bold mb-4">Connect with VeriWallet</h1>
            <p className="text-gray-400 mb-6">Select the account(s) to use on this site</p>
            <div className="flex flex-col space-y-2 mb-6">
              <div className="flex items-center">
                <input
                  id="select-all"
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-500"
                />
                <label htmlFor="select-all" className="ml-2 text-sm font-medium">
                  Select all
                </label>
              </div>
              {accounts.map((account, index) => (
                <div key={index} className="flex items-center">
                  <input
                    id={`account-${index}`}
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-500"
                  />
                  <label
                    htmlFor={`account-${index}`}
                    className="ml-2 text-sm font-medium flex items-center"
                  >
                    <span className="text-blue-400 mr-1">{account.label}</span>
                    <span className="text-gray-400">{account.address}</span>
                  </label>
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              <button className="px-4 py-2 rounded-md bg-gray-800 text-sm font-medium hover:bg-gray-700">
                Cancel
              </button>
              <button onClick= {handleSubmit} className="px-4 py-2 rounded-md bg-blue-500 text-sm font-medium hover:bg-blue-600">
                Next
              </button>
            </div>
          </div>
        </div>
      );
};

export default Connect;