import houseModel from '../model/user.js';
// var util = require('../../service/util.js');

export default {
    getList: async (ctx, next) => {
        const page = ctx.request.body['page'] || ctx.query['page'];
        const conditions = {
            page,
            pageSize: 10,
        };
        const output = await houseModel.getHouseList(ctx, conditions);
        ctx.body = JSON.stringify(output);
    },
}