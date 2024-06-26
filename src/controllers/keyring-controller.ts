import { EventEmitter } from 'events'
import crypto from 'crypto'
import { ObservableStore } from '@metamask/obs-store'
import * as encryptor from '@metamask/browser-passworder'
import HdKeyring from '@rabby-wallet/eth-hd-keyring'
import * as bip39 from '@scure/bip39'
import { wordlist } from '@scure/bip39/wordlists/english'
import * as ethUtil from 'ethereumjs-util'
import { normalizeAddress } from '../wallet-utils/accountUtils'

interface Keyring {
  addAccount: () => string
  signTransaction: (account: string, txData: any) => Promise<any>
  hasAccount: (account: string) => boolean
}

//interface SerializedKeyrings {}

interface MemStoreState {
  isUnlocked: boolean
  keyrings: any[]
  mnenonic: string
}

const KeyringTypes = {
  HdKeyring,
}

class KeyringController extends EventEmitter {
  private keyrings: Keyring[] = []
  private encryptionKey: string | null = null
  keyringTypes: any[]
  password: string | null = null
  store!: ObservableStore<any>
  memStore: ObservableStore<MemStoreState>
  kerings: any[]
  encryptor: typeof encryptor = encryptor
  serializedKeyrings: any[]
  private static instance: KeyringController | null = null

  constructor() {
    super()
    this.keyringTypes = Object.values(KeyringTypes)
    this.memStore = new ObservableStore({
      isUnlocked: false,
      keyringTypes: this.keyringTypes.map((krt) => krt.type),
      keyrings: [],
      mnenonic: '',
    })
    this.keyrings = []
    this.serializedKeyrings = []
  }

  public static getInstance(): KeyringController {
    if (!KeyringController.instance) {
      KeyringController.instance = new KeyringController()
    }
    return KeyringController.instance
  }

  loadStore(initState) {
    this.store = new ObservableStore(initState)
  }

  //This is the initialization stage which is part of the wallet setup process where a password is first created ny the user ro unlock the wallet
  async boot(password: string) {
    console.log('state here', this.store)
    this.password = password
    const encryptedBooted = await this.encryptor.encrypt(password, 'true') //the password is used to encrypt the booted boolean so that later can be used to verify if the correct password is provided to unlock the wallet
    this.store.updateState({ booted: encryptedBooted })
    this.memStore.updateState({ isUnlocked: true })
  }

  //This is to verify if a password is correctly provided to unlock the wallet i,e when user come back
  async submitPassword(password: string): Promise<MemStoreState> {
    console.log('try here', this.store.getState())
    await this.verifyPassword(password)
    this.password = password
    return null
    try {
    } catch {}
  }

  async verifyPassword(password: string): Promise<void> {
    const encryptedBooted = this.store.getState().booted
    if (!encryptedBooted) {
      throw new Error('Cannot unlock')
    }
    await this.encryptor.decrypt(password, encryptedBooted)
  }

  private async generateMnemonic(): Promise<string> {
    const mnemonic = bip39.generateMnemonic(wordlist)
    const encryptedNnemonic = await this.encryptor.encrypt(
      this.password!,
      mnemonic,
    )
    this.memStore.updateState({ mnenonic: encryptedNnemonic })
    return mnemonic
  }

  async getMnemonic(): Promise<any> {
    if (!this.password) {
      throw new Error('Unauthicated')
    }
    const encryptedMnemonic = this.memStore.getState().mnenonic
    if (!encryptedMnemonic) {
      return await this.generateMnemonic()
    }
    return await this.encryptor.decrypt(this.password, encryptedMnemonic)
  }

  getKeyrings(): any {
    return this.kerings
  }

  /**
   * Creates a new vault and restores from a mnemonic phrase.
   * This method destroys any old encrypted storage and creates a new HD wallet from the given seed.
   *
   * @emits KeyringController#unlock
   * @param {string} seed - The BIP44-compliant seed phrase.
   * @returns {Promise<Object>} A Promise that resolves to the updated state.
   */
  async createKeyringWithMnemonics(seed: string) {
    //Check if password is valid
    if (!this.password || typeof this.password !== 'string') {
      throw new Error('Password is not valid')
    }

    // Validate mnemonic; reject if invalid
    if (!bip39.validateMnemonic(seed, wordlist)) {
      throw new Error('invalid memonic')
    }

    // Persist existing keyrings before creating a new one
    await this.persistAllKeyrings()

    // Add new keyring with the provided mnemonic
    const keyring = await this.addNewKeyring('HD Key Tree', {
      mnemonic: seed,
      activeIndexes: [],
    })

    await this.persistAllKeyrings()

    return keyring
  }

  async addNewAccount(selectedKeyring: any): Promise<string[]> {
    await selectedKeyring.addAccounts(1)
    // Fetch accounts, considering whether the keyring has specific methods for branded accounts
    const accounts = await selectedKeyring.getAccounts()

    // Normalize and process accounts
    const allAccounts = accounts.map((account) => ({
      address: normalizeAddress(
        typeof account === 'string' ? account : account.address,
      ),
      brandName:
        typeof account === 'string'
          ? selectedKeyring.type
          : account.realBrandName || account.brandName,
    }))

    //emit new account events for each account
    for (const account of allAccounts) {
      this.emit('newAccount', account.address)
    }

    // Persist changes to keyrings and update internal state
    await this.persistAllKeyrings()
    await this._updateMemStoreKeyrings()
    // await this.fullUpdate();

    // Return the original list of accounts
    return accounts
  }

  //For now supports HD w=Wallet will add support for other wallets later
  async addNewKeyring(type: string, opts?: any): Promise<any> {
    const Keyring = this.getKeyringClass(type)
    console.log('opts', opts)
    const keyring = new Keyring(opts)
    console.log('keyring2', await keyring.getAccounts())
    this.updateKeyringIndex(keyring)
    return await this.addKeyring(keyring)
  }

  async addKeyring(keyring) {
    // Get accounts from the keyring and check for duplicates
    const accounts = await keyring.getAccounts()
    console.log('accountssss', accounts)
    await this.checkForDuplicate(keyring.type, accounts)

    // Add the keyring to the collection
    this.keyrings.push(keyring)

    console.log('check added', this.keyrings)

    // Persist all keyrings and update internal state
    await this.persistAllKeyrings()
    await this._updateMemStoreKeyrings()

    // Update the entire state and return the added keyring
    //await this.fullUpdate();
    return keyring
  }

  private async persistAllKeyrings(): Promise<boolean> {
    //console.log("hyy", this.getKeyringClass('HD Key Tree'))
    //Serialize all keyrings
    const serializeKeyrings = await Promise.all(
      this.keyrings.map(async (keyring: any) => {
        const [type, data] = await Promise.all([
          keyring.type,
          keyring.serialize(),
        ])
        return {
          type,
          data,
        }
      }),
    )

    console.log('serilizedring', serializeKeyrings)
    //Encrypt the serialized keyrings
    const encryptedString = await this.encryptor.encrypt(
      this.password,
      serializeKeyrings,
    )

    // Update the store with the cncrypted string
    this.store.updateState({
      vault: encryptedString,
    })
    return true
  }

  async _updateMemStoreKeyrings(): Promise<void> {
    const keyrings = await Promise.all(
      this.keyrings.map((keyring) => this.displayForKeyring(keyring)),
    )
    return this.memStore.updateState({ keyrings })
  }

  updateKeyringIndex(keyring) {
    console.log('...')
    if (keyring.type !== 'HD Key Tree') {
      console.log('returning')
      return
    }
    if (this.keyrings.find((item) => item === keyring)) {
      return
    }
    const keryings = this.keyrings.filter(
      (item: any) => item.type === 'HD Key Tree',
    )
    keyring.index =
      Math.max(
        ...keryings.map((item: any) => item.index),
        keryings.length - 1,
      ) + 1

    console.log('keyring index', keyring.index)
  }

  async getAccounts(): Promise<string[]> {
    console.log('getting acct', this.keyrings)
    const keyrings = this.keyrings || []
    const addrs = await Promise.all(
      keyrings.map((kr: any) => kr.getAccounts()),
    ).then((keyringArrays) => {
      return keyringArrays.reduce((res, arr) => {
        return res.concat(arr)
      }, [])
    })
    return addrs.map(normalizeAddress)
  }

  async exportAccount(address: string): Promise<any> {
    //Normally this should filter keyring by address since its just one i have in the array
    let keyring: any = this.keyrings[0]
    console.log('jjjj', keyring)
    return await keyring.exportAccount(normalizeAddress(address))
  }

  /**
   * Simplified Display for Keyring
   *
   * This function enhances readability by using async/await and clarifies logic for
   * processing keyring account visibility.
   *
   * @param {Keyring} keyring The keyring to display.
   * @param {boolean} includeHidden Whether to include hidden accounts in the output.
   * @returns {Promise<DisplayedKeryring>} A promise that resolves to the keyring display object.
   */
  async displayForKeyring(keyring) {
    // Fetch accounts; could be specific to brand or general accounts.
    const rawAccounts = await keyring.getAccounts()

    // Process accounts to normalize and filter based on visibility.
    const processedAccounts = rawAccounts.map((account) => ({
      address: normalizeAddress(
        typeof account === 'string' ? account : account.address,
      ),
      brandName: typeof account === 'string' ? keyring.type : account.brandName,
    }))

    // Return the structured keyring display object.
    return {
      type: keyring.type,
      accounts: processedAccounts,
      keyring: keyring,
      byImport: keyring.byImport,
      publicKey: keyring.publicKey,
    }
  }

  async checkForDuplicate(
    type: string,
    accountArray: string[],
  ): Promise<boolean> {
    const keyrings = this.filterKeyringsByType(type)
    const _accounts = await Promise.all(
      keyrings.map((keyring) => keyring.getAccounts()),
    )

    const accounts = _accounts
      .flat() // Flattens the array of arrays into a single array
      .map((address) => normalizeAddress(address).toLowerCase())

    // Check if any account in newAccountArray is found in accounts
    const hasDuplicate = accountArray.some(
      (account) =>
        accounts.includes(account.toLowerCase()) ||
        accounts.includes(ethUtil.stripHexPrefix(account)),
    )

    return hasDuplicate
  }

  filterKeyringsByType(type: string): any[] {
    console.log('at filter part', this.keyrings)
    return this.keyrings.filter((keyring: any) => keyring.type === type)
  }

  getKeyringClass(type: string): any {
    return this.keyringTypes.find((keyringType) => keyringType.type === type)
  }

  async unlockKeyrings(password: string): Promise<any[]> {
    const encryptedData = this.store.getState().vault
    if (!encryptedData) {
      throw new Error('Cannot unlock: No data.')
    }

    //decrypt the vault using the password provided
    const decryptedVault = await this.encryptor.decrypt(password, encryptedData)

    //clear existing keyrings

    return null
    //
  }

  async clearKeyrings(): Promise<void> {
    this.keyrings = []
    this.memStore.updateState({
      keyrings: [],
    })
  }

  async signTransaction(account: string, txData: any): Promise<any> {
    const keyring: Keyring | undefined = this._findKeyringForAccount(account)
    if (!keyring) throw new Error('Keyring not found for the given account')
    return keyring.signTransaction(account, txData)
  }

  private _findKeyringForAccount(account: string): Keyring | undefined {
    return this.keyrings.find((kr) => kr.hasAccount(account))
  }
}

export default KeyringController.getInstance()
