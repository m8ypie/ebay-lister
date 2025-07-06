import { camelCase, pascalCase } from "https://deno.land/x/case/mod.ts";
import fs from "node:fs";
import openapiTS, { astToString } from "openapi-typescript";
import { Project, ts, Type } from "ts-morph";

import { TextWriter } from "@yellicode/core";
import { Generator, OutputMode } from "@yellicode/templating";
import {
  FunctionDefinition,
  InterfaceDefinition,
  ParameterDefinition,
  TypeScriptWriter,
} from "@yellicode/typescript";
import { TsConfigResolver } from "jsr:@ts-morph/common@0.27";

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
): Type<ts.Type> | undefined => {
  const fields = field.split(".").reverse();
  const currentField = fields.pop();
  const newFields = fields.reverse().join(".");
  console.log(fields, field);

  const newType = s?.getProperty(currentField!!)?.getValueDeclaration()
    ?.getType();

  console.log("currentField", currentField, !!newType!!, newFields);

  if (newFields.length) {
    return tunnel(newType, newFields);
  }
  return newType;
};

class ApiMethod {
  private body: Body;
  private response: Response;
  private path: Path;
  constructor(
    private pathStr: string,
    private methodName: string,
    private requestInfo: Type<ts.Type>,
    private apiMethod: string,
  ) {
    console.log("???????");
    const requestBodyType = tunnel(
      requestInfo,
      "requestBody.content.application/json",
    );
    console.log(!!requestBodyType);
    const responseBodyType = tunnel(
      requestInfo,
      "responses",
    )?.getProperties().map((prop) =>
      tunnel(prop.getValueDeclaration()?.getType(), "content.application/json")
    ).find((t) => !!t);

    const pathType = tunnel(requestInfo, "parameters.path");
    console.log(
      "hererererere",
      !!requestBodyType,
      !!responseBodyType,
      !!pathType,
    );
    this.response = new Response(methodName, responseBodyType);

    this.path = new Path(pathStr, methodName, pathType);

    this.body = new Body(methodName, requestBodyType);
  }

  public write(tw: TypeScriptWriter) {
    this.body.write(tw);
    tw.writeLine();
    this.path.write(tw);
    tw.writeLine();
    this.response.write(tw);
    tw.writeLine();
    this.writeFunction(tw);
  }

  private writeFunction(tw: TypeScriptWriter) {
    const parameters: ParameterDefinition[] = [
      ...this.path.getParameterDefMap(() => this.path.unrolledValue),
      ...this.body.getParameterDefMap(() => "body"),
    ];
    const functionDef: FunctionDefinition = {
      name: "",
      isAsync: false,
      returnTypeName:
        (this.response.exists
          ? this.response.getTypeNameWrappedWithArg("Promise")
          : "Promise<void>") +
        "=>",
      parameters,
    };

    tw.writeConstDeclaration({
      name: camelCase(this.methodName),
      export: true,
      typeName: "",
      initializer: (w) => {
        w.write("async ").writeFunctionBlock(functionDef, (fw) => {
          const args = [
            this.body.exists && "body",
            `method: "${this.apiMethod.toLocaleLowerCase()}"`,
          ].filter((t) => t);
          fw.write(
            `return await httpClient.request(${this.path.stringTemplatePath},${`{${
              args.join(",")
            }}`})`,
          );
        });
      },
    });
    // tw.writeConstDeclaration(functionDef, (w) => {
    //   w.(
    //     `return await eBayClient.${this.apiMethod.toLocaleLowerCase()}(${this.path.stringTemplatePath}${
    //       this.body.exists ? `, {json:body}` : ""
    //     }).json()`,
    //   );
    // });
  }
}

class ElementWithType {
  protected yelliType?: InterfaceDefinition;

  constructor(private name: string, private type?: Type<ts.Type>) {
    this.yelliType = type && {
      name: `${name}`,
      export: true,
      properties: type!!.getProperties()!!.map((prop) => ({
        typeName: prop.getValueDeclaration()!!.getType().getText(),
        name: prop.getName(),
        isOptional: prop.isOptional(),
      })),
    };
  }

  getParameterDef(name: () => string): ParameterDefinition | undefined {
    if (!this.exists) {
      return undefined;
    }
    return { name: name(), typeName: this.yelliType!!.name!! };
  }

  getParameterDefMap(name: () => string): ParameterDefinition[] {
    const def = this.getParameterDef(name);
    return def ? [def] : [];
  }

  protected _exists(): boolean {
    return !!this.yelliType;
  }

  get exists(): boolean {
    return this._exists();
  }

  protected throwIfDoesntExist() {
    if (!this.exists) {
      throw new Error("type does not exist");
    }
  }

  getTypeNameWrappedWithArg(typeArgName: string): string {
    return `${typeArgName}<${this.typeName}>`;
  }

  get typeName(): string {
    this.throwIfDoesntExist();
    return this.yelliType?.name!!;
  }

  public write(tw: TypeScriptWriter) {
    console.log("hererere");
    if (!this.exists) {
      console.log("not writing", this.name);
      return;
    }
    console.log("riting", this.name);
    tw.writeInterfaceBlock(this.yelliType!!, (w) => {
      this.yelliType!!.properties?.forEach((prop) => {
        w.writeProperty(prop);
        w.writeLine();
      });
    });
  }
}

class Response extends ElementWithType {
  constructor(
    private apiMethodName: string,
    private responseType?: Type<ts.Type>,
  ) {
    super(pascalCase(`${apiMethodName}Response`), responseType);
  }
}

class Body extends ElementWithType {
  constructor(
    private apiMethodName: string,
    private bodyType?: Type<ts.Type>,
  ) {
    super(pascalCase(`${apiMethodName}Body`), bodyType);
  }
}

class Path extends ElementWithType {
  constructor(
    private path: string,
    private apiMethodName: string,
    private pathType?: Type<ts.Type>,
  ) {
    super(pascalCase(`${apiMethodName}Path`), pathType);
  }

  override _exists(): boolean {
    return !!this.pathType?.getProperties().length;
  }

  get stringTemplatePath(): string {
    return "`" + this.path.split("{").join("${").slice(1) + "`";
  }

  get unrolledValue(): string {
    this.throwIfDoesntExist();
    return `{${
      this.pathType!!.getProperties()
        .map(
          (p) => p.getName(),
        ).join(",")
    }}`;
  }
}

const yelliCodeApiMethods = typeWithNewDef.flatMap(({ name, path, method }) => {
  const requestInfo = tunnel(
    schemaObj,
    `${path}.${method.toLocaleLowerCase()}`,
  );
  console.log(
    "requestInfo",
    `${path}.${method.toLocaleLowerCase()}`,
    !!requestInfo,
  );
  if (!requestInfo) {
    return [];
  }
  try {
    return [new ApiMethod(path, name, requestInfo, method)];
  } catch (err) {
    console.log(err);
    return [];
  }
});

Generator.generate(
  {
    outputFile: "./services/ebay/ebayHttpClient.ts",
    outputMode: OutputMode.Overwrite,
  },
  (output: TextWriter) => {
    const ts = new TypeScriptWriter(output);
    ts.writeFile("./transform/apiClientTemplate.ts");
    yelliCodeApiMethods.forEach((yell) => yell.write(ts));
  },
);

// const apiClientConfig = typeWithNewDef.flatMap(({ name, path, method }) => {
//   // const methodName = method.charAt(0).toUpperCase() + method.slice(1);
//   try {
//     const prop = tunnel(schemaObj, path);
//     const requestInfo = tunnel(prop, method.toLocaleLowerCase());
//     const bodyType2 = tunnel(
//       tunnel(tunnel(requestInfo, "requestBody"), "content"),
//       "application/json",
//     );
//     const bodyType = bodyType2?.getText();
//     const responseBody = getTextOrUnknown(
//       tunnel(requestInfo, "responses")?.getProperties().map((it) =>
//         tunnel(it.getValueDeclaration()?.getType(), "content")
//       )
//         .map((it) => tunnel(it, "application/json"))
//         .find((it) => !!it),
//     );

//     const pathParams = getTextOrUnknown(
//       tunnel(tunnel(requestInfo, "parameters"), "path"),
//     );
//     const values = tunnel(tunnel(requestInfo, "parameters"), "path")
//       ?.getProperties().map(
//         (p) => p.getName(),
//       ).join(",");
//     const pathValues = values?.length
//       ? "{" +
//         tunnel(tunnel(requestInfo, "parameters"), "path")?.getProperties()
//           .map(
//             (p) => p.getName(),
//           ).join(",") +
//         "}"
//       : "unknown";
//     const stringTempate = "`" + path.split("{").join("${").slice(1) + "`";
//     const nullTypes = ["undefined", "unknown"];
//     const bodyExists = !nullTypes.includes(bodyType || "unknown");
//     const pathValuesExists = !nullTypes.includes(pathValues || "unknown");
//     return [{
//       stringTempate,
//       bodyExists,
//       pathValuesExists,
//       responseBody,
//       pathParams,
//       pathValues,
//       name,
//       bodyType,
//       method,
//       bodyType2,
//     }];
//   } catch (err) {
//     console.log(err);
//   }
//   return [];
// });

// const r = apiClientConfig.filter((t) => t.bodyExists);
// Generator.generate(
//   { outputFile: "./custom-sample.ts" },
//   (output: TextWriter) => {
//     const ts = new TypeScriptWriter(output);
//     r.forEach(
//       (
//         {
//           bodyExists,
//           responseBody,
//           name,
//           pathParams,
//           pathValues,
//           pathValuesExists,
//           bodyType,
//           method,
//           stringTempate,
//           bodyType2,
//         },
//       ) => {
//         const camel = camelCase(name);
//         const pascal = pascalCase(name);

//         const func: FunctionDefinition = {
//           name: camel,
//           isAsync: true,
//           parameters: [],
//         };
//         if (bodyExists) {
//           const bodyType: InterfaceDefinition = {
//             name: `${pascal}Body`,
//             export: true,
//             properties: bodyType2!!.getProperties()!!.map((prop) => ({
//               typeName: prop.getValueDeclaration()!!.getType().getText(),
//               name: prop.getName(),
//               isOptional: prop.isOptional(),
//             })),
//           };
//           const bodyDef: {
//             bodyType: InterfaceDefinition;
//             argName: string;
//             getParamDef: () => ParameterDefinition[];
//           } = {
//             bodyType,
//             argName: "body",
//             getParamDef: () => {
//               if (!bodyExists) {
//                 return [];
//               }
//               return [{
//                 typeName: bodyType.name,
//                 name: "body",
//                 isOptional: false,
//               }];
//             },
//           };
//           ts.writeInterfaceBlock(bodyDef.bodyType, (w) => {
//             bodyDef.bodyType.properties?.forEach((prop) => {
//               w.writeProperty(prop);
//               w.writeLine();
//             });
//           });
//           ts.writeLine();
//           // console.log(ts.)
//         }
//       },
//     );
//   },
// );
// const api = project.createSourceFile(
//   "./services/ebay/ebayHttpClient.ts",
//   (writer) => {
//     writer.write(maintainedCode);
//     apiClientConfig.forEach(
//       (
//         {
//           bodyExists,
//           responseBody,
//           name,
//           pathParams,
//           pathValues,
//           pathValuesExists,
//           bodyType,
//           method,
//           stringTempate,
//         },
//       ) => {
//         const camel = camelCase(name);
//         const pascal = pascalCase(name);
//         if (bodyExists) {
//           writer.write(
//             `export type ${pascal}Body = ${bodyType}\n`,
//           );
//         }
//         if (pathValuesExists) {
//           writer.write(
//             `export type ${pascal}PathParams = ${pathParams}\n`,
//           );
//         }
//         writer.write(
//           `
//         export type ${pascal}Response = ${responseBody}
//         export const ${camel} = async(${
//             pathValuesExists ? `${pathValues}: ${pascal}PathParams,` : ""
//           }${
//             bodyExists ? `body:${pascal}Body` : ""
//           } ):Promise<${pascal}Response> => {
//           return await eBayClient.${camelCase(method)}(${stringTempate}${
//             bodyExists ? `, {json:body}` : ""
//           }).json()
//         }

//         `,
//         );
//       },
//     );
//   },
//   { overwrite: true },
// );
// api.saveSync();
