"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { LogOut, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function OwnerHeader({ logoHref }: { logoHref: string }) {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  return (
    <header className="flex items-center justify-between max-w-4xl mx-auto h-20 px-4">
      <Link href={logoHref}>
        <Image src="/logo.svg" alt="Meetly" width={90} height={90} />
      </Link>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{session?.user?.name}</span>
        <Link
          href="https://wa.me/6587470061"
          target="_blank"
          className={buttonVariants({ variant: "secondary" })}
        >
          Withdraw (min IDR 500K)
        </Link>
        <Link
          href="/dashboard/settings"
          className={buttonVariants({ variant: "ghost", size: "icon" })}
          title="Settings"
        >
          <Settings className="size-4" />
        </Link>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => {
            authClient.signOut();
            router.push("/");
          }}
        >
          <LogOut className="size-4" />
        </Button>
      </div>
    </header>
  );
}
