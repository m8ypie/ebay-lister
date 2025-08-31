import { ApiClient } from "@m8ypie/open-api-http-client-generator";
const apiClient = await ApiClient.generateFrom({
  apiName: "inventoryApiClient",
  clientFilePath: "src/services/ebay/generatedClient/",
  url:
    "https://developer.ebay.com/api-docs/master/sell/inventory/openapi/3/sell_inventory_v1_oas3.json",
});
apiClient.writeApiClient();
