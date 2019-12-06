import Router from 'koa-router';
import userController from '../controller/user.js';

const user = new Router();

user.get('/detail.json', userController.getMyDetail);
user.post('/focus.json', userController.focus);
user.post('/unfocus.json', userController.unfocus);
user.get('/like.json', userController.focusList);
user.get('/follow.json', userController.followList);
user.post('/edit.json', userController.editDetail);

export default user;