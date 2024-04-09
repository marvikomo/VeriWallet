const scriptElement = document.createElement('script');
scriptElement.src = chrome.runtime.getURL('injected.js');
scriptElement.onload = function() {
    scriptElement.remove(); // Clean up after injection
};
(document.head || document.documentElement).appendChild(scriptElement);

window.addEventListener("message", (event) => {

    console.log("Received..")
    // chrome.runtime.sendMessage({ type: 'requestAccount' }, (response) => {
    //     console.log('Connected Account:', response.account);
    //   });
    // We only accept messages from ourselves
    // if (event.source != window)
    //   return;
  
    // if (event.data.type && (event.data.type == "FROM_PAGE")) {
    //   console.log("Content script received message: " + event.data.text);
    //   chrome.runtime.sendMessage({yourMessage: event.data});
    // }
  });