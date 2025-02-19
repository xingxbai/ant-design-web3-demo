/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from "react";
import { Flex, Space, message, Divider } from "antd";
import { TokenSelect, useAccount, type Token } from "@ant-design/web3";
import Balance from "./Balance";
import { MetaMask, WagmiWeb3ConfigProvider } from "@ant-design/web3-wagmi";
import {
  useWriteDebugTokenMint,
  useReadPoolManagerGetPairs,
} from "@/utils/contracts";
import { useReadContract } from "wagmi";
import { uniq } from "lodash-es";
import { ConnectButton, Connector } from "@ant-design/web3";
import { mainnet, sepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import { createConfig, http } from "wagmi";

import { getContractAddress, getTokenInfo } from "@/utils/common";

const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http("https://api.zan.top/public/eth-sepolia"),
  },
  connectors: [
    injected({
      target: "metaMask",
    }),
  ],
});

export const Faucet = () => {
  const { writeContractAsync } = useWriteDebugTokenMint();
  const { account } = useAccount();
  const { data: pairs = [] } = useReadPoolManagerGetPairs({
    address: getContractAddress("PoolManager"),
  });

  const [tokenA, setTokenA] = useState<Token>();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const options = uniq(
      pairs
        ?.map((pair: { token0: string; token1: string }) => [
          pair.token0,
          pair.token1,
        ])
        .flat(),
    ).map(getTokenInfo);
    setTokenA(options[0]);
    setTokens(options);
    console.log(444444, options);
  }, [pairs]);
  const claim = async (address: `0x${string}`, tokenName: string) => {
    setLoading(true);
    try {
      await writeContractAsync({
        address,
        args: [account?.address, BigInt("10000000000000000000")],
      });
      message.success("领取代币成功");
    } catch (error) {
      console.error("rd ~ claim ~ error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Divider />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <TokenSelect
          value={tokenA}
          onChange={(event) => setTokenA(event)}
          options={tokens}
        />
        <Balance token={tokenA}></Balance>
      </div>

      <Divider />
      <h3 style={{ marginTop: "30px" }}></h3>
      <Flex align="center" justify="center">
        <div>领取测试代币：</div>
        {loading ? (
          "Claiming..."
        ) : (
          <Space>
            <a
              type="link"
              onClick={() => {
                claim(getContractAddress("DebugTokenA"), "DTA");
              }}
            >
              DTA
            </a>
            <a
              type="link"
              onClick={() => {
                claim(getContractAddress("DebugTokenB"), "DTB");
              }}
            >
              DTB
            </a>
            <a
              type="link"
              onClick={() => {
                claim(getContractAddress("DebugTokenC"), "DTC");
              }}
            >
              DTC
            </a>
          </Space>
        )}
      </Flex>
    </>
  );
};
const TransactionDemo: React.FC = () => {
  return (
    <WagmiWeb3ConfigProvider
      config={config}
      eip6963={{
        autoAddInjectedWallets: true,
      }}
      wallets={[MetaMask()]}
    >
      <Connector>
        <ConnectButton />
      </Connector>
      
      <Faucet />
    </WagmiWeb3ConfigProvider>
  );
};
export default TransactionDemo;