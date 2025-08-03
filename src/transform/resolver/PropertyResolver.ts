import {
  Node,
  PropertySignature,
  Symbol,
  SyntaxKind,
  ts,
  Type,
  TypeReferenceNode,
} from "ts-morph";
import { BaseTypeResolutionResult, ProjectInfo } from "./projectInfo.ts";

type TypeResolvedResult = {
  currentStep: PropertyResolutionStep;
  propertyResolved: true;
  layer: number;
} & BaseTypeResolutionResult;

type TypeUnresolvedResult = {
  currentStep: PropertyResolutionStep;
  propertyResolved: false;
  layer: number;
};

type TypeResolutionResult = TypeResolvedResult | TypeUnresolvedResult;

type TypeResolutionReturnResult =
  | { propertyResolved: false }
  | { propertyResolved: true } & BaseTypeResolutionResult;

type PropertyResolutionStep =
  | "primitiveCheck"
  | "typeReferenceCheck-rootType"
  | "typeReferenceCheck-RecordType"
  | "literalTypeDefCheck";
type PropertyResolveGenerator = Generator<TypeResolutionResult>;

type TypeWrapper = (resolvedType: string) => string 


export class PropertyResolver {
  protected _prop?: Symbol;
  protected _typeWrapper: TypeWrapper= (str:string) =>str

  constructor(public projectInfo: ProjectInfo) {
  }

  set prop(prop: Symbol) {
    this._prop = prop;
  }

  set typeWrapper(typeWrapper: TypeWrapper){
    this._typeWrapper = typeWrapper
  }

  run(): TypeResolutionReturnResult {
    if (!this._prop) {
      throw new Error("property not set");
    }
    for (const gen of this.resolveProperty(this._prop)) {
      if (gen.propertyResolved) {
        this.projectInfo.cacheHappyResult(gen);
        return {
          propertyResolved: true,
          node: gen.node,
          type: gen.type,
          resolvedType: gen.resolvedType,
        };
        // break;
      }
    }
    return { propertyResolved: false };

    // const gen = this.resolveProperty(this._prop);
    // let result = gen.next();

    // while (!result.done && !result.value.propertyResolved) {
    //   const value = result.value;

    //   result = gen.next();
    // }
    // if (result.value?.propertyResolved) {
    //   this.projectInfo.cacheHappyResult(result.value);
    // }
    // return result.value;
  }

  protected checkIfTypeRefIsRootTypeAndIfSoCovered = (
    typeRef: TypeReferenceNode,
  ):
    | Pick<
      TypeResolvedResult,
      "resolvedType" | "propertyResolved" | "type" | "node"
    >
    | Pick<TypeUnresolvedResult, "propertyResolved"> => {
    const symbol = typeRef.getSymbol() ||
      this.projectInfo.project.getTypeChecker().getSymbolAtLocation(
        typeRef.getTypeName(),
      );

    if (!symbol) throw new Error();

    const isReferencingRootNodeType = symbol.getDeclarations()
      ?.some((decl) => {
        const sourceFile = decl.getSourceFile();
        const filePath = sourceFile.getFilePath();

        // Check if it's NOT a library file
        return !filePath.includes("node_modules") &&
          !filePath.includes("lib.") &&
          !sourceFile.isFromExternalLibrary();
      });

    const referencingAndCOveredByExport = isReferencingRootNodeType &&
      this.projectInfo.typeConveredByCache(typeRef, typeRef.getType());
    if (referencingAndCOveredByExport) {
      return {
        propertyResolved: true,
        ...referencingAndCOveredByExport,
      };
    }
    return {
      propertyResolved: false,
    };
  };

  public getPropertyTypeOrFail(): string {
    if (!this._prop) {
      throw new Error("property not set");
    }
    const res = this.run();
    if (!res?.propertyResolved) {
      throw new Error("property not resolved");
    }
    return res.resolvedType;
  }


  
  protected *resolveProperty(
    prop: Symbol,
    layer = 0,
    typeWrapper?: (resolvedType: string) => string,
  ): PropertyResolveGenerator {
    const type = prop.getTypeAtLocation(this.projectInfo.source);
    type.isArray
    yield* this.resolvePrimitive(prop, layer);
    const valueDecl = prop.getValueDeclaration()?.asKindOrThrow(
      ts.SyntaxKind.PropertySignature,
    );
    if (valueDecl) {
      yield* this.reolveTypeReference(valueDecl, layer);
      yield* this.resolveTypeLiteral(valueDecl, layer);
    }
  }

  protected isPrimitiveType(type: Type<ts.Type>): boolean {
    return type.isString() ||
      type.isNumber() ||
      type.isBoolean() ||
      type.isBigInt() ||
      type.isUndefined() ||
      type.isNull();
  }

  protected getArrayExtension(node: Node<ts.Node>): string;
  protected getArrayExtension(type: Type<ts.Type>): string;
  protected getArrayExtension(arg: Node<ts.Node> | Type<ts.Type>): string {
    if (arg instanceof Type) {
      return arg.isArray() ? "[]" : "";
    }
    if (arg instanceof Node) {
      const nodeType = arg.getType();
      return nodeType.isArray() ? "[]" : "";
    }
    return "";
  }
  protected getPrimitiveType(type: Type<ts.Type>): string {
    if (type.isString()) {
      return "string";
    }
    if (type.isNumber()) {
      return "number";
    }
    if (type.isBoolean()) {
      return "boolean";
    }
    if (type.isBigInt()) {
      return "bigint";
    }
    if (type.isUndefined()) {
      return "undefined";
    }
    if (type.isNull()) {
      return "null";
    }
    throw new Error("Unknown primitive type");
  }

  protected generateResolvedType(resolvedType:string, typeWrapper?: (resolvedType: string) => string,) {
    return typeWrapper?.
  }

  protected *resolvePrimitive(
    prop: Symbol,
    layer: number,
    typeWrapper: TypeWrapper
  ): PropertyResolveGenerator {
    const type = prop.getTypeAtLocation(this.projectInfo.source);
    const isPrimitive = this.isPrimitiveType(type);
    const extension = this.getArrayExtension(type);
    if (isPrimitive) {
      yield {
        propertyResolved: true,
        resolvedType: this.getPrimitiveType(type) + extension,
        currentStep: "primitiveCheck",
        layer,
        node: prop.getValueDeclaration()!,
        type,
      };
    } else {
      yield {
        propertyResolved: false,
        currentStep: "primitiveCheck",
        layer,
      };
    }
  }

  protected createResolvedType(baseResolvedType:string):string{

  }

  protected *reolveTypeReference(
    propertySig: PropertySignature,
    layer: number,
    typeWrapper: TypeWrapper
  ): PropertyResolveGenerator {
    const baseTypeRefYieldData = { layer, propertyResolved: false };

    const typeRef = propertySig.getFirstDescendantByKind(
      ts.SyntaxKind.TypeReference,
    );

    if (typeRef) {
      const coverdByTypeCache = this.checkIfTypeRefIsRootTypeAndIfSoCovered(
        typeRef,
      );
      if (coverdByTypeCache.propertyResolved) {
        const arrayExtension = this.getArrayExtension(typeRef);
        const resolvedType =
          `${coverdByTypeCache.resolvedType}${arrayExtension}`;
        yield {
          ...baseTypeRefYieldData,
          currentStep: "typeReferenceCheck-rootType",
          ...coverdByTypeCache,
          resolvedType,
        };
      } else {
        yield {
          ...baseTypeRefYieldData,
          currentStep: "typeReferenceCheck-rootType",
          ...this.checkIfTypeRefIsRootTypeAndIfSoCovered(
            typeRef,
          ),
        };
      }

      const typeName = typeRef.getTypeName().getText();

      if (typeName === "Record") {
        const typeArgs = typeRef.getTypeArguments();
        if (typeArgs.length !== 2 || typeArgs[0].getText() !== "string") {
          throw new Error("Invalid json payload with Record type");
        }
        const valueType = typeArgs[1].getSymbolOrThrow();
        yield* this.resolveProperty(
          valueType,
          layer + 1,
          (resolvedType) => `Record<string,z${resolvedType}>`,
        );
      }
    }
  }

  protected *resolveTypeLiteral(
    valueDecl: PropertySignature,
    layer: number,
    typeWrapper
  ): Generator<TypeResolutionResult> {
    const isTypeLiteral = valueDecl?.isKind(
      ts.SyntaxKind.TypeLiteral,
    );
    if (isTypeLiteral) {
      const typeLiteral = valueDecl.asKindOrThrow(SyntaxKind.TypeLiteral);
      const members = typeLiteral.getMembers();
      const hasFunctionSignatures = members.some((m) =>
        m.isKind(ts.SyntaxKind.MethodSignature)
      );
      if (hasFunctionSignatures) {
        throw new Error(
          `property ${valueDecl.getText()} has functoin signatures. Not valid for json payload`,
        );
      }
      for (const mem of members) {
        if (
          mem.isKind(ts.SyntaxKind.IndexSignature) ||
          mem.isKind(ts.SyntaxKind.PropertySignature)
        ) {
          yield* this.resolveProperty(mem.getSymbolOrThrow(), layer + 1);
        }
      }
    }
  }
}
