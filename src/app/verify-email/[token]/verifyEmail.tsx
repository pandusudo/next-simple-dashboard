"use client";
import { Box, Button, Center, Text, Link } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function VerifyEmailPage({ token }: { token: string }) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<any>(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BE_PATH}/api/users/verify-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
      next: {
        revalidate: 0,
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setIsLoading(false);
      });
  }, [token]);

  if (isLoading) {
    return <></>;
  } else {
    // Check if the request was successful (status code 2xx)
    return (
      <Center height="100vh">
        <Box textAlign="center">
          <Text fontSize="xl" fontWeight="bold" mb="4">
            {data.success
              ? "Email Verification Successful!"
              : data.message.message}
          </Text>
          <Link href={data.success ? "/dashboard" : "/auth/signin"}>
            <Button colorScheme={data.success ? "teal" : "red"} size="lg">
              Go Back to the App
            </Button>
          </Link>
        </Box>
      </Center>
    );
  }
}
