"use client";
import { Box, Button, Flex, useToast } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Sidebar = (props: {
  dashboard?: boolean;
  user?: boolean;
  profile?: boolean;
}) => {
  const router = useRouter();
  const toast = useToast();
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
    <Flex
      direction="column"
      bg="gray.800"
      color="white"
      w="250px"
      minH="100vh"
      h="auto"
      boxShadow="base"
    >
      {/* Add sidebar content */}
      <Box
        mb="4"
        p="8"
        w="full"
        alignContent="center"
        fontWeight="bold"
        justifyContent="center"
      >
        Simple Dashboard
      </Box>

      <Link href="/dashboard">
        <Button
          variant="outline"
          borderWidth="0"
          color="white"
          width="100%"
          height="50px"
          borderRadius="0"
          isActive={props.dashboard}
          _hover={{ bg: "rgba(0, 0, 0, 0.3)" }}
          _active={{ bg: "rgba(0, 0, 0, 0.7)" }}
        >
          Dashboard
        </Button>
      </Link>

      <Link href="/dashboard/user">
        <Button
          variant="outline"
          borderWidth="0"
          color="white"
          width="100%"
          height="50px"
          borderRadius="0"
          isActive={props.user}
          _hover={{ bg: "rgba(0, 0, 0, 0.3)" }}
          _active={{ bg: "rgba(0, 0, 0, 0.7)" }}
        >
          User list
        </Button>
      </Link>

      <Link href="/dashboard/profile">
        <Button
          variant="outline"
          borderWidth="0"
          color="white"
          width="100%"
          height="50px"
          borderRadius="0"
          isActive={props.profile}
          _hover={{ bg: "rgba(0, 0, 0, 0.3)" }}
          _active={{ bg: "rgba(0, 0, 0, 0.7)" }}
        >
          Profile setting
        </Button>
      </Link>

      <Box flex="1"></Box>

      {/* Sign-out button */}
      <Button
        borderRadius="0"
        width="100%"
        left="0"
        bottom="0"
        colorScheme="red"
        onClick={handleSignOut}
      >
        Sign Out
      </Button>
    </Flex>
  );
};

export default Sidebar;
