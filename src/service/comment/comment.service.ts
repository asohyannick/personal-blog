import Comment from "../../model/comment/comment.model";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
const createComment = async(req: Request, res:Response): Promise<Response> => {
    const {
        postId,
        author, 
        content,
    } = req.body;
    try {
        const newComment = new Comment({
            postId,
            author,
            content,
            isApproved: true,
            date: Date.now(),
        });
        await newComment.save();
        return res.status(StatusCodes.CREATED).json({
            success: true,
            newComment,
            message: "Comment has been submitted successfully"
        });
    } catch (error) {
        return res.status(StatusCodes.OK).json({message: "Something went wrong"});
    }
};

const fetchComments = async(req: Request, res:Response): Promise<Response> => {
    try {
        const comments = await Comment.find();
        return res.status(StatusCodes.OK).json({message: "Comments have been fetched successfully", comments});
    } catch (error) {
        return res.status(StatusCodes.OK).json({message: "Something went wrong"});
    }
};

const fetchComment = async(req: Request, res:Response): Promise<Response> => {
    const { id } = req.params;
    try {
        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Comment does not exist",
                comment
            });
        }
        return res.status(StatusCodes.OK).json({message: "Comment has been fetched successfully", comment});
    } catch (error) {
        return res.status(StatusCodes.OK).json({message: "Something went wrong"});
    }
};

const updateComment = async(req: Request, res:Response): Promise<Response> => {
    const { id } = req.params;
    try {
        const comment = await Comment.findByIdAndUpdate(id, req.body, {new: true});
        if (!comment) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Comment does not exist",
                comment
            });
        }
        return res.status(StatusCodes.OK).json({message: "Comment has been updated successfully", comment});
    } catch (error) {
        return res.status(StatusCodes.OK).json({message: "Something went wrong"});
    }
};

const deleteComment = async(req: Request, res:Response): Promise<Response> => {
    const { id } = req.params;
    try {
        const comment = await Comment.findByIdAndDelete(id);
        if (!comment) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Comment does not exist",
                comment
            });
        }
        return res.status(StatusCodes.OK).json({message: "Comment has been deleted successfully", comment});
    } catch (error) {
        return res.status(StatusCodes.OK).json({message: "Something went wrong"});
    }
};



export {
    createComment,
    fetchComments,
    fetchComment,
    updateComment,
    deleteComment
}
