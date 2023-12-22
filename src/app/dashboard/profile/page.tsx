"use client";
import {
  Flex,
  Box,
  Button,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  useToast,
  useDisclosure,
  FormErrorMessage,
  FormLabel,
  FormControl,
  Text,
} from "@chakra-ui/react";
import Sidebar from "@/components/sidebar";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { updateNameSchema } from "@/validations/profile";
import ResetPassword from "./resetPassword";

type Inputs = {
  name: string;
};

const UserProfilePage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<Inputs>({
    resolver: zodResolver(updateNameSchema),
  });
  const toast = useToast();
  const [data, setData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [defaultName, setDefaultName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<any>(true);
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  //   TODO: check when user set password with account that initially registered using google account and vice versa
  //         check forbidden access and resend verification email

  useEffect(() => {
    (async () => {
      const data = await fetch(
        `${process.env.NEXT_PUBLIC_BE_PATH}/api/users/profile`,
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
        const responseData = await data.json();
        setData(responseData);
        setValue("name", responseData.data.name);
        setDefaultName(responseData.data.name);
        setIsLoading(false);
      }
    })();
  }, [router, setValue]);

  const handleResetPassword = () => {
    onOpen();
  };

  const handleCancelEditing = () => {
    setValue("name", defaultName);
    setIsEditing(false);
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BE_PATH}/api/users/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          next: {
            revalidate: 0,
          },
          body: JSON.stringify(data),
        }
      );

      const responseData = await response.json();

      // Check if the request was successful (status code 2xx)
      if (response.ok) {
        toast({
          title: "Success",
          status: "success",
          duration: 2000,
          isClosable: true,
          description: "Name has been updated!",
        });
        setIsEditing(false);
        setDefaultName(responseData.data.name);
      } else {
        toast({
          title: "Error",
          status: "error",
          duration: 2000,
          isClosable: true,
          description: responseData.message
            ? responseData.message
            : "Hang on! There's some thing wrong in our system",
        });

        if (response.status === 401) router.push("/auth/signin");
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

  if (isLoading) {
    return <></>;
  } else {
    return (
      <Flex>
        <Sidebar profile={true} />
        <Box w="full" p={4}>
          <Text
            fontSize="2xl"
            fontWeight="bold"
            justifyContent="center"
            align="center"
            mb={4}
          >
            User profile
          </Text>
          <Box w="full">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box mb={8} ml="25%" maxW="xl">
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  id="email"
                  type="text"
                  value={data?.data?.email}
                  isDisabled
                />
              </Box>
              <Box mb={8} ml="25%" maxW="xl">
                <FormControl isInvalid={!!errors.name}>
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <Input
                    type="text"
                    id="name"
                    placeholder="Name"
                    {...register("name")}
                    onChange={(e) => {
                      setIsEditing(true);
                    }}
                  />
                  <FormErrorMessage>
                    {errors.name && errors.name.message}
                  </FormErrorMessage>
                </FormControl>
              </Box>
              <Box ml="25%" maxW="xl">
                <Button
                  type="submit"
                  colorScheme="blue"
                  isDisabled={!isEditing}
                  isLoading={isSubmitting}
                >
                  Save
                </Button>
                <Button
                  colorScheme="yellow"
                  isDisabled={!isEditing}
                  ml={4}
                  onClick={handleCancelEditing}
                >
                  Cancel
                </Button>
                <Button colorScheme="red" ml={4} onClick={handleResetPassword}>
                  {data.data.password_is_set
                    ? "Reset Password"
                    : "Set Password"}
                </Button>
              </Box>
            </form>
          </Box>
        </Box>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              Alert! Resetting your password will result in a logout, requiring
              you to log in again.
            </ModalHeader>
            <ModalBody>
              <ResetPassword
                onClose={onClose}
                passwordIsSet={data.data.password_is_set}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      </Flex>
    );
  }
};

export default UserProfilePage;
