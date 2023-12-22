import { CircularProgress, Center } from "@chakra-ui/react";

const LoadingSpinner = () => {
  return (
    <Center h="100vh">
      {" "}
      <CircularProgress isIndeterminate color="teal.500" size="4rem" />
    </Center>
  );
};

export default LoadingSpinner;
