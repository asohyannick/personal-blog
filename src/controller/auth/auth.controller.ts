import express from 'express';
import { register, login } from '../../service/auth/auth.service';
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
)
export default router;
