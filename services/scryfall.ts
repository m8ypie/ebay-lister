import * as Scry from "scryfall-sdk";
import runtimeConfig from "@ebay/config";
import { emidToTcgLookUp } from "./emidLookup.ts";
import { CardItem } from "./echoMtg.ts";
import { CreateOfferBody } from "./ebay/ebayHttpClient.ts";
import { CreateOrReplaceInventoryItemBody } from "../custom-sample.ts";

export const promoTypeTextMap = {
  [Scry.PromoType[Scry.PromoType.fracturefoil]]: "Fracture Foil",
  [Scry.PromoType[Scry.PromoType.galaxyfoil]]: "Galaxy Foil",
  [Scry.PromoType[Scry.PromoType.halofoil]]: "Halo Foil",
  [Scry.PromoType[Scry.PromoType.invisibleink]]: "Invisible Ink",
  [Scry.PromoType[Scry.PromoType.manafoil]]: "Mana Foil",
  [Scry.PromoType[Scry.PromoType.neonink]]: "Neon Ink",
  [Scry.PromoType[Scry.PromoType.oilslick]]: "Oil Slick",
  [Scry.PromoType[Scry.PromoType.portrait]]: "Portrait",
  [Scry.PromoType[Scry.PromoType.poster]]: "Poster",
  [Scry.PromoType[Scry.PromoType.ripplefoil]]: "Ripple Foil",
  [Scry.PromoType[Scry.PromoType.schinesealtart]]: "Simplified Chinese Alt Art",
  [Scry.PromoType[Scry.PromoType.scroll]]: "Scroll",
  [Scry.PromoType[Scry.PromoType.serialized]]: "Serialized",
  [Scry.PromoType[Scry.PromoType.setextension]]: "Set Extension",
  [Scry.PromoType[Scry.PromoType.setpromo]]: "Set Promo",
  [Scry.PromoType[Scry.PromoType.silverfoil]]: "Silver Foil",
  [Scry.PromoType[Scry.PromoType.sldbonus]]: "Secret Lair Bonus",
  [Scry.PromoType[Scry.PromoType.stamped]]: "Stamped",
  [Scry.PromoType[Scry.PromoType.surgefoil]]: "Surge Foil",
  [Scry.PromoType[Scry.PromoType.textured]]: "Textured",
  [Scry.PromoType[Scry.PromoType.themepack]]: "Theme Pack",
  [Scry.PromoType[Scry.PromoType.thick]]: "Thick",
  [Scry.PromoType[Scry.PromoType.tourney]]: "Tourney",
  [Scry.PromoType[Scry.PromoType.upsidedown]]: "Upside Down",
  [Scry.PromoType[Scry.PromoType.upsidedownback]]: "Upside Down Back",
  [Scry.PromoType[Scry.PromoType.vault]]: "Vault",
  [Scry.PromoType[Scry.PromoType.wizardsplaynetwork]]: "Wizards Play Network",
} as const;

export const FrameEffectTextMap = {
  [Scry.FrameEffect[Scry.FrameEffect.legendary]]: "Legendary",
  [Scry.FrameEffect[Scry.FrameEffect.miracle]]: "Miracle",
  [Scry.FrameEffect[Scry.FrameEffect.sunmoondfc]]: "Sun/Moon DFC",
  [Scry.FrameEffect[Scry.FrameEffect.compasslanddfc]]: "Compass/Land DFC",
  [Scry.FrameEffect[Scry.FrameEffect.originpwdfc]]: "Origin PW DFC",
  [Scry.FrameEffect[Scry.FrameEffect.mooneldrazidfc]]: "Moon Eldrazi DFC",
  [Scry.FrameEffect[Scry.FrameEffect.moonreversemoondfc]]:
    "Moon Reverse Moon DFC",
  [Scry.FrameEffect[Scry.FrameEffect.showcase]]: "Showcase",
  [Scry.FrameEffect[Scry.FrameEffect.extendedart]]: "Extended Art",
  [Scry.FrameEffect[Scry.FrameEffect.companion]]: "Companion",
  [Scry.FrameEffect[Scry.FrameEffect.etched]]: "Etched",
  [Scry.FrameEffect[Scry.FrameEffect.snow]]: "Snow",
  [Scry.FrameEffect[Scry.FrameEffect.lesson]]: "Lesson",
  [Scry.FrameEffect[Scry.FrameEffect.shatteredglass]]: "Shattered Glass",
  [Scry.FrameEffect[Scry.FrameEffect.convertdfc]]: "Convert DFC",
  [Scry.FrameEffect[Scry.FrameEffect.fandfc]]: "Fan DFC",
  [Scry.FrameEffect[Scry.FrameEffect.upsidedowndfc]]: "Upside Down DFC",
};

export const ColorTextMap: Record<Scry.Color, string> = {
  W: "White",
  B: "Black",
  R: "Red",
  U: "Blue",
  G: "Green",
};

export const getScryCard = async (cardItem: CardItem): Promise<Card> => {
  const card = await Scry.Cards.byTcgPlayerId(
    Number(emidToTcgLookUp[cardItem.emid.toString()]),
  );
  if (!card) {
    throw new Error(
      `emid ${cardItem.emid} not found in lookup. Probably need to update`,
    );
  }
  card.setCardPrice(cardItem.price);
  card.setFoil(cardItem.foil);
  return card;
};

String.prototype.ebayLegalString = function (this: string): string {
  // Ensure the string is trimmed and does not exceed 65 characters
  const trimmedString = this.trim();
  if (trimmedString.length <= 65) {
    return trimmedString;
  }
  return trimmedString.substring(0, 65);
};

const constructName = (baseName: string, additions: string[]): string => {
  const name = `${baseName}${
    additions.length > 0 ? " " + additions.join(" ") : ""
  }`;
  if (name.length > 65) {
    if (additions.length === 0) {
      return name.substring(0, 54);
    }
    const newAdditions = [...additions];
    newAdditions.pop();
    return constructName(baseName, newAdditions);
  }
  return name;
};

Scry.Card.prototype.getEbayName = function (): string {
  const frameEffectsWeCareAbout =
    this.frame_effects?.filter((effect) => FrameEffectTextMap[effect]) || [];

  const cardTypesWeCareAbout =
    this.promo_types?.filter((type) => promoTypeTextMap[type]) || [];

  const frameEffects = frameEffectsWeCareAbout?.length
    ? frameEffectsWeCareAbout.map((type) => FrameEffectTextMap[type]).join(" ")
    : "";
  const promoTypes = cardTypesWeCareAbout?.length
    ? cardTypesWeCareAbout.map((type) => promoTypeTextMap[type]).join(" ")
    : "";
  const image = this.getImageURI("border_crop")
    ? [this.getImageURI("border_crop")!!]
    : [];
  const fullArt = this.full_art ? "Full Art " : "";
  const foilStr = this.sellCardIsFoil ? "Foil" : "Non-Foil";

  return constructName(`MTG - ${this.name}`, [
    fullArt,
    frameEffects,
    promoTypes,
    foilStr,
    this.set_name,
    `#${this.collector_number}`,
  ]);
};

Scry.Card.prototype.setCardPrice = function (price: number) {
  this.sellPrice = price;
};

Scry.Card.prototype.getCardPrice = function (): number {
  if (isNaN(this.sellPrice)) {
    throw Error(`Price not set for ${this.name}`);
  }
  if (this.sellPrice < runtimeConfig.MIN_UNIT_PRICE) {
    throw Error(
      `Price too low for ${this.name}, price is ${this.sellPrice} and min sell price is set to ${runtimeConfig.MIN_UNIT_PRICE}`,
    );
  }
  return this.sellPrice;
};

Scry.Card.prototype.setFoil = function (foil: boolean) {
  this.sellCardIsFoil = foil;
};

Scry.Card.prototype.getFoil = function (): boolean {
  if (this.sellCardIsFoil === null) {
    throw Error(`Foil not set for ${this.name}`);
  }

  return this.sellCardIsFoil;
};

export type Card = Scry.Card;

Scry.Card.prototype.toEbayOffer = function (): CreateOfferBody {
  return {
    sku: this.id,
    marketplaceId: "EBAY_AU",
    format: "FIXED_PRICE",
    listingDescription:
      `${this.getEbayName()} near mint. Sleeved out of the pack and placed in a top loader. Will be shipped in a bubble mailer with tracking.`,
    pricingSummary: {
      price: {
        value: this.sellPrice.toFixed(2),
        currency: "AUD",
      },
    },
    listingPolicies: {
      eBayPlusIfEligible: false,
      bestOfferTerms: {
        bestOfferEnabled: true,
        autoDeclinePrice: {
          value: (this.sellPrice * runtimeConfig.OFFER_PERCENTAGE).toFixed(2),
          currency: "AUD",
        },
      },
    },
    categoryId: "183454",
    merchantLocationKey: "AU_2042",
    tax: {
      applyTax: false,
    },
    listingDuration: "GTC",
    hideBuyerDetails: false,
  };
};

Scry.Card.prototype.toEbayListingItem =
  function (): CreateOrReplaceInventoryItemBody {
    const image = this.getImageURI("border_crop")
      ? [this.getImageURI("border_crop")!!]
      : [];

    const productWithCorrectedAspects: Omit<
      CreateOrReplaceInventoryItemBody["product"],
      "aspects"
    > = {
      title: this.getEbayName(),
      aspects: {
        Autographed: ["No"],
        Set: [this.set_name.ebayLegalString()],
        Material: ["Card Stock"],
        Vintage: ["No"],
        Rarity: [this.rarity],
        Game: ["Magic: The Gathering"],
        "Card Name": [this.name.ebayLegalString()],
        Manufacturer: ["Wizards of the Coast"],
        Features: ([] as string[])
          .concat(this.promo_types || [])
          .concat(...(this.frame_effects || [])),
        "Card Type": [this.type_line.ebayLegalString()],
        "Country/Region of Manufacture": ["United States"],
        Finish: [this.sellCardIsFoil ? "Foil" : "Non-Foil"],
      },
      imageUrls: [...image],
    };
    return {
      product: productWithCorrectedAspects,
      condition: "USED_VERY_GOOD",
      packageWeightAndSize: {
        dimensions: {
          width: 11,
          length: 17,
          height: 2,
          unit: "CENTIMETER",
        },
        packageType: "PADDED_BAGS",
        weight: {
          value: 0.1,
          unit: "KILOGRAM",
        },
        shippingIrregular: false,
      },
      availability: {
        shipToLocationAvailability: {
          quantity: 1,
        },
      },
      conditionDescriptors: [
        {
          name: "40001",
          values: ["400010"],
        },
      ],
    };
  };
