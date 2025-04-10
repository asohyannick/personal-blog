import { Request, Response } from "express";
import { StatusCodes } from 'http-status-codes';
import Post from "../../model/post/post.model";
const createPost = async(req: Request, res: Response): Promise<Response> => {
    const {
        title,
        content,
        author,
        tags,
        category,
        isPublishable,
        views, 
        imageURL,
        excerpt,
        readingTime,
    } = req.body;
    try {
        const newPost = new Post({
            title,
            content,
            author,
            tags,
            category,
            isPublishable,
            views,
            imageURL,
            excerpt,
            readingTime,
            date: Date.now(),
        });
        await newPost.save();
        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: "Post has been created successfully",
            newPost
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Something went wrong"})
    }
};

const fetchPosts = async(req: Request, res: Response): Promise<Response> => {
    try {
        const posts = await Post.find();
        return  res.status(StatusCodes.OK).json({message: "Posts have been fetched successfully", posts});
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Something went wrong"})
    }
};

const fetchPost = async(req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(StatusCodes.NOT_FOUND).json({message: "Post does not exist"})
        }
        return res.status(StatusCodes.OK).json({message: "Post has been fetched successfully", post});
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Something went wrong"})
    }
};

const updatePost = async(req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    try {
        const post = await Post.findByIdAndUpdate(id, req.body, {new: true});
        if (!post) {
            return res.status(StatusCodes.NOT_FOUND).json({message: "Post does not exist"})
        }
        return res.status(StatusCodes.OK).json({message: "Post has been updated successfully", post});
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Something went wrong"})
    }
};

const deletePost = async(req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    try {
        const post = await Post.findByIdAndDelete(id);
        if (!post) {
            return res.status(StatusCodes.NOT_FOUND).json({message: "Post does not exist"})
        }
        return res.status(StatusCodes.OK).json({message: "Post has been deleted successfully", post});
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Something went wrong"})
    }
};
const searchPost = async(req: Request, res: Response): Promise<Response> => {
    const {
        title,
        content,
        author,
        tags,
        category,
        isPublishable,
        views,
        imageURL,
        excerpt,
        readingTime,
        date,
        sortBy,
        sortOrder = 'asc',
        page = 1,
        limit = 12
    } = req.query;
    try {
        const pageNumber = typeof page === 'string' ? parseInt(page) : 1;
        const limitNumber = typeof limit === 'string' ? parseInt(limit) : 12;
        const filter: any = {};
        if (title) {
            filter.title = {$regex: title, $options: 'i'}
        }
        if (content) {
            filter.content = {$regex: content, $options: 'i'}
        }
        if (author) {
            filter.author = {$regex: author, $options: 'i'}
        }
        // Filter by tags if provided
        if (tags && typeof tags === 'string') {
            filter.tags = { $in: tags.split(',').map(tag => tag.trim()) }; // Split by commas for multiple tags
        } else if (Array.isArray(tags)) {
            filter.tags = { $in: tags.map(tag => (typeof tag === 'string' ? tag.trim() : tag)) }; // Handle array
        }
        if (category) {
            filter.category = {$regex: category, $options: 'i'}
        }
        if(isPublishable) {
            filter.isPublishable = { $regex: isPublishable, $options: 'i'}
        }
        if(views) {
            filter.views = { $regex: views, $options: 'i'}
        }
        if(imageURL) {
            filter.imageURL = { $regex: imageURL, $options: 'i'}
        }
        if(excerpt) {
            filter.excerpt = { $regex: excerpt, $options: 'i'}
        }
        if(readingTime){
           filter.readingTime = { $regex: readingTime, $options: 'i'}
        }
        if(date) {
            filter.date = { $regex: date, $options: 'i'}
        }
        const sortOptions: any = {};
        if (sortBy && typeof sortBy === 'string') {
            sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
        }
        const totalPost = await Post.countDocuments(filter);
        const posts = await Post.find(filter)
        .sort(sortOptions)
        .skip((pageNumber -1 ) * limitNumber)
        .limit(Number(limit))
        return res.status(StatusCodes.OK).json({
            posts,
            totalPost,
            totalPosts: Math.ceil(totalPost / limitNumber),
            currentPost: pageNumber
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Something went wrong"})
    }
};
export {
    createPost,
    fetchPosts,
    fetchPost,
    updatePost,
    deletePost,
    searchPost
}
