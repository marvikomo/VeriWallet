import { handleEvent } from '../controllers/event-handler'
import ProviderController from '../controllers/provider-controller'

const initWallet = (): any => {
  try {

    let providerPort = null;

    let requestData = {
      message: 'I am fine',
    }

    console.log('running I think')

    const provider = new ProviderController()

    provider.store.subscribe(() => {
      console.log("JJJJXXX", provider.store.getState())
    })

    chrome.runtime.onInstalled.addListener((details) => {
      try {
        console.log('details', details)
        if (details.reason === 'install') {
          checkRegistration()
          //chrome.tabs.create({url: 'https://veriwallet.io/download'});
        }
      } catch (err) {
        console.log('err')
        throw new Error(err)
      }
    })

    //Setup connection
    chrome.runtime.onConnect.addListener((port) => {
      try {
        console.log('came here to trigger')
        if(port.name == 'provider') {
          providerPort = port
        }
        if (port.name === 'popup') {
          console.log('came to popup') //
          port.onDisconnect.addListener(() => {
            port = null
          })

          port.onMessage.addListener((msg) => {
            if (msg.type === 'REQUEST_POPUP_DATA' && port) {
              // Immediately send stored data if available
              port.postMessage({
                type: 'NEW_DATA',
                payload: provider.store.getState(),
              })
            }
          })
        } else if(port.name == 'sign-tx'){
          //This event is for the signup page
          port.onDisconnect.addListener(() => {
            port = null
          })

          port.onMessage.addListener((msg) => {
            if (msg.type === 'REQUEST_SUCCESS' && port) {
              // Immediately send stored data if available
               console.log("came here o", providerPort)
               providerPort.postMessage({type: 'VERIWALLET_RESPONSE', receipt: msg.receipt});
            }
          })


        }else{

          // cloneDeep("")
           handleEvent(port, provider)
          
        }
      } catch (err) {
        console.log(err)
      }
    })

    function checkRegistration() {
      chrome.storage.local.get(['isRegistered'], function (result) {
        if (!result.isRegistered) {
          // User is not registered, open the registration page
          chrome.tabs.create({ url: 'onboard.html' })
        }
      })
    }
  } catch (err) {
    console.log(err)
  }



}

//   chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.action === 'getCurrentTransaction') {
//         sendResponse(currentTransaction);
//     }
// });
initWallet()
