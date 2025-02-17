import React, { useState } from "react";
import { ConnectButton, Connector, useAccount } from "@ant-design/web3";
import { useSignMessage } from "wagmi";
import { message, Space, Button } from "antd";

export const SignDemo: React.FC = () => {
  const { signMessageAsync } = useSignMessage();
  const { account } = useAccount();
  const [signLoading, setSignLoading] = useState(false);

  const doSignature = async () => {
    setSignLoading(true);
    try {
      const res = await signMessageAsync({
        message: "test message for WTF-DApp demo",
      });
      checkSignature({address: account?.address, signature: res})
    } catch (error) {
      console.error("rd ~ doSignature ~ error:", error)
    }
    setSignLoading(false);
  }
  const checkSignature = async (params: {
    address?: string,
    signature?: string,
  }) => {
    try {
      const res = await fetch("/api/signatureCheck", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });
      const result = await res.json();
      if (result.data) {
        message.success("签名验证成功");
      } else {
        message.error("签名验证失败");
      }
    } catch (error) {
      message.error(JSON.stringify(error))
    }
  }
  return (
    <div>
      <h4>
        useSignMessage 是 wagmi 提供的一个
        Hook，用于签名消息。主要用于证明用户拥有某个钱包地址的所有权
        使用createPublicClient().verifyMessage验证signature
      </h4>
      <Space>
        <Connector>
          <ConnectButton />
        </Connector>
        <Button
          loading={signLoading}
          disabled={!account?.address}
          onClick={doSignature}
        >
          Sign message
        </Button>
      </Space>
    </div>
  );
};
