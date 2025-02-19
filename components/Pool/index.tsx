import React, { useState } from "react";
import { Table, Button, Typography } from "antd";
import type { TableProps } from 'antd';
import AddModal from "./AddModal";
import { getContractAddress} from "@/utils/common"
import {
  useWritePoolManagerCreateAndInitializePoolIfNecessary,
  useReadPoolManagerGetAllPools,
} from "@/utils/contracts";

const PoolListTable: React.FC = () => {
  const { writeContractAsync } =
    useWritePoolManagerCreateAndInitializePoolIfNecessary();
  
  const { data: poolList = [], refetch, isLoading } = useReadPoolManagerGetAllPools({
    address: getContractAddress("PoolManager"),
  });

  const [loading, setLoading] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);


  const columns: TableProps["columns"] = [
    {
      title: "Pool",
      dataIndex: "pool",
      key: "pool",
      ellipsis: true,
      fixed: "left",
    },
    {
      title: "Token 0",
      dataIndex: "token0",
      key: "token0",
      ellipsis: true,
    },
    {
      title: "Token 1",
      dataIndex: "token1",
      key: "token1",
      ellipsis: true,
    },
    {
      title: "Index",
      dataIndex: "index",
      key: "index",
    },
    {
      title: "Fee",
      dataIndex: "fee",
      key: "fee",
    },
    {
      title: "Tick Lower",
      dataIndex: "tickLower",
      key: "tickLower",
    },
    {
      title: "Tick Upper",
      dataIndex: "tickUpper",
      key: "tickUpper",
    },
    {
      title: "Tick",
      dataIndex: "tick",
      key: "tick",
    },
    {
      title: "Liquidity",
      dataIndex: "liquidity",
      render: (value: bigint) => {
        return value.toString();
      },
      key: "liquidity",
    },
    {
      title: "Price",
      dataIndex: "sqrtPriceX96",
      key: "sqrtPriceX96",
      render: (value: bigint) => {
        return value.toString();
      },
      fixed: "right",
    },
  ];

  return (
    <div>
      <Typography.Title level={2}>Pool</Typography.Title>
      <div style={{ display: "flex", justifyContent: "right", marginBottom: 12 }}>
        <Button
          type="primary"
          onClick={()=>refetch()}
          style={{ marginRight: 14 }}
          loading={isLoading || loading}
        >
          Refresh
        </Button>

        <Button type="primary" onClick={() => setAddModalVisible(true)}>
          Add Pool
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={poolList}
        loading={isLoading || loading}
        scroll={{ x: "max-content" }}
        rowKey="pool"
      />
      <AddModal
        open={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        onCreatePool={async (createParams) => {
          setLoading(true);
          try {
            await writeContractAsync({
              address: getContractAddress("PoolManager"),
              args: [
                {
                  token0: createParams.token0,
                  token1: createParams.token1,
                  fee: createParams.fee,
                  tickLower: createParams.tickLower,
                  tickUpper: createParams.tickUpper,
                  sqrtPriceX96: createParams.sqrtPriceX96,
                },
              ],
            });
            setAddModalVisible(false);
            refetch();
          } catch (error) {
            console.error("创建池子失败:", error);
          } finally {
            setLoading(false);
          }
        }}
      />
    </div>
  );
}

export default PoolListTable;