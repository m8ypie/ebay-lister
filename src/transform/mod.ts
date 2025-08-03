import { ApiClient } from "@m8ypie/open-api-http-client-generator";
import { camelCase } from "x/case";
import { extractTypeFromExample } from "./openApiExampleToType.ts";
import path from "node:path";

const apiClient = await ApiClient.generateFrom({
  apiName: "echo",
  clientFilePath: "temp/",
  filePath: "./openapi.json",
  transformerOptions: {
    methodNameExtractor: ({ methodJson, inUseMethodsNames }) => {
      const colonSplitMethod = methodJson.summary.includes(":") &&
          methodJson.summary.split(" ").length - 1 > 1
        ? methodJson.summary.split(":")[1]
        : methodJson.summary;

      const entireDescFallback = methodJson.summary.replace(":", "");

      const relevantName = inUseMethodsNames.includes(colonSplitMethod)
        ? colonSplitMethod
        : entireDescFallback;
      return camelCase(relevantName);
    },
    requestBodyTransform: ({ methodJson, pathStr }) => {
      const content = methodJson.requestBody.content;
      const responseType = content["application/json"] || content["*/*"];
      return extractTypeFromExample(
        JSON.stringify(
          responseType?.schema?.example || {},
        ),
        pathStr,
      ).getBodyTransformProperty();
    },
    responseBodyTransform: ({ methodJson, pathStr }) => {
      console.log(pathStr);
      return extractTypeFromExample(
        JSON.stringify(
          methodJson.responses["200"]?.content["application/json"]?.example ||
            {},
        ),
        pathStr,
      ).getBodyTransformProperty();
    },
  },
});
console.log("2");
apiClient.writeApiClient();
console.log("3");

// const apiClient2 = await ApiClient.generateFrom({
//   apiName: "buyDeal",
//   clientFilePath: "temp/",
//   url:
//     "https://developer.ebay.com/api-docs/master/buy/deal/openapi/3/buy_deal_v1_oas3.json",
// });
// apiClient2.writeApiClient();
