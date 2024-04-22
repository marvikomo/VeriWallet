import { ObservableStore } from '@metamask/obs-store';

const transactionStore = new ObservableStore({
  transactions: []
});

export default transactionStore;
