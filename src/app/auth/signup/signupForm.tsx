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
import Link from "next/link";
import { signupSchema } from "@/validations/signup";
import GoogleButton from "@/components/googleButton";

type Inputs = {
  email: string;
  password: string;
  name: string;
  reconfirm_password: string;
};

const SignupForm = () => {
  const toast = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    defaultValues: {
      email: "",
      password: "",
      name: "",
      reconfirm_password: "",
    },
    resolver: zodResolver(signupSchema),
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BE_PATH}/api/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const responseData = await response.json();
      console.log(responseData);
      console.log(response.ok);

      // Check if the request was successful (status code 2xx)
      if (response.ok) {
        reset({
          email: "",
          password: "",
          name: "",
          reconfirm_password: "",
        });
        toast({
          title: "Success",
          status: "success",
          duration: 2000,
          isClosable: true,
          description:
            "Account created, please check your email to verify your account!",
        });
      } else {
        if (response.status === 400) {
          const emailErrorMessage =
            responseData.message.find(
              (error: any) => error.property === "email"
            )?.constraints?.customValidation ||
            "Hang on! There's some thing wrong in our system";
          toast({
            title: "Error",
            status: "error",
            duration: 2000,
            isClosable: true,
            description: emailErrorMessage,
          });
        } else {
          toast({
            title: "Error",
            status: "error",
            duration: 2000,
            isClosable: true,
            description: "Hang on! There's some thing wrong in our system",
          });
        }
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
          <FormControl mt="4" isInvalid={!!errors.name}>
            <FormLabel htmlFor="name">Name</FormLabel>
            <Input
              type="text"
              id="name"
              placeholder="name"
              w="full"
              {...register("name")}
            />
            <FormErrorMessage>
              {errors.name && errors.name.message}
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
          <FormControl mt="4" isInvalid={!!errors.password}>
            <FormLabel htmlFor="reconfirm_password">
              Reconfirm Password
            </FormLabel>
            <Input
              type="password"
              id="reconfirm_password"
              placeholder="reconfirm password"
              w="full"
              {...register("reconfirm_password")}
            />
            <FormErrorMessage>
              {errors.reconfirm_password && errors.reconfirm_password.message}
            </FormErrorMessage>
          </FormControl>
          <Flex justifyContent="space-between" alignItems="center" mt="4">
            <Button colorScheme="blue" type="submit" isLoading={isSubmitting}>
              Register
            </Button>
            <Text ml="2">
              Already have an account?{" "}
              <Link href="/auth/signin">
                <u>Signin</u>
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

export default SignupForm;
