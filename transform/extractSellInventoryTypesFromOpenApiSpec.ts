import fs from "node:fs";
import { camelCase, pascalCase } from "https://deno.land/x/case/mod.ts";
import openapiTS, { astToString } from "openapi-typescript";
import { Project, Symbol, ts, Type } from "ts-morph";

const project = new Project();

const ast = await openapiTS(
  new URL(
    "https://developer.ebay.com/api-docs/master/sell/inventory/openapi/3/sell_inventory_v1_oas3.json",
  ),
);
const contents = astToString(ast);

// (optional) write to file
fs.writeFileSync("./my-schema.ts", contents);

const file = project.createSourceFile("temp.ts", contents);
// const newFile = project.addSourceFileAtPath("../services/ebay/sellTypes.ts");
const offerCreateBody = file.getInterface("components")?.getProperty("schemas")
  ?.getType()
  .getProperty("EbayOfferDetailsWithKeys")?.getValueDeclaration()?.getType()
  .getText();

const typeWithNewDef = [
  {
    name: "CreateOffer",
    path: "/offer",
    method: "POST",
  },
  {
    name: "PublishOffer",
    path: "/offer/{offerId}/publish",
    method: "POST",
  },
  {
    name: "GetOffer",
    path: "/offer/{offerId}",
    method: "GET",
  },
  {
    name: "UpdateOffer",
    path: "/offer/{offerId}",
    method: "PUT",
  },
  {
    name: "CreateOrReplaceInventoryItem",
    path: "/inventory_item/{sku}",
    method: "PUT",
  },
  {
    name: "GetInventoryItem",
    path: "/inventory_item/{sku}",
    method: "PUT",
  },
  {
    name: "DeleteInventoryItem",
    path: "/inventory_item/{sku}",
    method: "DELETE",
  },
  {
    name: "DeleteOffer",
    path: "/offer/{offerId}",
    method: "DELETE",
  },
];

const schemaObj = file.getInterface("paths")!!.getType(); //.getProperty("schemas")
// ?.getType();
const flag = `/***************BEGIN GENERATED CODE*************/`;
const tunnel = (
  s: Type<ts.Type> | undefined,
  field: string,
): Type<ts.Type> | undefined =>
  s?.getProperty(field)?.getValueDeclaration()?.getType();

const getTextOrUnknown = (s?: Type<ts.Type>): string =>
  s?.getText() || "unknown";

const maintainedCode =
  (await Deno.readTextFile("./services/ebay/ebayHttpClient.ts")).split(
    flag,
  )[0] +
  "\n" + flag + "\n";
const api = project.createSourceFile(
  "./services/ebay/ebayHttpClient.ts",
  (writer) => {
    writer.write(maintainedCode);
    typeWithNewDef.forEach(({ name, path, method }) => {
      const camel = camelCase(name);
      const pascal = pascalCase(name);
      // const methodName = method.charAt(0).toUpperCase() + method.slice(1);
      try {
        const prop = tunnel(schemaObj, path);
        const requestInfo = tunnel(prop, method.toLocaleLowerCase());
        const bodyType = tunnel(
          tunnel(tunnel(requestInfo, "requestBody"), "content"),
          "application/json",
        )?.getText();
        const responseBody = getTextOrUnknown(
          tunnel(requestInfo, "responses")?.getProperties().map((it) =>
            tunnel(it.getValueDeclaration()?.getType(), "content")
          )
            .map((it) => tunnel(it, "application/json"))
            .find((it) => !!it),
        );

        const pathParams = getTextOrUnknown(
          tunnel(tunnel(requestInfo, "parameters"), "path"),
        );
        const values = tunnel(tunnel(requestInfo, "parameters"), "path")
          ?.getProperties().map(
            (p) => p.getName(),
          ).join(",");
        const pathValues = values?.length
          ? "{" +
            tunnel(tunnel(requestInfo, "parameters"), "path")?.getProperties()
              .map(
                (p) => p.getName(),
              ).join(",") +
            "}"
          : "unknown";
        const stringTempate = "`" + path.split("{").join("${").slice(1) + "`";
        const nullTypes = ["undefined", "unknown"];
        const bodyExists = !nullTypes.includes(bodyType || "unknown");
        const pathValuesExists = !nullTypes.includes(pathValues || "unknown");
        if (bodyExists) {
          writer.write(
            `export type ${pascal}Body = ${bodyType}\n`,
          );
        }
        if (pathValuesExists) {
          writer.write(
            `export type ${pascal}PathParams = ${pathParams}\n`,
          );
        }
        writer.write(
          `
        export type ${pascal}Response = ${responseBody}
        export const ${camel} = async(${
            pathValuesExists ? `${pathValues}: ${pascal}PathParams,` : ""
          }${
            bodyExists ? `body:${pascal}Body` : ""
          } ):Promise<${pascal}Response> => {
          return await eBayClient.${camelCase(method)}(${stringTempate}${
            bodyExists ? `, {json:body}` : ""
          }).json()
        }

        `,
        );
      } catch (err) {
        console.log(err);
      }
    });
  },
  { overwrite: true },
);
api.saveSync();
