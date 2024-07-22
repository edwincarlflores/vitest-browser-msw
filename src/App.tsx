import {
  QueryClient,
  QueryClientProvider,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import {
  createBrowserRouter,
  RouterProvider,
  RouteObject,
} from "react-router-dom";
import { getLoaderData } from "./api";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const repoQuery = queryOptions({
  queryKey: ["repoData"],
  queryFn: () =>
    fetch("https://api.github.com/repos/TanStack/query").then((res) =>
      res.json(),
    ),
});

function exampleLoader(queryClient: QueryClient) {
  return async () => {
    const repo = await getLoaderData(queryClient, repoQuery);
    console.log("FROM LOADER REPO:", repo);
    return repo;
  };
}

export function getRoutes(queryClient: QueryClient): RouteObject[] {
  return [
    { path: "/", element: <Example />, loader: exampleLoader(queryClient) },
  ];
}

export const router = createBrowserRouter(getRoutes(queryClient));

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

function Example() {
  const { data } = useQuery(repoQuery);

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.description}</p>
      <strong>👀 {data.subscribers_count}</strong>{" "}
      <strong>✨ {data.stargazers_count}</strong>{" "}
      <strong>🍴 {data.forks_count}</strong>
    </div>
  );
}
