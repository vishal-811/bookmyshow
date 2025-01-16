import { Router, Request, Response } from "express";
import { SignUpZodSchema } from "@repo/zod/zodSchema";

const router = Router();

router.post("/signup", (req : Request, res : Response) =>{
    const validateInput = SignUpZodSchema.safeParse(req.body);
    if(!validateInput.success){
      return;
    }

    const { phoneNumber, name } = validateInput.data;
    console.log(phoneNumber,name)
})

router.post("signup/verify",(req: Request, res : Response) => {

})

export default router;