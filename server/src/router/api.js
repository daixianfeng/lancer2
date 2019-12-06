import Router from 'koa-router';
import passport from './passport.js';
import user from './user.js';
import video from './video.js';

const apiRouter = new Router();
apiRouter.use('/passport', passport.routes(), passport.allowedMethods());
apiRouter.use('/user', user.routes(), user.allowedMethods());
apiRouter.use('/video', video.routes(), video.allowedMethods());

export default apiRouter;