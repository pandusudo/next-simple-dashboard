"use client";
import { Box, Button, Text, Flex, useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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

const SigninForm = () => {
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    (async () => {
      const resp = await checkSession();

      const data = await resp.json();

      if (resp.ok) {
        if (data.data.verified_at) {
          router.push("/dashboard");
        }
      } else {
        if (resp.status == 401) {
          router.push("/auth/signin");
        }
      }
    })();
  }, [router]);

  const handleClickEmail = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BE_PATH}/api/users/resend-email-verification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
          next: {
            revalidate: 0,
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        toast({
          title: "Success",
          status: "success",
          duration: 2000,
          isClosable: true,
          description:
            "Email sent, please check your email to verify your account!",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        status: "error",
        duration: 2000,
        isClosable: true,
        description: "Hang on! There's some thing wrong in our system",
      });
    }
  };

  const handleSignOut = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BE_PATH}/api/auth/logout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
          next: {
            revalidate: 0,
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        router.push("/auth/signin");
      } else {
        toast({
          title: "Error",
          status: "error",
          duration: 2000,
          isClosable: true,
          description: "Hang on! There's some thing wrong in our system",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        status: "error",
        duration: 2000,
        isClosable: true,
        description: "Hang on! There's some thing wrong in our system",
      });
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      h="100vh"
    >
      <Box
        w="full"
        maxW="xl"
        p="4"
        borderWidth="1px"
        borderRadius="lg"
        boxShadow="md"
      >
        <Text align="center" fontWeight="bold" fontSize="xl">
          You need to verify your email to access the app.
        </Text>
        <Flex justifyContent="center" alignItems="center" mt="4">
          <Button colorScheme="blue" onClick={handleClickEmail}>
            Resend email verification
          </Button>
          <Box w="5%"></Box>
          <Button colorScheme="red" onClick={handleSignOut}>
            Sign out
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default SigninForm;
