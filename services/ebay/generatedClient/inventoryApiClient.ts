import { httpClient } from "./httpClient.ts";
export { initApiClient } from "./httpClient.ts";
export interface BulkCreateOrReplaceInventoryItemBody {
  requests?: {
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
    locale?: string;
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
    sku?: string;
  }[];
}

export interface BulkCreateOrReplaceInventoryItemResponse {
  responses?: {
    errors?: {
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
    locale?: string;
    sku?: string;
    statusCode?: number;
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
  }[];
}

export const bulkCreateOrReplaceInventoryItem = async (
  body: BulkCreateOrReplaceInventoryItemBody,
): Promise<BulkCreateOrReplaceInventoryItemResponse> => {
  return await httpClient.request(`bulk_create_or_replace_inventory_item`, {
    body,
    method: "post",
  });
};
export interface BulkGetInventoryItemBody {
  requests?: { sku?: string }[];
}

export interface BulkGetInventoryItemResponse {
  responses?: {
    errors?: {
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
    inventoryItem?: {
      availability?: {
        pickupAtLocationAvailability?: {
          availabilityType?: string;
          fulfillmentTime?: { unit?: string; value?: number };
          merchantLocationKey?: string;
          quantity?: number;
        }[];
        shipToLocationAvailability?: {
          allocationByFormat?: { auction?: number; fixedPrice?: number };
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
      inventoryItemGroupKeys?: string[];
      locale?: string;
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
      sku?: string;
    };
    sku?: string;
    statusCode?: number;
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
  }[];
}

export const bulkGetInventoryItem = async (
  body: BulkGetInventoryItemBody,
): Promise<BulkGetInventoryItemResponse> => {
  return await httpClient.request(`bulk_get_inventory_item`, {
    body,
    method: "post",
  });
};
export interface BulkUpdatePriceQuantityBody {
  requests?: {
    offers?: {
      availableQuantity?: number;
      offerId?: string;
      price?: { currency?: string; value?: string };
    }[];
    shipToLocationAvailability?: {
      availabilityDistributions?: {
        fulfillmentTime?: { unit?: string; value?: number };
        merchantLocationKey?: string;
        quantity?: number;
      }[];
      quantity?: number;
    };
    sku?: string;
  }[];
}

export interface BulkUpdatePriceQuantityResponse {
  responses?: {
    errors?: {
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
    offerId?: string;
    sku?: string;
    statusCode?: number;
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
  }[];
}

export const bulkUpdatePriceQuantity = async (
  body: BulkUpdatePriceQuantityBody,
): Promise<BulkUpdatePriceQuantityResponse> => {
  return await httpClient.request(`bulk_update_price_quantity`, {
    body,
    method: "post",
  });
};

export interface GetInventoryItemPath {
  sku: string;
}

export interface GetInventoryItemResponse {
  availability?: {
    pickupAtLocationAvailability?: {
      availabilityType?: string;
      fulfillmentTime?: { unit?: string; value?: number };
      merchantLocationKey?: string;
      quantity?: number;
    }[];
    shipToLocationAvailability?: {
      allocationByFormat?: { auction?: number; fixedPrice?: number };
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

  groupIds?: string[];

  inventoryItemGroupKeys?: string[];

  locale?: string;

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

  sku?: string;
}

export const getInventoryItem = async (
  { sku }: GetInventoryItemPath,
): Promise<GetInventoryItemResponse> => {
  return await httpClient.request(`inventory_item/${sku}`, { method: "get" });
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

export const createOrReplaceInventoryItem = async (
  { sku }: CreateOrReplaceInventoryItemPath,
  body: CreateOrReplaceInventoryItemBody,
): Promise<CreateOrReplaceInventoryItemResponse> => {
  return await httpClient.request(`inventory_item/${sku}`, {
    body,
    method: "put",
  });
};

export interface DeleteInventoryItemPath {
  sku: string;
}

export const deleteInventoryItem = async (
  { sku }: DeleteInventoryItemPath,
): Promise<void> => {
  return await httpClient.request(`inventory_item/${sku}`, {
    method: "delete",
  });
};

export interface GetInventoryItemsResponse {
  href?: string;

  inventoryItems?: {
    availability?: {
      pickupAtLocationAvailability?: {
        availabilityType?: string;
        fulfillmentTime?: { unit?: string; value?: number };
        merchantLocationKey?: string;
        quantity?: number;
      }[];
      shipToLocationAvailability?: {
        allocationByFormat?: { auction?: number; fixedPrice?: number };
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
    groupIds?: string[];
    inventoryItemGroupKeys?: string[];
    locale?: string;
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
    sku?: string;
  }[];

  limit?: number;

  next?: string;

  prev?: string;

  size?: number;

  total?: number;
}

export const getInventoryItems = async (): Promise<
  GetInventoryItemsResponse
> => {
  return await httpClient.request(`inventory_item`, { method: "get" });
};

export interface GetProductCompatibilityPath {
  sku: string;
}

export interface GetProductCompatibilityResponse {
  compatibleProducts?: {
    compatibilityProperties?: { name?: string; value?: string }[];
    notes?: string;
    productFamilyProperties?: {
      engine?: string;
      make?: string;
      model?: string;
      trim?: string;
      year?: string;
    };
    productIdentifier?: { epid?: string; gtin?: string; ktype?: string };
  }[];

  sku?: string;
}

export const getProductCompatibility = async (
  { sku }: GetProductCompatibilityPath,
): Promise<GetProductCompatibilityResponse> => {
  return await httpClient.request(
    `inventory_item/${sku}/product_compatibility`,
    { method: "get" },
  );
};
export interface CreateOrReplaceProductCompatibilityBody {
  compatibleProducts?: {
    compatibilityProperties?: { name?: string; value?: string }[];
    notes?: string;
    productFamilyProperties?: {
      engine?: string;
      make?: string;
      model?: string;
      trim?: string;
      year?: string;
    };
    productIdentifier?: { epid?: string; gtin?: string; ktype?: string };
  }[];

  sku?: string;
}

export interface CreateOrReplaceProductCompatibilityPath {
  sku: string;
}

export interface CreateOrReplaceProductCompatibilityResponse {
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

export const createOrReplaceProductCompatibility = async (
  { sku }: CreateOrReplaceProductCompatibilityPath,
  body: CreateOrReplaceProductCompatibilityBody,
): Promise<CreateOrReplaceProductCompatibilityResponse> => {
  return await httpClient.request(
    `inventory_item/${sku}/product_compatibility`,
    { body, method: "put" },
  );
};

export interface DeleteProductCompatibilityPath {
  sku: string;
}

export const deleteProductCompatibility = async (
  { sku }: DeleteProductCompatibilityPath,
): Promise<void> => {
  return await httpClient.request(
    `inventory_item/${sku}/product_compatibility`,
    { method: "delete" },
  );
};

export interface GetInventoryItemGroupPath {
  inventoryItemGroupKey: string;
}

export interface GetInventoryItemGroupResponse {
  aspects?: string;

  description?: string;

  imageUrls?: string[];

  inventoryItemGroupKey?: string;

  subtitle?: string;

  title?: string;

  variantSKUs?: string[];

  variesBy?: {
    aspectsImageVariesBy?: string[];
    specifications?: { name?: string; values?: string[] }[];
  };

  videoIds?: string[];
}

export const getInventoryItemGroup = async (
  { inventoryItemGroupKey }: GetInventoryItemGroupPath,
): Promise<GetInventoryItemGroupResponse> => {
  return await httpClient.request(
    `inventory_item_group/${inventoryItemGroupKey}`,
    { method: "get" },
  );
};
export interface CreateOrReplaceInventoryItemGroupBody {
  aspects?: string;

  description?: string;

  imageUrls?: string[];

  inventoryItemGroupKey?: string;

  subtitle?: string;

  title?: string;

  variantSKUs?: string[];

  variesBy?: {
    aspectsImageVariesBy?: string[];
    specifications?: { name?: string; values?: string[] }[];
  };

  videoIds?: string[];
}

export interface CreateOrReplaceInventoryItemGroupPath {
  inventoryItemGroupKey: string;
}

export interface CreateOrReplaceInventoryItemGroupResponse {
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

export const createOrReplaceInventoryItemGroup = async (
  { inventoryItemGroupKey }: CreateOrReplaceInventoryItemGroupPath,
  body: CreateOrReplaceInventoryItemGroupBody,
): Promise<CreateOrReplaceInventoryItemGroupResponse> => {
  return await httpClient.request(
    `inventory_item_group/${inventoryItemGroupKey}`,
    { body, method: "put" },
  );
};

export interface DeleteInventoryItemGroupPath {
  inventoryItemGroupKey: string;
}

export const deleteInventoryItemGroup = async (
  { inventoryItemGroupKey }: DeleteInventoryItemGroupPath,
): Promise<void> => {
  return await httpClient.request(
    `inventory_item_group/${inventoryItemGroupKey}`,
    { method: "delete" },
  );
};
export interface BulkMigrateListingBody {
  requests?: { listingId?: string }[];
}

export interface BulkMigrateListingResponse {
  responses?: {
    errors?: {
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
    inventoryItemGroupKey?: string;
    inventoryItems?: { offerId?: string; sku?: string }[];
    listingId?: string;
    marketplaceId?: string;
    statusCode?: number;
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
  }[];
}

export const bulkMigrateListing = async (
  body: BulkMigrateListingBody,
): Promise<BulkMigrateListingResponse> => {
  return await httpClient.request(`bulk_migrate_listing`, {
    body,
    method: "post",
  });
};

export interface GetSkuLocationMappingPath {
  listingId: string;

  sku: string;
}

export interface GetSkuLocationMappingResponse {
  locations?: { merchantLocationKey?: string }[];
}

export const getSkuLocationMapping = async (
  { listingId, sku }: GetSkuLocationMappingPath,
): Promise<GetSkuLocationMappingResponse> => {
  return await httpClient.request(`listing/${listingId}/sku/${sku}/locations`, {
    method: "get",
  });
};
export interface CreateOrReplaceSkuLocationMappingBody {
  locations?: { merchantLocationKey?: string }[];
}

export interface CreateOrReplaceSkuLocationMappingPath {
  listingId: string;

  sku: string;
}

export const createOrReplaceSkuLocationMapping = async (
  { listingId, sku }: CreateOrReplaceSkuLocationMappingPath,
  body: CreateOrReplaceSkuLocationMappingBody,
): Promise<void> => {
  return await httpClient.request(`listing/${listingId}/sku/${sku}/locations`, {
    body,
    method: "put",
  });
};

export interface DeleteSkuLocationMappingPath {
  listingId: string;

  sku: string;
}

export const deleteSkuLocationMapping = async (
  { listingId, sku }: DeleteSkuLocationMappingPath,
): Promise<void> => {
  return await httpClient.request(`listing/${listingId}/sku/${sku}/locations`, {
    method: "delete",
  });
};
export interface BulkCreateOfferBody {
  requests?: {
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
  }[];
}

export interface BulkCreateOfferResponse {
  responses?: {
    errors?: {
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
    format?: string;
    marketplaceId?: string;
    offerId?: string;
    sku?: string;
    statusCode?: number;
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
  }[];
}

export const bulkCreateOffer = async (
  body: BulkCreateOfferBody,
): Promise<BulkCreateOfferResponse> => {
  return await httpClient.request(`bulk_create_offer`, {
    body,
    method: "post",
  });
};
export interface BulkPublishOfferBody {
  requests?: { offerId?: string }[];
}

export interface BulkPublishOfferResponse {
  responses?: {
    errors?: {
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
    listingId?: string;
    offerId?: string;
    statusCode?: number;
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
  }[];
}

export const bulkPublishOffer = async (
  body: BulkPublishOfferBody,
): Promise<BulkPublishOfferResponse> => {
  return await httpClient.request(`bulk_publish_offer`, {
    body,
    method: "post",
  });
};

export interface GetOffersResponse {
  href?: string;

  limit?: number;

  next?: string;

  offers?: {
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
  }[];

  prev?: string;

  size?: number;

  total?: number;
}

export const getOffers = async (): Promise<GetOffersResponse> => {
  return await httpClient.request(`offer`, { method: "get" });
};
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

export const createOffer = async (
  body: CreateOfferBody,
): Promise<CreateOfferResponse> => {
  return await httpClient.request(`offer`, { body, method: "post" });
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

export const getOffer = async (
  { offerId }: GetOfferPath,
): Promise<GetOfferResponse> => {
  return await httpClient.request(`offer/${offerId}`, { method: "get" });
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

export const updateOffer = async (
  { offerId }: UpdateOfferPath,
  body: UpdateOfferBody,
): Promise<UpdateOfferResponse> => {
  return await httpClient.request(`offer/${offerId}`, { body, method: "put" });
};

export interface DeleteOfferPath {
  offerId: string;
}

export const deleteOffer = async (
  { offerId }: DeleteOfferPath,
): Promise<void> => {
  return await httpClient.request(`offer/${offerId}`, { method: "delete" });
};
export interface GetListingFeesBody {
  offers?: { offerId?: string }[];
}

export interface GetListingFeesResponse {
  feeSummaries?: {
    fees?: {
      amount?: { currency?: string; value?: string };
      feeType?: string;
      promotionalDiscount?: { currency?: string; value?: string };
    }[];
    marketplaceId?: string;
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
  }[];
}

export const getListingFees = async (
  body: GetListingFeesBody,
): Promise<GetListingFeesResponse> => {
  return await httpClient.request(`offer/get_listing_fees`, {
    body,
    method: "post",
  });
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

export const publishOffer = async (
  { offerId }: PublishOfferPath,
): Promise<PublishOfferResponse> => {
  return await httpClient.request(`offer/${offerId}/publish`, {
    method: "post",
  });
};
export interface PublishOfferByInventoryItemGroupBody {
  inventoryItemGroupKey?: string;

  marketplaceId?: string;
}

export interface PublishOfferByInventoryItemGroupResponse {
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

export const publishOfferByInventoryItemGroup = async (
  body: PublishOfferByInventoryItemGroupBody,
): Promise<PublishOfferByInventoryItemGroupResponse> => {
  return await httpClient.request(`offer/publish_by_inventory_item_group`, {
    body,
    method: "post",
  });
};

export interface WithdrawOfferPath {
  offerId: string;
}

export interface WithdrawOfferResponse {
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

export const withdrawOffer = async (
  { offerId }: WithdrawOfferPath,
): Promise<WithdrawOfferResponse> => {
  return await httpClient.request(`offer/${offerId}/withdraw`, {
    method: "post",
  });
};
export interface WithdrawOfferByInventoryItemGroupBody {
  inventoryItemGroupKey?: string;

  marketplaceId?: string;
}

export const withdrawOfferByInventoryItemGroup = async (
  body: WithdrawOfferByInventoryItemGroupBody,
): Promise<void> => {
  return await httpClient.request(`offer/withdraw_by_inventory_item_group`, {
    body,
    method: "post",
  });
};

export interface GetInventoryLocationPath {
  merchantLocationKey: string;
}

export interface GetInventoryLocationResponse {
  location?: {
    address?: {
      addressLine1?: string;
      addressLine2?: string;
      city?: string;
      country?: string;
      county?: string;
      postalCode?: string;
      stateOrProvince?: string;
    };
    geoCoordinates?: { latitude?: number; longitude?: number };
    locationId?: string;
  };

  locationAdditionalInformation?: string;

  locationInstructions?: string;

  locationTypes?: string[];

  locationWebUrl?: string;

  merchantLocationKey?: string;

  merchantLocationStatus?: string;

  name?: string;

  operatingHours?: {
    dayOfWeekEnum?: string;
    intervals?: { close?: string; open?: string }[];
  }[];

  phone?: string;

  specialHours?: {
    date?: string;
    intervals?: { close?: string; open?: string }[];
  }[];

  timeZoneId?: string;

  fulfillmentCenterSpecifications?: {
    sameDayShippingCutOffTimes?: {
      overrides?: {
        cutOffTime?: string;
        endDate?: string;
        startDate?: string;
      }[];
      weeklySchedule?: { cutOffTime?: string; dayOfWeekEnum?: string[] }[];
    };
  };
}

export const getInventoryLocation = async (
  { merchantLocationKey }: GetInventoryLocationPath,
): Promise<GetInventoryLocationResponse> => {
  return await httpClient.request(`location/${merchantLocationKey}`, {
    method: "get",
  });
};
export interface CreateInventoryLocationBody {
  location?: {
    address?: {
      addressLine1?: string;
      addressLine2?: string;
      city?: string;
      country?: string;
      county?: string;
      postalCode?: string;
      stateOrProvince?: string;
    };
    geoCoordinates?: { latitude?: number; longitude?: number };
  };

  locationAdditionalInformation?: string;

  locationInstructions?: string;

  locationTypes?: string[];

  locationWebUrl?: string;

  merchantLocationStatus?: string;

  name?: string;

  operatingHours?: {
    dayOfWeekEnum?: string;
    intervals?: { close?: string; open?: string }[];
  }[];

  phone?: string;

  specialHours?: {
    date?: string;
    intervals?: { close?: string; open?: string }[];
  }[];

  timeZoneId?: string;

  fulfillmentCenterSpecifications?: {
    sameDayShippingCutOffTimes?: {
      overrides?: {
        cutOffTime?: string;
        endDate?: string;
        startDate?: string;
      }[];
      weeklySchedule?: { cutOffTime?: string; dayOfWeekEnum?: string[] }[];
    };
  };
}

export interface CreateInventoryLocationPath {
  merchantLocationKey: string;
}

export const createInventoryLocation = async (
  { merchantLocationKey }: CreateInventoryLocationPath,
  body: CreateInventoryLocationBody,
): Promise<void> => {
  return await httpClient.request(`location/${merchantLocationKey}`, {
    body,
    method: "post",
  });
};

export interface DeleteInventoryLocationPath {
  merchantLocationKey: string;
}

export const deleteInventoryLocation = async (
  { merchantLocationKey }: DeleteInventoryLocationPath,
): Promise<void> => {
  return await httpClient.request(`location/${merchantLocationKey}`, {
    method: "delete",
  });
};

export interface DisableInventoryLocationPath {
  merchantLocationKey: string;
}

export interface DisableInventoryLocationResponse {
}

export const disableInventoryLocation = async (
  { merchantLocationKey }: DisableInventoryLocationPath,
): Promise<DisableInventoryLocationResponse> => {
  return await httpClient.request(`location/${merchantLocationKey}/disable`, {
    method: "post",
  });
};

export interface EnableInventoryLocationPath {
  merchantLocationKey: string;
}

export interface EnableInventoryLocationResponse {
}

export const enableInventoryLocation = async (
  { merchantLocationKey }: EnableInventoryLocationPath,
): Promise<EnableInventoryLocationResponse> => {
  return await httpClient.request(`location/${merchantLocationKey}/enable`, {
    method: "post",
  });
};

export interface GetInventoryLocationsResponse {
  href?: string;

  limit?: number;

  next?: string;

  offset?: number;

  prev?: string;

  total?: number;

  locations?: {
    location?: {
      address?: {
        addressLine1?: string;
        addressLine2?: string;
        city?: string;
        country?: string;
        county?: string;
        postalCode?: string;
        stateOrProvince?: string;
      };
      geoCoordinates?: { latitude?: number; longitude?: number };
      locationId?: string;
    };
    locationAdditionalInformation?: string;
    locationInstructions?: string;
    locationTypes?: string[];
    locationWebUrl?: string;
    merchantLocationKey?: string;
    merchantLocationStatus?: string;
    name?: string;
    operatingHours?: {
      dayOfWeekEnum?: string;
      intervals?: { close?: string; open?: string }[];
    }[];
    phone?: string;
    specialHours?: {
      date?: string;
      intervals?: { close?: string; open?: string }[];
    }[];
    timeZoneId?: string;
    fulfillmentCenterSpecifications?: {
      sameDayShippingCutOffTimes?: {
        overrides?: {
          cutOffTime?: string;
          endDate?: string;
          startDate?: string;
        }[];
        weeklySchedule?: { cutOffTime?: string; dayOfWeekEnum?: string[] }[];
      };
    };
  }[];
}

export const getInventoryLocations = async (): Promise<
  GetInventoryLocationsResponse
> => {
  return await httpClient.request(`location`, { method: "get" });
};
export interface UpdateInventoryLocationBody {
  location?: {
    address?: {
      addressLine1?: string;
      addressLine2?: string;
      city?: string;
      country?: string;
      county?: string;
      postalCode?: string;
      stateOrProvince?: string;
    };
    geoCoordinates?: { latitude?: number; longitude?: number };
  };

  locationAdditionalInformation?: string;

  locationInstructions?: string;

  locationTypes?: string[];

  locationWebUrl?: string;

  name?: string;

  operatingHours?: {
    dayOfWeekEnum?: string;
    intervals?: { close?: string; open?: string }[];
  }[];

  phone?: string;

  specialHours?: {
    date?: string;
    intervals?: { close?: string; open?: string }[];
  }[];

  timeZoneId?: string;

  fulfillmentCenterSpecifications?: {
    sameDayShippingCutOffTimes?: {
      overrides?: {
        cutOffTime?: string;
        endDate?: string;
        startDate?: string;
      }[];
      weeklySchedule?: { cutOffTime?: string; dayOfWeekEnum?: string[] }[];
    };
  };
}

export interface UpdateInventoryLocationPath {
  merchantLocationKey: string;
}

export const updateInventoryLocation = async (
  { merchantLocationKey }: UpdateInventoryLocationPath,
  body: UpdateInventoryLocationBody,
): Promise<void> => {
  return await httpClient.request(
    `location/${merchantLocationKey}/update_location_details`,
    { body, method: "post" },
  );
};
