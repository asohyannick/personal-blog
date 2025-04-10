import express from 'express';
import { authToken } from '../../middleware/auth/authToken.middleware';
import { createComment, deleteComment, fetchComment, fetchComments, updateComment } from '../../service/comment/comment.service';
const router = express.Router();
router.post('/create-comment',
    authToken,
    createComment
);
router.get('/fetch-comments',
    authToken,
    fetchComments
);
router.get('/fetch-comment/:id',
    authToken,
    fetchComment
);
router.put('/update-comment/:id',
    authToken,
    updateComment
);
router.delete('/delete-comment/:id',
    authToken,
    deleteComment
)
export default router;
