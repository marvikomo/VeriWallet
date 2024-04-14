chrome.runtime.onInstalled.addListener((details) => {
    console.log("details", details)
    if(details.reason === 'install'){
        checkRegistration();
      //chrome.tabs.create({url: 'https://veriwallet.io/download'});
    }
  
});

    //Setup connection
    chrome.runtime.onConnect.addListener((port) => {
      console.log("port---->", port)
  });


function checkRegistration() {
    chrome.storage.local.get(["isRegistered"], function(result) {
      if (!result.isRegistered) {
        // User is not registered, open the registration page
        chrome.tabs.create({ url: "onboard.html" });
      }
    });
  }