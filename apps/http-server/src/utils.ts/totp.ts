import { generateToken, verifyToken } from "authenticator";
import dotenv from "dotenv";

dotenv.config();

type VerifyOtpType = { delta: number } | null;

export function getOtp(phoneNumber: string): number {
  const totp = generateToken(phoneNumber.toString() + process.env.OTP_SECRET);
  return parseInt(totp);
}

export function verifyOtp(phoneNumber: string, totp: number): VerifyOtpType {
  const verifytotp = verifyToken(
    phoneNumber.toString() + process.env.OTP_SECRET,
    totp.toString()
  );
  return verifytotp;
}
