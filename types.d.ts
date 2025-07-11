// types.d.ts
import "scryfall-sdk";
import {
  CreateOfferBody,
  CreateOrReplaceInventoryItemBody,
} from "@ebay/ebayClient";

declare module "scryfall-sdk" {
  interface Card {
    sellPrice: number;

    sellCardIsFoil: boolean;
    toEbayOffer(): CreateOfferBody;
    toEbayListingItem(): CreateOrReplaceInventoryItemBody;
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
