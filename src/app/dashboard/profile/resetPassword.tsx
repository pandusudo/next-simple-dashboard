"use client";
import {
  Box,
  Button,
  Input,
  useToast,
  FormErrorMessage,
  FormLabel,
  FormControl,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { resetPasswordSchema } from "@/validations/profile";
import { useRouter } from "next/navigation";

type Inputs = {
  old_password: string;
  password: string;
  reconfirm_password: string;
};

const ResetPassword = (props: {
  onClose: () => void;
  passwordIsSet: boolean;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    resolver: zodResolver(resetPasswordSchema),
  });
  const toast = useToast();
  const router = useRouter();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BE_PATH}/api/users/reset-password/`,
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
          description: "Password has been updated!",
        });
        props.onClose();
        router.push("/auth/signin");
      } else {
        console.log(response.status);
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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {props.passwordIsSet ? (
        <Box mb={4}>
          <FormLabel htmlFor="old_password">Old password</FormLabel>
          <Input
            id="old_password"
            type="password"
            placeholder="Old password"
            {...register("old_password")}
          />
        </Box>
      ) : (
        <></>
      )}
      <Box mb={4}>
        <FormControl isInvalid={!!errors.password}>
          <FormLabel htmlFor="new_password">
            {props.passwordIsSet ? "New password" : "Password"}
          </FormLabel>
          <Input
            type="password"
            id="new_password"
            placeholder="New password"
            {...register("password")}
          />
          <FormErrorMessage>
            {errors.password && errors.password.message}
          </FormErrorMessage>
        </FormControl>
      </Box>
      <Box mb={4}>
        <FormControl isInvalid={!!errors.reconfirm_password}>
          <FormLabel htmlFor="reconfirm_password">
            {props.passwordIsSet
              ? "Reconfirm new password"
              : "Reconfirm password"}
          </FormLabel>
          <Input
            type="password"
            id="reconfirm_password"
            placeholder="Reconfirm new password"
            {...register("reconfirm_password")}
          />
          <FormErrorMessage>
            {errors.reconfirm_password && errors.reconfirm_password.message}
          </FormErrorMessage>
        </FormControl>
      </Box>
      <Box pt={5} pb={5}>
        <Button type="submit" colorScheme="blue" isLoading={isSubmitting}>
          Save
        </Button>
        <Button colorScheme="yellow" ml={3} onClick={props.onClose}>
          Close
        </Button>
      </Box>
    </form>
  );
};

export default ResetPassword;
