"use client";

import { QueryClient } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";

const TRPCLayout = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();

  return (
    <trpc.Provider
      client={trpc.createClient({
        links: [
          httpBatchLink({
            url: "/api/trpc",
            async fetch(url, options) {
              const res = await fetch(url, options);

              return res;
            },
          }),
        ],
      })}
      queryClient={queryClient}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};

export default TRPCLayout;
