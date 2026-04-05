import { useParams } from "react-router-dom";
import server from "../../api/server";
import { useEffect, useState } from "react";
import type { AdById } from "../../types/types";
import { Flex, Typography } from "antd";
import EditAd from "./components/EditAd/EditAd";
import DateInfo from "./components/DateInfo/DateInfo";
import placeholderImg from "./assets/placeholder-image.png";
import AdInfo from "./components/AdInfo/AdInfo";
import transformToCharacteristics from "./utils/transformToCharacteristics";
import getMissingFields from "./utils/getMissingFields";

export default function Ad(): React.ReactNode {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isErr, setIsErr] = useState<boolean>(false);
  const [ad, setAd] = useState<AdById | undefined>(undefined);
  const { Title, Text } = Typography;

  const characteristics = ad ? transformToCharacteristics(ad) : undefined;
  const fields = ad ? getMissingFields(ad) : undefined;

  useEffect(() => {
    async function getAd() {
      try {
        setIsErr(false);
        setIsLoading(true);
        const data = (await server.get<AdById>(`/items/${id}`)).data;
        setAd(data);
      } catch {
        setIsErr(true);
      } finally {
        setIsLoading(false);
      }
    }

    getAd();
  }, []);

  return (
    <div
      style={{
        margin: "0 auto",
        width: "1335px",
        padding: "8px 0",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {isErr && (
        <Flex
          justify="center"
          align="center"
          style={{
            width: "100%",
            height: "100vh",
            fontSize: "24px",
            fontWeight: "600",
          }}
        >
          Ошибка! Объявление не найдено
        </Flex>
      )}
      {!isLoading && ad && (
        <>
          <Flex
            style={{ padding: "16px 0", borderBottom: "1px solid #F0F0F0" }}
            gap={16}
            vertical
          >
            <Flex justify="space-between">
              <Title
                level={5}
                style={{ fontSize: 30, fontWeight: 500, padding: 0, margin: 0 }}
              >
                {ad.title}
              </Title>
              <Title
                level={5}
                style={{ fontSize: 30, fontWeight: 500, padding: 0, margin: 0 }}
              >
                {ad.price} ₽
              </Title>
            </Flex>

            <Flex justify="space-between" align="center">
              <EditAd />
              <DateInfo
                createdAt={new Date(ad.createdAt)}
                updatedAt={new Date(ad.updatedAt)}
              />
            </Flex>
          </Flex>
          <Flex style={{ width: "100%" }} gap={24} justify="start">
            <div style={{ height: "360px" }}>
              <img
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  backgroundColor: "#FAFAFA",
                  flexGrow: 0,
                  flexShrink: 1,
                }}
                src={placeholderImg}
                alt=""
              />
            </div>
            <AdInfo characteristics={characteristics} fields={fields} />
          </Flex>
          <Title
            level={5}
            style={{ fontSize: "22px", fontWeight: 500, padding: 0, margin: 0 }}
          >
            Описание
          </Title>
          {ad.description && <Text>{ad.description}</Text>}
          {!ad.description && <Text>Отсутствует</Text>}
        </>
      )}
      {isLoading && (
        <>
          <Flex
            style={{ padding: "16px 0", borderBottom: "1px solid #F0F0F0" }}
            gap={16}
            vertical
          >
            <div style={{ height: "40px", backgroundColor: "#FAFAFA" }}></div>
            <div style={{ height: "40px", backgroundColor: "#FAFAFA" }}></div>
          </Flex>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "start",
              gap: 24,
            }}
          >
            <div style={{ height: "360px" }}>
              <img
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  backgroundColor: "#FAFAFA",
                  flexGrow: 0,
                  flexShrink: 1,
                }}
                src={placeholderImg}
                alt=""
              />
            </div>
            <div
              style={{
                height: "360px",
                width: "831px",
                backgroundColor: "#FAFAFA",
              }}
            ></div>
          </div>
          <div style={{ height: "40px", backgroundColor: "#FAFAFA" }}></div>
        </>
      )}
    </div>
  );
}
