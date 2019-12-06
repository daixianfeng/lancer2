import userModel from '../model/user.js';
import videoModel from '../model/video.js';
// var util = require('../../service/util.js');

export default {
    getMyDetail: async (ctx, next) => {
        const userId = ctx.userId;
        if (userId) {
            const output = await userModel.getDetailById(ctx, { userId });
            ctx.body = JSON.stringify({ error: 0, data: output });
        } else {
            ctx.body = JSON.stringify({ error: 403, message: '权限不足' });
        }
    },
    getDetail: async (ctx, next) => {
        let userId = ctx.request.body['userId'] || ctx.userId;
        const output = await userModel.getDetailById(ctx, { userId });
        ctx.body = JSON.stringify(output);
    },
    editDetail: async (ctx, next) => {
        if (!ctx.userId) {
            ctx.body = JSON.stringify({ error: 403, message: '请登陆后操作' });
            return;
        }
        let nickname = ctx.request.body['nickname'] || null;
        let gender = ctx.request.body['gender'] || null;
        let birthday = ctx.request.body['birthday'] || null;
        let city = ctx.request.body['city'] || null;
        let contact = ctx.request.body['contact'] || null;
        let desc = ctx.request.body['desc'] || null;
        let avatar = ctx.request.body['avatar'] || null;
        const output = await userModel.editMyDetail(ctx, {
            nickname,
            gender,
            birthday,
            city,
            contact,
            desc,
            avatar,
        });
        ctx.body = JSON.stringify(output);
    },
    focus: async (ctx, next) => {
        let focusId = ctx.request.body['userId'] || '';
        if (!ctx.userId) {
            ctx.body = JSON.stringify({ error: 403, message: '请登陆后操作' });
            return;
        }
        if (!focusId) {
            ctx.body = JSON.stringify({ error: 1, message: '请选择关注的用户' });
            return;
        }
        const output = await userModel.focus(ctx, { focusId });
        if (output) {
            ctx.body = JSON.stringify({ error: 0, data: output });
        } else {
            ctx.body = JSON.stringify({ error: 1, message: '关注失败' });
        }
    },
    unfocus: async (ctx, next) => {
        let focusId = ctx.request.body['userId'] || '';
        if (!ctx.userId) {
            ctx.body = JSON.stringify({ error: 403, message: '请登陆后操作' });
            return;
        }
        if (!focusId) {
            ctx.body = JSON.stringify({ error: 1, message: '请选择取消关注的用户' });
            return;
        }
        const output = await userModel.unfocus(ctx, { focusId });
        if (output) {
            ctx.body = JSON.stringify({ error: 0, data: output });
        } else {
            ctx.body = JSON.stringify({ error: 1, message: '取消关注失败' });
        }
    },
    focusList: async (ctx, next) => {
        let userId = Number(ctx.request.body['userId']) || Number(ctx.query['userId'])  || ctx.userId;
        let page = Number(ctx.request.body['page']) || Number(ctx.query['page']) || 1;
        let pageSize = Number(ctx.request.body['pageSize']) || Number(ctx.query['pageSize']) || 10;
        if (!userId) {
            ctx.body = JSON.stringify({ error: 1, message: '获取关注用户列表失败' });
            return;
        }
        const userList = await videoModel.getFocus(ctx, { userId, page, pageSize });
        if (!userList) {
            ctx.body = JSON.stringify({ error: 1, message: '获取关注用户列表失败' });
            return;
        }
        ctx.body = JSON.stringify({ error: 0, data: userList.rows, pagination: { page, pageSize, total: userList.count } });
    },
    followList: async (ctx, next) => {
        let userId = Number(ctx.request.body['userId']) || Number(ctx.query['userId'])  || ctx.userId;
        let page = Number(ctx.request.body['page']) || Number(ctx.query['page']) || 1;
        let pageSize = Number(ctx.request.body['pageSize']) || Number(ctx.query['pageSize']) || 10;
        if (!userId) {
            ctx.body = JSON.stringify({ error: 1, message: '获取粉丝用户列表失败' });
            return;
        }
        const userList = await userModel.getFollow(ctx, { userId, page, pageSize });
        if (!userList) {
            ctx.body = JSON.stringify({ error: 1, message: '获取粉丝用户列表失败' });
            return;
        }
        ctx.body = JSON.stringify({ error: 0, data: userList.rows, pagination: { page, pageSize, total: userList.count } });
    },
}