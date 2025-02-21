# react-router-fs-routes-next
React Router v7 File-System based routing inspired by Next.js App Router

Supports all route types of [the official docs](https://reactrouter.com/start/framework/routing):

- Root and index routes: Either `index.tsx` or `page.tsx`, but a segment folder is not required, e.g. `posts.tsx` is the same as `posts/index.tsx`
- Dynamic Segments: `posts/[id].tsx` or `posts/[id]/index.tsx`
- Optional Segments: `[[lang]]/news.tsx`
- Splat/Wildcard routes: `api/auth/[...].tsx`
- Layout routes: `layout.tsx` at any level, inheritable.
- Extras inspired by Next:
  - Route grouping (via parentheses): `(auth)/news.tsx` will be `/news`. Has no effect more than code organisation purposes or for sharing the same layout without requiring a nested level.
 
Supports both `.ts` and `.tsx` files, depends if you use JSX inside or not.

## Setup
It requires React Router v7 or compatible.

This is not an NPM package, it's just a file [`src/routes,ts`](src/routes,ts) that you can copy-paste 
in your `app/routes.ts` and customize it as you wish.

Example:

![image](https://github.com/user-attachments/assets/c763ce13-4774-432f-849c-171cd3745545)

![image](https://github.com/user-attachments/assets/0424f543-22d8-4739-8fe5-aac171157a5b)



