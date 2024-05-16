import TransactionController from './transaction-controller'
import { providerInstances } from './event-handler'
import transactionStore from './transaction-store'
import keyring from './keyring-controller'
import { BaseController } from './base-controller'
//import { cloneDeep } from 'lodash';
import OnboardingController from './onboarding-controller'
import { extend } from 'lodash'

export const RequestType = {
  SEND_TRANSACTION: 'eth_sendTransaction',
  SIGN_TRANSACTION: 'signTransaction',
  REQUEST_ACCOUNT: 'eth_requestAccounts'
}

//const transactionController = new keyring();

class ProviderController extends BaseController {
  private readonly transactionController

  constructor() {
    super({ transaction: [] })
    //this.transactionController = new OnboardingController()
  }

  subscriber(newState) {
    console.log('heard you', newState)
  }

  async handler(request, port, portId) {
    console.log('message received in handler', request)
    return await this.handle(request, port, portId)
  }

  async handle({ method, params }, port, portId) {
    try {
      console.log('Method g', method)

      switch (method) {
        case RequestType.SEND_TRANSACTION:
          return await this.confirmTransaction(method, params, portId)
        case RequestType.REQUEST_ACCOUNT:
          return await this.requestAccount(port, portId)
      }
    } catch (err) {
      console.log(err)
    }
  }

  //Change to send transaction
  private async confirmTransaction(method, params, portId) {
    const instance = providerInstances[portId]

    console.log('Method', method)
    console.log('Param', params)
    const transactions = [...this.store.getState().transaction]

    let tx = {
      id: portId,
      method,
      params,
    }

    transactions.push(tx)

    this.store.updateState({
      transaction: transactions,
    })

    console.log('state', this.store.getState())

   
    chrome.windows.create({
      url: chrome.runtime.getURL('transaction.html') + '?tabId=' + portId,
      type: 'popup',
      width: 400,
      height: 600
    });
  }



  private async requestAccount(port: any, portId) {
    chrome.windows.create({
      url: chrome.runtime.getURL('connect.html') + '?tabId=' + port,
      type: 'popup',
      width: 400,
      height: 600
    });

    return new Promise((resolve, reject) => {
      chrome.storage.local.get(['walletData'], async function(result) {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError); // R
        }
        resolve(result['walletData'].address);
        console.log("result of stored", result['walletData'].address);
    });

    })

  //   chrome.storage.local.get(['walletData'], async function(result) {
  //     if (chrome.runtime.lastError) {
       
  //     }
    
  //     console.log("result of stored", result['walletData'].address);
  // });
  //   return "PORT11111"
    
  }




}

export default ProviderController
