import jwt from 'jsonwebtoken';
import userModel from '../model/user.js';
import config from '../../config/index.js';

export default {
    register: async (ctx, next) => {
        const username = ctx.request.body['username'];
        const nickname = ctx.request.body['nickname'];
        const password = ctx.request.body['password'];
        const output = await userModel.register(ctx, { username, nickname, password });
        if (output) {
            ctx.session.id = output.id;
            const token = jwt.sign({ id: output.id }, config.tokenSecret, { expiresIn: '2h' });
            ctx.body = JSON.stringify({ error: 0, data: output, token });
        } else {
            ctx.session.id = undefined;
            ctx.body = JSON.stringify({ error: 1, message: '用户名已存在' });
        }
    },
    login: async (ctx, next) => {
        const username = ctx.request.body['username'];
        const password = ctx.request.body['password'];
        const output = await userModel.login(ctx, { username, password });
        if (output) {
            ctx.session.id = output.id;
            const token = jwt.sign({ id: output.id }, config.tokenSecret, { expiresIn: '2h' });
            ctx.body = JSON.stringify({ error: 0, data: output, token });
        } else {
            ctx.session.id = undefined;
            ctx.body = JSON.stringify({ error: 1, message: '用户名或密码错误' });
        }
    },
    changePwd: async (ctx, next) => {
        if (!ctx.userId) {
            ctx.body = JSON.stringify({ error: 403, message: '请登陆后操作' });
            return;
        }
        const username = ctx.request.body['username'];
        const password = ctx.request.body['password'];
        const newPassword = ctx.request.body['newPassword'];
        const output = await userModel.changePwd(ctx, { username, password, newPassword });
        if (output) {
            ctx.body = JSON.stringify({ error: 0, data: output });
        } else {
            ctx.body = JSON.stringify({ error: 1, message: '用户名或密码错误' });
        }
    },
}