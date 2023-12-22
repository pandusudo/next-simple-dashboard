"use client";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
  Flex,
  useToast,
} from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signinSchema } from "@/validations/signin";
import Link from "next/link";
import GoogleButton from "@/components/googleButton";
import { useRouter } from "next/navigation";

type Inputs = {
  email: string;
  password: string;
};

const SigninForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(signinSchema),
  });
  const router = useRouter();
  const toast = useToast();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const response = await fetch(
        // "/api/auth/signin",
        `${process.env.NEXT_PUBLIC_BE_PATH}/api/auth/signin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include",
        }
      );

      const responseData = await response.json();

      // Check if the request was successful (status code 2xx)
      if (response.ok) {
        if (responseData.data.verified_at) {
          router.push("/dashboard");
        } else {
          router.push("/verify-email");
        }
      } else {
        toast({
          title: "Error",
          status: "error",
          duration: 2000,
          isClosable: true,
          description: responseData.message,
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={!!errors.email}>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              type="text"
              id="email"
              placeholder="email"
              w="full"
              {...register("email")}
            />
            <FormErrorMessage>
              {errors.email && errors.email.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl mt="4" isInvalid={!!errors.password}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              type="password"
              id="password"
              placeholder="password"
              w="full"
              {...register("password")}
            />
            <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>
          <Flex justifyContent="space-between" alignItems="center" mt="4">
            <Button colorScheme="blue" type="submit" isLoading={isSubmitting}>
              Login
            </Button>
            <Text ml="2">
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup">
                <u>Signup</u>
              </Link>
            </Text>
          </Flex>
        </form>
        <Flex alignItems="center" mt="4">
          <Box flex="1" height="1px" bg="gray.300"></Box>
          <Text mx="2" color="gray.500" fontWeight="bold">
            OR
          </Text>
          <Box flex="1" height="1px" bg="gray.300"></Box>
        </Flex>
        <Flex justifyContent="center" alignItems="center" mt="4">
          <GoogleButton />
        </Flex>
      </Box>
    </Box>
  );
};

export default SigninForm;
