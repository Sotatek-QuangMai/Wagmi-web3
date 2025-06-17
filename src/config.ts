import type { AbiFunction } from "abitype";
import { http, createConfig } from "wagmi";
import { polygonAmoy, sepolia } from "wagmi/chains";
import {
  coinbaseWallet,
  injected,
  walletConnect,
  metaMask,
} from "wagmi/connectors";

export const config = createConfig({
  chains: [polygonAmoy, sepolia],
  connectors: [
    injected(),
    coinbaseWallet(),
    walletConnect({ projectId: import.meta.env.VITE_WC_PROJECT_ID }),
    metaMask(),
  ],
  transports: {
    [polygonAmoy.id]: http(),
    [sepolia.id]: http(),
  },
});

export const contractConfig = {
  address: "0x747e61E97002F15b0004984A8d12a1C5C10755A9",
  abi: [
    {
      inputs: [],
      name: "greet",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "string", name: "_newGreeting", type: "string" },
      ],
      name: "setGreeting",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ] as AbiFunction[],
} as const;
