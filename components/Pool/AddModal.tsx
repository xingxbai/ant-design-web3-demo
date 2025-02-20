import React, { useState } from 'react'
import { Modal, Form, message, Input, Select, InputNumber } from "antd";
import { parsePriceToSqrtPriceX96, getContractAddress } from "@/utils/common";
import { encodeSqrtRatioX96 } from "@uniswap/v3-sdk";
interface CreatePoolParams {
  token0: `0x${string}`;
  token1: `0x${string}`;
  fee: number;
  tickLower: number;
  tickUpper: number;
  sqrtPriceX96: bigint;
}
interface AddModalProps {
  open: boolean;
  onCancel: () => void;
  onCreatePool: (params: CreatePoolParams) => void;
}
export default function AddModal(props: AddModalProps) {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  
  const handleOk = async () => {
    form.validateFields().then(async (values) => {
      setLoading(true);
      await props.onCreatePool({
        ...values,
        sqrtPriceX96: parsePriceToSqrtPriceX96(values.price),
      });
      setLoading(false);
    }).catch((error) => {
      console.error("rd ~ error:", error);
    })
    
  }
  return (
    <Modal
      open={props.open}
      title="Add Pool"
      onCancel={props.onCancel}
      onOk={handleOk}
      width={"40%"}
      confirmLoading={loading}
    >
      <Form
        name="basic"
        form={form}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}
        initialValues={{
          token0: getContractAddress("DebugTokenC"),
          token1: getContractAddress("DebugTokenA"),
          fee: 3000,
          tickLower: -887272,
          tickUpper: 887272,
          price: 1,
        }}
      >
        <Form.Item
          label="Token 0"
          name="token0"
          rules={[{ required: true, message: "Token0 required" }]}
        >
          <Input placeholder="Token0" />
        </Form.Item>
        <Form.Item
          label="Token 1"
          name="token1"
          rules={[{ required: true, message: "Token1 required" }]}
        >
          <Input placeholder="Toke1" />
        </Form.Item>
        <Form.Item
          label="Fee"
          name="fee"
          rules={[{ required: true, message: "Fee required" }]}
        >
          <Select
            options={[
              { value: 3000, label: 0.3 },
              { value: 5000, label: 0.5 },
              { value: 10000, label: 1 },
            ]}
            placeholder="Fee"
          ></Select>
        </Form.Item>
        <Form.Item
          label="TickLower"
          name="tickLower"
          rules={[{ required: true, message: "TickLower required" }]}
        >
          <InputNumber placeholder="TickLower" />
        </Form.Item>
        <Form.Item
          label="TickUpper"
          name="tickUpper"
          rules={[{ required: true, message: "TickUpper required" }]}
        >
          <InputNumber placeholder="tickUpper" />
        </Form.Item>
        <Form.Item
          label="Init Price(token1/token0)"
          name="price"
          rules={[{ required: true, message: "Price required" }]}
        >
          <InputNumber min={0.000001} max={1000000} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

