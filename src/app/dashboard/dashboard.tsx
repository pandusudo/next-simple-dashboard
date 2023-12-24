"use client";
import {
  Box,
  Center,
  CircularProgress,
  Flex,
  HStack,
  Text,
} from "@chakra-ui/react";
import Sidebar from "@/components/sidebar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const DashboardPage = () => {
  const [data, setData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const data = await fetch(
        `${process.env.NEXT_PUBLIC_BE_PATH}/api/users/dashboard`,
        {
          credentials: "include",
          next: {
            revalidate: 0,
          },
        }
      );

      if (data.status == 401) {
        router.push("/auth/signin");
      }

      if (data.status == 403) {
        router.push("/verify-email");
      }

      if (data.ok) setData(await data.json());
    })();
  }, [router]);

  return (
    <Flex>
      <Sidebar dashboard={true} />
      <Box p={4} w="full">
        <HStack justify="center">
          <Box
            p="4"
            borderWidth="1px"
            borderRadius="lg"
            boxShadow="base"
            w="full"
          >
            <Text>Total Users</Text>
            <Text fontSize="2xl">
              {data ? (
                data?.data?.total_users
              ) : (
                <>
                  <Center>
                    {" "}
                    <CircularProgress
                      isIndeterminate
                      color="teal.500"
                      size="2rem"
                    />
                  </Center>
                </>
              )}
            </Text>
          </Box>
          <Box
            p="4"
            borderWidth="1px"
            borderRadius="lg"
            boxShadow="base"
            w="full"
          >
            <Text>Active Users Today</Text>
            <Text fontSize="2xl">
              {data ? (
                data?.data?.active_users_today
              ) : (
                <>
                  <Center>
                    {" "}
                    <CircularProgress
                      isIndeterminate
                      color="teal.500"
                      size="2rem"
                    />
                  </Center>
                </>
              )}
            </Text>
          </Box>
          <Box
            p="4"
            borderWidth="1px"
            borderRadius="lg"
            boxShadow="base"
            w="full"
          >
            <Text>Average Active Users (7 Days)</Text>
            <Text fontSize="2xl">
              {data ? (
                data?.data?.average_active_users_last_7_days
              ) : (
                <>
                  <Center>
                    {" "}
                    <CircularProgress
                      isIndeterminate
                      color="teal.500"
                      size="2rem"
                    />
                  </Center>
                </>
              )}
            </Text>
          </Box>
        </HStack>
      </Box>
    </Flex>
  );
};

export default DashboardPage;
