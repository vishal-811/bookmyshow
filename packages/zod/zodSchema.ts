import { z } from "zod";

export const SignUpZodSchema = z.object({
    phoneNumber : z.number(),
    name : z.string(),
})

export const OtpVerifyZodSchema = z.object({
    phoneNumber : z.number(),
    totp :z.number()
})

export const SigninZodSchema = z.object({
    phoneNumber : z.number()
})

