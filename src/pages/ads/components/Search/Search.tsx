import React, { useState } from "react";
import { Input } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import type { InputRef } from "antd";
import searchImg from "./assets/Search.png";
import type { FiltersType } from "../../../../types/types";

interface SearchProps {
  placeholder?: string;
  filters: FiltersType;
  setFilters: React.Dispatch<React.SetStateAction<FiltersType>>;
}

const Search: React.FC<SearchProps> = ({
  placeholder = "Найти объявление....",
  filters,
  setFilters
}) => {
  const [searchValue, setSearchValue] = useState("");
  const inputRef = React.useRef<InputRef>(null);

  const handleClear = () => {
    setSearchValue("");
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (searchValue.trim()){
        setFilters({...filters, q: searchValue.trim(), skip: 0})
      }
      setSearchValue("");
    }
  };

  return (
    <div
      style={{
        width: "100%",
      }}
    >
      <Input
        ref={inputRef}
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyPress={handleKeyPress}
        size="large"
        suffix={
          searchValue ? (
            <CloseCircleOutlined
              style={{ color: "#707176", cursor: "pointer", fontSize: 14 }}
              onClick={handleClear}
            />
          ) : (
            <img
              src={searchImg}
              alt="search"
              style={{ width: 12.5, height: 12.5 }}
            />
          )
        }
        style={{
          borderRadius: 8,
          fontSize: 14,
          background: "#F6F6F8",
          border: "none",
        }}
        styles={{
          input: {
            color: "black",
          },
        }}
      />
    </div>
  );
};

export default Search;
