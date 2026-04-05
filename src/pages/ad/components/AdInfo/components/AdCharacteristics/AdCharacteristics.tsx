import React from "react";
import { Flex, Typography } from "antd";

const { Text } = Typography;

interface Characteristic {
  label: string;
  value: string;
}

interface AdCharacteristicsProps {
  title?: string;
  characteristics?: Characteristic[];
}

const AdCharacteristics: React.FC<AdCharacteristicsProps> = ({
  title = "Характеристики",
  characteristics = [],
}) => {
  return (
    <div>
      {/* Заголовок */}
      <Text
        style={{
          fontSize: 22,
          fontWeight: 500,
          color: "#000000",
          display: "block",
          marginBottom: 8,
        }}
      >
        {title}
      </Text>

      {/* Характеристики */}
      <Flex vertical gap={8}>
        {characteristics.map((item, index) => (
          <Flex
            key={index}
            align="center"
            style={{
              gap: 16,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: "#00000073",
                minWidth: 120,
              }}
            >
              {item.label}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 400,
                color: "#000000",
              }}
            >
              {item.value}
            </Text>
          </Flex>
        ))}
      </Flex>
    </div>
  );
};

export default AdCharacteristics;
