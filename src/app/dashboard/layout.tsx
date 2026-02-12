"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  return (
    <div>
      {session?.user?.name}
      <button
        onClick={() => {
          authClient.signOut();
          router.push("/");
        }}
      >
        logout
      </button>
      {children}
    </div>
  );
};

export default Layout;
