"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { trpc } from "@/lib/trpc/client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  const [slugInput, setSlugInput] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const { data: me, isLoading } = trpc.user.getMe.useQuery();
  const updateProfile = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      setMessage({ type: "success", text: "Profile slug saved." });
      void utils.user.getMe.invalidate();
    },
    onError: (err) => {
      setMessage({ type: "error", text: err.message });
    },
  });
  const utils = trpc.useUtils();

  useEffect(() => {
    if (me?.slug != null) setSlugInput(me.slug);
    else setSlugInput("");
  }, [me?.slug]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const value = slugInput
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    const normalized = value === "" ? "" : value.replace(/^-+|-+$/g, "");
    updateProfile.mutate({ slug: normalized === "" ? "" : normalized });
  };

  const profileUrl =
    typeof window !== "undefined" && me?.slug
      ? `${window.location.origin}/${me.slug}`
      : null;

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Settings className="size-6" />
            Settings
          </h1>
        </div>
        <Link href="/dashboard" className={buttonVariants({ variant: "secondary" })}>
          Back to events
        </Link>
      </div>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Profile slug</CardTitle>
          <CardDescription>
            Set a custom URL slug for your public profile. Your profile will list all events you
            created. Use only lowercase letters, numbers, and hyphens (e.g. john-doe).
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="slug" className="text-sm font-medium">
                Custom slug
              </label>
              <Input
                id="slug"
                value={slugInput}
                onChange={(e) => setSlugInput(e.target.value)}
                placeholder="my-profile"
                disabled={isLoading}
                className="font-mono"
              />
              {profileUrl && (
                <p className="text-sm text-muted-foreground">
                  Profile URL:{" "}
                  <a
                    href={profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    {profileUrl}
                  </a>
                </p>
              )}
            </div>
            {message && (
              <p
                className={
                  message.type === "error"
                    ? "text-sm text-destructive"
                    : "text-sm text-green-600"
                }
              >
                {message.text}
              </p>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={updateProfile.isPending || isLoading}>
              {updateProfile.isPending ? "Saving..." : "Save"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </>
  );
}
