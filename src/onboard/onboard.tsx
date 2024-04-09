import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import CreateWallet from './components/CreateWallet'

const importMetamaskWallet = async () => {
  const { ethereum } = window as any

//   useEffect(() => {
//     if (typeof ethereum !== 'undefined') {
//       console.log('MetaMask is installed!')
//     } else {
//       console.log('MetaMask is not installed!')
//     }
//   }, [])

  console.log('window', ethereum)
  if (!ethereum) {
    window.open('https://metamask.io/download.html')
  } else {
    try {
      console.log('here...')
      await ethereum.request({ method: 'eth_requestAccounts' })
    } catch (error) {
      console.error(error)
    }
  }
}

const Onboard = () => {
    return (
        <div className="flex h-screen bg-black">
          <div className="m-auto text-center">
            <img src="" alt="VeriWallet" className="h-16 mb-4 mx-auto" />
            <h1 className="text-3xl text-white font-bold mb-2">Let's get started</h1>
            <p className="text-gray-400 mb-6">Trusted by millions, VeriWallet is a secure wallet enhancing trust in web3.</p>
            <form>
              <div className="mb-4">
                <label htmlFor="terms" className="inline-flex items-center">
                  <input type="checkbox" id="terms" className="text-blue-600 form-checkbox" />
                  <span className="ml-2 text-white">I agree to Veriwallet's Terms of use</span>
                </label>
              </div>
              <button
                type="button"
                className="block w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-full mb-3 hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300"
              >
                Create a new wallet
              </button>
              <button
                onClick={importMetamaskWallet}
                type="button"
                className="block w-full bg-transparent text-blue-500 font-semibold py-2 px-4 border border-blue-500 rounded-full hover:bg-blue-500 hover:text-white hover:border-transparent focus:outline-none focus:ring focus:border-blue-300"
              >
                Import an existing wallet
              </button>
            </form>
          </div>
          <div className="absolute top-4 right-4">
            <select className="bg-black text-white border-0 focus:ring-0">
              <option value="en">English</option>
              {/* Add other language options here */}
            </select>
          </div>
          <Routes>
             <Route path="/create-wallet" element={<CreateWallet />} />
            </Routes>
        </div>
      );
}

export default Onboard