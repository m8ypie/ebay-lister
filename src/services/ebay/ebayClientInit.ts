import runtimeConfig from "../../config.ts";
import EbayAuthToken from "ebay-oauth-nodejs-client";
import { KyInstance } from "ky";
import authClient from "../authClient.ts";
import { initApiClient } from "./generatedClient/inventoryApiClient.ts";

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

initApiClient({
  request: (path: string, options) => {
    return eBayClient(path, {
      ...(options.body ? { json: options.body } : {}),
      method: options.method,
    }).json();
  },
});
