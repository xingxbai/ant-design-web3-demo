import React, { useEffect } from "react";
import { MetaMask, WagmiWeb3ConfigProvider } from "@ant-design/web3-wagmi";
import { createConfig, http, useAccount, useBalance } from "wagmi";
import { injected } from "wagmi/connectors";
import { mainnet, sepolia, localhost } from "wagmi/chains";
import { ConnectButton, Connector } from "@ant-design/web3";
import { Input } from 'antd'
import {parseEther, formatEther} from "ethers";
const config = createConfig({
  chains: [mainnet, sepolia, localhost],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [localhost.id]: http("http://127.0.0.1:8545"),
  },
  connectors: [
    injected({
      target: "metaMask",
    }),
  ],
});

const parseAmountToBigInt = (amount: number, decimal: number = 18) => {
  return (
    BigInt(Math.floor(amount * 10000)) *
    BigInt(10 ** (decimal - 4))
  )
}

const parseBigIntToAmount = (amount: bigint, decimal: number = 18) => {
  return (
    Number(amount / BigInt(10 ** (decimal-4))) / 10000
  )
}
const ParseEther = () => {
  const { address } = useAccount();
  const { data: ethBalance } = useBalance({
     address,
  });

  const [inputValue, setInputValue] = React.useState(0);
  const [decimal, setDecimal] = React.useState(18);

  const [parseWeiValue, setParseWeiValue] = React.useState<bigint>(BigInt(0));
  const [parseEthValue, setParseEthValue] = React.useState<number>();

  const handleInputChange = (event: any) => {
    const value = parseFloat(event.target.value);
    if (Number.isNaN(value)) {
      setInputValue(0);
      return;
    }
    setInputValue(value);
  };
  const handleSetDecimalChange = (event: any) => {
    const value = parseFloat(event.target.value);
    if (Number.isNaN(value)) {
      setDecimal(0);
      return;
    }
    setDecimal(value);
  };
  useEffect(() => {
    if (decimal < 4) {
      return
    }
    const weiValue = parseAmountToBigInt(inputValue, decimal);
    setParseWeiValue(weiValue);

    const ethValue = parseBigIntToAmount(weiValue, decimal);
    setParseEthValue(ethValue);

  }, [inputValue, decimal]);
  return (
    <div>
      账户余额: {ethBalance?.value?.toString()}ETH
      <h4 style={{ marginTop: "20px" }}>decimal转化,可能不同代币的小数位不一致，支持显示4位小数</h4>
      <div>
        balance：
        <Input
          style={{ width: "100px" }}
          value={inputValue}
          onChange={(event) => handleInputChange(event)}
        ></Input>
        <span style={{ marginLeft: 10 }}>ETH</span>
      </div>
      <div>
        decimal：
        <Input
          style={{ width: "100px" }}
          value={decimal}
          onChange={(event) => handleSetDecimalChange(event)}
        ></Input>
      </div>
      <p>parseEthValue：{parseWeiValue?.toString()}Wei</p>
      <p>parseWeiValue：{parseEthValue?.toString()}ETH</p>
      <p>Ether.js转化：{parseEther(inputValue + "")?.toString()}</p>
    </div>
  );
}
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
      <h3>Utils工具函数练习</h3>
      <ParseEther />
    </WagmiWeb3ConfigProvider>
  );
};

export default TransactionDemo;
