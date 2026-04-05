import { Card, Badge, Typography, Flex, Image, Tag } from "antd";
const { Text, Title } = Typography;

import placeholderImg from "./assets/placeholder-image.png";

interface ListingCardProps {
  view: "grid" | "list";
  title: string;
  price: number;
  category: "auto" | "real_estate" | "electronics";
  imageUrl?: string;
  needsRevision?: boolean;
  toAd: (title: string) => void;
}

const ListingCard: React.FC<ListingCardProps> = ({
  view,
  title,
  price,
  category,
  imageUrl,
  needsRevision = false,
  toAd,
}) => {
  const categoryLabels: Record<string, string> = {
    auto: "Авто",
    real_estate: "Недвижимость",
    electronics: "Электроника",
  };

  const isGrid = view === "grid";
  const categoryName = categoryLabels[category] || category;

  // Общий блок с информацией о доработке
  const revisionBadge = needsRevision && (
    <div
      style={{
        backgroundColor: "#F9F1E6",
        borderRadius: "8px",
        padding: "2px 8px",
        alignSelf: isGrid ? "stretch" : "flex-start",
      }}
    >
      <Badge
        color="#FAAD14"
        text="Требует доработок"
        style={{ fontSize: 10, color: "#FAAD14" }}
      />
    </div>
  );

  if (isGrid) {
    return (
      <Card
        hoverable
        styles={{
          body: { padding: "0 16px 16px 16px", textAlign: "left" },
        }}
        style={{ minHeight: 268 }}
        cover={
          <div style={{ height: 150, overflow: "hidden" }}>
            <Image
              alt={title}
              src={imageUrl || placeholderImg}
              style={{
                objectFit: "cover",
                height: "100%",
                width: "100%",
                backgroundColor: "#FAFAFA",
              }}
              preview={false}
            />
          </div>
        }
        onClick={()=>toAd(title)}
      >
        <Tag
          color="blue"
          style={{
            transform: "translateY(-50%)",
            backgroundColor: "white",
            border: "2px solid #D9D9D9",
            color: "black",
          }}
        >
          {categoryName}
        </Tag>

        <Flex vertical gap={4}>
          <Title
            level={5}
            style={{ fontSize: "16px", margin: 0, fontWeight: 400 }}
          >
            {title}
          </Title>

          <Text
            strong
            style={{
              fontSize: "16px",
              color: "#00000073",
            }}
          >
            {price.toLocaleString("ru-RU")} ₽
          </Text>

          {revisionBadge}
        </Flex>
      </Card>
    );
  }

  return (
    <Card
      hoverable
      styles={{ body: { padding: 0 } }}
      style={{ minHeight: 150 }}
      onClick={()=>toAd(title)}
    >
      <Flex style={{ height: 150, width: "1055px", alignItems: "center" }}>
        <img
          alt={title}
          src={imageUrl || placeholderImg}
          style={{
            objectFit: "cover",
            height: "100%",
            backgroundColor: "#FAFAFA",
            borderTopLeftRadius: 8,
            borderBottomLeftRadius: 8,
          }}
        />

        <Flex
          vertical
          justify="space-between"
          style={{ flex: 1, padding: "12px 16px" }}
        >
          <Flex vertical gap={8}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {categoryName}
            </Text>

            <Title
              level={5}
              style={{ fontSize: "16px", margin: 0, fontWeight: 500 }}
            >
              {title}
            </Title>

            <Text strong style={{ fontSize: "18px", color: "#000000" }}>
              {price.toLocaleString("ru-RU")} ₽
            </Text>
          </Flex>

          {revisionBadge}
        </Flex>
      </Flex>
    </Card>
  );
};

export default ListingCard;
