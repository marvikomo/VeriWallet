
const scriptElement = document.createElement('script');
scriptElement.src = chrome.runtime.getURL('injected.js');
scriptElement.onload = function() {
    scriptElement.remove(); // Clean up after injection
};
(document.head || document.documentElement).appendChild(scriptElement);

let port = undefined


window.addEventListener("message", (message) => {
    if(message.source !== window || message.origin !== window.location.origin)  return;
    console.log("mhh", message)
      port.postMessage(message?.data)

  });



  const init = () => {
     port = chrome.runtime.connect({ name: 'provider' });
    port.onMessage.addListener((message: any): void => {

        console.log("prot message", message)

    })

  }

  init();
