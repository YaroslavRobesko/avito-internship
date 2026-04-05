export interface Item {
  category: "auto" | "real_estate" | "electronics";
  title: string;
  price: number;
  needsRevision?: boolean;
}

export interface ItemsGetOut {
  items: Item[];
  total: number;
}

export interface AutoItemParams {
  brand?: string;
  model?: string;
  yearOfManufacture?: number;
  transmission?: "automatic" | "manual";
  mileage?: number;
  enginePower?: number;
}

export interface RealEstateItemParams {
  type?: "flat" | "house" | "room";
  address?: string;
  area?: number;
  floor?: number;
}

export interface ElectronicsItemParams {
  type?: "phone" | "laptop" | "misc";
  brand?: string;
  model?: string;
  condition?: "new" | "used";
  color?: string;
}

export interface AdById {
  id: number;
  category: "auto" | "real_estate" | "electronics";
  title: string;
  description?: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  params: AutoItemParams | RealEstateItemParams | ElectronicsItemParams;
  needsRevision?: boolean;
}

export interface ItemUpdateIn {
  category: "auto" | "real_estate" | "electronics";
  title: string;
  description?: string;
  price: number;
  params: AutoItemParams | RealEstateItemParams | ElectronicsItemParams;
}

export interface FiltersType {
  q: string;
  skip: number;
  needsRevision: boolean;
  categories: ("auto" | "real_estate" | "electronics")[];
  sortColumn: string;
  sortDirection: "asc" | "desc";
}

export type Ad = {
  id: number;
} & Item;
