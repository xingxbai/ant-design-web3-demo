import React, { useState } from "react";
import { Tabs, Typography } from "antd";
import type { TabsProps } from "antd";
// import Pool from '../components/Pool';
import Faucet from '../components/Faucet'

const items: TabsProps["items"] = [
  {
    key: "faucet",
    label: "1.Faucet",
    children: <Faucet></Faucet>,
  },
  // {
  //   key: "swap",
  //   label: "2.Swap",
  //   children: <Pool></Pool>,
  // },
  // {
  //   key: "pool",
  //   label: "3.Pool",
  //   children: <Pool></Pool>,
  // },
];

const WtfApp: React.FC = () => {
  const [activeKey, setActiveKey] = useState("swap")
  return (
    <div style={{ margin: "24px 148px" }}>
      <Typography.Title level={2}>{activeKey}</Typography.Title>
      <Tabs items={items} onChange={setActiveKey} activeKey={activeKey} />
    </div>
  );
}

export default WtfApp;
