import { Dropdown, Typography } from "antd";
import { CheckOutlined, DownOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import type { FiltersType } from "../../../../types/types";

interface SortProps {
  filters: FiltersType;
  setFilters: React.Dispatch<React.SetStateAction<FiltersType>>;
}

const Sort: React.FC<SortProps> = ({ filters, setFilters }) => {
  const options = [
    { value: "desc" as const, label: "По новизне (сначала новые)" },
    { value: "asc" as const, label: "По новизне (сначала старые)" },
  ];
  const handleChange = (value: "desc" | "asc") => {
    setFilters({ ...filters, sortColumn: "createdAt", sortDirection: value, skip: 0, });
  };

  const items: MenuProps["items"] = options.map((option) => ({
    key: option.value,
    label: (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          padding: "4px 8px",
          minWidth: 200,
        }}
      >
        <span style={{ color: "#000000" }}>{option.label}</span>
        {filters.sortDirection === option.value && (
          <CheckOutlined style={{ fontSize: 10, color: "#1890ff" }} />
        )}
      </div>
    ),
    onClick: () => handleChange(option.value),
  }));

  return (
    <div
      style={{
        display: "inline-block",
        background: "#F4F4F6",
        borderRadius: 8,
        padding: "4px",
      }}
    >
      <Dropdown menu={{ items }} trigger={["click"]} placement="bottomLeft">
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 6,
            padding: "2px 6px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            minWidth: 180,
            justifyContent: "space-between",
          }}
        >
          <Typography.Text
            style={{ color: "#000000", fontSize: 14, textWrap: "nowrap" }}
          >
            {options.find((item) => item.value === filters.sortDirection)
              ?.label || options.find((item) => item.value === "asc")?.label}
          </Typography.Text>
          <DownOutlined style={{ fontSize: 10, color: "#707176" }} />
        </div>
      </Dropdown>
    </div>
  );
};

export default Sort;
