import {
  InterfaceDeclaration,
  Node,
  Project,
  SourceFile,
  ts,
  Type,
} from "ts-morph";

import { quicktypeJSON } from "../quickTypeJsonGenerator.ts";

const sourceFileName = "temp.ts";
const topLevelName = "TopLevelType";

type ResolvedType = {};

export type BaseTypeResolutionResult = {
  resolvedType: string;
  node: Node<ts.Node>;
  type: Type<ts.Type>;
};

export class ProjectInfo {
  public source: SourceFile;
  public rootExport: InterfaceDeclaration;
  private typeExportsWithoutRoot: InterfaceDeclaration[];
  private nodeMap: Map<Node<ts.Node>, BaseTypeResolutionResult>;
  public exportedTypesStr: string;
  public project: Project;

  constructor(jsonStr: string) {
    const typeBuilder = quicktypeJSON(
      "typescript",
      topLevelName,
      jsonStr,
      {
        "just-types": true,
        "nice-property-names": false,
        nicePropertyNames: false,
      },
    );

    this.project = new Project();

    const [, type] = typeBuilder.entries().next().value!;

    this.exportedTypesStr = type.lines.join("\n");
    this.source = this.project.createSourceFile(
      sourceFileName,
      type.lines.join("\n"),
      {
        overwrite: true,
      },
    );
    this.rootExport = this.source.getInterfaceOrThrow(topLevelName);
    this.typeExportsWithoutRoot = this.source.getInterfaces().filter((inter) =>
      inter !== this.rootExport
    );

    this.nodeMap = new Map<Node<ts.Node>, BaseTypeResolutionResult>();
  }

  public cacheHappyResult(propResolved: BaseTypeResolutionResult) {
    if (!this.nodeMap.has(propResolved.node)) {
      const type = propResolved.node.getType();
      // if (propResolved.node.isKind(ts.SyntaxKind.TypeReference)) {
      //   // console.log("happpy boi", propResolved.resolvedType);
      //   return;
      // }
      const resolutionResult = {
        type,
        resolvedType: propResolved.resolvedType,
        node: propResolved.node,
      };
      this.nodeMap.set(propResolved.node, resolutionResult);
    }
  }

  public typeConveredByCache(
    node: Node<ts.Node>,
    type?: Type<ts.Type>,
  ): BaseTypeResolutionResult | undefined {
    if (!type) return;
    if (node.isKind(ts.SyntaxKind.TypeReference)) {
      const nodeText = node.asKind(ts.SyntaxKind.TypeReference)?.getTypeName()
        .getText();
      return Array.from(this.nodeMap.values()).find((cachedType) => {
        const cacheName = cachedType.node.getSymbol()?.getName();
        return nodeText === cacheName;
      });
    }
    return Array.from(this.nodeMap.values()).find((cachedType) => {
      return type.isAssignableTo(cachedType.type);
    });
  }

  public printCachedNodes() {
    // console.log(
    //   "printCachedNodes",
    //   this.cacheNodeStr,
    // );
  }

  get cacheNodeStr(): string {
    return Array.from(this.nodeMap.values()).map(({ resolvedType }) =>
      resolvedType
    )
      .join("\n\n");
  }

  get allExportsBarRoot(): InterfaceDeclaration[] {
    return [...this.typeExportsWithoutRoot];
  }
}

// export const createProjectInfo = (
//   jsonStr: string,
// ): ProjectInfo => {
//   const typeBuilder = quicktypeJSON(
//     "typescript",
//     topLevelName,
//     jsonStr,
//     {
//       "just-types": true,
//       "nice-property-names": false,
//       nicePropertyNames: false,
//     },
//   );
//   const proj = new Project();

//   const [, type] = typeBuilder.entries().next().value!;
//   // console.log(type.lines.join("\n"));

//   const exportedTypesStr = type.lines.join("\n");
//   const source = proj.createSourceFile(sourceFileName, type.lines.join("\n"), {
//     overwrite: true,
//   });
//   const rootExport = source.getInterfaceOrThrow(topLevelName);
//   const typeExportsWithoutRoot = source.getInterfaces().filter((inter) =>
//     inter !== rootExport
//   );

//   console.log(typeExportsWithoutRoot.length, source.getInterfaces().length);

//   const nodeMap = new Map<Node<ts.Node>, string>();
//   const alreadyResolvedTypes: {
//     type: Type<ts.Type>;
//     resolvedType: string;
//   }[] = [];

//   const cacheHappyResult: ProjectInfo["cacheHappyResult"] = (propResolved) => {
//     if (!nodeMap.has(propResolved.node)) {
//       console.log("happpy boi", propResolved);
//       const type = propResolved.node.getType();
//       alreadyResolvedTypes.push({
//         type,
//         resolvedType: propResolved.resolvedType,
//       });
//       nodeMap.set(propResolved.node, propResolved.resolvedType);
//     }
//   };
//   const typeConveredByCache: ProjectInfo["typeConveredByCache"] = (type) =>
//     alreadyResolvedTypes.find((cachedType) =>
//       type.isAssignableTo(cachedType.type)
//     );

//   const printCachedNodes = () =>
//     console.log("hererere", Array.from(nodeMap.values()).join("\n\n"));

//   return {
//     source,
//     nodeMap,
//     alreadyResolvedTypes,
//     cacheHappyResult,
//     typeConveredByCache,
//     typeExportsWithoutRoot,
//     rootExport,
//     exportedTypesStr,
//     printCachedNodes,
//   };
// };
