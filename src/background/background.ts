import { handleEvent } from "../controllers/event-handler";
import ProviderController from "../controllers/provider-controller";

let popupPort = null;

let requestData = {
  message: "I am fine"
}

chrome.runtime.onInstalled.addListener((details) => {
    console.log("details", details)
    if(details.reason === 'install'){
        checkRegistration();
      //chrome.tabs.create({url: 'https://veriwallet.io/download'});
    }
  
});

    //Setup connection
    chrome.runtime.onConnect.addListener((port) => {
      console.log("came here to trigger")
      if(port.name === 'popup') {
        console.log("came to popup")
        popupPort = port
        popupPort.onDisconnect.addListener(() => {
          popupPort = null;
        })
        
        popupPort.onMessage.addListener(msg => {
          if (msg.type === 'REQUEST_POPUP_DATA' && popupPort) {
            // Immediately send stored data if available
            popupPort.postMessage({
              type: 'NEW_DATA',
              payload:requestData
          });

        }

        })


      }
      handleEvent(port, new ProviderController())
  });


function checkRegistration() {
    chrome.storage.local.get(["isRegistered"], function(result) {
      if (!result.isRegistered) {
        // User is not registered, open the registration page
        chrome.tabs.create({ url: "onboard.html" });
      }
    });
  }

//   chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.action === 'getCurrentTransaction') {
//         sendResponse(currentTransaction);
//     }
// });