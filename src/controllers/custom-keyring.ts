import { ec as EC } from 'elliptic';
import { keccak256 } from 'js-sha3';

class CustomKeyring {
  private ec: EC;
  private keyPair: EC.KeyPair;

  constructor() {
    // Initialize elliptic curve, secp256k1 is commonly used for Ethereum
    this.ec = new EC('secp256k1');

    // Generate a new key pair
    this.keyPair = this.ec.genKeyPair();
  }

  // Get the public key
  public getPublicKey(): string {
    return this.keyPair.getPublic('hex');
  }

  // Get the private key
  public getPrivateKey(): string {
    return this.keyPair.getPrivate('hex');
  }

  // Get the Ethereum address derived from the public key
  public getAddress(): string {
    const publicKey = this.keyPair.getPublic('hex');
    const publicKeyBuffer = Buffer.from(publicKey, 'hex');

    // Ethereum addresses are derived by taking the last 20 bytes of the keccak256 hash of the public key
    const addressBuffer = Buffer.from(keccak256(publicKeyBuffer.slice(1)), 'hex');
    return '0x' + addressBuffer.slice(-20).toString('hex');
  }

  // Example method to sign a message
  public signMessage(message: string): string {
    const messageHash = keccak256(message);
    const signature = this.keyPair.sign(messageHash, 'hex');
    return signature.toDER('hex');
  }
}

export default CustomKeyring;
