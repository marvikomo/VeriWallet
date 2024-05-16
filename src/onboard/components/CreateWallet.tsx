import React, { useEffect, useState } from 'react'
// import { generateAccount } from '../../wallet-utils/accountUtils'
import { useNavigate } from 'react-router-dom'
import KeyringController from '../../controllers/keyring-controller'
const CreateWallet = () => {
  const navigate = useNavigate()

  const keyring = KeyringController

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')


  useEffect(() => {
    
    keyring.getAccounts().then(res => {
      console.log("res>>>>>", res)
    })
     
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      alert('Passwords do not match')
    }

    //Onboard
    const keyStringstate =  chrome.storage.local.get(['keyringState'])
  
    let valueToPersit = null
    keyring.loadStore(keyStringstate)
    keyring.store.subscribe(value => {
      console.log("keyring state>>>", value)
      valueToPersit = value
    })
    
    await keyring.boot(password);

    //get mnemonic
    let seed = await keyring.getMnemonic();
  
   await keyring.createKeyringWithMnemonics(seed);

    const k = keyring.filterKeyringsByType("HD Key Tree")

   const accts = await keyring.addNewAccount(k[0])
   
    const getAcct = await keyring.getAccounts()

    const exported = await keyring.exportAccount(getAcct[0])

    console.log("getAcct", exported)

    const port = chrome.runtime.connect({ name: 'persit-keyring' })
    port.postMessage({ type: 'PERSIT_KEYRING', value:valueToPersit, address: getAcct[0]})


    //store it encrypted password
    chrome.storage.local.set({ encryptedPassword: password }, function() {
      console.log("Data has been stored.");
    });

    // let account = generateAccount();
    // console.log("acct created", account)

    // Handle the password creation logic here
  

    navigate('/wallet-created')
  }

  return (
    <div className="flex h-screen bg-black w-[60%] p-5 justify-center items-center">
      <div className="m-auto w-full text-center">
        <header className="flex justify-between items-center px-4 mb-4">
          {/* Assuming you have the MetaMask logo as an SVG or image */}
          <img
            src="/path-to-your/metamask-logo.svg"
            alt="VeriWallet"
            className="h-8"
          />
          <select className="bg-transparent text-white border border-white rounded p-1">
            <option value="en">English</option>
            {/* Other languages here */}
          </select>
        </header>
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="mb-6">
            <h1 className="text-xl text-white font-bold mb-2">
              Create password
            </h1>
            <p className="text-gray-400 text-sm">
              This password will unlock your VeriWallet only on this device.
              VeriWallet cannot recover this password for you.
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="password"
                className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                placeholder="New password (8 characters min)"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
                minLength={3}
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                placeholder="Confirm password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                required
                minLength={3}
              />
            </div>
            <div className="mb-6">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-600"
                  required
                />
                <span className="ml-2 text-gray-400 text-sm">
                  I understand that veriwallet cannot recover this password for
                  me.
                </span>
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300"
            >
              Create a new wallet
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateWallet