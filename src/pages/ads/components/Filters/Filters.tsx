// components/Filters.tsx
import React, { useState } from "react";
import { Button, Typography, Checkbox, Switch } from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import type { FiltersType } from "../../../../types/types";

const { Title, Text } = Typography;

interface FiltersProps {
  filters: FiltersType;
  setFilters: React.Dispatch<React.SetStateAction<FiltersType>>;
}

const Filters: React.FC<FiltersProps> = ({ filters, setFilters }) => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);

  const categories: {
    label: string;
    value: "auto" | "real_estate" | "electronics";
  }[] = [
    { label: "Авто", value: "auto" },
    { label: "Электроника", value: "electronics" },
    { label: "Недвижимость", value: "real_estate" },
  ];

  const handleCategoryChange = (
    value: "auto" | "real_estate" | "electronics",
  ) => {
    if (filters.categories.includes(value)) {
      setFilters({
        ...filters,
        categories: filters.categories.filter((val) => val !== value),
        skip: 0,
      });
    } else {
      setFilters({
        ...filters,
        categories: [...filters.categories, value],
        skip: 0,
      });
    }
  };

  return (
    <div
      style={{
        width: 256,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        flexShrink: 0,
      }}
    >
      <div style={{ background: "#fff", borderRadius: 8, padding: "16px" }}>
        <div
          style={{
            padding: "16px 16px 8px 16px",

            borderRadius: 8,
          }}
        >
          <Title level={5} style={{ fontWeight: 700, margin: 0 }}>
            Фильтры
          </Title>
        </div>

        <div
          style={{
            borderBottom: "1px solid #F0F0F0",

            borderRadius: 8,
          }}
        >
          <div
            style={{
              padding: "12px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          >
            <Text strong>Категория</Text>
            {isCategoryOpen ? (
              <UpOutlined style={{ fontSize: 10 }} />
            ) : (
              <DownOutlined style={{ fontSize: 10 }} />
            )}
          </div>

          <div
            style={{
              overflow: "hidden",
              transition: "all 0.3s ease-in-out",
              maxHeight: isCategoryOpen ? 150 : 0,
              opacity: isCategoryOpen ? 1 : 0,
            }}
          >
            <div style={{ padding: "0 16px 16px 16px", background: "#fff" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {categories.map((cat) => (
                  <Checkbox
                    key={cat.value}
                    value={cat.value}
                    checked={filters.categories.includes(cat.value)}
                    onChange={() => handleCategoryChange(cat.value)}
                  >
                    {cat.label}
                  </Checkbox>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Только требующие доработок */}
        <div
          style={{
            padding: "12px 16px",
            borderRadius: 8,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Title
              level={5}
              style={{ fontWeight: 600, fontSize: "16px", margin: 0 }}
            >
              Только требующие доработок
            </Title>
            <Switch
              checked={filters.needsRevision}
              onChange={() =>
                setFilters({
                  ...filters,
                  needsRevision: !filters.needsRevision,
                  skip: 0,
                })
              }
              size="default"
            />
          </div>
        </div>
      </div>

      {/* Сбросить фильтры */}
      <div style={{ padding: "16px", borderRadius: 8, background: "#fff" }}>
        <Button
          onClick={() =>
            setFilters({
              q: "",
              skip: 0,
              needsRevision: false,
              categories: [],
              sortColumn: "",
              sortDirection: "desc",
            })
          }
          style={{
            width: "100%",
            color: "#848388",
            borderColor: "#D9D9D9",
          }}
        >
          Сбросить фильтры
        </Button>
      </div>
    </div>
  );
};

export default Filters;
