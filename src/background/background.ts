import browser from 'webextension-polyfill';

browser.runtime.onInstalled.addListener((details) => {
    console.log("details", details)
    if(details.reason === 'install'){
        checkRegistration();
      //chrome.tabs.create({url: 'https://veriwallet.io/download'});
    }
  
});


function checkRegistration() {
  browser.storage.local.get(["isRegistered"], function(result) {
      if (!result.isRegistered) {
        // User is not registered, open the registration page
        browser.tabs.create({ url: "onboard.html" });
      }
    });
  }