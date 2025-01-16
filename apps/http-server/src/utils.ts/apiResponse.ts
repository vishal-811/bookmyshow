import { Request, Response } from "express";

export default function ApiResponse(
  req: Request,
  res: Response,
  code: number,
  success: boolean,
  message: object
) {
  res.status(code).json({
    success: success,
    message: message,
  });
  return;
}
