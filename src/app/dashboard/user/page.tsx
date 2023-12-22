"use client";
import {
  Box,
  Flex,
  Text,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Button,
} from "@chakra-ui/react";
import Sidebar from "@/components/sidebar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import moment from "moment-timezone";

const UserListPage = () => {
  const [data, setData] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const data = await fetch(
        `${process.env.NEXT_PUBLIC_BE_PATH}/api/users?page=${currentPage}`,
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

      if (data.ok) {
        setData(await data.json());
      }
    })();
  }, [router, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (
      newPage >= 1 &&
      newPage <= Math.ceil(data.metadata.totalCount / data.metadata.limit)
    ) {
      setCurrentPage(newPage);
    }
  };

  const renderPaginationButtons = (totalPages: number) => {
    const pagesToDisplay = Math.min(totalPages, 5);
    const startPage = Math.max(1, currentPage - Math.floor(pagesToDisplay / 2));
    const endPage = Math.min(totalPages, startPage + pagesToDisplay - 1);

    const paginationButtons = [];
    for (let i = startPage; i <= endPage; i++) {
      paginationButtons.push(
        <Button
          key={i}
          onClick={() => handlePageChange(i)}
          colorScheme={currentPage === i ? "blue" : "gray"}
          mx={1}
        >
          {i}
        </Button>
      );
    }

    return paginationButtons;
  };

  console.log(data);

  return (
    <Flex>
      <Sidebar user={true} />

      <Box p={4} width="full">
        <Text fontSize="2xl" fontWeight="bold" align="center" mb={4}>
          User List
        </Text>
        {data && data.data ? (
          <>
            <Table variant="striped" size="sm" width="100%">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Signed up at</Th>
                  <Th>Last session</Th>
                  <Th>Login counter</Th>
                  {/* Add more columns as needed */}
                </Tr>
              </Thead>
              <Tbody>
                {data.data.map((user: any) => (
                  <Tr key={user.id}>
                    <Td>{user.name}</Td>
                    <Td>
                      {moment(user.signed_up_at)
                        .tz(moment.tz.guess())
                        .format("YYYY-MM-DD HH:mm")}
                    </Td>
                    <Td>
                      {moment(user.last_session)
                        .tz(moment.tz.guess())
                        .format("YYYY-MM-DD HH:mm")}
                    </Td>
                    <Td>{user.login_counter}</Td>
                    {/* Add more cells as needed */}
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <Flex position="absolute" left="50%" bottom="20%">
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                isDisabled={currentPage === 1}
                mx={1}
              >
                Prev
              </Button>
              {renderPaginationButtons(
                Math.ceil(data.metadata.totalCount / data.metadata.limit)
              )}
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                isDisabled={
                  currentPage ===
                  Math.ceil(data.metadata.totalCount / data.metadata.limit)
                }
                mx={1}
              >
                Next
              </Button>
            </Flex>
          </>
        ) : (
          <Text>No user data available.</Text>
        )}
      </Box>
    </Flex>
  );
};

export default UserListPage;
