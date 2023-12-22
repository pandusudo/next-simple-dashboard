"use client";
import React, { useEffect } from "react";
import SigninForm from "./signinForm";
import { useRouter } from "next/navigation";

const checkSession = async () => {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_BE_PATH}/api/users/check-session`,
    {
      next: {
        revalidate: 0,
      },
      credentials: "include",
    }
  );

  return data;
};

export default function SigninPage() {
  const router = useRouter();
  useEffect(() => {
    (async () => {
      const resp = await checkSession();
      const data = await resp.json();

      if (resp.ok) {
        if (data.data.verified_at) {
          router.push("/dashboard");
        } else {
          router.push("/verify-email");
        }
      }
    })();
  }, [router]);

  return <SigninForm />;
}
