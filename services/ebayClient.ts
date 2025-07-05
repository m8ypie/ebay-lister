import eBayApi from "ebay-api";
import runtimeConfig from "@ebay/config";
import { Card } from "./scryfall.ts";
import {
  EbayOfferDetailsWithId,
  EbayOfferDetailsWithKeys,
  InventoryItem,
} from "ebay-api/lib/types";
import EbayAuthToken from "ebay-oauth-nodejs-client";
import authClient from "./authClient.ts";
import ky, { HTTPError } from "ky";

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

// ebayAuthToken.

const eBayClient = await authClient({
  baseUrl: "https://api.ebay.com/sell/inventory/v1/",
  headers: {
    "Content-Type": "application/json",
    "Content-Language": "en-AU",
    "Accept-Language": "en-AU",
  },
  auth: {
    tokenResolver: async (_) => {
      const { access_token } = JSON.parse(
        await ebayAuthToken.getAccessToken(
          "PRODUCTION",
          runtimeConfig.EBAY_REFRESH_TOKEN,
          scopes,
        ),
      ) as { access_token: string };
      console.log(
        "herere",
        access_token,
      );
      return access_token;
    },
    header: "Authorization",
    valueGenerator: (token: string) => `Bearer ${token}`,
  },
});

const createOrReplaceInventoryItem = async (
  sku: string,
  inventoryItem: InventoryItem,
) => {
  await eBayClient.put(`inventory_item/${sku}`, { json: inventoryItem });
};

// const eBayClient = new eBayApi({
//   appId: runtimeConfig.EBAY_APP_ID,
//   certId: runtimeConfig.EBAY_CERT_ID,
//   devId: runtimeConfig.EBAY_DEV_ID,
//   authToken: token.access_token,
//   sandbox: false,
//   siteId: eBayApi.SiteId.EBAY_AU,
//   marketplaceId: eBayApi.MarketplaceId.EBAY_AU,
//   contentLanguage: eBayApi.ContentLanguage.en_AU,
//   //   scope: [
//   //     "https://api.ebay.com/oauth/api_scope",
//   //     "https://api.ebay.com/oauth/api_scope/sell.marketing.readonly",
//   //     "https://api.ebay.com/oauth/api_scope/sell.marketing",
//   //     "https://api.ebay.com/oauth/api_scope/sell.inventory.readonly",
//   //     "https://api.ebay.com/oauth/api_scope/sell.inventory",
//   //     "https://api.ebay.com/oauth/api_scope/sell.account",
//   //     "https://api.ebay.com/oauth/api_scope/sell.account.readonly",
//   //     "https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly",
//   //     "https://api.ebay.com/oauth/api_scope/sell.fulfillment",
//   //     "https://api.ebay.com/oauth/api_scope/sell.analytics.readonly",
//   //     "https://api.ebay.com/oauth/api_scope/sell.finances",
//   //     "https://api.ebay.com/oauth/api_scope/sell.payment.dispute",
//   //   ],
// });

// eBayClient.auth.oAuth2.setScope([
//   "https://api.ebay.com/oauth/api_scope",
//   "https://api.ebay.com/oauth/api_scope/sell.marketing.readonly",
//   "https://api.ebay.com/oauth/api_scope/sell.marketing",
//   "https://api.ebay.com/oauth/api_scope/sell.inventory.readonly",
//   "https://api.ebay.com/oauth/api_scope/sell.inventory",
//   "https://api.ebay.com/oauth/api_scope/sell.account",
//   "https://api.ebay.com/oauth/api_scope/sell.account.readonly",
//   "https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly",
//   "https://api.ebay.com/oauth/api_scope/sell.fulfillment",
//   "https://api.ebay.com/oauth/api_scope/sell.analytics.readonly",
//   "https://api.ebay.com/oauth/api_scope/sell.finances",
//   "https://api.ebay.com/oauth/api_scope/sell.payment.dispute",
// ]);
// try {
//   console.log(
//     "he",
//     runtimeConfig.EBAY_APP_ID,
//     runtimeConfig.EBAY_CERT_ID,
//     runtimeConfig.EBAY_DEV_ID,
//   );
//   await eBayClient.auth.OAuth2.setClientToken(token);
// } catch (err) {
//   console.log("here", err);
// }

const printErrorIfHttp = async (err: any) => {
  if (err instanceof HTTPError == true) {
    console.log(await (err as HTTPError).response.json());
  }
};

type CreateListingRes = { listingSku: string };
const createListing = async (card: Card): Promise<CreateListingRes> => {
  try {
    //todo override this so its not shit
    const listingRes = await createOrReplaceInventoryItem(
      card.id,
      card.toEbayListingItem(),
    );
    console.log(JSON.stringify(listingRes, null, 2));
    return { listingSku: card.id };
  } catch (err) {
    await printErrorIfHttp(err);
    console.error("create listing failed", err);
    throw err;
  }
};
type CreateOfferRes = { offerId: string; offer: EbayOfferDetailsWithId };
const createOffer = async (
  card: Card,
  listingRes: CreateListingRes,
): Promise<CreateOfferRes> => {
  try {
    const { offerId } = await eBayClient.post<{ offerId: string }>(`offer`, {
      json: card.toEbayOffer(),
    }).json();
    offerId;
    console.log(JSON.stringify(offerId, null, 2));
    const offer = await eBayClient.get<EbayOfferDetailsWithId>(
      `offer/${offerId}`,
    ).json();
    return { offer, offerId };
  } catch (err) {
    await printErrorIfHttp(err);
    console.error("create offer failed", err);
    await revertListingAttempt(listingRes);
    throw err;
  }
};

const revertListingAttempt = async (
  listingRes?: CreateListingRes,
  offerRes?: CreateOfferRes,
): Promise<void> => {
  if (offerRes) {
    try {
      await eBayClient.delete<void>(
        `offer/${offerRes.offerId}`,
      );
      console.log(`Deleted failed offer ID: ${offerRes.offerId}`);
    } catch (deleteError) {
      await printErrorIfHttp(deleteError);
      console.error(
        `Failed to delete offer ID: ${offerRes.offerId}`,
        deleteError,
      );
    }
  }

  if (listingRes) {
    try {
      await eBayClient.delete(`inventory_item/${listingRes.listingSku}`);
      console.log(`Deleted failed listing SKU: ${listingRes.listingSku}`);
    } catch (deleteError) {
      await printErrorIfHttp(deleteError);
      console.error(
        `Failed to delete listing SKU: ${listingRes.listingSku}`,
        deleteError,
      );
    }
  }
};

type PublishOfferRes = { listingId: string };

const publishOffer = async (
  listingRes: CreateListingRes,
  offerRes: CreateOfferRes,
): Promise<PublishOfferRes> => {
  try {
    await eBayClient.put<{ offerId: string }>(`offer/${offerRes.offerId}`, {
      json: {
        ...offerRes.offer,
        listingPolicies: {
          ...offerRes.offer.listingPolicies,
          returnPolicyId: "246986707013",
          fulfillmentPolicyId: "247005531013",
        },
      },
    }).json();
    const publishRes = await eBayClient.post<{ listingId: string }>(
      `offer/${offerRes.offerId}/publish`,
      {
        json: {
          ...offerRes.offer,
          listingPolicies: {
            ...offerRes.offer.listingPolicies,
            returnPolicyId: "246986707013",
            fulfillmentPolicyId: "247005531013",
          },
        },
      },
    ).json();
    return publishRes;
  } catch (err) {
    await printErrorIfHttp(err);
    console.error("publish offer failed", err);
    await revertListingAttempt(listingRes, offerRes);
    throw err;
  }
};

const createListingNote = (
  card: Card,
  offerRes: CreateOfferRes,
  publishOfferRes: PublishOfferRes,
) => {
  return `sku: ${card.id}
      offerId: ${offerRes.offerId}
      listingId: ${publishOfferRes.listingId}`;
};

export type SuccessfulList = {
  success: true;
  card: Card;
  offerRes: CreateOfferRes;
  publishOfferRes: PublishOfferRes;
  listingNote: string;
};
export type ListError = { success: false; message: string };
export type ListResult =
  | SuccessfulList
  | ListError;
export const listItem = async (card: Card): Promise<ListResult> => {
  try {
    const listingRes = await createListing(card);

    const offerRes = await createOffer(card, listingRes);

    const publishOfferRes = await publishOffer(listingRes, offerRes);
    return {
      success: true,
      card,
      offerRes,
      publishOfferRes,
      listingNote: createListingNote(card, offerRes, publishOfferRes),
    };
  } catch (err) {
    console.error("list item failed", err);
    return { success: false, message: "list item failed" };
  }
};
