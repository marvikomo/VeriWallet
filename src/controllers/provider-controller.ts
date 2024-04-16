import TransactionController from "./transaction-controller";
import { providerInstances } from "./event-handler";


export const RequestType = {
    CONFIRM_TRANSACTION: 'confirmTransaction',
    SIGN_TRANSACTION: 'signTransaction',
};

class ProviderController {
    private readonly transactionController: TransactionController;

    constructor() {
     this.transactionController = new TransactionController();
     
    }

    handler(message, port, portId) {

      console.log("message received in handler", message)
     this.handle(message.type, message.request, port, portId);
      
    }

  async handle(type, request, port, portId) {
    switch (type) {
      case RequestType.CONFIRM_TRANSACTION:
        return await this.confirmTransaction(request, portId)
    }
  }

    private async confirmTransaction(request, portId) {
      const instance = providerInstances[portId];
    
     // transactionStore.setTransaction(portId, request)

      // console.log("portid", portId)

      // console.log("transactionstore", transactionStore.getTransaction(portId));

      const currentWindow = await chrome.windows.getCurrent();
      console.log("current window", currentWindow)
      console.log("isntnce", instance);

      chrome.windows.create({
        url: chrome.runtime.getURL('popup.html') + '?tabId=' + portId,
        type: 'popup',
        width: 400,
        height: 600
      });


    }


}

export default ProviderController;