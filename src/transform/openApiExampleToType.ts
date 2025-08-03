import { TypeScriptTargetLanguage } from "quicktype-core";
import { ProjectInfo } from "./resolver/projectInfo.ts";
import {
  InterfaceResolver,
  JsonPayloadResolver,
  PropertyResolver,
} from "./resolver/mod.ts";

const t = new TypeScriptTargetLanguage();

export const extractTypeFromExample = (
  jsonStr: string,
  pathStr: string,
): {
  getBodyTransformProperty: () => {
    typeName: string;
    name: string;
    isOptional: boolean;
  }[];
  getJson: () => any;
  getQuickTypeStr: () => string;
} => {
  const projectInfo = new ProjectInfo(jsonStr);
  const propertyResolver = new PropertyResolver(projectInfo);
  const interfaceResolver = new InterfaceResolver(propertyResolver);

  const jsonPayloadResolver = new JsonPayloadResolver(interfaceResolver);
  if (pathStr === "/api/lists/get/") {
    console.log("yayayaya");
    Deno.writeTextFileSync("export2.txt", projectInfo.exportedTypesStr);
  }
  console.log(pathStr);
  jsonPayloadResolver.generateTypes();
  projectInfo.printCachedNodes();
  if (pathStr.includes("/api/lists/get/")) {
    Deno.writeTextFileSync(
      "testStr.ts",
      `export const testStr = \`${jsonStr}\``,
    );
    Deno.writeTextFileSync("cacheNode2.txt", projectInfo.cacheNodeStr);
    Deno.writeTextFileSync("export2.txt", projectInfo.exportedTypesStr);
  }

  const getBodyTransformProperty = () =>
    jsonPayloadResolver.getJsonPayloadTransformProperty();
  const getJson = () => jsonPayloadResolver.getJsonPayloadStr();
  const getQuickTypeStr = () => {
    return projectInfo.exportedTypesStr;
  };
  return { getBodyTransformProperty, getJson, getQuickTypeStr };
};
