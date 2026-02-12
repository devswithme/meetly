import { publicProcedure } from "../context";
import { t } from "../trpc";

export const helloRouter = t.router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return "Hello " + ctx.user?.name;
  }),
});
