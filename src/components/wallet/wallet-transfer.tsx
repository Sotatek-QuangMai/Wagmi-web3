import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import type React from "react";
import { useState } from "react";

export function WalletTransfer() {
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");

  const { data: hash, sendTransaction, isPending: isSendPending, error: sendError } = useSendTransaction();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (toAddress && amount) {
      try {
        sendTransaction({
          to: toAddress as `0x${string}`,
          value: parseEther(amount),
        });
      } catch (err) {
        console.error("Error preparing transaction:", err);
      }
    }
  };

  return (
    <div style={{ margin: "0 50px 0 50px" }}>
      <h3>Wallet Transfer</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="eth-address">Recipient Address:</label>
          <input
            id="eth-address"
            type="text"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            placeholder="0x..."
            required
            style={{ width: "100%", padding: "8px", margin: "5px 0" }}
          />
        </div>
        <div>
          <label htmlFor="eth-amount">Amount:</label>
          <input
            id="eth-amount"
            type="number"
            step="any"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.01"
            required
            style={{ width: "100%", padding: "8px", margin: "5px 0" }}
          />
        </div>
        <button
          type="submit"
          disabled={isSendPending || isConfirming}
          style={{ padding: "10px 15px", cursor: "pointer" }}
        >
          {isSendPending ? "Confirming in Wallet..." : isConfirming ? "Sending..." : "Send"}
        </button>

        {hash && (
          <p style={{ marginTop: "10px" }}>
            Transaction Hash:{" "}
            <a href={`https://etherscan.io/tx/${hash}`} target="_blank" rel="noopener noreferrer">
              {hash.slice(0, 6)}...{hash.slice(-4)}
            </a>
          </p>
        )}
        {isConfirming && <p>Waiting for confirmation...</p>}
        {isConfirmed && <p style={{ color: "green" }}>Transaction confirmed!</p>}
        {sendError && <p style={{ color: "red" }}>Error sending: {sendError.message}</p>}
        {confirmError && <p style={{ color: "red" }}>Error confirming: {confirmError.message}</p>}
      </form>
    </div>
  );
}
