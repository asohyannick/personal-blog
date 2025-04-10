import express, { Application } from 'express';
import 'dotenv/config';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import databaseConfig from './config/db/databaseConfig.mongoDB';
import authRoute from './controller/auth/auth.controller';
import postRoute from './controller/post/post.controller';
import commentRoute from './controller/comment/comment.controller';
import notFound from './exception/404/notFound.middleware';
import errorHanlder from './exception/500/errorHandler.middleware';
const app: Application = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(compression());
app.use(cors({
    origin: process.env.FRONTEND_URL as string,
    credentials: true,
}));
app.use(helmet());
const APP_OWNER: string | number = process.env.APP_OWNER as string | number || 'codinglamb' as string | number;
const APP_HOST: string | number = process.env.APP_HOST as string | number || 'localhost' as string | number;
const PORT: string | number = process.env.PORT as string ||  parseInt('8000') as string | number;
const API_VERSION: string | number = process.env.API_VERSION as string | number || 'v1' as string | number;
if (process.env.NODE_ENV as string === 'development') {
    app.use(morgan('dev'));
}
// Routes
app.use(`/api/${API_VERSION}/auth`, authRoute);
app.use(`/api/${API_VERSION}/post`, postRoute);
app.use(`/api/${API_VERSION}/comment`, commentRoute);
app.use(notFound);
app.use(errorHanlder)
async function serve() {
    await databaseConfig(),
    app.listen(PORT, () => {
    console.log(`Server is owned by ${APP_OWNER} running on ${APP_HOST} on port ${PORT}: /api/${API_VERSION}...`)
})
}
serve();
