# react-router-fs-routes-next
React Router v7 File-System based routing inspired in Next.js App Router

Supports all route types of [the official docs](https://reactrouter.com/start/framework/routing):

- Root and index routes: Either `index.tsx` or `page.tsx`, but a segment folder is not required, e.g. `posts.tsx` is the same as `posts/index.tsx`
- Dynamic Segments: `posts/[id].tsx` or `posts/[id]/index.tsx`
- Optional Segments: `:lang?/news.tsx`
- Splat/Wildcard routes: `api/auth/[...auth].tsx`
- Layout routes: `layout.tsx` at any level, inheritable.
- Extras inspired by Next:
  - Route grouping (via parentheses): `(auth)/news.tsx` will be `/news`. Has no effect more than code organisation purposes or for sharing the same layout without requiring a nested level.

## Setup
It requires React Router v7 or compatible.

This is not an NPM package, it's just a file [`src/routes,ts`](src/routes,ts) that you can copy-paste 
in your `app/routes.ts` and customize it as you wish.

Example:

![image](https://github.com/user-attachments/assets/ac3228c2-afdd-4064-8b08-579747764637)


