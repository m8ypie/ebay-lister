const configConfigLol = [
  { key: "EBAY_APP_ID", type: "string" },
  { key: "EBAY_CERT_ID", type: "string" },
  { key: "EBAY_DEV_ID", type: "string" },
  { key: "EBAY_REFRESH_TOKEN", type: "string" },
  { key: "ECHO_MTG_TOKEN", type: "string" },
  { key: "ECHO_MTG_EMAIL", type: "string" },
  { key: "ECHO_MTG_PASSWORD", type: "string" },
  { key: "OFFER_PERCENTAGE", type: "number" },
  { key: "MIN_UNIT_PRICE", type: "number" },
] as const;

type TypeMap = {
  string: string;
  number: number;
};

type ConfigArray = typeof configConfigLol;

type EbayListerConfig = {
  [C in ConfigArray[number] as C["key"]]: TypeMap[C["type"]];
};

export const runtimeConfig = configConfigLol.reduce<EbayListerConfig>(
  (config, configConfig) => {
    const envVal = Deno.env.get(configConfig.key);
    if (!envVal) {
      throw new Error(`Value not set for ${configConfig.key}`);
    }
    return {
      ...config,
      [configConfig.key]: configConfig.type === "number"
        ? Number(envVal)
        : envVal,
    };
  },
  {} as EbayListerConfig,
);

export default runtimeConfig;
