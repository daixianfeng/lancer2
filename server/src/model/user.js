import userDAO from '../dao/user.js';
import focusDAO from '../dao/focus.js';
import md5 from 'crypto-js/md5';

const userModel = {
    login: async (ctx, params) => {
        try {
            const user = userDAO(ctx.sequelize);
            const userDetail = await user.findOne({
                where: {
                    username: params.username,
                    password: md5(md5(params.password).toString()).toString(),
                    status: 0,
                },
            });
            if (userDetail) {
                const showDetail = {
                    avatar: userDetail.avatar,
                    birthday: userDetail.birthday,
                    cellphone: userDetail.cellphone,
                    city: userDetail.city,
                    contact: userDetail.contact,
                    desc: userDetail.desc,
                    gender: userDetail.gender,
                    id: userDetail.id,
                    nickname: userDetail.nickname,
                    username: userDetail.username,
                }
                return showDetail;
            }
            return null;
        } catch(e) {
            ctx.errorLog.error('Login error:');
            throw(e);
        }
    },
    register: async (ctx, params) => {
        try {
            const user = userDAO(ctx.sequelize);
            const [userDetail, isSuccess] = await user.findOrCreate({
                where: {
                    username: params.username,
                },
                defaults: {
                    username: params.username,
                    nickname: params.nickname,
                    cellphone: params.username,
                    password: md5(md5(params.password).toString()).toString(),
                    status: 0,
                    createTime: Date.now(),
                },
            });
            if (isSuccess) {
                const showDetail = {
                    avatar: userDetail.avatar,
                    birthday: userDetail.birthday,
                    cellphone: userDetail.cellphone,
                    city: userDetail.city,
                    contact: userDetail.contact,
                    desc: userDetail.desc,
                    gender: userDetail.gender,
                    id: userDetail.id,
                    nickname: userDetail.nickname,
                    username: userDetail.username,
                }
                return showDetail;
            }
            return null;
        } catch(e) {
            ctx.errorLog.error('Register error:');
            throw(e);
        }
    },
    editMyDetail: async (ctx, params) => {
        try {
            const user = userDAO(ctx.sequelize);
            const userDetail = await user.update({
                nickname: params.nickname,
                gender: params.gender,
                birthday: params.birthday,
                city: params.city,
                contact: params.contact,
                desc: params.desc,
                avatar: params.avatar,
            }, {
                where: {
                    id: ctx.userId,
                },
            });
            return userDetail;
        } catch(e) {
            ctx.errorLog.error('Edit detail error:');
            throw(e);
        }
    },
    changePwd: async (ctx, params) => {
        try {
            const user = userDAO(ctx.sequelize);
            const userDetail = await user.findOne({
                where: {
                    id: ctx.userId,
                    username: params.username,
                    password: md5(md5(params.password).toString()).toString(),
                    status: 0,
                },
            });
            if (userDetail) {
                const result = await user.update({password: md5(md5(params.newPassword).toString()).toString()}, {
                    where: {
                        id: ctx.userId,
                        username: params.username,
                        status: 0,
                    },
                });
                return result;
            }
            return null;
        } catch(e) {
            ctx.errorLog.error('Change password error:');
            throw(e);
        }
    },
    getDetailById: async (ctx, params) => {
        try {
            const user = userDAO(ctx.sequelize);
            let { userId } = params;
            const userDetail = await user.findOne({
                where: {
                    id: userId,
                },
            });
            const showDetail = {
                avatar: userDetail.avatar,
                birthday: userDetail.birthday,
                cellphone: userDetail.cellphone,
                city: userDetail.city,
                contact: userDetail.contact,
                desc: userDetail.desc,
                gender: userDetail.gender,
                id: userDetail.id,
                nickname: userDetail.nickname,
                username: userDetail.username,
            }
            return showDetail;
        } catch(e) {
            ctx.errorLog.error('Get userDetail error:');
            throw(e);
        }
    },
    focus: async (ctx, params) => {
        try {
            const focus = focusDAO(ctx.sequelize);
            const result = await ctx.sequelize.transaction((t) => {
                return focus.findOne({
                    where: {
                        focusId: params.focusId,
                        followId: ctx.userId,
                    },
                    transaction: t,
                }).then((focusDetail) => {
                    if(focusDetail) {
                        return focus.update({ status: 0, createTime: Date.now() }, {
                            where: {
                                focusId: params.focusId,
                                followId: ctx.userId,
                            },
                            transaction: t,
                        })
                    }
                    return focus.create({
                        focusId: params.focusId,
                        followId: ctx.userId,
                        status: 0,
                        createTime: Date.now(),
                    }, {
                        transaction: t,
                    });
                });
            });
            return result;
        } catch(e) {
            ctx.errorLog.error('Focus user error:');
            throw(e);
        }
    },
    unfocus: async (ctx, params) => {
        try {
            const focus = focusDAO(ctx.sequelize);
            const result = await focus.update({status: 1}, {
                where: {
                    focusId: params.focusId,
                    followId: ctx.userId,
                },
            });
            return result;
        } catch(e) {
            ctx.errorLog.error('Unfocus user error:');
            throw(e);
        }
    },
    getFocus: async (ctx, params) => {
        try {
            const user = userDAO(ctx.sequelize);
            const focus = focusDAO(ctx.sequelize);
            const conditions = { status: 0 };
            const userList = await user.findAndCountAll({
                include: {
                    model: focus,
                    as: 'like',
                    association: user.belongsTo(focus, { foreignKey: 'id', targetKey: 'focusId' }),
                    where: {
                        status: 0,
                        followId: params.userId,
                    },
                },
                limit: params.pageSize,
                offset: (params.page-1) * params.pageSize,
                order: [['createTime', 'DESC']],
                where: conditions,
            });
            return userList;
        } catch(e) {
            ctx.errorLog.error('Get focus user error:');
            throw(e);
        }
    },
    getFollow: async (ctx, params) => {
        try {
            const user = userDAO(ctx.sequelize);
            const focus = focusDAO(ctx.sequelize);
            const conditions = { status: 0 };
            const userList = await user.findAndCountAll({
                include: {
                    model: focus,
                    as: 'like',
                    association: user.belongsTo(focus, { foreignKey: 'id', targetKey: 'followId' }),
                    where: {
                        status: 0,
                        focusId: params.userId,
                    },
                },
                limit: params.pageSize,
                offset: (params.page-1) * params.pageSize,
                order: [['createTime', 'DESC']],
                where: conditions,
            });
            return userList;
        } catch(e) {
            ctx.errorLog.error('Get follow user error:');
            throw(e);
        }
    },
};

export default userModel;