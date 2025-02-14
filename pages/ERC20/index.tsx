import { http, useReadContract, useWriteContract, useWaitForTransactionReceipt, useBalance } from "wagmi";
import { WagmiWeb3ConfigProvider, MetaMask, Mainnet, Sepolia } from "@ant-design/web3-wagmi";
import { Address, NFTCard, Connector, ConnectButton, useAccount } from "@ant-design/web3";
import { Button, message, Flex, Input, InputNumber, Form } from "antd";
import { parseEther } from "viem";
import { useEffect } from "react";
import type { FormProps } from "antd";
// Sepolia test contract 0x81BaD6F768947D7741c83d9EB9007e1569115703
const CONTRACT_ADDRESS = "0xA2e1EB7f936DB223d8f2A9A78781f0A5E8010A34";
import { abi } from "../../abi/IERC20.json";
// console.log("rd ~ abi:", abi)

const CallTest = () => {
  const { account } = useAccount();
  const balanceObj = useBalance({
    address: account?.address,
  });
  const { data: mintHash, writeContract: mintWriteContract } = useWriteContract();
  const { data: burnHash, writeContract: burnWriteContract } = useWriteContract();
  type FieldType = {
    address?: string;
    amount?: string;
    remember?: string;
  };


  const { data, isLoading, isError, refetch } = useReadContract({
    abi,
    address: CONTRACT_ADDRESS,
    functionName: "symbol",
    args: [],
  }) as any;
  console.log(11111, data)
  if (isLoading) return <div>加载中...</div>;
  if (isError) return <div>获取数据失败</div>;  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const mint = () => {
    mintWriteContract(
      {
        abi,
        address: CONTRACT_ADDRESS,
        functionName: "mint",
        args: [BigInt(1)],
        value: parseEther("0.01")
      },
      {
        onError: (err) => {
          message.error(err.message)
        }
      }
    )
  }

  const burn = () => {

  }
  return (
    <div>
      <h3>ERC20</h3>
      <div>
        <span>账户地址：</span>
        <Address address={account?.address?.toString()}></Address>
      </div>
      <div>
        <span>账户余额：</span>
        <div>{balanceObj?.data?.value?.toString()} ETH</div>
      </div>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        autoComplete="off"
      >
        <Form.Item<FieldType> label="Address" name="address">
          <Input />
        </Form.Item>

        <Form.Item<FieldType> label="Amount" name="amount">
          <InputNumber />
        </Form.Item>

        <Form.Item label={" "}>
          <Button className="mr15" onClick={() => mint()}>
            Mint
          </Button>
          <Button className="mr15">Burn</Button>
          <Button type="primary" className="mr15">
            Transfer
          </Button>
        </Form.Item>
      </Form>
    </div>
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
        [Mainnet.id]: http("http://117.72.119.181:3001/api"),
        [Sepolia.id]: http(
          "https://api.zan.top/node/v1/eth/sepolia/7f039b4a093940a8bb5d2f76cca81e45"
        ),
      }}
    >
      <Connector>
        <ConnectButton />
      </Connector>
      <CallTest />
    </WagmiWeb3ConfigProvider>
  );
}
