"use client";

import { authClient } from "@/lib/auth-client";

export default function Home() {
  return (
    <button
      onClick={() =>
        authClient.signIn.social({
          provider: "google",
          callbackURL: "/dashboard",
        })
      }
    >
      login
    </button>
  );
}
