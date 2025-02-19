import React, { useState } from "react";
import { ConnectButton, Connector, useAccount } from "@ant-design/web3";
import { useSignMessage } from "wagmi";
import { message, Space, Button } from "antd";

export const SignDemo: React.FC = () => {
  const { signMessageAsync } = useSignMessage();
  const { account } = useAccount();
  const [signLoading, setSignLoading] = useState(false);

  const doSignature = async () => {
    await setSignLoading(true);
    try {
      const res = await signMessageAsync({
        message: "test message for WTF-DApp demo",
      });
      await checkSignature({address: account?.address, signature: res})
    } catch (error) {
      console.error("rd ~ doSignature ~ error:", error)
    }
    await setSignLoading(false);
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
      <div>
        <div style={{ width: "60%", textAlign: "center" }}>
          <h4 style={{ marginBottom: "20px" }}>
            useSignMessage 是 wagmi 提供的一个
            Hook，用于签名消息。主要用于证明用户拥有某个钱包地址的所有权
            使用createPublicClient().verifyMessage验证signature
          </h4>
          <p>
            如果资产是在区块链上，那或许是可以的，因为智能合约的调用都需要地址对应的私钥签名认证。但是并非所有的资产都是在链上，如果你的
            DApp
            需要操作传统数据库中的用户资产，那么必须要确保当前操作的用户拥有相关权限。
          </p>
          <p>
            然而只是连接上钱包获得地址就认为用户拥有该账号是不可靠的，因为调用钱包获取到地址的接口可能会被客户端伪造。所以我们需要让用户通过签名来验证身份，用户通过他的私钥对某一条消息进行签名，DApp
            的服务端通过公钥对签名结果进行验证，这样才能确保用户的操作权限。
          </p>
        </div>
      </div>
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
