

interface Window {
    veriwallet?: {
      isInjectedProvider: boolean;
      request: ({ method, params }: { method: string; params?: any[] }) => Promise<any>;
    };
  }
// injectedScript.js
(function() {
    if (typeof window.veriwallet !== 'undefined') {
        console.warn("An veriwallet provider is already injected.");
        return;
    }

    window.veriwallet = {
        isInjectedProvider: false,
        request: async ({ method, params }) => {
            console.log(`Mock Ethereum request method: ${method}`, params);
            console.log("window", window)
            window.postMessage({
                type: 'messageFromInPage',
                data: {
                    someInformation: 'Hello from the in-page script!'
                }
            }, '*');
            // return new Promise((resolve, reject) => {
            //     chrome.runtime.sendMessage({ method, params }, response => {
            //       if (response.error) {
            //         reject(response.error);
            //       } else {
            //         resolve(response.result);
            //       }
            //     });
            //   });
            // Implement your request handling logic here
            // For example, return a mock account address
            // if (method === 'eth_accounts') {
            //     return ['0xMockedAccountAddress'];
            // }
           // throw new Error(`Unhandled method: ${method}`);
        }
    };

    console.log("Custom Ethereum provider injected.");
})();