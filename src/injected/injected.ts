

// injectedScript.js
(function() {
    if (typeof (window as any).ethereum !== 'undefined') {
        console.warn("An veriwallet provider is already injected.");
        return;
    }

    (window as any).ethereum = {
        isInjectedProvider: true,
        request: async ({ method, params }) => {
            console.log(`Mock Ethereum request method: ${method}`, params);
            console.log("window", window)
            window.postMessage({
                type: 'messageFromInPage',
                data: {
                    someInformation: 'Hello from the in-page script!'
                }
            }, window.location.href);
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