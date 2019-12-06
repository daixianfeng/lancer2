import videoModel from '../model/video.js';

export default {
    share: async (ctx, next) => {
        if (!ctx.userId) {
            ctx.body = JSON.stringify({ error: 403, message: '请登陆后操作' });
            return;
        }
        const link = ctx.request.body['link'];
        const title = ctx.request.body['title'];
        const tags = ctx.request.body['tags'];
        const isOpen = ctx.request.body['isOpen'];

        const isOpenInt = Number(isOpen) === 0 ? 0 : 1; 

        const videoDetail = await videoModel.add(ctx, { link, title, tags, isOpenInt });
        if (!videoDetail) {
            ctx.body = JSON.stringify({ error: 1, message: '您以分享过该视频' });
            return;
        }
        ctx.body = JSON.stringify({ error: 0, data: videoDetail });
    },
    forget: async (ctx, next) => {
        if (!ctx.userId) {
            ctx.body = JSON.stringify({ error: 403, message: '请登陆后操作' });
            return;
        }
        const videoId = ctx.request.body['videoId'];
        const result = await videoModel.remove(ctx, { videoId });
        if (!result) {
            ctx.body = JSON.stringify({ error: 1, message: '您未分享过该视频' });
            return;
        }
        ctx.body = JSON.stringify({ error: 0, data: result });
    },
    like: async (ctx, next) => {
        if (!ctx.userId) {
            ctx.body = JSON.stringify({ error: 403, message: '请登陆后操作' });
            return;
        }
        const videoId = ctx.request.body['videoId'];
        const result = await videoModel.like(ctx, { videoId });
        if (!result) {
            ctx.body = JSON.stringify({ error: 1, message: '您已关注过该视频' });
            return;
        }
        ctx.body = JSON.stringify({ error: 0, data: result });
    },
    unlike: async (ctx, next) => {
        if (!ctx.userId) {
            ctx.body = JSON.stringify({ error: 403, message: '请登陆后操作' });
            return;
        }
        const videoId = ctx.request.body['videoId'];
        const result = await videoModel.unlike(ctx, { videoId });
        if (!result) {
            ctx.body = JSON.stringify({ error: 1, message: '您未关注过该视频' });
            return;
        }
        ctx.body = JSON.stringify({ error: 0, data: result });
    },
    recommend: async (ctx, next) => {
        let q = ctx.request.body['q'] || ctx.query['q'] || '';
        let page = Number(ctx.request.body['page']) || Number(ctx.query['page']) || 1;
        let pageSize = Number(ctx.request.body['pageSize']) || Number(ctx.query['pageSize']) || 10;
        const videoList = await videoModel.getRecommend(ctx, { q, page, pageSize });
        if (!videoList) {
            ctx.body = JSON.stringify({ error: 1, message: '获取视频列表失败' });
            return;
        }
        ctx.body = JSON.stringify({ error: 0, data: videoList.rows, pagination: { page, pageSize, total: videoList.count } });
    },
    focusList: async (ctx, next) => {
        if (!ctx.userId) {
            ctx.body = JSON.stringify({ error: 403, message: '请登陆后操作' });
            return;
        }
        let q = ctx.request.body['q'] || ctx.query['q'] || '';
        let page = Number(ctx.request.body['page']) || Number(ctx.query['page']) || 1;
        let pageSize = Number(ctx.request.body['pageSize']) || Number(ctx.query['pageSize']) || 10;
        const videoList = await videoModel.getFocus(ctx, { q, page, pageSize });
        if (!videoList) {
            ctx.body = JSON.stringify({ error: 1, message: '获取视频列表失败' });
            return;
        }
        ctx.body = JSON.stringify({ error: 0, data: videoList.rows, pagination: { page, pageSize, total: videoList.count } });
    },
    getList: async (ctx, next) => {
        let q = ctx.request.body['q'] || ctx.query['q'] || '';
        let userId = ctx.request.body['userId'] || ctx.userId || '';
        let page = Number(ctx.request.body['page']) || Number(ctx.query['page']) || 1;
        let pageSize = Number(ctx.request.body['pageSize']) || Number(ctx.query['pageSize']) || 10;
        const videoList = await videoModel.getList(ctx, { q, userId, page, pageSize });
        if (!videoList) {
            ctx.body = JSON.stringify({ error: 1, message: '获取视频列表失败' });
            return;
        }
        ctx.body = JSON.stringify({ error: 0, data: videoList.rows, pagination: { page, pageSize, total: videoList.count } });
    },
    getMyList: async (ctx, next) => {
        if (!ctx.userId) {
            ctx.body = JSON.stringify({ error: 403, message: '请登陆后操作' });
            return;
        }
        let q = ctx.request.body['q'] || ctx.query['q'] || '';
        let userId = ctx.userId;
        let page = Number(ctx.request.body['page']) || Number(ctx.query['page']) || 1;
        let pageSize = Number(ctx.request.body['pageSize']) || Number(ctx.query['pageSize']) || 10;
        const videoList = await videoModel.getList(ctx, { q, userId, page, pageSize });
        if (!videoList) {
            ctx.body = JSON.stringify({ error: 1, message: '获取视频列表失败' });
            return;
        }
        ctx.body = JSON.stringify({ error: 0, data: videoList.rows, pagination: { page, pageSize, total: videoList.count } });
    },
    likeList: async (ctx, next) => {
        let q = ctx.request.body['q'] || ctx.query['q'] || '';
        let userId =  Number(ctx.request.body['userId']) || Number(ctx.query['userId']) || ctx.userId;
        let page = Number(ctx.request.body['page']) || Number(ctx.query['page']) || 1;
        let pageSize = Number(ctx.request.body['pageSize']) || Number(ctx.query['pageSize']) || 10;
        if (!userId) {
            ctx.body = JSON.stringify({ error: 1, message: '获取视频列表失败' });
            return;
        }
        const videoList = await videoModel.getLike(ctx, { q, userId, page, pageSize });
        if (!videoList) {
            ctx.body = JSON.stringify({ error: 1, message: '获取视频列表失败' });
            return;
        }
        ctx.body = JSON.stringify({ error: 0, data: videoList.rows, pagination: { page, pageSize, total: videoList.count } });
    },
}