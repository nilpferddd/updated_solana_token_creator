import { Connection, PublicKey } from '@solana/web3.js';

// Phantom Wallet Integration
export class PhantomWalletAdapter {
  private _publicKey: PublicKey | null = null;
  private _connected: boolean = false;
  private _onDisconnect: (() => void) | null = null;

  constructor() {
    this._checkForPhantom();
    this._registerEvents();
  }

  get publicKey(): PublicKey | null {
    return this._publicKey;
  }

  get connected(): boolean {
    return this._connected;
  }

  private _checkForPhantom(): boolean {
    const isPhantomInstalled = window.phantom?.solana?.isPhantom || false;
    return isPhantomInstalled;
  }

  private _registerEvents(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        // Check if Phantom is connected on page load
        this._checkConnection();
      });

      // Listen for Phantom connection status changes
      window.addEventListener('phWalletDisconnected', () => {
        this._handleDisconnect();
      });
    }
  }

  private _checkConnection(): void {
    if (window.phantom?.solana?.isConnected) {
      this._publicKey = new PublicKey(window.phantom.solana.publicKey.toString());
      this._connected = true;
    }
  }

  async connect(): Promise<PublicKey> {
    try {
      if (!this._checkForPhantom()) {
        throw new Error('Phantom wallet not installed');
      }

      // Connect to Phantom
      const response = await window.phantom.solana.connect();
      this._publicKey = new PublicKey(response.publicKey.toString());
      this._connected = true;
      
      console.log('Connected to Phantom wallet:', this._publicKey.toString());
      return this._publicKey;
    } catch (error) {
      console.error('Error connecting to Phantom wallet:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (window.phantom?.solana) {
        await window.phantom.solana.disconnect();
        this._handleDisconnect();
      }
    } catch (error) {
      console.error('Error disconnecting from Phantom wallet:', error);
      throw error;
    }
  }

  private _handleDisconnect(): void {
    this._publicKey = null;
    this._connected = false;
    
    if (this._onDisconnect) {
      this._onDisconnect();
    }
  }

  onDisconnect(callback: () => void): void {
    this._onDisconnect = callback;
  }

  async signTransaction(transaction: any): Promise<any> {
    try {
      if (!this._connected) {
        throw new Error('Wallet not connected');
      }

      const signedTransaction = await window.phantom.solana.signTransaction(transaction);
      return signedTransaction;
    } catch (error) {
      console.error('Error signing transaction:', error);
      throw error;
    }
  }

  async signAllTransactions(transactions: any[]): Promise<any[]> {
    try {
      if (!this._connected) {
        throw new Error('Wallet not connected');
      }

      const signedTransactions = await window.phantom.solana.signAllTransactions(transactions);
      return signedTransactions;
    } catch (error) {
      console.error('Error signing transactions:', error);
      throw error;
    }
  }
}

// Add Phantom wallet type definitions
declare global {
  interface Window {
    phantom?: {
      solana?: {
        isPhantom: boolean;
        isConnected: boolean;
        publicKey: { toString(): string };
        connect: () => Promise<{ publicKey: { toString(): string } }>;
        disconnect: () => Promise<void>;
        signTransaction: (transaction: any) => Promise<any>;
        signAllTransactions: (transactions: any[]) => Promise<any[]>;
      };
    };
  }
}

// Create a singleton instance
let phantomWalletInstance: PhantomWalletAdapter | null = null;

export function getPhantomWallet(): PhantomWalletAdapter {
  if (!phantomWalletInstance) {
    phantomWalletInstance = new PhantomWalletAdapter();
  }
  return phantomWalletInstance;
}

// Debug utilities for wallet integration
export const walletDebugger = {
  logConnectionStatus: (adapter: PhantomWalletAdapter): void => {
    console.log('Wallet connected:', adapter.connected);
    console.log('Public key:', adapter.publicKey?.toString() || 'Not connected');
  },
  
  monitorWalletEvents: (): void => {
    if (typeof window !== 'undefined') {
      window.addEventListener('phWalletConnected', (event) => {
        console.log('Wallet connected event:', event);
      });
      
      window.addEventListener('phWalletDisconnected', (event) => {
        console.log('Wallet disconnected event:', event);
      });
    }
  },
  
  checkPhantomInstallation: (): boolean => {
    const isInstalled = window.phantom?.solana?.isPhantom || false;
    console.log('Phantom wallet installed:', isInstalled);
    return isInstalled;
  }
};
