import { t } from "@/lib/trpc/trpc";
import { helloRouter } from "./routes/hello";

export const appRouter = t.router({
  hello: helloRouter,
});

export type AppRouter = typeof appRouter;
