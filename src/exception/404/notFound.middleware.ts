import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
const notFound = (req: Request, res: Response) => {
    return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Route does not exist",
        status: StatusCodes.NOT_FOUND || "Something went wrong"
    });
};

export default notFound;
