import React, { useState } from 'react';
import { Input, Button, Card, Image, message, Select, Upload } from "antd";

import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";


const ipfsGateways = {
  // local: "http://localhost:8080/ipfs/",
  pinata: "https://tan-legal-lungfish-82.mypinata.cloud/ipfs/",
  dev: "http://117.72.119.181:8080/ipfs/",
};
const uploadGateways = {
  local: {
    name: "file",
    action: "http://localhost:5001/api/v0/add",
    headers: {
      
    },
  },
  pinata: {
    action: "https://api.pinata.cloud/pinning/pinFileToIPFS",
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI4ZTVkZGJiYi1mMTNmLTQxOWQtODNiYi1kM2Q5YzZkZjk5ZWYiLCJlbWFpbCI6ImJ4eHN5ZWFAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6Ijc2YTZjNTZlMjY0OTQwYzdjYzNjIiwic2NvcGVkS2V5U2VjcmV0IjoiNWM4OWQ3YjY5MmY3YWY3Y2I5YmIzNTlkMWZhYjBiZTM5NWNhYjZiODc2ZjA3NmYzOWY4ZTUwNWU3N2UzMDQ4YSIsImV4cCI6MTc3NDY4Njc3OH0.4pCqifuqZiuQC0hpNUB1llAtVPb_i_wkfQiKSSVH24A`,
    },
  },
  dev: {
    name: "file",
    action:
      "http://117.72.119.181:5001/api/v0/add",
    withCredentials: false,
  },
};
function Ipfs() {
  const [cid, setCid] = useState(
    "QmTQak529xYZjwnZowEoew2Sr125waFAUonFwVq3ej5A5H",
  );
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const [gateway, setGateway] = useState("dev");

  const handleViewImage = () => {
    if (!cid) {
      message.error("请输入有效的CID");
      return;
    }
    setLoading(true);
    const fullUrl = `${ipfsGateways[gateway as keyof typeof ipfsGateways]}${cid}`;
    setImageUrl(fullUrl);
    setLoading(false);
  }

  // 上传图片
  const uploadProps: UploadProps = {
    // name: "file",
    // action: "http://localhost:5001/api/v0/add",
    
    // 上传到private action: "https://uploads.pinata.cloud/v3/files",
    ...uploadGateways[gateway as keyof typeof uploadGateways],
    async onChange(info) {
      if (info.file.status === "done") {
        message.success(`${info.file.name} 上传成功`);
           const hash = info.file.response.Hash || info.file.response.IpfsHash;
           await setCid(hash);
        await setCid(hash);

        try {
          const response = await fetch(`http://117.72.119.181:5001/api/v0/files/cp?arg=/ipfs/${hash}&arg=/${info.file.name}`,
            {
              method: "POST",
            }
          );
          if (response.ok) {
            message.success("文件已保存到 IPFS MFS");
          }
        } catch (error) {
          console.error("保存到 MFS 失败:", error);
        }
        
        await handleViewImage()
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} 上传失败`);
      }
    },
  };
  return (
    <div>
      <h1>IPFS图片查看器</h1>
      <Card
        title={
          <div style={{display:'flex'}}>
            查看 IPFS 图片
            <span style={{flex: 1, textAlign: 'right'}}>
              <a
                style={{ color: "blue" }}
                href="http://117.72.119.181:5001/ipfs/bafybeicyp7ssbnj3hdzehcibmapmpuc3atrsc4ch3q6acldfh4ojjdbcxe/#/files"
                target="_blank"
              >
                http://117.72.119.181:5001/ipfs/bafybeicyp7ssbnj3hdzehcibmapmpuc3atrsc4ch3q6acldfh4ojjdbcxe/#/files
              </a>
            </span>
          </div>
        }
        style={{ marginBottom: "20px" }}
      >
        <Input
          placeholder="输入 IPFS CID (例如: QmW2WQi7j6c7UgJTarActp7tDNikE4B2qXtFCfLPdsgaTQ)"
          value={cid}
          onChange={(e) => setCid(e.target.value)}
          style={{ marginBottom: "10px" }}
          allowClear
        />
        <Select
          style={{ width: "100px", marginRight: 14 }}
          value={gateway}
          onChange={(val) => setGateway(val)}
        >
          {Object.keys(ipfsGateways).map((key) => {
            return (
              <Select.Option key={key} value={key}>
                {key}
              </Select.Option>
            );
          })}
        </Select>
        <Button
          type="primary"
          onClick={handleViewImage}
          loading={loading}
          style={{ marginRight: 14 }}
        >
          查看图片
        </Button>
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />}>上传图片-{gateway}</Button>
        </Upload>
        <h3 style={{ lineHeight: "300%" }}>
          Gateway：{" "}
          {typeof uploadProps.action === "string" ? uploadProps.action : "未知"}
        </h3>
        <h3>图片URL示例：</h3>
        <div style={{ paddingLeft: "24px" }}>
          {/* <p>local：QmYrD8FyJUhbApkxovgnhQUrPZHY7JqQd3YUN6o3sPJtwr</p> */}
          <p>
            pinata：bafybeigszmwipyfxvaaftinawfiog7clp3b47vsjr3dyuh3hgatjlfi4om
          </p>
          <p>dev：QmTQak529xYZjwnZowEoew2Sr125waFAUonFwVq3ej5A5H</p>
        </div>
      </Card>
      {imageUrl && (
        <Card title="IPFS 图片">
          <Image src={imageUrl} alt="IPFS图片出错了"></Image>
        </Card>
      )}
    </div>
  );
}
export default Ipfs;