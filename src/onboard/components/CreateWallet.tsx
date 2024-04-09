import React, { useEffect, useState } from 'react'


const CreateWallet = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      // Handle the password creation logic here
      console.log(password, confirmPassword);
    };

    return (
        <div className="flex h-screen bg-black">
        <div className="m-auto w-full max-w-md text-center">
          <header className="flex justify-between items-center px-4 mb-4">
            {/* Assuming you have the MetaMask logo as an SVG or image */}
            <img src="/path-to-your/metamask-logo.svg" alt="MetaMask Logo" className="h-8" />
            <select className="bg-transparent text-white border border-white rounded p-1">
              <option value="en">English</option>
              {/* Other languages here */}
            </select>
          </header>
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="mb-6">
              <h1 className="text-xl text-white font-bold mb-2">Create password</h1>
              <p className="text-gray-400 text-sm">This password will unlock your MetaMask wallet only on this device. MetaMask cannot recover this password for you.</p>
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
                  minLength={8}
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
                  minLength={8}
                />
              </div>
              <div className="mb-6">
                <label className="flex items-start">
                  <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" required />
                  <span className="ml-2 text-gray-400 text-sm">I understand that MetaMask cannot recover this password for me.</span>
                </label>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300">
                Create a new wallet
              </button>
            </form>
          </div>
        </div>
    
      </div>
      );
}

export default CreateWallet