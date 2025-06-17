import type React from "react";
import { useEffect, useState } from "react";
import { useAccount, useBalance, useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { Box, Button, Card, CardContent, Typography, TextField, Container } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";

export function WalletTransfer() {
  const { address } = useAccount();
  const { queryKey } = useBalance({ address });
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const queryClient = useQueryClient();

  const { data: hash, sendTransaction, isPending: isSendPending, error: sendError } = useSendTransaction();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({ hash });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const onSuccess = async () => {
      console.log("🚀 ~ WalletTransfer ~ onSuccess:");

      await queryClient.invalidateQueries({ queryKey });
    };

    if (isConfirmed) {
      onSuccess();
    }
  }, [isConfirmed, queryClient]);

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
    <Container maxWidth="sm">
      <Card sx={{ mt: 4, p: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Wallet Transfer
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Recipient Address"
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              placeholder="0x..."
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.01"
              margin="normal"
              required
            />
            <Button fullWidth type="submit" variant="contained" sx={{ mt: 2 }} disabled={isSendPending || isConfirming}>
              {isSendPending ? "Confirming in Wallet..." : isConfirming ? "Sending..." : "Send"}
            </Button>
          </Box>

          {hash && (
            <Typography variant="body2" sx={{ mt: 2 }}>
              Transaction Hash:{" "}
              <a href={`https://etherscan.io/tx/${hash}`} target="_blank" rel="noopener noreferrer">
                {hash.slice(0, 6)}...{hash.slice(-4)}
              </a>
            </Typography>
          )}

          {isConfirming && <Typography color="text.secondary">Waiting for confirmation...</Typography>}
          {isConfirmed && <Typography color="green">Transaction confirmed!</Typography>}
          {sendError && <Typography color="error">Error sending: {sendError.message}</Typography>}
          {confirmError && <Typography color="error">Error confirming: {confirmError.message}</Typography>}
        </CardContent>
      </Card>
    </Container>
  );
}
