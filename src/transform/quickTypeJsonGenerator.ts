import {
  InputData,
  jsonInputForTargetLanguage,
  LanguageName,
  quicktypeMultiFileSync,
} from "quicktype-core";
export function quicktypeJSON<T extends LanguageName>(
  targetLanguage: T,
  typeName: string,
  jsonString: string,
  rendererOptions: any,
) {
  const jsonInput = jsonInputForTargetLanguage(targetLanguage);

  // We could add multiple samples for the same desired
  // type, or many sources for other types. Here we're
  // just making one type from one piece of sample JSON.
  jsonInput.addSourceSync({
    name: typeName,
    samples: [jsonString],
  });

  const inputData = new InputData();
  inputData.addInput(jsonInput);

  return quicktypeMultiFileSync({
    inputData,
    lang: targetLanguage,
    rendererOptions,
    // inferDateTimes: false,
    inferEnums: false,
    inferMaps: true,
    inferDateTimes: false,
    // combineClasses: true,
  });
}
