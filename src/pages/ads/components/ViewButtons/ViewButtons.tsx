import { Button } from "antd";
import { AppstoreOutlined, UnorderedListOutlined } from "@ant-design/icons";

export type ViewType = "grid" | "list";

interface ViewButtonsProps {
  view: ViewType;
  setView: React.Dispatch<React.SetStateAction<ViewType>>;
}

const ViewButtons: React.FC<ViewButtonsProps> = ({
  view,
  setView,
}: ViewButtonsProps) => {
  const handleChange = (viewNew: ViewType) => {
    setView(viewNew);
  };

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        background: "#F4F4F6",
        borderRadius: 8,
        height: 32,
        padding: 0,
      }}
    >
      <Button
        type="text"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          borderRadius: 0,
          border: "none",
          background: "transparent",
          color: view === "grid" ? "#1890ff" : "#707176",
          fontSize: 18,
          cursor: "pointer",
          transition: "all 0.2s",
        }}
        onClick={() => handleChange("grid")}
        icon={<AppstoreOutlined />}
      />
      <div
        style={{
          width: 1,
          height: 32,
          background: "#FFFFFF",
        }}
      />
      <Button
        type="text"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          borderRadius: 0,
          border: "none",
          background: "transparent",
          color: view === "list" ? "#1890ff" : "#707176",
          fontSize: 18,
          cursor: "pointer",
          transition: "all 0.2s",
        }}
        onClick={() => handleChange("list")}
        icon={<UnorderedListOutlined />}
      />
    </div>
  );
};

export default ViewButtons;
