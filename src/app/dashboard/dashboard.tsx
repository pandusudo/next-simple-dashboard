"use client";
import { Box, Flex, HStack, Text } from "@chakra-ui/react";
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
      <Box p="8" width="100%">
        <HStack spacing="8" justify="center">
          <Box
            p="4"
            borderWidth="1px"
            borderRadius="lg"
            boxShadow="base"
            w="300px"
          >
            <Text>Total Users</Text>
            <Text fontSize="2xl">{data?.data?.total_users}</Text>
          </Box>
          <Box
            p="4"
            borderWidth="1px"
            borderRadius="lg"
            boxShadow="base"
            w="300px"
          >
            <Text>Active Users Today</Text>
            <Text fontSize="2xl">{data?.data?.active_users_today}</Text>
          </Box>
          <Box
            p="4"
            borderWidth="1px"
            borderRadius="lg"
            boxShadow="base"
            w="300px"
          >
            <Text>Average Active Users (7 Days)</Text>
            <Text fontSize="2xl">
              {data?.data?.average_active_users_last_7_days}
            </Text>
          </Box>
        </HStack>
      </Box>
    </Flex>
  );
};

export default DashboardPage;
