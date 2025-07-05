import { KyInstance } from "https://esm.sh/ky@1.8.1/distribution/index.d.ts";
import { runtimeConfig } from "@ebay/config";
import authClient from "./authClient.ts";

const refreshJob = async (refreshClient: KyInstance) => {
  const { status, token } = await refreshClient.post<{
    token: string;
    message: string;
    status: string;
  }>("user/auth/", {
    json: {
      email: runtimeConfig.ECHO_MTG_EMAIL,
      password: runtimeConfig.ECHO_MTG_PASSWORD,
    },
  }).json();
  if (status !== "success") {
    throw new Error("oopsies");
  }
  return token;
};

const echoMtg = await authClient({
  baseUrl: "https://api.echomtg.com/api",
  auth: {
    tokenResolver: refreshJob,
    valueGenerator: (token: string) => `Bearer ${token}`,
    header: "Authorization",
  },
});

type MetaData = {
  sort: string;
  direction: string;
  total_pages: number;
  items_per_page: number;
  current_page: number;
  results: number;
  total_items: number;
  filtered_results: number;
  filter_color: boolean;
  filter_type: boolean;
  filter_search: boolean;
  filter_set: boolean;
  host_images: string;
  host_urls: string;
};

type CardItemInternal = {
  tcgplayer_id: string;
  tcg_low: number | "N/A" | null;
  tcg_mid: number | null;
  tcg_market: number | null;
  foil_price: number | null;
  price_change: number;
  mc: string | null;
  game: number;
  main_type: string;
  colors: string | null;
  name: string;
  mid: number;
  t: string | null;
  set: string;
  rarity: string;
  types: string;
  set_code: string;
  expansion: string;
  reserve_list: number;
  emid: number;
  inventory_id: number;
  note_id: number;
  user_image: string | null;
  condition: string;
  tradable: number;
  lang: string;
  date_acquired: string;
  date_acquired_html: string;
  foil: number;
  price_acquired: number;
  current_price: number;
  personal_gain: number;
  set_image: string;
  image_cropped: string;
  image: string;
  gain: number;
  echo_set_url: string;
  echo_url: string;
};
type ListResult = {
  sku: string;
  offerId: string;
  listingId: String;
  cardItem: CardItemInternal;
};

type CardResponse = {
  items: CardItemInternal[];
  meta: MetaData;
  status: string;
};

export interface CardItem {
  emid: string;
  price: number;
  foil: boolean;
  inventoryId: number;
}

export const getInventoryToSell = async (): Promise<CardItem[]> => {
  const res = await echoMtg.get<CardResponse>("inventory/view", {
    searchParams: {
      tradable: 1,
    },
  }).json();
  console.log(res);
  return res.items.map((it) => ({
    emid: it.emid.toString(),
    foil: it.foil === 1,
    price: it.price_acquired,
    inventoryId: it.inventory_id,
  }));
};

export const updateInventoryItemTradability = async (
  cardItem: CardItem,
  tradable: boolean,
): Promise<void> => {
  const { inventoryId } = cardItem;
  try {
    const response = await echoMtg.post(`inventory/update/`, {
      json: {
        id: inventoryId,
        tradable: tradable ? 1 : 0,
      },
    }).json();

    console.log(
      `Inventory item ${inventoryId} updated successfully:`,
      response,
    );
  } catch (error) {
    console.error(`Error updating inventory item ${inventoryId}:`, error);
    throw error;
  }
};

export const addInventoryNote = async (
  cardItem: CardItem,
  note: string,
): Promise<void> => {
  const { inventoryId } = cardItem;
  try {
    const response = await echoMtg.post(`notes/create/`, {
      json: {
        target_id: inventoryId,
        target_app: "inventory",
        note,
      },
    }).json();

    console.log(`Note added to inventory item ${inventoryId}:`, response);
  } catch (error) {
    console.error(`Error adding note to inventory item ${inventoryId}:`, error);
    throw error;
  }
};
