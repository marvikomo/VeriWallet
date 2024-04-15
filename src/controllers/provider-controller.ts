import TransactionController from "./transaction-controller";

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
      
    }

  async handle(id, type, request, port, portId) {
    switch (type) {
      case RequestType.CONFIRM_TRANSACTION:
        return this.confirmTransaction(request)
    }
  }

    private async confirmTransaction(request) {

    }


}

export default ProviderController;