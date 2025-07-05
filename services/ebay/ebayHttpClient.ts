import runtimeConfig from "@ebay/config";
import EbayAuthToken from "ebay-oauth-nodejs-client";
import { KyInstance } from "ky";
import authClient from "../authClient.ts";

const scopes = [
  "https://api.ebay.com/oauth/api_scope/commerce.identity.readonly",
  "https://api.ebay.com/oauth/api_scope/sell.stores.readonly",
  "https://api.ebay.com/oauth/api_scope",
  "https://api.ebay.com/oauth/api_scope/sell.marketing.readonly",
  "https://api.ebay.com/oauth/api_scope/sell.marketing",
  "https://api.ebay.com/oauth/api_scope/sell.inventory.readonly",
  "https://api.ebay.com/oauth/api_scope/sell.inventory",
  "https://api.ebay.com/oauth/api_scope/sell.account.readonly",
  "https://api.ebay.com/oauth/api_scope/sell.account",
  "https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly",
  "https://api.ebay.com/oauth/api_scope/sell.fulfillment",
];

const ebayAuthToken = new EbayAuthToken({
  clientId: runtimeConfig.EBAY_APP_ID,
  clientSecret: runtimeConfig.EBAY_CERT_ID,
  environment: "PRODUCTION",
  scopes: scopes,
  redirectUri: "Joel_Berta-JoelBert-mtglis-lhxiiqgo",
});

const eBayClient = await authClient({
  baseUrl: "https://api.ebay.com/sell/inventory/v1/",
  headers: {
    "Content-Type": "application/json",
    "Content-Language": "en-AU",
    "Accept-Language": "en-AU",
  },
  auth: {
    tokenResolver: async (_: KyInstance) => {
      const { access_token } = JSON.parse(
        await ebayAuthToken.getAccessToken(
          "PRODUCTION",
          runtimeConfig.EBAY_REFRESH_TOKEN,
          scopes,
        ),
      ) as { access_token: string };
      return access_token;
    },
    header: "Authorization",
    valueGenerator: (token: string) => `Bearer ${token}`,
  },
});

/***************BEGIN GENERATED CODE*************/
export type CreateOfferBody = {
  availableQuantity?: number;
  categoryId?: string;
  charity?: { charityId?: string; donationPercentage?: string };
  extendedProducerResponsibility?: {
    ecoParticipationFee?: { currency?: string; value?: string };
    producerProductId?: string;
    productDocumentationId?: string;
    productPackageId?: string;
    shipmentPackageId?: string;
  };
  format?: string;
  hideBuyerDetails?: boolean;
  includeCatalogProductDetails?: boolean;
  listingDescription?: string;
  listingDuration?: string;
  listingPolicies?: {
    bestOfferTerms?: {
      autoAcceptPrice?: { currency?: string; value?: string };
      autoDeclinePrice?: { currency?: string; value?: string };
      bestOfferEnabled?: boolean;
    };
    eBayPlusIfEligible?: boolean;
    fulfillmentPolicyId?: string;
    paymentPolicyId?: string;
    productCompliancePolicyIds?: string[];
    regionalProductCompliancePolicies?: {
      countryPolicies?: { country?: string; policyIds?: string[] }[];
    };
    regionalTakeBackPolicies?: {
      countryPolicies?: { country?: string; policyIds?: string[] }[];
    };
    returnPolicyId?: string;
    shippingCostOverrides?: {
      additionalShippingCost?: { currency?: string; value?: string };
      priority?: number;
      shippingCost?: { currency?: string; value?: string };
      shippingServiceType?: string;
      surcharge?: { currency?: string; value?: string };
    }[];
    takeBackPolicyId?: string;
  };
  listingStartDate?: string;
  lotSize?: number;
  marketplaceId?: string;
  merchantLocationKey?: string;
  pricingSummary?: {
    auctionReservePrice?: { currency?: string; value?: string };
    auctionStartPrice?: { currency?: string; value?: string };
    minimumAdvertisedPrice?: { currency?: string; value?: string };
    originallySoldForRetailPriceOn?: string;
    originalRetailPrice?: { currency?: string; value?: string };
    price?: { currency?: string; value?: string };
    pricingVisibility?: string;
  };
  quantityLimitPerBuyer?: number;
  regulatory?: {
    documents?: { documentId?: string }[];
    energyEfficiencyLabel?: {
      imageDescription?: string;
      imageURL?: string;
      productInformationSheet?: string;
    };
    hazmat?: {
      component?: string;
      pictograms?: string[];
      signalWord?: string;
      statements?: string[];
    };
    manufacturer?: {
      addressLine1?: string;
      addressLine2?: string;
      city?: string;
      companyName?: string;
      contactUrl?: string;
      country?: string;
      email?: string;
      phone?: string;
      postalCode?: string;
      stateOrProvince?: string;
    };
    productSafety?: {
      component?: string;
      pictograms?: string[];
      statements?: string[];
    };
    repairScore?: number;
    responsiblePersons?: {
      addressLine1?: string;
      addressLine2?: string;
      city?: string;
      companyName?: string;
      contactUrl?: string;
      country?: string;
      email?: string;
      phone?: string;
      postalCode?: string;
      stateOrProvince?: string;
      types?: string[];
    }[];
  };
  secondaryCategoryId?: string;
  sku?: string;
  storeCategoryNames?: string[];
  tax?: {
    applyTax?: boolean;
    thirdPartyTaxCategory?: string;
    vatPercentage?: number;
  };
};

export type CreateOfferResponse = {
  offerId?: string;
  warnings?: {
    category?: string;
    domain?: string;
    errorId?: number;
    inputRefIds?: string[];
    longMessage?: string;
    message?: string;
    outputRefIds?: string[];
    parameters?: { name?: string; value?: string }[];
    subdomain?: string;
  }[];
};
export const createOffer = async (
  body: CreateOfferBody,
): Promise<CreateOfferResponse> => {
  return await eBayClient.post(`offer`, { json: body }).json();
};

export type PublishOfferPathParams = { offerId: string };

export type PublishOfferResponse = {
  listingId?: string;
  warnings?: {
    category?: string;
    domain?: string;
    errorId?: number;
    inputRefIds?: string[];
    longMessage?: string;
    message?: string;
    outputRefIds?: string[];
    parameters?: { name?: string; value?: string }[];
    subdomain?: string;
  }[];
};
export const publishOffer = async (
  { offerId }: PublishOfferPathParams,
): Promise<PublishOfferResponse> => {
  return await eBayClient.post(`offer/${offerId}/publish`).json();
};

export type GetOfferPathParams = { offerId: string };

export type GetOfferResponse = {
  availableQuantity?: number;
  categoryId?: string;
  charity?: { charityId?: string; donationPercentage?: string };
  extendedProducerResponsibility?: {
    ecoParticipationFee?: { currency?: string; value?: string };
    producerProductId?: string;
    productDocumentationId?: string;
    productPackageId?: string;
    shipmentPackageId?: string;
  };
  format?: string;
  hideBuyerDetails?: boolean;
  includeCatalogProductDetails?: boolean;
  listing?: {
    listingId?: string;
    listingOnHold?: boolean;
    listingStatus?: string;
    soldQuantity?: number;
  };
  listingDescription?: string;
  listingDuration?: string;
  listingPolicies?: {
    bestOfferTerms?: {
      autoAcceptPrice?: { currency?: string; value?: string };
      autoDeclinePrice?: { currency?: string; value?: string };
      bestOfferEnabled?: boolean;
    };
    eBayPlusIfEligible?: boolean;
    fulfillmentPolicyId?: string;
    paymentPolicyId?: string;
    productCompliancePolicyIds?: string[];
    regionalProductCompliancePolicies?: {
      countryPolicies?: { country?: string; policyIds?: string[] }[];
    };
    regionalTakeBackPolicies?: {
      countryPolicies?: { country?: string; policyIds?: string[] }[];
    };
    returnPolicyId?: string;
    shippingCostOverrides?: {
      additionalShippingCost?: { currency?: string; value?: string };
      priority?: number;
      shippingCost?: { currency?: string; value?: string };
      shippingServiceType?: string;
      surcharge?: { currency?: string; value?: string };
    }[];
    takeBackPolicyId?: string;
  };
  listingStartDate?: string;
  lotSize?: number;
  marketplaceId?: string;
  merchantLocationKey?: string;
  offerId?: string;
  pricingSummary?: {
    auctionReservePrice?: { currency?: string; value?: string };
    auctionStartPrice?: { currency?: string; value?: string };
    minimumAdvertisedPrice?: { currency?: string; value?: string };
    originallySoldForRetailPriceOn?: string;
    originalRetailPrice?: { currency?: string; value?: string };
    price?: { currency?: string; value?: string };
    pricingVisibility?: string;
  };
  quantityLimitPerBuyer?: number;
  regulatory?: {
    documents?: { documentId?: string }[];
    energyEfficiencyLabel?: {
      imageDescription?: string;
      imageURL?: string;
      productInformationSheet?: string;
    };
    hazmat?: {
      component?: string;
      pictograms?: string[];
      signalWord?: string;
      statements?: string[];
    };
    manufacturer?: {
      addressLine1?: string;
      addressLine2?: string;
      city?: string;
      companyName?: string;
      contactUrl?: string;
      country?: string;
      email?: string;
      phone?: string;
      postalCode?: string;
      stateOrProvince?: string;
    };
    productSafety?: {
      component?: string;
      pictograms?: string[];
      statements?: string[];
    };
    repairScore?: number;
    responsiblePersons?: {
      addressLine1?: string;
      addressLine2?: string;
      city?: string;
      companyName?: string;
      contactUrl?: string;
      country?: string;
      email?: string;
      phone?: string;
      postalCode?: string;
      stateOrProvince?: string;
      types?: string[];
    }[];
  };
  secondaryCategoryId?: string;
  sku?: string;
  status?: string;
  storeCategoryNames?: string[];
  tax?: {
    applyTax?: boolean;
    thirdPartyTaxCategory?: string;
    vatPercentage?: number;
  };
};
export const getOffer = async (
  { offerId }: GetOfferPathParams,
): Promise<GetOfferResponse> => {
  return await eBayClient.get(`offer/${offerId}`).json();
};

export type UpdateOfferBody = {
  availableQuantity?: number;
  categoryId?: string;
  charity?: { charityId?: string; donationPercentage?: string };
  extendedProducerResponsibility?: {
    ecoParticipationFee?: { currency?: string; value?: string };
    producerProductId?: string;
    productDocumentationId?: string;
    productPackageId?: string;
    shipmentPackageId?: string;
  };
  hideBuyerDetails?: boolean;
  includeCatalogProductDetails?: boolean;
  listingDescription?: string;
  listingDuration?: string;
  listingPolicies?: {
    bestOfferTerms?: {
      autoAcceptPrice?: { currency?: string; value?: string };
      autoDeclinePrice?: { currency?: string; value?: string };
      bestOfferEnabled?: boolean;
    };
    eBayPlusIfEligible?: boolean;
    fulfillmentPolicyId?: string;
    paymentPolicyId?: string;
    productCompliancePolicyIds?: string[];
    regionalProductCompliancePolicies?: {
      countryPolicies?: { country?: string; policyIds?: string[] }[];
    };
    regionalTakeBackPolicies?: {
      countryPolicies?: { country?: string; policyIds?: string[] }[];
    };
    returnPolicyId?: string;
    shippingCostOverrides?: {
      additionalShippingCost?: { currency?: string; value?: string };
      priority?: number;
      shippingCost?: { currency?: string; value?: string };
      shippingServiceType?: string;
      surcharge?: { currency?: string; value?: string };
    }[];
    takeBackPolicyId?: string;
  };
  listingStartDate?: string;
  lotSize?: number;
  merchantLocationKey?: string;
  pricingSummary?: {
    auctionReservePrice?: { currency?: string; value?: string };
    auctionStartPrice?: { currency?: string; value?: string };
    minimumAdvertisedPrice?: { currency?: string; value?: string };
    originallySoldForRetailPriceOn?: string;
    originalRetailPrice?: { currency?: string; value?: string };
    price?: { currency?: string; value?: string };
    pricingVisibility?: string;
  };
  quantityLimitPerBuyer?: number;
  regulatory?: {
    documents?: { documentId?: string }[];
    energyEfficiencyLabel?: {
      imageDescription?: string;
      imageURL?: string;
      productInformationSheet?: string;
    };
    hazmat?: {
      component?: string;
      pictograms?: string[];
      signalWord?: string;
      statements?: string[];
    };
    manufacturer?: {
      addressLine1?: string;
      addressLine2?: string;
      city?: string;
      companyName?: string;
      contactUrl?: string;
      country?: string;
      email?: string;
      phone?: string;
      postalCode?: string;
      stateOrProvince?: string;
    };
    productSafety?: {
      component?: string;
      pictograms?: string[];
      statements?: string[];
    };
    repairScore?: number;
    responsiblePersons?: {
      addressLine1?: string;
      addressLine2?: string;
      city?: string;
      companyName?: string;
      contactUrl?: string;
      country?: string;
      email?: string;
      phone?: string;
      postalCode?: string;
      stateOrProvince?: string;
      types?: string[];
    }[];
  };
  secondaryCategoryId?: string;
  storeCategoryNames?: string[];
  tax?: {
    applyTax?: boolean;
    thirdPartyTaxCategory?: string;
    vatPercentage?: number;
  };
};
export type UpdateOfferPathParams = { offerId: string };

export type UpdateOfferResponse = {
  offerId?: string;
  warnings?: {
    category?: string;
    domain?: string;
    errorId?: number;
    inputRefIds?: string[];
    longMessage?: string;
    message?: string;
    outputRefIds?: string[];
    parameters?: { name?: string; value?: string }[];
    subdomain?: string;
  }[];
};
export const updateOffer = async (
  { offerId }: UpdateOfferPathParams,
  body: UpdateOfferBody,
): Promise<UpdateOfferResponse> => {
  return await eBayClient.put(`offer/${offerId}`, { json: body }).json();
};

export type CreateOrReplaceInventoryItemBody = {
  availability?: {
    pickupAtLocationAvailability?: {
      availabilityType?: string;
      fulfillmentTime?: { unit?: string; value?: number };
      merchantLocationKey?: string;
      quantity?: number;
    }[];
    shipToLocationAvailability?: {
      availabilityDistributions?: {
        fulfillmentTime?: { unit?: string; value?: number };
        merchantLocationKey?: string;
        quantity?: number;
      }[];
      quantity?: number;
    };
  };
  condition?: string;
  conditionDescription?: string;
  conditionDescriptors?: {
    additionalInfo?: string;
    name?: string;
    values?: string[];
  }[];
  packageWeightAndSize?: {
    dimensions?: {
      height?: number;
      length?: number;
      unit?: string;
      width?: number;
    };
    packageType?: string;
    shippingIrregular?: boolean;
    weight?: { unit?: string; value?: number };
  };
  product?: {
    aspects?: string;
    brand?: string;
    description?: string;
    ean?: string[];
    epid?: string;
    imageUrls?: string[];
    isbn?: string[];
    mpn?: string;
    subtitle?: string;
    title?: string;
    upc?: string[];
    videoIds?: string[];
  };
};
export type CreateOrReplaceInventoryItemPathParams = { sku: string };

export type CreateOrReplaceInventoryItemResponse = {
  warnings?: {
    category?: string;
    domain?: string;
    errorId?: number;
    inputRefIds?: string[];
    longMessage?: string;
    message?: string;
    outputRefIds?: string[];
    parameters?: { name?: string; value?: string }[];
    subdomain?: string;
  }[];
};
export const createOrReplaceInventoryItem = async (
  { sku }: CreateOrReplaceInventoryItemPathParams,
  body: CreateOrReplaceInventoryItemBody,
): Promise<CreateOrReplaceInventoryItemResponse> => {
  return await eBayClient.put(`inventory_item/${sku}`, { json: body }).json();
};

export type GetInventoryItemBody = {
  availability?: {
    pickupAtLocationAvailability?: {
      availabilityType?: string;
      fulfillmentTime?: { unit?: string; value?: number };
      merchantLocationKey?: string;
      quantity?: number;
    }[];
    shipToLocationAvailability?: {
      availabilityDistributions?: {
        fulfillmentTime?: { unit?: string; value?: number };
        merchantLocationKey?: string;
        quantity?: number;
      }[];
      quantity?: number;
    };
  };
  condition?: string;
  conditionDescription?: string;
  conditionDescriptors?: {
    additionalInfo?: string;
    name?: string;
    values?: string[];
  }[];
  packageWeightAndSize?: {
    dimensions?: {
      height?: number;
      length?: number;
      unit?: string;
      width?: number;
    };
    packageType?: string;
    shippingIrregular?: boolean;
    weight?: { unit?: string; value?: number };
  };
  product?: {
    aspects?: string;
    brand?: string;
    description?: string;
    ean?: string[];
    epid?: string;
    imageUrls?: string[];
    isbn?: string[];
    mpn?: string;
    subtitle?: string;
    title?: string;
    upc?: string[];
    videoIds?: string[];
  };
};
export type GetInventoryItemPathParams = { sku: string };

export type GetInventoryItemResponse = {
  warnings?: {
    category?: string;
    domain?: string;
    errorId?: number;
    inputRefIds?: string[];
    longMessage?: string;
    message?: string;
    outputRefIds?: string[];
    parameters?: { name?: string; value?: string }[];
    subdomain?: string;
  }[];
};
export const getInventoryItem = async (
  { sku }: GetInventoryItemPathParams,
  body: GetInventoryItemBody,
): Promise<GetInventoryItemResponse> => {
  return await eBayClient.put(`inventory_item/${sku}`, { json: body }).json();
};

export type DeleteInventoryItemPathParams = { sku: string };

export type DeleteInventoryItemResponse = unknown;
export const deleteInventoryItem = async (
  { sku }: DeleteInventoryItemPathParams,
): Promise<DeleteInventoryItemResponse> => {
  return await eBayClient.delete(`inventory_item/${sku}`).json();
};

export type DeleteOfferPathParams = { offerId: string };

export type DeleteOfferResponse = unknown;
export const deleteOffer = async (
  { offerId }: DeleteOfferPathParams,
): Promise<DeleteOfferResponse> => {
  return await eBayClient.delete(`offer/${offerId}`).json();
};
