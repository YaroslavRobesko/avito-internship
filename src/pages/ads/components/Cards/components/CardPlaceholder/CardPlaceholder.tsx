import placeholderImg from "./assets/placeholder-image.png";
import { Card, Image, Flex } from "antd";
export default function CardPlaceholder({
  view,
}: {
  view: "grid" | "list";
}): React.ReactNode {
  const isGrid = view === "grid";

  if (isGrid) {
    return (
      <Card
        hoverable
        styles={{
          body: { padding: "0 16px 16px 16px", textAlign: "left" },
          header: { backgroundColor: "#fafafa" },
        }}
        style={{ minHeight: 268 }}
        cover={
          <div style={{ height: 150, overflow: "hidden" }}>
            <Image
              alt={"placeholderImg"}
              src={placeholderImg}
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
      ></Card>
    );
  }

  return (
    <Card
      hoverable
      styles={{ body: { padding: 0 } }}
      style={{ minHeight: 150 }}
    >
      <Flex style={{ height: 150, width: "1055px", alignItems: "center" }}>
        <img
          alt={"placeholderImg"}
          src={placeholderImg}
          style={{
            objectFit: "cover",
            height: "100%",
            backgroundColor: "#FAFAFA",
            borderTopLeftRadius: 8,
            borderBottomLeftRadius: 8,
          }}
        />
      </Flex>
    </Card>
  );
}
