import focusModel from '../model/focus.js';

export default {
    remark: async (ctx, next) => {
        let focusId = ctx.request.body['userId'] || '';
        let remarkname = ctx.request.body['remarkname'] || '';
        if (!ctx.userId) {
            ctx.body = JSON.stringify({ error: 403, message: '请登陆后操作' });
            return;
        }
        if (!focusId) {
            ctx.body = JSON.stringify({ error: 1, message: '请选择关注的用户' });
            return;
        }
        const output = await focusModel.focus(ctx, { focusId, remarkname });
        if (output) {
            ctx.body = JSON.stringify({ error: 0, data: output });
        } else {
            ctx.body = JSON.stringify({ error: 1, message: '修改备注失败' });
        }
    },
}