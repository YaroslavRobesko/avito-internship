import React from "react";
import { Flex, Typography } from "antd";

const { Text } = Typography;

interface DateInfoProps {
  createdAt: Date;
  updatedAt: Date;
}

const DateInfo: React.FC<DateInfoProps> = ({ createdAt, updatedAt }) => {
  const formatDate = (date: Date): string => {
    const day = date.getDate();
    const month = date.toLocaleString("ru-RU", { month: "long" });
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day} ${month} ${hours}:${minutes}`;
  };

  const formattedCreatedAt = formatDate(createdAt);
  const formattedUpdatedAt = formatDate(updatedAt);

  return (
    <Flex vertical gap={4} align="end">
      <Text style={{ color: "#848388", fontSize: 16 }}>
        Опубликовано: {formattedCreatedAt}
      </Text>
      <Text style={{ color: "#848388", fontSize: 16 }}>
        Отредактировано: {formattedUpdatedAt}
      </Text>
    </Flex>
  );
};

export default DateInfo;
