import { ChakraProvider } from "@chakra-ui/react";
import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Test</title>
      </head>
      <body>
        <ChakraProvider>
          <React.Fragment>{children}</React.Fragment>
        </ChakraProvider>
      </body>
    </html>
  );
}
