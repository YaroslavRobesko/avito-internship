import { Flex, Typography } from "antd";
import Filters from "./components/Filters/Filters";
import Cards from "./components/Cards/Cards";
import Search from "./components/Search/Search";
import ViewButtons from "./components/ViewButtons/ViewButtons";
import Sort from "./components/Sort/Sort";
import Pagination from "./components/Pagination/Pagination";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { loadData, type AdsInfo } from "../../store/slices/adsSlice";
import type { Item, ItemsGetOut, FiltersType } from "../../types/types";
import server from "../../api/server";

export default function Ads(): React.ReactNode {
  const dispatch = useDispatch<AppDispatch>();
  const { ads, isLoading, isError, error } = useSelector<RootState, AdsInfo>(
    (state) => state.ads,
  );
  const { Title, Text } = Typography;
  const [adsPerPage, setAdsPerPage] = useState<Item[]>([]);
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(false);
  const [isErrPage, setIsErrPage] = useState<boolean>(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [total, setTotal] = useState<number>(10);

  const [filters, setFilters] = useState<FiltersType>({
    q: "",
    skip: 0,
    needsRevision: false,
    categories: [],
    sortColumn: "",
    sortDirection: "desc",
  });

  useEffect(() => {
    if (!(ads.length > 0)) {
      dispatch(loadData());
    }
    localStorage.clear();
  }, []);

  useEffect(() => {
    async function loadPage() {
      try {
        setIsErrPage(false);
        setIsLoadingPage(true);

        const params = new URLSearchParams();

        if (filters.q) params.append("q", filters.q);
        if (filters.skip) params.append("skip", filters.skip.toString());
        if (filters.needsRevision) params.append("needsRevision", "true");
        if (filters.categories.length > 0) {
          params.append("categories", filters.categories.join(","));
        }
        if (filters.sortColumn) params.append("sortColumn", filters.sortColumn);
        if (filters.sortDirection)
          params.append("sortDirection", filters.sortDirection.trim());

        const url = `/items${params.toString() ? `?${params.toString()}` : ""}`;
        const data = (await server.get<ItemsGetOut>(url)).data;
        setTotal(data.total);
        if (data.total === 0) {
          throw new Error("Страница не найдена");
        }
        setAdsPerPage([...data.items]);
      } catch {
        setIsErrPage(true);
      } finally {
        setIsLoadingPage(false);
      }
    }

    loadPage();
  }, [filters]);

  return (
    <div style={{ backgroundColor: "#F7F5F8", minHeight: "100vh" }}>
      <div
        style={{
          margin: "0 auto",
          width: "1335px",
          padding: "8px 0",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <Title
              level={5}
              style={{ fontSize: "22px", fontWeight: 500, margin: 0 }}
            >
              Мои объявления
            </Title>
            {isLoading ? (
              <div
                style={{
                  backgroundColor: "#eeeeee",
                  height: "22px",
                  width: "100%",
                }}
              ></div>
            ) : isError ? (
              error
            ) : (
              <Text style={{ fontSize: "18px", color: "#848388" }}>
                {ads.length} объявления
              </Text>
            )}
          </div>
          <div
            style={{
              padding: 12,
              backgroundColor: "white",
              display: "flex",
              gap: "16px",
              alignItems: "center",
            }}
          >
            <Search filters={filters} setFilters={setFilters} />
            <ViewButtons view={view} setView={setView} />
            <Sort filters={filters} setFilters={setFilters} />
          </div>
        </div>
        <Flex gap={24}>
          <Filters filters={filters} setFilters={setFilters} />
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <Cards
              view={view}
              adsPerPage={adsPerPage}
              isLoadingPage={isLoadingPage}
              isErrPage={isErrPage}
              ads={ads}
            />
            <Pagination
              total={total}
              current={filters.skip / 10 + 1}
              setFilters={setFilters}
              filters={filters}
            />
          </div>
        </Flex>
      </div>
    </div>
  );
}
