"use client";

import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { OwnerEventList } from "@/components/owner-event-list";

const DashboardPage = () => {
  const router = useRouter();
  const { data: me, isLoading } = trpc.user.getMe.useQuery();

  if (!isLoading && me?.slug) {
    router.replace(`/${me.slug}`);
    return null;
  }

  return <OwnerEventList />;
};

export default DashboardPage;
