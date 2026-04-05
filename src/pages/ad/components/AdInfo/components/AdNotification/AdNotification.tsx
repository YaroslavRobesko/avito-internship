import React from "react";
import { Flex, Typography } from "antd";

const { Text } = Typography;

interface AdNotificationProps {
  title?: string;
  description?: string;
  fields?: string[];
}

const AdNotification: React.FC<AdNotificationProps> = ({
  title = "Требуются доработки",
  description = "У объявления не заполнены поля:",
  fields = [],
}) => {
  return (
    <div
      style={{
        padding: "12px 16px",
        backgroundColor: "#F9F1E6",
        borderRadius: 8,
        minWidth: "512px",
      }}
    >
      <Flex gap={48} align="flex-start">
        {/* Левая часть - иконка */}
        <div
          style={{
            width: 18,
            height: 18,
            backgroundColor: "#FFA940",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            marginTop: 2,
          }}
        >
          <Text
            style={{
              fontSize: 11,
              fontWeight: "bold",
              color: "#FFFFFF",
              lineHeight: 1,
            }}
          >
            !
          </Text>
        </div>

        {/* Правая часть - текст */}
        <Flex vertical gap={2} style={{ flex: 1 }}>
          <Text
            strong
            style={{ fontSize: 16, fontWeight: 600, marginBottom: 0 }}
          >
            {title}
          </Text>

          <Text style={{ fontSize: 14, fontWeight: 400, marginBottom: 4 }}>
            {description}
          </Text>

          <div>
            {fields.map((field, index) => (
              <Flex
                key={index}
                align="center"
                gap={8}
                style={{ marginBottom: 2 }}
              >
                <div
                  style={{
                    width: 4,
                    height: 4,
                    backgroundColor: "#000000",
                    borderRadius: "50%",
                  }}
                />
                <Text style={{ fontSize: 14, fontWeight: 400 }}>{field}</Text>
              </Flex>
            ))}
          </div>
        </Flex>
      </Flex>
    </div>
  );
};

export default AdNotification;
