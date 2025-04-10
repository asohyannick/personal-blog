import express from 'express';
import { register, login, refreshAccessToken, fetchUsers, fetchUser, updateUser, deleteUser } from '../../service/auth/auth.service';
import { authToken } from '../../middleware/auth/authToken.middleware';
import schemaValidator from '../../util/schema.helper';
const router = express.Router();
router.post('/create-account',
    schemaValidator("/auth/create-account"),
    register
);
router.post('/login',
    schemaValidator("/auth/login"),
    authToken,
    login
);
router.post('/refresh-access-token',
    authToken,
    refreshAccessToken
);
router.get('/fetch-users',
    authToken,
    fetchUsers
);
router.get('/fetch-user/:id',
    authToken,
    fetchUser
);
router.put('/update-user/:id',
    authToken,
    updateUser
);
router.delete('/delete-user/:id',
    authToken,
    deleteUser
)
export default router;
