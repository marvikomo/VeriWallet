import { ObservableStore } from '@metamask/obs-store';

class TransactionController {
    static instance;  // This will hold the singleton instance

     store!: ObservableStore<any>;
    // subscribers

    constructor(initialState = { transactions: [], count: 0 }) {
        // if (TransactionController.instance) {
        //     return TransactionController.instance;
        // }

       // this.store = new ObservableStore(initialState);
        // this.subscribers = new Set();  
       // TransactionController.instance = this;  // Assign this instance to the static property
    }

    subscribe() {
       // this.subscribers.add(callback);
     
    }

    handleStoreChange() {
      //  console.log('Store updated:', this.store.getState());
    }

   
}

export default TransactionController;

