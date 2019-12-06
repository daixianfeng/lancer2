import Router from 'koa-router';
import videoController from '../controller/video.js';

const video = new Router();

video.post('/share.json', videoController.share);
video.post('/forget.json', videoController.forget);
video.get('/recommend.json', videoController.recommend);
video.get('/focus.json', videoController.focusList);
video.get('/list.json', videoController.getList);
video.get('/my.json', videoController.getMyList);
video.get('/like.json', videoController.likeList);
video.post('/focus.json', videoController.like);
video.post('/unfocus.json', videoController.unlike);

export default video;