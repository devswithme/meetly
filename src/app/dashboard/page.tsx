"use client";

import { trpc } from "@/lib/trpc/client";

const Page = () => {
  const { data } = trpc.hello.getAll.useQuery();
  return <div>Dashboard page {data}</div>;
};

export default Page;
