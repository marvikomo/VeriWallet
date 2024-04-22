import React, { useEffect, useState } from 'react'

const WalletCreated = () => {
  chrome.storage.local.get(['encryptedPassword'], function (result) {
    if (result.encryptedPassword) {
      // Display the data in your extension's UI
      console.log('Encrypted Seed:', result.encryptedPassword)
      // Or update the DOM to show the encrypted seed to the user
      // document.getElementById('display').textContent = result.encryptedSeed;
    } else {
      console.log('No encrypted seed found')
    }
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    window.location.href = 'popup.html';
  }

  return (
    <div className="bg-black min-h-screen flex items-center p-5 justify-center">
      <div className="max-w-lg mx-auto text-center p-8 bg-gray-800 rounded-lg">
        <div className="mb-4">
          {/* MetaMask logo and success message here */}
          <img
            src="/path-to-your-metamask-logo.svg"
            alt="MetaMask"
            className="mx-auto mb-4"
          />
          <h1 className="text-xl text-white font-semibold mb-3">
            VeriWallet creation successful
          </h1>
          <p className="text-gray-400 text-sm">
            You’ve successfully protected your wallet. Keep your Secret Recovery
            Phrase safe and secret - it's your responsibility!
          </p>
        </div>

        <div className="text-left text-gray-400 text-sm mb-6">
          <ul>
            <li className="mb-2">
              VeriWallet can’t recover your Secret Recovery Phrase.
            </li>
            <li className="mb-2">
              VeriWallet will never ask you for your Secret Recovery Phrase.
            </li>
            <li className="mb-2">
              Never share your Secret Recovery Phrase with anyone or risk your
              funds being stolen.
            </li>
            <li className="mb-2">
              <a href="#" className="text-blue-500 hover:underline">
                Learn more
              </a>
            </li>
          </ul>
        </div>

        {/* <div className="mb-6">
      <button className="text-blue-500 hover:underline text-sm">
        Advanced configuration
      </button>
    </div> */}

        <div className="mb-6">
          <button onClick={handleSubmit} className="bg-blue-600 text-white text-sm px-6 py-2 rounded hover:bg-blue-700 transition-colors">
            Got it
          </button>
        </div>

        <div className="text-center">
          <a href="#" className="text-gray-400 text-sm hover:text-gray-300">
            Follow us on Twitter
            {/* Twitter logo here */}
            <span className="inline-block ml-2">
              <img src="/path-to-your-twitter-logo.svg" alt="Twitter" />
            </span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default WalletCreated
