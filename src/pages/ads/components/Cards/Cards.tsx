import { useNavigate } from "react-router-dom";
import type { Ad, Item } from "../../../../types/types";
import CardPlaceholder from "./components/CardPlaceholder/CardPlaceholder";
import ListingCard from "./components/ListingCard/ListingCard";

interface props {
  adsPerPage: Item[];
  isLoadingPage: boolean;
  isErrPage: boolean;
  view: "grid" | "list";
  ads: Ad[];
}

export default function Cards({
  adsPerPage,
  isLoadingPage,
  isErrPage,
  view,
  ads,
}: props): React.ReactNode {
  const navigate = useNavigate();
  const toAd = (title: string) => {
    const id: number = Number(ads.findIndex((ad) => ad.title === title)) + 1;
    navigate(`/ads/${id}`);
  };
  const styleView =
    view == "grid"
      ? ({
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 16,
        } as const)
      : ({
          display: "flex",
          flexDirection: "column",
          gap: 16,
        } as const);
  return (
    <>
      {isErrPage ? (
        <div
          style={{
            display: "flex",
            height: "560px",
            width: "1055px",
            justifyContent: "center",
            textAlign: "center",
            alignItems: "center",
          }}
        >
          <div style={{ fontWeight: 600, fontSize: "24px" }}>
            Ошибка, страница не найдена
          </div>
        </div>
      ) : (
        <div style={styleView}>
          {isLoadingPage
            ? Array(10)
                .fill(null)
                .map((_, index) => <CardPlaceholder key={index} view={view} />)
            : adsPerPage.map((ad) => (
                <ListingCard
                  view={view}
                  title={ad.title}
                  price={ad.price}
                  category={ad.category}
                  needsRevision={ad.needsRevision}
                  toAd={toAd}
                />
              ))}
        </div>
      )}
    </>
  );
}
