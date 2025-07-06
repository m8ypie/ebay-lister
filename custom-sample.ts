import { eBayClient, extractBody } from "./client.ts";
export interface CreateOfferBody {
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
}

export interface CreateOfferResponse {
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
}

export const CreateOffer = async (
  body: CreateOfferBody,
): Promise<CreateOfferResponse> => {
  return extractBody(
    await eBayClient.request(`offer`, { body, method: "post" }),
  );
};

export interface PublishOfferPath {
  offerId: string;
}

export interface PublishOfferResponse {
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
}

export const PublishOffer = async (
  { offerId }: PublishOfferPath,
): Promise<PublishOfferResponse> => {
  return extractBody(
    await eBayClient.request(`offer/${offerId}/publish`, { method: "post" }),
  );
};

export interface GetOfferPath {
  offerId: string;
}

export interface GetOfferResponse {
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
}

export const GetOffer = async (
  { offerId }: GetOfferPath,
): Promise<GetOfferResponse> => {
  return extractBody(
    await eBayClient.request(`offer/${offerId}`, { method: "get" }),
  );
};
export interface UpdateOfferBody {
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
}

export interface UpdateOfferPath {
  offerId: string;
}

export interface UpdateOfferResponse {
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
}

export const UpdateOffer = async (
  body: UpdateOfferBody,
  { offerId }: UpdateOfferPath,
): Promise<UpdateOfferResponse> => {
  return extractBody(
    await eBayClient.request(`offer/${offerId}`, { body, method: "put" }),
  );
};
export interface CreateOrReplaceInventoryItemBody {
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
}

export interface CreateOrReplaceInventoryItemPath {
  sku: string;
}

export interface CreateOrReplaceInventoryItemResponse {
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
}

export const CreateOrReplaceInventoryItem = async (
  body: CreateOrReplaceInventoryItemBody,
  { sku }: CreateOrReplaceInventoryItemPath,
): Promise<CreateOrReplaceInventoryItemResponse> => {
  return extractBody(
    await eBayClient.request(`inventory_item/${sku}`, { body, method: "put" }),
  );
};
export interface GetInventoryItemBody {
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
}

export interface GetInventoryItemPath {
  sku: string;
}

export interface GetInventoryItemResponse {
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
}

export const GetInventoryItem = async (
  body: GetInventoryItemBody,
  { sku }: GetInventoryItemPath,
): Promise<GetInventoryItemResponse> => {
  return extractBody(
    await eBayClient.request(`inventory_item/${sku}`, { body, method: "put" }),
  );
};

export interface DeleteInventoryItemPath {
  sku: string;
}

export const DeleteInventoryItem = async (
  { sku }: DeleteInventoryItemPath,
): Promise<void> => {
  return extractBody(
    await eBayClient.request(`inventory_item/${sku}`, { method: "delete" }),
  );
};

export interface DeleteOfferPath {
  offerId: string;
}

export const DeleteOffer = async (
  { offerId }: DeleteOfferPath,
): Promise<void> => {
  return extractBody(
    await eBayClient.request(`offer/${offerId}`, { method: "delete" }),
  );
};
