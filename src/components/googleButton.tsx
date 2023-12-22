import { Button, Image } from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import GoogleLogo from "@/public/images/google-logo.png";

export default function GoogleButton() {
  const handleClick = () => {
    signIn("google", { redirect: false, callbackUrl: "/dashboard" });
    // , {
    //   callbackUrl: "/dashboard",
    // });
  };

  return (
    <Button
      colorScheme="white"
      bgColor="white"
      textColor="black"
      borderColor="black"
      borderWidth="1px"
      type="submit"
      onClick={handleClick}
      display="flex"
      alignItems="center"
    >
      <Image src={GoogleLogo.src} boxSize="5" mr="2" alt="Google Logo" />
      Continue with Google
    </Button>
  );
}
