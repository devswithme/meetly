"use client";

import { trpc } from "@/lib/trpc/client";
import { authClient } from "@/lib/auth-client";
import { OwnerHeader } from "@/components/owner-header";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = authClient.useSession();
  const { data: me } = trpc.user.getMe.useQuery(undefined, {
    enabled: !!session?.user,
  });
  const logoHref = me?.slug ? `/${me.slug}` : "/dashboard";

  return (
    <>
      <OwnerHeader logoHref={logoHref} />
      <main className="mx-auto max-w-4xl space-y-10 my-16 px-4">
        {children}
      </main>
    </>
  );
};

export default Layout;
