import { extractTypeFromExample } from "./src/transform/openApiExampleToType.ts";
import { testStr } from "./testStr.ts";

const test = {
  "status": "success",
  "message": "1 Snapcaster Mage added to inventory binder.",
  "inventory_id": 46653735,
  "card": {
    "id": "92175",
    "tcgplayer_id": "52206",
    "multiverseid": "227676",
    "set_number": "78",
    "card_name": "Snapcaster Mage",
    "expansion": "Innistrad",
    "set_code": "ISD",
    "rarity": "Rare",
    "mana_cost": "{{1}}{{u}}",
    "cmc": "2",
    "p_t": "2 / 1",
    "types": "Creature - Human Wizard",
    "main_type": "Creature - Human Wizard",
    "sub_type": "",
    "rating": "4.265",
    "votes": "358",
    "card_text":
      "<p>Flash</p><p>When Snapcaster Mage enters the battlefield, target instant or sorcery card in your graveyard gains flashback until end of turn. The flashback cost is equal to its mana cost. <i>(You may cast that card from your graveyard for its flashback cost. Then exile it.)</i></p>",
    "attributes": "flash,flash",
    "flavor_text": null,
    "power": "2",
    "toughness": "1",
    "artist": "Volkan Baga",
    "all_sets": null,
    "community_rating": "Community Rating: 4.265 / 5&nbsp;&nbsp;(358 votes)",
    "type": "Creature",
    "main_colors": "Blue",
    "abilities_colors": "",
    "crawlurl":
      "http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=227676",
    "watermark": null,
    "loyalty": null,
    "other_sets": null,
    "card_number": "78",
    "has_image": "1",
    "flip": "0",
    "reserve_list": "0",
    "sealed": "0",
    "card_id": "92175",
    "tcg_low": "17.74",
    "tcg_mid": "24.97",
    "tcg_market": "20.28",
    "tcg_high": "24.97",
    "foil_price": "101.37",
    "last_updated": "2022-10-27 14:22:37",
    "change": "2.00",
    "change_1d": "0.00",
    "foil_change": "0.00",
    "purchase_link_tcg":
      "https://shop.tcgplayer.com/magic/product/show?advancedSearch=true&ProductName=Snapcaster+Mage&partner=ECHOMAGE&utm_campaign=affiliate&utm_medium=echomtg-com&utm_source=ECHOMAGE",
    "ck_price": null,
    "ck_buy": null,
    "ck_qty_buying": null,
    "ck_foil_price": null,
    "ck_foil_buy": null,
    "ck_foil_qty_buying": null,
  },
};
const testJsonOutputFile = "./temp/json.ts";
const testQuickOutputFile = "./temp/quick.ts";

const typeBuilder = extractTypeFromExample(testStr, "");
const js = typeBuilder.getJson();
Deno.writeTextFileSync(
  testJsonOutputFile,
  `type re = ${js}`,
);

Deno.writeTextFileSync(
  testQuickOutputFile,
  typeBuilder.getQuickTypeStr(),
);

// JSON.parse(js);
