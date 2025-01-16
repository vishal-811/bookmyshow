import { Router, Request, Response } from "express";
import {
  OtpVerifyZodSchema,
  SigninZodSchema,
  SignUpZodSchema,
} from "@repo/zod/zodSchema";
import ApiResponse from "../utils.ts/apiResponse";
import { getOtp, verifyOtp } from "../utils.ts/totp";
import { client } from "@repo/db/client";
import Jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

router.post("/signup", async (req: Request, res: Response) => {
  const validInput = SignUpZodSchema.safeParse(req.body);
  if (!validInput.success) {
    return ApiResponse(req, res, 401, false, {
      data: "please provide a valid input field",
    });
  }

  try {
    const { phoneNumber, name } = validInput.data;
    const totp = getOtp(phoneNumber.toString());

    const user = await client.user.upsert({
      where: {
        phoneNumber: phoneNumber,
      },
      create: {
        phoneNumber: phoneNumber,
        name: name,
        isverified: false,
      },
      update: {
        name: name,
      },
    });

    return ApiResponse(req, res, 200, true, {
      data: `your otp is ${totp}`,
      userId: user.id,
    });
  } catch (error) {
    return ApiResponse(req, res, 500, false, {
      error: "Internal Server error",
    });
  }
});

router.post("/signup/verify", async (req: Request, res: Response) => {
  const validInput = OtpVerifyZodSchema.safeParse(req.body);
  if (!validInput.success) {
    return ApiResponse(req, res, 401, false, {
      data: "Please provide a valid inpit field",
    });
  }

  try {
    const { phoneNumber, totp } = validInput.data;
    const isOtpverified = verifyOtp(phoneNumber.toString(), totp);
    if (!isOtpverified) {
      return ApiResponse(req, res, 401, false, {
        data: "please provide a valid otp",
      });
    }

    const user = await client.user.update({
      where: {
        phoneNumber: phoneNumber,
      },
      data: {
        isverified: true,
      },
    });

    const token = Jwt.sign(user.id, process.env.JWT_SECRET || "");

    return ApiResponse(req, res, 200, true, {
      message: "otp verified successfully",
      token: token,
      isUserVerified: user.isverified,
    });
  } catch {
    return ApiResponse(req, res, 500, false, {
      message: "Intrenal server error",
    });
  }
});

router.post("/signin", async (req: Request, res: Response) => {
  const validInput = SigninZodSchema.safeParse(req.body);
  if (!validInput.success) {
    return ApiResponse(req, res, 401, false, {
      data: "please provide a valid input fields",
    });
  }

  try {
    const { phoneNumber } = validInput.data;

    const userExist = await client.user.findFirst({
      where: {
        phoneNumber: phoneNumber,
      },
    });

    if (!userExist) {
      return ApiResponse(req, res, 404, false, {
        message: "No user exist with this phone number",
      });
    }
    const totp = getOtp(phoneNumber.toString());
    return ApiResponse(req, res, 201, true, { data: `your otp is ${totp}` });
  } catch (error) {
    return ApiResponse(req, res, 500, false, {
      error: "Internal server error",
    });
  }
});

router.post("/signin/verify", async (req: Request, res: Response) => {
  const validInput = OtpVerifyZodSchema.safeParse(req.body);
  if (!validInput.success) {
    return ApiResponse(req, res, 401, false, {
      data: "please provide  a  valid input field",
    });
  }
  try {
    const { phoneNumber, totp } = validInput.data;

    const userExist = await client.user.findFirst({
      where: {
        phoneNumber: phoneNumber,
      },
    });

    if (!userExist) {
      return ApiResponse(req, res, 404, false, {
        data: "No user exist with this phone number",
      });
    }
    const verifiedtopt = verifyOtp(phoneNumber.toString(), totp);
    if (!verifiedtopt) {
      return ApiResponse(req, res, 401, false, {
        data: "please provide a valid otp",
      });
    }
    
    const token = Jwt.sign(userExist.id,process.env.JWT_SECRET || "");

    return ApiResponse(req, res, 200, true, {
      data: "otp verified sucessfully",
      token : token
    });
  } catch (error) {
    return ApiResponse(req, res, 500, false, { data: "internal Server Error" });
  }
});

export default router;
