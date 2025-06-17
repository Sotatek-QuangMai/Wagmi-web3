import { useAccount, useBalance, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { formatEther } from "viem";
import { Box, Button, Card, CardContent, Typography, Stack, Container, Divider } from "@mui/material";
import { useEffect, useState } from "react";

export function WalletConnector() {
  const { address, isConnected, chain: connectedChain } = useAccount();
  const [balance, setBalance] = useState("");
  const { connect, connectors } = useConnect();
  const { data } = useBalance();
  const { disconnect } = useDisconnect();
  const { chains, switchChain } = useSwitchChain();

  useEffect(() => {
    const currentBalance = formatEther(data?.value ?? 0n);
    setBalance(currentBalance);
  }, [data]);

  return (
    <Container maxWidth="sm">
      <Card sx={{ mt: 5, p: 3 }}>
        <Typography variant="h5" gutterBottom>
          🦊 My DApp
        </Typography>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Wallet Connect
          </Typography>

          {!isConnected ? (
            <Stack spacing={2}>
              {connectors.map((connector) => (
                <Button key={connector.id} variant="contained" onClick={() => connect({ connector })} style={{}}>
                  Connect with {connector.name}
                </Button>
              ))}
            </Stack>
          ) : (
            <Box>
              <Typography variant="body1" mt={2}>
                <strong>Address:</strong> {address}
              </Typography>
              <Typography variant="body1">
                <strong>Chain:</strong> {connectedChain?.name}
              </Typography>
              <Typography variant="body1">
                <strong>Balance:</strong> {balance} {connectedChain?.nativeCurrency?.symbol}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1">Switch Chain:</Typography>
              <Stack spacing={1} direction="row" mt={1}>
                {chains.map((chain) => (
                  <Button
                    key={chain.id}
                    variant="contained"
                    onClick={() => switchChain?.({ chainId: chain.id })}
                    disabled={chain.id === connectedChain?.id}
                  >
                    {chain.name}
                  </Button>
                ))}
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Button type="button" variant="outlined" color="error" onClick={() => disconnect()}>
                Disconnect
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
