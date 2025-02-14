import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, localhost } from 'wagmi/chains'
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors'
const projectId = '0x5FFA7e880AD4301b19417763C8882e5E9ce2ea29'

export const config = createConfig({
  chains: [mainnet, sepolia, localhost],
  transports: {
    [mainnet.id]: http("http://127.0.0.1:8545"),
    [localhost.id]: http("http://127.0.0.1:8545"),
    [sepolia.id]: http("http://127.0.0.1:8545"),
  },
   
  // connectors: [
  //   injected(),
  //   // walletConnect({ projectId }),
  //   metaMask(),
  //   safe(),
  // ],
})