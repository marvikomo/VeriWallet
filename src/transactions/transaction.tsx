import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import './transaction.css'
import KeyringController from '../controllers/keyring-controller'
import useRequestData from './hooks/useRequestData'
import { fetchData, signTransactions } from '../utils/web3.util'
import transaction from '../controllers/transaction-controller'
import ProviderController from '../controllers/provider-controller'

interface Account {
  privateKey: string
  address: string
  balance: string
}

// const keyring = new KeyringController();

const tx = new transaction()

const Transaction = () => {
  let [searchParams, setSearchParams] = useSearchParams()

  const [auditCertificate, setAudtCertificate] = useState<any>(null)
  const [transaction, setTransaction] = useState<any>(null)
  const [input, setInput] = useState<any>(null)
  const [loading, setLoading] = useState<any>(null)
  const [approve, setApprove] = useState<any>(false)
  const [method, setMethod] = useState<any>(false)

  const { request } = useRequestData()
  //console.log("paramVal", paramValue)

  useEffect(() => {

    chrome.storage.local.get(['activity'], async function(result) {
      console.log("aaaa", result)
    })
    console.log(tx.subscribe())

    const paramValue = searchParams.get('tabId')

    console.log('transaction store')

    console.log('param Value', paramValue)

    console.log('request', request)

    //   getAccounts().then(result => {
    //       console.log("result", result)
    //   })
    const port = chrome.runtime.connect({ name: 'popup' })
    console.log('new>> port', port)
    port.postMessage({ type: 'REQUEST_POPUP_DATA', id: paramValue })

    let transactions = []

    port.onMessage.addListener((msg) => {
      if (msg.type === 'NEW_DATA') {
        let tx = msg?.payload?.transaction
        console.log('msg>>>>', msg.payload.transaction)
        // setTransaction(tx[0])
        if (tx && tx.length > 0) {
          // Assuming you want to filter and pick transactions based on 'paramValue'
          const filteredTx = tx.filter((e) => e.id === paramValue)
          console.log(
            'Filtered Transaction',
            JSON.parse(filteredTx[0].params.data),
          )
          setInput(JSON.parse(filteredTx[0].params.data))
          if (filteredTx.length > 0) {
            console.log('filtered ty', filteredTx)
            setTransaction(filteredTx[0]) // Set the first matching transaction
          }
        

        }

        console.log('tnx', transaction)
      }
    })

    console.log('Tranx', transactions)

    return () => port.disconnect()
  }, [request])

  useEffect(() => {
    if(transaction) {
      setMethod(JSON.parse(transaction?.params?.data).name)
    }
   
      fetchData(transaction?.params?.to).then((res) => {
            console.log('res now', res)
            setApprove(res?.approved)
            setAudtCertificate(res?.auditReport)
          })

  }, [transaction])

  const handleCancel = () => {
    window.close()
  }

  const handleSubmit = async () => {
    const port = chrome.runtime.connect({ name: 'sign-tx' })
    setLoading(true)
    let abi = []
    abi.push(input)

    let tx = await signTransactions(
      abi,
      transaction?.params?.to,
      transaction?.params?.from,
      input.name,
      transaction.params.inputs,
    )

    const activity = {
      from: transaction?.params?.from,
      to: transaction?.params?.to,
      transactionHash: tx.hash,
      gasUsed: tx.gasUsed,
      gasPrice: tx.gasPrice,
      blockNumber: tx.blockNumber,
      status: 'comfirmed'
    }

    chrome.storage.local.get(['activity'], async function(result) {
      if (chrome.runtime.lastError) {
       
      }
      if(result?.activity?.length > 0){
        chrome.storage.local.set({ ['activity']: [...result.activity, activity] }, function() {
          console.log('Data is stored in local storage.');
      });
      }else{
        chrome.storage.local.set({ ['activity']: [activity] }, function() {
              console.log('Data is stored in local storage.');
          });
      }
  });
    
    port.postMessage({ type: 'REQUEST_SUCCESS', receipt: tx, transaction })
    port.disconnect()
    setLoading(false)
    window.close();
  }

  return (
    <div className="bg-whit shadow-lg rounded-lg p-8  flex justify-center items-center h-full max-w-sm mx-auto ">
      <div>
        <h2 className="text-xl font-semibold mb-8">Avax Testnet Transaction</h2>
        <div className="mb-12">
          <div className="text-sm font-semibold text-gray-700">
            Signature Address:
          </div>
          <div className="text-sm mb-4">{transaction?.params?.from}</div>
          <div className="text-sm font-semibold text-gray-700">
            Interact Contract:
          </div>
          <div className="text-sm mb-4">{transaction?.params?.to}</div>

          <div className="flex justify-between items-center mb-4">
            <div className="text-sm font-semibold text-gray-700">
              Audit Status:
            </div>
            <div className="text-sm text-blue-600 cursor-pointer hover:underline">
              <a
                href={
                  'https://skywalker.infura-ipfs.io/ipfs/' + auditCertificate
                }
              >
                Verified (click here)
              </a>
            </div>
          </div>
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm font-semibold text-gray-700">Status:</div>
            <div className="text-sm">{approve ? 'Safe' : 'UnSafe'}</div>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-4 mb-4">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm font-semibold text-gray-700">
              Operation:
            </div>
            <div className="text-sm">{method}</div>
          </div>
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm font-semibold text-gray-700">Gas:</div>
            <div className="text-sm">0.00092417 ≈$0.05</div>
          </div>
        </div>
        <p className="text-xs text-gray-600 mb-4">
          It's important to be aware that some contracts are malicious and can
          potentially drain your funds. Carefully review the contract details
          before signing.
        </p>
        <div className="flex items-center justify-between">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {loading ? 'Loading...' : ' Sign and Create'}
          </button>
          <button
            onClick={handleCancel}
            className="text-blue-500 hover:text-blue-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default Transaction
