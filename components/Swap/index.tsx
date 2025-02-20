import React, { useEffect, useState } from "react";
import { TokenSelect, type Token } from "@ant-design/web3";
import { Card, Input, Button, Space, Typography, message } from "antd";
import { usePublicClient } from 'wagmi'
import { SwapOutlined } from "@ant-design/icons";
import styles from './swap.module.css';
import {
  useReadPoolManagerGetPairs,
} from "@/utils/contracts";
import { swapRouterAbi } from "@/utils/contracts";
import useTokenAddress from "@/hooks/useTokenAddress";

import { uniq } from "lodash-es";
import Balance from '../Faucet/Balance'
import {
  getContractAddress,
  getTokenInfo,
  parseAmountToBigInt,
  parseBigIntToAmount,
  computeSqrtPriceLimitX96,
} from "@/utils/common";
const { Text } = Typography;


export default function Swap() {
  const publicClient = usePublicClient();
  const { data: pairs = [] } = useReadPoolManagerGetPairs({
    address: getContractAddress("PoolManager"),
  });

  // 用户输入的代币的数量
  const [amountA, setAmountA] = useState(0);
  const [amountB, setAmountB] = useState(0);

  // 用户选择的两个代币
  const [tokenA, setTokenA] = useState<Token>();
  const [tokenB, setTokenB] = useState<Token>();
  const [tokens, setTokens] = useState([]);

  // 两个代币的地址
  const tokenAddressA = useTokenAddress(tokenA);
  const tokenAddressB = useTokenAddress(tokenB);

  // 是否是A指定输入（否则就是指定输出）
  const [isExactInput, setIsExactInput] = useState(false);
  useEffect(() => {
    const options: Token[] = uniq(
      pairs.map((pair: any) => [pair.token0, pair.token1]).flat(),
    ).map((token) => getTokenInfo(token as string));
    setTokens(options as []);
    setTokenA(options[0]);
    setTokenB(options[1]);
  }, [pairs]);

  const updateAmountBwithAmountA = () => {};
  const updateAmountAWithAmountB = async (value: number) => {
    if (!tokenAddressA || !tokenAddressB || !publicClient) {
      return;
    }
    const res = await publicClient?.simulateContract({
      address: getContractAddress("SwapRouter"),
      abi: swapRouterAbi,
      functionName: "quoteExactInput",
      args: [
        {
          tokenIn: tokenAddressA,
          tokenOut: tokenAddressB,
          indexPath: [],
          amountIn: parseAmountToBigInt(value, tokenA),
          sqrtPriceLimitX96: BigInt("1"),
        },
      ],
    });
    console.log(111111, res);
  };
  const handleAmountAChange = (event: any) => {
    const value = parseFloat(event.target.value);
    setAmountA(value);
    setIsExactInput(true);
  };

  const handleAmountBChange = (event: any) => {
    const value = parseFloat(event?.target.value);
    setAmountB(value);
    setIsExactInput(false);
  };

  const handleSwitch = () => {
    setTokenA(tokenB);
    setTokenB(tokenA);
    setAmountA(amountB);
    setAmountB(amountA);
  };
  useEffect(() => {
    if (isExactInput) {
      updateAmountBwithAmountA();
    } else {
      updateAmountAWithAmountB(amountB);
    }
  }, [amountA, amountB, isExactInput]);

  return (
    <div style={{ position: "relative" }}>
      <Card title="Swap" className={styles.swapCard}>
        <Card>
          <Input
            variant="borderless"
            value={amountA}
            type="number"
            onChange={(e) => handleAmountAChange(e)}
            addonAfter={
              <TokenSelect
                value={tokenA}
                onChange={setTokenA}
                options={tokens}
              />
            }
          />
          <Space className={styles.swapSpace}>
            <Text type="secondary"></Text>
            <Text type="secondary">
              Balance:<Balance token={tokenA}></Balance>
            </Text>
          </Space>
        </Card>
        <Space className={styles.switchBtn}>
          <Button
            shape="circle"
            icon={<SwapOutlined />}
            onClick={handleSwitch}
          />
        </Space>
        <Card>
          <Input
            variant="borderless"
            value={amountB}
            type="number"
            onChange={(e) => handleAmountBChange(e)}
            addonAfter={
              <TokenSelect
                value={tokenB}
                onChange={setTokenB}
                options={tokens}
              />
            }
          />
          <Space className={styles.swapSpace}>
            <Text type="secondary"></Text>
            <Text type="secondary">
              Balance:<Balance token={tokenB}></Balance>
            </Text>
          </Space>
        </Card>
      </Card>
    </div>
  );
}