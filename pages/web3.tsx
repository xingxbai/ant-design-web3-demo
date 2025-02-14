import {
  http,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import {
  WagmiWeb3ConfigProvider,
  MetaMask,
  Mainnet,
  Sepolia,
} from "@ant-design/web3-wagmi";
import {
  Address,
  NFTCard,
  Connector,
  ConnectButton,
  useAccount,
} from "@ant-design/web3";
import { Button, message, Flex } from "antd";
import { parseEther } from "viem";
import { useEffect } from "react";

// Sepolia test contract 0x81BaD6F768947D7741c83d9EB9007e1569115703
const CONTRACT_ADDRESS = "0xD471FC8e3E518224F6BF4f45acF4884ce3a71C10";

const CallTest = () => {
  const { account } = useAccount();
  const result = useReadContract({
    abi: [
      {
        inputs: [],
        name: "symbol",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string",
          },
        ],
        stateMutability: "view",
        type: "function",
        constant: true,
      },
    ],
    address: CONTRACT_ADDRESS,
    functionName: "symbol",
    // args: [account?.address as `0x${string}`],
  });
  console.log(99999, result);
  const { data: hash, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  useEffect(() => {
    if (isConfirmed) {
      message.success("Mint Success");
      result.refetch();
    }
  }, [isConfirmed]);

  return (
    <Flex gap={12} align="center">
      {result.data?.toString()}
      <Button
        loading={isConfirming}
        onClick={() => {
          writeContract(
            {
              abi: [
                {
                  type: "function",
                  name: "mint",
                  stateMutability: "payable",
                  inputs: [
                    {
                      internalType: "uint256",
                      name: "quantity",
                      type: "uint256",
                    },
                  ],
                  outputs: [],
                },
              ],
              address: CONTRACT_ADDRESS,
              functionName: "mint",
              args: [BigInt(1)],
              value: parseEther("0.01"),
            },
            {
              onError: (err) => {
                message.error(err.message);
              },
            }
          );
        }}
      >
        mint
      </Button>
    </Flex>
  );
};

export default function Web3() {
  return (
    <WagmiWeb3ConfigProvider
      chains={[Mainnet, Sepolia]}
      wallets={[MetaMask()]}
      eip6963={{
        autoAddInjectedWallets: true,
      }}
      transports={{
        // [Mainnet.id]: http("http://127.0.0.1:8545"),
        [Sepolia.id]: http(),
      }}
    >
      <Address format address="0xEcd0D12E21805803f70de03B72B1C162dB0898d9" />
      <NFTCard
        address="0xEcd0D12E21805803f70de03B72B1C162dB0898d9"
        tokenId={641}
      />
      <Connector>
        <ConnectButton />
      </Connector>
      <CallTest />
    </WagmiWeb3ConfigProvider>
  );
}
