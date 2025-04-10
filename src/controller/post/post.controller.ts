import express from 'express';
import { authToken } from '../../middleware/auth/authToken.middleware';
import { createPost, deletePost, fetchPost, fetchPosts, searchPost, updatePost } from '../../service/post/post.service';
import schemaValidator from '../../util/schema.helper';
const router = express.Router();
router.post('/create-post',
    authToken,
    schemaValidator("/post/create-post"),
    createPost
);
router.get('/fetch-posts',
    authToken,
    fetchPosts
);
router.get('/fetch-post/:id',
    authToken,
    fetchPost,
);
router.put('/update-post/:id',
    authToken,
    updatePost
);
router.delete('/remove-post/:id',
    authToken,
    deletePost
);
router.get('/search-post',
    authToken,
    searchPost
)
export default router;
