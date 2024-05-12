

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
                data: {
                    someInformation: 'Hello from the in-page script!'
                },
                request: {
                     method,
                     params
                }
            }, window.location.href);


            return new Promise((resolve, reject) => {
                function handleResponse(event) {
                    console.log("event came", event)
                    if (event.source === window && event.data.type === 'VERIWALLET_RESPONSE') {
                        if (event.data.error) {
                            reject(new Error(event.data.error));
                        } else {
                            resolve(event.data.response);
                        }
                        window.removeEventListener('message', handleResponse);
                    }
                }

                window.addEventListener('message', handleResponse);
            });
        
            

            // window.postMessage({
            //     type: 'confirmTransaction',
            //     data: {
            //         someInformation: 'Hello from the in-page script!'
            //     },
            //     request: {
            //         contractAddress: '0x12345',
            //         smth: 'xyz'
            //     }
            // }, window.location.href);
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