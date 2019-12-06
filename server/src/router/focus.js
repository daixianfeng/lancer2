import Router from 'koa-router';
import focusController from '../controller/focus.js';

const focus = new Router();

focus.post('/remark.json', focusController.remark);

export default focus;