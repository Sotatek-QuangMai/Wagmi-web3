import { formatEther } from "viem";
import { useAccount, useBalance, useConnect, useDisconnect, useSwitchChain } from "wagmi";

export function WalletConnector() {
  const { address, isConnected, chain: connectedChain } = useAccount();
  const { connect, connectors } = useConnect();
  const { data } = useBalance({
    address,
  });
  const { disconnect } = useDisconnect();
  const { chains, switchChain } = useSwitchChain();

  return (
    <div style={{ margin: "0 50px 0 50px" }}>
      <h1>🦊 My Dapp</h1>

      <h2>Wallet Connect</h2>

      {!isConnected ? (
        <>
          {connectors.map((connector) => (
            <button key={connector.id} type="button" onClick={() => connect({ connector })} style={{ marginRight: 10 }}>
              Connect with {connector.name}
            </button>
          ))}
        </>
      ) : (
        <>
          <button onClick={() => disconnect()} type="button" style={{ float: "right" }}>
            Disconnect Wallet
          </button>
          <div>
            <p>
              <strong>Address:</strong> {address}
            </p>
            <p>
              <strong>Chain:</strong> {connectedChain?.name}
            </p>
            <p>
              <strong>Balance:</strong> {formatEther(data?.value ?? 0n)} {connectedChain?.nativeCurrency?.symbol}
            </p>
          </div>
          <br />
          <div>
            <h3>Switch Chain:</h3>
            {chains.map((chain) => (
              <>
                <span key={`span-${chain.id}`}>{chain.testnet}</span>
                <button
                  key={chain.id}
                  type="button"
                  onClick={() => switchChain?.({ chainId: chain.id })}
                  disabled={chain.id === connectedChain?.id}
                  style={{ marginRight: 10 }}
                >
                  {chain.name}
                </button>
              </>
            ))}
          </div>
          <br />
        </>
      )}
    </div>
  );
}
