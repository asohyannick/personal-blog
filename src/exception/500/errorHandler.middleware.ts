import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
const errorHanlder = (req: Request, res: Response) => {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: true,
        message: "Something went wrong",
        status: StatusCodes.INTERNAL_SERVER_ERROR || "Something went wrong"
    });
};

export default errorHanlder;
