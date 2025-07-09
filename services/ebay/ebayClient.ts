import { HTTPError } from "ky";
import {
  createOffer,
  createOrReplaceInventoryItem,
  deleteInventoryItem,
  deleteOffer,
  getOffer,
  GetOfferResponse,
  publishOffer,
  updateOffer,
} from "./ebayHttpClient.ts";
import { Card } from "../scryfall.ts";
import "./ebayClientInit.ts";

const printErrorIfHttp = async (err: any) => {
  if (err instanceof HTTPError == true) {
    console.log(await (err as HTTPError).response.json());
  }
};

type CreateListingRes = { listingSku: string };
const createListing = async (card: Card): Promise<CreateListingRes> => {
  try {
    //todo override this so its not shit
    await createOrReplaceInventoryItem(
      { sku: card.id },
      card.toEbayListingItem(),
    );
    return { listingSku: card.id };
  } catch (err) {
    await printErrorIfHttp(err);
    throw err;
  }
};
type CreateOfferRes = { offerId: string; offer: GetOfferResponse };
const createAndReturnOffer = async (
  card: Card,
  listingRes: CreateListingRes,
): Promise<CreateOfferRes> => {
  try {
    const { offerId } = await createOffer(card.toEbayOffer());
    const offer = await getOffer({ offerId: offerId!! });
    return { offer, offerId: offerId!! };
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
      deleteOffer({ offerId: offerRes.offerId });
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
      await deleteInventoryItem({ sku: listingRes.listingSku });
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

const updateAndPublishOffer = async (
  listingRes: CreateListingRes,
  offerRes: CreateOfferRes,
): Promise<PublishOfferRes> => {
  try {
    await updateOffer({ offerId: offerRes.offerId }, {
      ...offerRes.offer,
      listingPolicies: {
        ...offerRes.offer.listingPolicies,
        returnPolicyId: "246986707013",
        fulfillmentPolicyId: "247005531013",
      },
    });
    const publishRes = await publishOffer({
      offerId: offerRes.offerId,
    });

    return { listingId: publishRes.listingId!! };
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

    const offerRes = await createAndReturnOffer(card, listingRes);

    const publishOfferRes = await updateAndPublishOffer(listingRes, offerRes);
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
