import { makeAutoObservable } from 'mobx';

 class TransactionStore {
    transactions = {};

    constructor() {
        makeAutoObservable(this);
    }

    setTransaction(id, details) {
        this.transactions[id] = details;
    }

    getTransaction(id) {
        return this.transactions[id];
    }

    clearTransaction(id) {
        delete this.transactions[id];
    }
}

export default new TransactionStore();

