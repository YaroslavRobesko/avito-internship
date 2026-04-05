import React from "react";
import { Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const EditAd: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Button
      type="primary"
      onClick={() => navigate("./edit")}
      style={{
        height: 38,
        padding: "8px 12px",
        backgroundColor: "#1890FF",
        borderRadius: 8,
        gap: 8,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 14,
        fontWeight: 400,
        border: "none",
      }}
    >
      Редактировать
      <EditOutlined style={{ fontSize: 16, color: "#FFFFFF" }} />
    </Button>
  );
};

export default EditAd;
