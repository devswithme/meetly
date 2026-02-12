## Next.js Starter Template

Minimal Next.js app with Google sign-in, a protected dashboard page, and a tRPC `hello` route wired end-to-end.

### Tech stack

- **Infrastructure**: Supabase
- **Framework**: Next.js 16 (App Router, TypeScript, React 19)
- **API**: tRPC 11 with `fetch` adapter
- **Data / ORM**: Prisma + `pg` (PostgreSQL)
- **Auth**: `better-auth` with Google OAuth

### Getting started

- **Install dependencies**

```bash
bun install # or npm install / pnpm install
```

- **Env setup**

```bash
cp .env.example .env.local
```

Set your database and auth config (e.g. Postgres URL, Google client ID/secret).

- **Run dev server**

```bash
bun dev
```

Visit `http://localhost:3000`, click **login**, and you’ll be redirected to `/dashboard`, which calls `trpc.hello.getAll` and renders the result.
