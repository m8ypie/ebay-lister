import { ebayClient, echoMtgClient, scryClient } from "@ebay/services";

const updateEchoMtgWithSuccess = async (
  inv: echoMtgClient.CardItem,
  listResult: ebayClient.SuccessfulList,
) => {
  try {
    await echoMtgClient.updateInventoryItemTradability(inv, false);
    await echoMtgClient.addInventoryNote(
      inv,
      listResult.listingNote,
    );
  } catch (err) {
    console.error(
      "failed to update echo mtg with successful listing, data out of sync",
      err,
    );
  }
};
for (const inv of await echoMtgClient.getInventoryToSell()) {
  try {
    const card = await scryClient.getScryCard(inv);
    const listResult = await ebayClient.listItem(card);
    if (listResult.success) {
      updateEchoMtgWithSuccess(inv, listResult);
    }
  } catch (err) {
    console.error(
      `Failed to list item ${inv.emid}`,
      err,
    );
  }
}
