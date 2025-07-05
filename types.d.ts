// types.d.ts
import "scryfall-sdk";
import type {
  EbayOfferDetailsWithKeys,
  InventoryItem,
} from "ebay-api/types/index.js";

declare module "scryfall-sdk" {
  interface Card {
    sellPrice: number;

    sellCardIsFoil: boolean;
    toEbayOffer(): EbayOfferDetailsWithKeys;
    toEbayListingItem(): InventoryItem;
    getEbayName(): string;
    setCardPrice(price: number): void;
    getCardPrice(): number;

    setFoil(foil: boolean): void;
    getFoil(): boolean;
  }
}

declare global {
  interface String {
    ebayLegalString(): string;
  }
}
