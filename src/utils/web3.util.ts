import Web3 from 'web3'
import { ethers } from 'ethers'

import WalletProvider from '@truffle/hdwallet-provider'

import registryAbi from '../abis/registry.json'

const PRIVATE_KEY ='4cacfec187b1b89b13e888784697c86de3cdb2c79b318777e92ebcfea52bef43'

const contractAddress = '0x7e936F77322409F1f3cF9ff4B9a7783F1DF30251'



const provider = new ethers.JsonRpcProvider(
  'https://avalanche-fuji.infura.io/v3/4e5cd3628a304f07aabb7f9698df804e',
)

const wallet = new ethers.Wallet(PRIVATE_KEY, provider);


const contract = new ethers.Contract(contractAddress, registryAbi.abi, provider)

async function fetchData(address) {
  try {
    console.log("initiating fetch...")
    const data = await contract.getDAppDetails(
      address,
    )
    console.log("data", data)
    return data
  } catch (error) {
    return null
    console.error('Error fetching data from the contract:', error)
  }
}

async function getContract(contractAddress, signerAddress, abi) {
  return new ethers.Contract(contractAddress, abi, wallet)
}
async function getAvaxBalance(address) {
  const balance =  await provider.getBalance(address)
  const avaxBalance = ethers.formatEther(balance);
  console.log(`Balance of ${address} is: ${avaxBalance} AVAX`);
  return avaxBalance;
}

async function signTransactions(
  abi,
  contractAddress,
  signerAddress,
  functionName,
  inputs = [],
) {
  try {
    console.log("functionNAme", functionName)
    const contract = await getContract(contractAddress, signerAddress, abi)
    const transactionResponse = await contract[functionName](...inputs)
    // const transactionResponse = await contractFunction(...inputs, {
    //   gasLimit: await contract.estimateGas[functionName](...inputs),
    // })

    console.log('Mining transaction...')
    console.log(`Transaction hash: ${transactionResponse.hash}`)
    const receipt = await transactionResponse.wait()
    return receipt
  } catch (err) {
    console.log('errrr', err)
  }
}

export { fetchData, signTransactions, getAvaxBalance }
