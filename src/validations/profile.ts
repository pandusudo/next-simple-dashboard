import { z } from "zod";

export const updateNameSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export const resetPasswordSchema = z
  .object({
    old_password: z.string().optional(),
    password: z
      .string()
      .min(8, "Minimum new password 8 characters")
      .refine(
        (value) =>
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/.test(
            value
          ),
        {
          message:
            "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character (@$!%*?&)",
        }
      ),
    reconfirm_password: z
      .string()
      .min(8, "Minimum reconfirm password 8 characters"),
  })
  .superRefine((v, ctx) => {
    if (v.reconfirm_password !== v.password) {
      ctx.addIssue({
        path: ["reconfirm_password"],
        code: "custom",
        message: "The passwords did not match",
      });
    }
  });
