import { EventEmitter } from 'events'
import crypto from 'crypto'
import { ObservableStore } from '@metamask/obs-store';
import * as encryptor from '@metamask/browser-passworder';
import HdKeyring from '@rabby-wallet/eth-hd-keyring';
import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';

interface Keyring {
  addAccount: () => string
  signTransaction: (account: string, txData: any) => Promise<any>
  hasAccount: (account: string) => boolean
}

interface SerializedKeyrings {}

interface MemStoreState {
    isUnlocked: boolean;
    keyrings: any[];
    preMnenonics: string
}

const KeyringTypes = {
   HdKeyring
}

class KeyringController extends EventEmitter {
  private keyrings: Keyring[] = []
  private encryptionKey: string | null = null
  keyringTypes: any[];
  password: string | null = null;
  store!: ObservableStore<any>;
  memStore: ObservableStore<MemStoreState>;
  kerings: any[];
  encryptor: typeof encryptor = encryptor;

  constructor() {
    super()
    this.keyringTypes = Object.values(KeyringTypes)
    this.memStore = new ObservableStore({
        isUnlocked: false,
        keyringTypes: this.keyringTypes.map((krt) => krt.type),
        keyrings: [],
        preMnenonics: ''

    })
    this.keyrings = [];
  }


  loadStore(initState) {
    this.store = new ObservableStore(initState);
  }

  //This is the initialization stage which is part of the wallet setup process where a password is first created ny the user ro unlock the wallet
  async boot(password: string) {
  
    console.log("typering", this.keyrings)
    this.password = password;
    const encryptedBooted = await this.encryptor.encrypt(password, 'true') //the password is used to encrypt the booted boolean so that later can be used to verify if the correct password is provided to unlock the wallet
    //this.store.updateState({ booted: encryptedBooted});
    //this.memStore.updateState({ isUnlocked: true});

  }



//This is to verify if a password is correctly provided to unlock the wallet i,e when use come back
  async submitPassword(password: string): Promise<MemStoreState> {
    await this.verifyPassword(password);
    this.password = password;
    return null;
    try{

    }catch{

    }

  }

  async verifyPassword(password: string): Promise<void> {
    const encryptedBooted = this.store.getState().booted;
    if(!encryptedBooted) {
        throw new Error('Cannot unlock')
    }
    await this.encryptor.decrypt(password, encryptedBooted)
  }


  async createNewKeyring(seed: string): Promise<any> {
    if(!bip39.validateMnemonic(seed, wordlist)) {
        throw new Error('Invalid mnemonic')
    }
    
    let keyring

return null;



  }
  

  async persistAllKeyrings(): Promise<boolean> {
    //Check if password is valid
    if(!this.password || typeof this.password!=='string') {
        throw new Error('Password is not valid')
    }

    console.log("hyy", this.keyrings)
    //Serialize all keyrings
    const serializeKeyrings = await Promise.all(this.keyrings.map( async (keyring: any) => {
        const [type, data] = await Promise.all([keyring.type, keyring.serialize()])
        return {
            type,
            data
        }
    }))

    //Encrypt the serialized keyrings
    const encryptedString = await this.encryptor.encrypt(this.password, serializeKeyrings);

    //Update the store with the cncrypted string
    // this.store.updateState({
    //     encryptedKeyrings: encryptedString
    // })

    console.log("serializeKeyrings", serializeKeyrings)
    return  true
  }





  //This unlock is called when the user is trying to unlock the wallet
  //keyrings manages a simple list of accounts with their private keys e.g
//   [{
//     type: 'HdKeyring',
//     accounts: ['0x...', '0x...'],
//     addAccounts: function(number) { /* logic to add accounts */ },
//     getAccounts: function() { /* logic to get accounts */ },
//     removeAccount: function(account) { /* logic to remove an account */ },
//     signTransaction: function(account, transaction) { /* logic to sign transaction */ },
//     signMessage: function(account, message) { /* logic to sign message */ },
//     // Other methods and properties specific to managing HD Wallet accounts
//   }]

// structure for vault
// [
//     {
//       "type": "HD Key Tree",
//       "data": {
//         "mnemonic": "seed phrase here",
//         "numberOfAccounts": 3,
//         "hdPath": "m/44'/60'/0'/0",
//         "accounts": ["0x...", "0x...", "0x..."],
//         // Additional metadata relevant to restoring the HD keyring
//       }
//     },
// ]
  async unlockKeyrings(password: string): Promise<any[]> {
    const encryptedData = this.store.getState().vault;
    if(!encryptedData) {
        throw new Error('Cannot unlock: No data.')
    }

    //decrypt the vault using the password provided
    const decryptedVault = await this.encryptor.decrypt(password, encryptedData)

    //clear existing keyrings



 return null;
    //


    
  }

  async clearKeyrings(): Promise<void> {
    this.keyrings = [];
    this.memStore.updateState({
        keyrings: []
    })
  }

  async createNewVaultAndKeyring(password: string): Promise<string> {
    this.encryptionKey = this._generateEncryptionKey(password);
    const encryptedData: string = this._encryptData(this.serializeKeyrings(), this.encryptionKey);
    // You would typically save `encryptedData` somewhere safe, like localStorage or a file
    return encryptedData;
  }

  async unlock(password: string): Promise<void> {
    const encryptionKey: string = this._generateEncryptionKey(password);
    const encryptedData: string = this.loadEncryptedData();
    const decryptedData: SerializedKeyrings = this._decryptData(encryptedData, encryptionKey);
    this.keyrings = this.deserializeKeyrings(decryptedData);
    this.encryptionKey = encryptionKey;
    this.emit('unlock');
  }

  async addNewAccount(): Promise<string> {
    const newAccount: string = this.keyrings[0].addAccount();
    this.emit('newAccount', newAccount);
    return newAccount;
  }

  async signTransaction(account: string, txData: any): Promise<any> {
    const keyring: Keyring | undefined = this._findKeyringForAccount(account);
    if (!keyring) throw new Error('Keyring not found for the given account');
    return keyring.signTransaction(account, txData);
  }

  private _findKeyringForAccount(account: string): Keyring | undefined {
    return this.keyrings.find(kr => kr.hasAccount(account));
  }

  private _encryptData(data: SerializedKeyrings, key: string): string {
    const cipher = crypto.createCipher('aes-256-cbc', key);
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  private _decryptData(encryptedData: string, key: string): SerializedKeyrings {
    const decipher = crypto.createDecipher('aes-256-cbc', key);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
  }

  private _generateEncryptionKey(password: string): string {
    return crypto.createHash('sha256').update(password).digest('base64').substr(0, 32);
  }

  // Placeholder methods for serialization
  serializeKeyrings(): SerializedKeyrings {
    // Implement serialization of keyrings
    return {}; // Placeholder return
  }

  deserializeKeyrings(data: SerializedKeyrings): Keyring[] {
    // Implement deserialization of keyrings
    return []; // Placeholder return
  }

  loadEncryptedData(): string {
    // Implement loading of encrypted data
    return ''; // Placeholder return
  }

}

export default KeyringController;
