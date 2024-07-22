import {
  type QueryClient,
  type QueryKey,
  type UseQueryOptions,
  type DataTag,
} from "@tanstack/react-query";

export type Query<TData, TQueryKey extends QueryKey> = UseQueryOptions<
  TData,
  Error,
  TData,
  TQueryKey
> & {
  initialData?: undefined;
} & { queryKey: DataTag<TQueryKey, TData> };

export async function getLoaderData<TData, TQueryKey extends QueryKey>(
  queryClient: QueryClient,
  query: Query<TData, TQueryKey>,
) {
  const { queryKey, queryFn } = query;

  if (!queryKey) {
    throw new Error("Missing Query Key");
  }

  if (!queryFn) {
    throw new Error("Missing Query Function");
  }

  // Retrieve data from the cache
  const cachedData = queryClient.getQueryData(queryKey);

  // Return the data from the cache if it exists
  if (cachedData) {
    console.log("Loading data from cache...");
    return cachedData;
  }

  // Initiate a fetch if there are no data in the cache
  console.log("Initiating fetch...");
  return await queryClient.fetchQuery(query);
}
