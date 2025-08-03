import { InterfaceResolver } from "./InterfaceResolver.ts";
import { ProjectInfo } from "./projectInfo.ts";
import { PropertyResolver } from "./PropertyResolver.ts";

export class JsonPayloadResolver {
  public projectInfo: ProjectInfo;
  public propertyResolver: PropertyResolver;
  constructor(protected interfaceResolver: InterfaceResolver) {
    this.projectInfo = interfaceResolver.projectInfo;
    this.propertyResolver = interfaceResolver.propertyResolver;
  }

  generateTypes() {
    let existingArrOfInterfaces = this.projectInfo.allExportsBarRoot;
    // console.log(existingArrOfInterfaces.length);
    while (existingArrOfInterfaces.length) {
      const int = existingArrOfInterfaces.pop();
      //   console.log(int?.getName(), existingArrOfInterfaces.length);
      if (!int) throw new Error();
      //   console.log(int?.getName());
      this.interfaceResolver.interface = int!;
      this.interfaceResolver.resolve();
      const intRes = this.interfaceResolver.resolve();
      //   console.log("RESOLVED?", int?.getName(), intRes.propertyResolved);
      if (!intRes.propertyResolved) {
        existingArrOfInterfaces = [int, ...existingArrOfInterfaces];
      } else {
        console.log("?");
      }
    }
  }

  getJsonPayloadTransformProperty() {
    this.interfaceResolver.interface = this.projectInfo.rootExport;
    this.interfaceResolver.resolve();

    return this.projectInfo.rootExport.getType().getProperties().map((prop) => {
      this.propertyResolver.prop = prop;
      return {
        typeName: this.propertyResolver.getPropertyTypeOrFail(),
        name: prop.getName(),
        isOptional: prop.isOptional(),
      };
    });
  }
  getJsonPayloadStr(): string {
    this.interfaceResolver.interface = this.projectInfo.rootExport;
    this.interfaceResolver.resolve();
    const rootRes = this.projectInfo.typeConveredByCache(
      this.projectInfo.rootExport,
      this.projectInfo.rootExport.getType(),
    );
    if (!rootRes) {
      throw new Error();
    }
    return rootRes.resolvedType;
  }
}
