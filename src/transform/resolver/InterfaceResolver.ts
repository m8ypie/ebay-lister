import { InterfaceDeclaration, ts } from "ts-morph";
import { BaseTypeResolutionResult, ProjectInfo } from "./projectInfo.ts";
import { PropertyResolver } from "./PropertyResolver.ts";

type PropertyResolvedTypeOverride = {
  resolvedType: {
    key: string;
    typeStr: string;
  };
};

type InterfaceResolvedResult =
  & {
    propertyResolved: true;
    currentPropNum: number;
    totalPropNum: number;
    totalUnresolvedNum: number;
  }
  & BaseTypeResolutionResult;

type InterfaceUnresolvedResult = {
  propertyResolved: false;
  currentPropNum: number;
  totalPropNum: number;
  totalUnresolvedNum: number;
};

type InterfaceResolution = InterfaceResolvedResult | InterfaceUnresolvedResult;

type Re =
  & {
    propertyResolved: true;
    currentPropNum: number;
    totalPropNum: number;
    totalUnresolvedNum: number;
  }
  & PropertyResolvedTypeOverride
  & Omit<BaseTypeResolutionResult, "resolvedType">;

type InterfaceResolveGenerator = Generator<
  Re,
  {
    currentPropNum: number;
    totalPropNum: number;
    totalUnresolvedNum: number;
  } & Omit<BaseTypeResolutionResult, "resolvedType">
>;

export class InterfaceResolver {
  public projectInfo: ProjectInfo;
  private _inter?: InterfaceDeclaration;
  constructor(public propertyResolver: PropertyResolver) {
    this.projectInfo = propertyResolver.projectInfo;
  }

  set interface(inter: InterfaceDeclaration) {
    this._inter = inter;
  }

  get interface(): InterfaceDeclaration {
    if (!this._inter) {
      throw new Error();
    }
    return this._inter;
  }

  get interfaceIsEmpty(): boolean {
    return this.interface.getProperties().length === 0;
  }

  resolve(): InterfaceResolution {
    if (!this._inter) {
      throw new Error("interface not set");
    }
    const baseIntRes: BaseTypeResolutionResult = {
      type: this._inter!.getType(),
      node: this._inter!,
      resolvedType: "",
    };
    if (this.interfaceIsEmpty) {
      return {
        ...baseIntRes,
        resolvedType: "{}",
        propertyResolved: true,
        totalPropNum: 0,
        totalUnresolvedNum: 0,
        currentPropNum: 0,
      };
    }
    const gen = this.processProperties();
    let result = gen.next();
    const resolvedProperties: Re[] = [];
    // console.log("STARTING RESOLVE", this._inter.getName());
    while (!result.done) {
      const value = result.value;
      if (value.propertyResolved === true) {
        const resValue = value;
        resValue.resolvedType;
        resolvedProperties.push({ ...value });
      }

      result = gen.next();
    }
    if (resolvedProperties.length) {
      const resolvedProp = resolvedProperties[0];
      let typeStr = "";
      if (
        resolvedProperties.every((resProp) =>
          resolvedProp.type.isAssignableTo(resProp.type)
        )
      ) {
        console.log(
          "rcoooooooord",
          resolvedProperties.map((prop) => prop.node.getSymbol()?.getName()),
        );
        // if (
        //   resolvedProp.resolvedType.typeStr.includes("string") &&
        //   resolvedProp.resolvedType.typeStr.length < 20
        // ) {
        //   console.log(
        //     "opps",
        //     this._inter.getName(),
        //     resolvedProp.node.getKindName(),
        //   );
        //   console.log(
        //     resolvedProperties.map((prop) =>
        //       prop.node.asKindOrThrow(ts.SyntaxKind.PropertySignature)
        //         .getStructure().type
        //     ),
        //   );
        // }
        typeStr = `Record<string, ${resolvedProp.resolvedType.typeStr}>`;
      } else {
        const resolvedType = resolvedProperties.map((res) =>
          `${res.resolvedType.key}:${res.resolvedType.typeStr}`
        ).join(
          "\n",
        );
        typeStr = `{${resolvedType}}`;
      }

      const intRes = {
        ...result.value,
        resolvedType: typeStr,
        propertyResolved: true,
      };
      this.projectInfo.cacheHappyResult(intRes);
      return intRes;
    }
    console.log(this._inter.getName());
    const intRes = {
      ...baseIntRes,
      ...result.value,
      propertyResolved: false,
    };
    return intRes;
  }

  private *processProperties(): InterfaceResolveGenerator {
    const properties = this._inter!.getType().getProperties();
    const total = properties.length;

    let totalUnresolvedNum = 0;
    let propNum = 0;

    for (const [index, prop] of properties.entries()) {
      const baseIntRes: BaseTypeResolutionResult = {
        type: prop.getTypeAtLocation(this.projectInfo.source),
        node: prop.getValueDeclaration()!!,
        resolvedType: "",
      };
      propNum = index + 1;
      this.propertyResolver.prop = prop;
      const propRes = this.propertyResolver.run();
      if (propRes?.propertyResolved) {
        const resolvedType = {
          key: prop.getName(),
          typeStr: propRes.resolvedType,
        };
        const propertyResult = {
          ...baseIntRes,
          resolvedType,
        };
        yield {
          ...propertyResult,
          currentPropNum: propNum,
          totalUnresolvedNum,
          totalPropNum: total,
          propertyResolved: true, //!unresolvedHit && index === properties.length - 1,
        };
      } else {
        totalUnresolvedNum++;
        // yield {
        //   propertyResolved: false,
        //   currentPropNum: propNum,
        //   totalPropNum: total,
        //   totalUnresolvedNum,
        // };
      }
    }
    return {
      type: this._inter!.getType(),
      node: this._inter!,
      totalUnresolvedNum,
      currentPropNum: propNum,
      totalPropNum: total,
    };
  }
  generate(): string {
    if (!this._inter) {
      throw new Error();
    }
    let expoCache = this.projectInfo.typeConveredByCache(
      this._inter!!,
      this._inter!.getType(),
    );
    if (!expoCache) {
      const res = this.resolve();
      if (!res.propertyResolved) {
        throw new Error();
      }
      expoCache = res;
    }
    return expoCache.resolvedType;
  }
}
