import { z } from "zod";

export const SignUpZodSchema = z.object({
    phoneNumber : z.number(),
    name : z.string(),
})