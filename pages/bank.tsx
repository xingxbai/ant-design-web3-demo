/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContracts,
  useReadContract,
  useSimulateContract,
  useWriteContract,
  usePrepareTransactionRequest,
  useSendTransaction,
  writeContractAsync,
} from "wagmi";
import { Button, Alert, Input, Spin, Tabs, InputNumber, message } from "antd";
import "../abi/IERC20.json";
import { abi } from "../abi/BigBank.json";
import type { TabsProps } from "antd";
import { parseEther, formatEther } from "ethers";
import moment from "moment";
import { Address } from "@ant-design/web3";


const contract = {
  address: "0xD17e04127f49c1b67241C2829cC0844bB4fAA626",
  abi,
} as any;
export function Login() {
  const { address } = useAccount();

  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();

  return connectors.map((connector) => (
    <div key={connector.uid}>
      address: {address}
      {address ? <Button onClick={() => disconnect()}>Disconnect</Button> : <Button onClick={() => connect({ connector })}>{connector.name}</Button>}
    </div>
  ));
}

function Deposit() {
  const [amount, setAmount] = useState("");
  const { address } = useAccount();

  const { sendTransaction } = useSendTransaction();

  const { writeContract, isPending, isError, error } = useWriteContract();

  const handleDeposit = async () => {
    await sendTransaction({
      to: contract.address,
      value: parseEther("2999999999999999999"),
      chainId: 1337,
    });
    // await writeContract({
    //   ...contract,
    //   functionName: "receive",
    //   // args: [parseEther(amount + "")],
    //   value: parseEther("2"),
    // });
  };

  const handleWithdraw = async () => {
    await writeContract({
      ...contract,
      functionName: "withdraw",
      args: [parseEther(amount + "")],
      // value: parseEther("2"),
    });
  };
  return (
    <div>
      <InputNumber
        placeholder="输入代币余额"
        value={amount}
        onChange={(value) => setAmount(value || "")}
      ></InputNumber>
      <Button style={{ marginLeft: 20 }} type="primary" onClick={handleDeposit}>
        {isPending ? "存款中" : "存款"}
      </Button>
      {/* {isSuccess && <div>存款成功!</div>} */}

      <Button
        style={{ marginLeft: 20 }}
        type="primary"
        onClick={handleWithdraw}
      >
        提取
      </Button>
      {/* {isError && (
        <Alert
          message="Error"
          description={error?.details as string}
          type="error"
          showIcon
          closable
        />
      )} */}
    </div>
  );
}

function GetAllDeposits() {

  const { data, isLoading, isError, refetch } = useReadContract({
    ...contract,
    functionName: "getAllDeposits",
    // args: [],
  }) as any;

  if (isLoading) return <div>加载中...</div>;
  if (isError) return <div>获取数据失败</div>;

  return (
    <div>
      <h2>存款排行榜</h2>
      <Button type="primary" onClick={() => refetch()} loading={isLoading}>
        刷新
      </Button>
      {data?.map((item: any, index: number) => (
        <div key={index}>
          <p>
            <span>地址: {item?.depositor}</span>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">存款金额：</span>
              <span className="font-mono">
                {Number(formatEther(item.amount)).toFixed(2)} ETH
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">存款时间：</span>
              <span>
                {moment(Number(item.timestamp) * 1000).format(
                  "YYYY-MM-DD HH:mm:ss"
                )}
              </span>
            </div>
          </p>
        </div>
      ))}
    </div>
  );
}

function GetTopDepositors() {
  const { data, isLoading } = useReadContract({
    ...contract,
    functionName: "getTopDepositors",
  }) as { data?:[string[], string[]], isLoading: boolean}
  console.log(55555555, data);
  if (isLoading) return <div>加载中...</div>;
  if (!data) return <div>暂无数据</div>;
  const addressList = data[0]
  const amountList = data[1]
  return (
    <div>
      {
        addressList?.map((address: string, index: number) => {
          return (
            <div key={index}>
              地址：
              <Address
                ellipsis={{
                  headClip: 8,
                  tailClip: 6,
                }}
                copyable
                address={address}
              />
              余额：
              {Number(formatEther(amountList[index])).toFixed(2)} ETH
              <span></span>
            </div>
          );
        })
      }
    </div>
  )
}
export default function NoahToken() {
  const [tabValue, setTableValue] = useState("Deposit")
  const items: TabsProps["items"] = [
    {
      key: "Deposit",
      label: "Deposit",
      children: <Deposit></Deposit>,
    },
    {
      key: "getTopDepositors",
      label: "存款排名",
      children: <GetTopDepositors></GetTopDepositors>,
    },
    {
      key: "getAllDeposits",
      label: "存款记录",
      children: <GetAllDeposits></GetAllDeposits>,
    },
    // {
    //   key: "Transfer",
    //   label: "Transfer",
    //   children: <Transfer></Transfer>,
    // },
  ];
  return (
    <div>
      <h2>Bank</h2>
      <Login></Login>
      <Tabs activeKey={tabValue} items={items} onChange={(value)=> setTableValue(value)} />
    </div>
  );
}
