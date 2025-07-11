#!/usr/bin/env -S deno run -A --env-file
import "jsr:@std/dotenv/load";
import { readAll } from "@std/io/read-all";
import { ebayClient, echoMtgClient, scryClient } from "@ebay/services";
type CronicleInput = {
  id: string;
  hostname: string;
  command: string;
  event: string;
  now: number;
  log_file: string;
  params: {
    myparam1: string;
    myparam2: string;
  };
};

type CronicleOutput = {
  complete: number;
  code: number;
};

try {
  const stdin = new TextDecoder().decode(await readAll(Deno.stdin));

  console.log("Cronicle input:", stdin);

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
  const encoder = new TextEncoder();
  const data = encoder.encode(`{ "complete": 1, "code": 0 }\n`);
  await Deno.stdout.write(data); // 11
} catch (err) {
  console.error("Error during listing process:", err);

  const encoder = new TextEncoder();
  const data = encoder.encode(`{ "complete": 0, "code": 1 }\n`);
  await Deno.stdout.write(data); // 11
} finally {
  Deno.exit(0);
}
