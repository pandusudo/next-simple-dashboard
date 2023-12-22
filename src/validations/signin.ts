import { z } from "zod";

export const signinSchema = z.object({
  email: z.string().min(1,'Email is required').email({ message: "Incorrect email format" }),
  password: z.string().min(8, "Minimum password 8 characters").refine((value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/.test(value), {
    message: "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character (@$!%*?&)",
  }),
});
