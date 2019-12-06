import Router from 'koa-router';
import passportController from '../controller/passport.js';

const passport = new Router();

passport.post('/register.json', passportController.register);
passport.post('/login.json', passportController.login);
passport.post('/changePwd.json', passportController.changePwd);

export default passport;