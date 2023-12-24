import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { parse } from "cookie";
import { cookies } from "next/headers";

export const authConfig: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ account }) {
      const data = { token: account?.id_token };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BE_PATH}/api/auth/signin-google`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(data),
        }
      );

      const apiCookies = response.headers.getSetCookie();

      if (apiCookies && apiCookies.length > 0) {
        apiCookies.forEach((cookie) => {
          const parsedCookie = parse(cookie);
          const [cookieName, cookieValue] = Object.entries(parsedCookie)[0];
          const httpOnly = cookie.includes("HttpOnly");

          cookies().set({
            name: cookieName,
            value: cookieValue,
            httpOnly,
            secure: true,
            domain: process.env.COOKIE_DOMAIN,
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000,
          });
        });
      }

      return true;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
