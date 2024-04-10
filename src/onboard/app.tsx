import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CreateWallet from './components/CreateWallet'
import Onboard from './onboard'
import { Routes, Route } from 'react-router-dom'
import WalletCreated from './components/WalletCreated'

const App = () => {
    return (
        <Routes>
        <Route path="/" element={<Onboard />} />
        <Route path="/create-wallet" element={<CreateWallet />} />
        <Route path="/wallet-created" element={<WalletCreated />} />
    </Routes>
    )
}

export default App