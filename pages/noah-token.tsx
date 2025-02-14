/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect, useReadContracts, useReadContract, useSimulateContract, useWriteContract } from "wagmi";
import { Button, Alert, Input, Spin, Tabs, InputNumber, message } from "antd";
import "../abi/IERC20.json";
import { abi } from "../abi/NoahToken.json";
import type { TabsProps } from "antd";

const contract = {
  address: "0xD471FC8e3E518224F6BF4f45acF4884ce3a71C10",
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

function Detail() {
  const { data, error, isLoading, isError } = useReadContracts({
    contracts: [
      {
        ...contract,
        functionName: "name",
      },
      {
        ...contract,
        functionName: "symbol",
      },
      {
        ...contract,
        functionName: "decimals",
      },
      {
        ...contract,
        functionName: "totalSupply",
      },
    ],
  }) as any;
  const [name, symbol, decimals, totalSupply] = data || [];

  return (
    <div>
      <div>代币信息：</div>
      {isLoading ? (
        "loading"
      ) : (
        <>
          <div>代币名称：{name && name?.result.toString()}</div>
          <div>代币代号：{symbol && symbol?.result.toString()}</div>
          <div>代币精度：{decimals && decimals?.result.toString()}</div>
          <div>代币总量：{totalSupply && totalSupply?.result.toString()}</div>
        </>
      )}
      {isError ? <Alert message={`查询失败，失败原因：${error}`}></Alert> : null}
    </div>
  );
}

function BalanceOf() {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");

  const { data, isLoading } = useReadContract({
    ...contract,
    functionName: "balanceOf",
    args: [address],
  }) as any;
  
  useEffect(() => {
    setBalance(data?.toString());
  }, [data, isLoading])
  return (
    <div>
      <p></p>
      <Input placeholder="输入钱包地址查询代币余额" value={address} onChange={(event) => setAddress(event.target.value)}></Input>
      <Button type="primary" onClick={()=> setAddress(address)}>查询</Button>
      
      余额：{balance}
    </div>
  );
}
function Transfer() {
  
  const [address, setAddress] = useState("0x44cAF3A7B6aEc73e300Dd1e34A7E84815a9FBFBd");
  const [amount, setAmount] = useState("");

  const aaa = useSimulateContract({
    ...contract,
    functionName: "transfer",
    args: [address, BigInt(amount)], // 替换为实际的接收地址和金额
  }) as any;
  console.log(111111, aaa);
  const data = aaa.data
  const bbb = useWriteContract();
  console.log(222222, bbb);
  const { writeContract, isPending, status } = bbb; 

  useEffect(() => {
    if (status === "success") {
      message.success("操作成功");
    }
  }, [status])
  const handleTransfer = async () => {
    // console.log(11111, address, writeContract, amount);
    if (address) {
      await writeContract(data!.request);
      
    } else {
      alert("Please connect your wallet first.");
    }
  };

  return (
    <div>
      <p>转账</p>
      <Input placeholder="输入钱包地址" value={address} onChange={(event) => setAddress(event.target.value)}></Input>
      <InputNumber placeholder="输入代币余额" value={amount} onChange={(value) => setAmount(value || "")}></InputNumber>
      <Button onClick={handleTransfer} loading={isPending} style={{marginLeft: 8}}>
        转账
      </Button>
    </div>
  );
}
export default function NoahToken() {
  const [tabValue, setTableValue] = useState("Detail")
  const items: TabsProps["items"] = [
    {
      key: "Detail",
      label: "Detail",
      children: <Detail></Detail>,
    },
    {
      key: "BalanceOf",
      label: "BalanceOf",
      children: <BalanceOf></BalanceOf>,
    },
    {
      key: "Transfer",
      label: "Transfer",
      children: <Transfer></Transfer>,
    },
  ];
  return (
    <div>
      <Login></Login>
      <Tabs activeKey={tabValue} items={items} onChange={(value)=> setTableValue(value)} />
    </div>
  );
}
