import { initTRPC } from "@trpc/server";
import { TRPCContext } from "@/lib/trpc/context";

export const t = initTRPC.context<TRPCContext>().create();
