import ky, { KyInstance } from "ky";

let job: Promise<string> | null = null;
let refreshJobCompleted = true;

type TokenResolver = (authClient: KyInstance) => Promise<string>;

function refreshAccessToken(jobTask: () => Promise<string>): Promise<string> {
  return job = !job || !refreshJobCompleted ? job = jobTask() : job;
}

export default async (
  { baseUrl, auth, headers }: {
    baseUrl: string;
    headers?: Record<string, string>;
    auth: {
      tokenResolver: TokenResolver;
      header: string;
      valueGenerator: (token: string) => string;
    };
  },
): Promise<KyInstance> => {
  const refreshClient = ky.create({
    prefixUrl: baseUrl,
    throwHttpErrors: true,
  });
  const instance = ky.create({
    prefixUrl: baseUrl,
    headers: {
      ...(headers || {}),
      [auth.header]: auth.valueGenerator(
        await auth.tokenResolver(refreshClient),
      ),
    },
    hooks: {
      beforeRetry: [
        async ({ request }) => {
          request.headers.set(
            auth.header,
            auth.valueGenerator(
              await refreshAccessToken(async () => {
                refreshJobCompleted = false;
                const res = await auth.tokenResolver(refreshClient);
                refreshJobCompleted = true;
                return res;
              }),
            ),
          );
        },
      ],
    },
  });
  return instance;
};
