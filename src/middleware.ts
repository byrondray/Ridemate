import {
  authMiddleware,
  withAuth,
} from "@kinde-oss/kinde-auth-nextjs/middleware";

export default function middleware(req: Request) {
  return withAuth(req);
}

// const protectedRoutes = ["/dashboard"];

export const config = {
  matcher: [],
};
