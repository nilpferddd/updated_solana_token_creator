import { useState, useEffect } from 'react';
import { LiquidityPoolInfo } from '../src/raydiumV3Integration';

export default function TokenManagementForm() {
  // State für Token-Verwaltung
  const [selectedToken, setSelectedToken] = useState('');
  const [revokeAuthority, setRevokeAuthority] = useState(false);
  const [tokenPools, setTokenPools] = useState<LiquidityPoolInfo[]>([]);
  
  // State für Formular-Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  
  // Simulierte Token-Liste (in einer echten Anwendung würde dies aus der Wallet oder einer API kommen)
  const userTokens = [
    { address: 'token1', name: 'TOKEN1', supply: 1000000000, decimals: 9 },
    { address: 'token2', name: 'TOKEN2', supply: 500000000, decimals: 9 },
    { address: 'token3', name: 'TOKEN3', supply: 100000000, decimals: 6 },
  ];
  
  // Simuliere das Laden von Liquidity Pools für das ausgewählte Token
  useEffect(() => {
    if (selectedToken) {
      // In einer echten Anwendung würde hier die LiquidityPoolManager.getPoolsForToken Methode aufgerufen werden
      const mockPools: LiquidityPoolInfo[] = [
        {
          poolId: `pool_${selectedToken}_1`,
          baseTokenMint: selectedToken,
          quoteTokenMint: 'sol_mint_address',
          baseAmount: 1000,
          quoteAmount: 5000,
          price: 5.0,
          createdAt: new Date(Date.now() - 86400000), // 1 Tag alt
        },
        {
          poolId: `pool_${selectedToken}_2`,
          baseTokenMint: selectedToken,
          quoteTokenMint: 'usdc_mint_address',
          baseAmount: 2000,
          quoteAmount: 2000,
          price: 1.0,
          createdAt: new Date(Date.now() - 172800000), // 2 Tage alt
        }
      ];
      
      setTokenPools(mockPools);
    } else {
      setTokenPools([]);
    }
  }, [selectedToken]);
  
  // Handler für Revoke-Funktion
  const handleRevokeAuthority = async () => {
    if (!selectedToken) {
      setError('Bitte wähle zuerst ein Token aus.');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Hier würde die tatsächliche Revoke-Funktion aufgerufen werden
      // Unter Verwendung des tokenService
      
      // Simuliere eine erfolgreiche Revoke-Operation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(true);
      setRevokeAuthority(false);
    } catch (err) {
      setError('Fehler beim Widerrufen der Token-Autorität. Bitte versuche es erneut.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-solana-green">Token verwalten</h1>
      
      {success ? (
        <div className="bg-green-800 text-white p-4 rounded-md mb-6">
          Token-Autorität wurde erfolgreich widerrufen!
        </div>
      ) : null}
      
      {error ? (
        <div className="bg-red-800 text-white p-4 rounded-md mb-6">
          {error}
        </div>
      ) : null}
      
      <div className="card mb-6">
        <h2 className="text-xl font-semibold mb-6 text-solana-purple">Token auswählen</h2>
        
        <div>
          <label htmlFor="tokenSelect" className="block text-sm font-medium text-gray-300 mb-2">Deine Tokens:</label>
          <select
            id="tokenSelect"
            className="input-field"
            value={selectedToken}
            onChange={(e) => setSelectedToken(e.target.value)}
          >
            <option value="">Token auswählen</option>
            {userTokens.map((token) => (
              <option key={token.address} value={token.address}>
                {token.name} ({token.supply.toLocaleString()} Tokens)
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {selectedToken && (
        <>
          <div className="card mb-6">
            <h2 className="text-xl font-semibold mb-6 text-solana-purple">Token-Details</h2>
            
            {userTokens.filter(t => t.address === selectedToken).map((token) => (
              <div key={token.address} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400">Name:</p>
                    <p className="text-white">{token.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Symbol:</p>
                    <p className="text-white">{token.name}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400">Versorgung:</p>
                    <p className="text-white">{token.supply.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Dezimalstellen:</p>
                    <p className="text-white">{token.decimals}</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    className="btn-secondary"
                    onClick={() => setRevokeAuthority(true)}
                  >
                    Token-Autorität widerrufen
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="card mb-6">
            <h2 className="text-xl font-semibold mb-6 text-solana-purple">Liquidity Pools</h2>
            
            {tokenPools.length > 0 ? (
              <div className="space-y-4">
                {tokenPools.map((pool) => (
                  <div key={pool.poolId} className="bg-dark-blue p-4 rounded-md">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400">Pool ID:</p>
                        <p className="text-white">{pool.poolId}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Preis:</p>
                        <p className="text-white">{pool.price} Quote/Base</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <p className="text-gray-400">Base Menge:</p>
                        <p className="text-white">{pool.baseAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Quote Menge:</p>
                        <p className="text-white">{pool.quoteAmount.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <p className="text-gray-400">Erstellt am:</p>
                      <p className="text-white">{pool.createdAt.toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-300">Keine Liquidity Pools für dieses Token gefunden.</p>
            )}
          </div>
        </>
      )}
      
      {/* Revoke Authority Modal */}
      {revokeAuthority && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-dark-blue p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4 text-solana-purple">Token-Autorität widerrufen</h3>
            
            <p className="text-gray-300 mb-6">
              Bist du sicher, dass du die Token-Autorität widerrufen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.
              Nach dem Widerruf können keine weiteren Token geprägt werden.
            </p>
            
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-700 text-white rounded-md"
                onClick={() => setRevokeAuthority(false)}
                disabled={isSubmitting}
              >
                Abbrechen
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md"
                onClick={handleRevokeAuthority}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Wird widerrufen...' : 'Widerrufen'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
