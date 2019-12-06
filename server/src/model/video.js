import Sequelize from 'Sequelize';

import videoDAO from '../dao/video.js';
import focusDAO from '../dao/focus.js';
import likeDAO from '../dao/like.js';
import tagsDAO from '../dao/tags.js';

const genSearchQuery = (q) => {
    const {or, like} = Sequelize.Op;
    const conditions = {};
    if (q) {
        const search = q.split(' ');
        search.forEach((v) => {
            if(v) {
                if(!conditions[or]) {
                    conditions[or] = [];
                }
                conditions[or].push({ title: { [like]: `%${v}%` }});
                conditions[or].push({ tags: { [like]: `%${v}%` }});
            }
        })
    }
    return conditions;
}
const videoModel = {
    add: async (ctx, params) => {
        try {
            const video = videoDAO(ctx.sequelize);
            const tags = tagsDAO(ctx.sequelize);
            const result = await ctx.sequelize.transaction((t) => {
                return video.findOrCreate({
                    where: {
                        link: params.link,
                        ownerId: ctx.userId,
                        status: 0,
                    },
                    defaults: {
                        ownerId: ctx.userId,
                        link: params.link,
                        title: params.title,
                        tags: params.tags,
                        isOpen: params.isOpenInt,
                        followNum: 0,
                        viewNum: 0,
                        status: 0,
                        createTime: Date.now(),
                    },
                    transaction: t,
                }).then(([videoDetail, isSuccess]) => {
                    if (!isSuccess) {
                        throw new Error('video repeat');
                    }
                    const tagsList = params.tags.split(';').map((v) => {
                        v = {
                            videoId: videoDetail.id,
                            name: v.trim(/\s/),
                            status: 0,
                            createTime: Date.now(),
                        };
                        return v;
                    });
                    return tags.bulkCreate(tagsList, { transaction: t });
                });
            });
            return result;
        } catch(e) {
            if (e.message === 'video repeat') {
                return null;
            }
            ctx.errorLog.error('Add video error:');
            throw(e);
        }
    },
    remove: async (ctx, params) => {
        try {
            const video = videoDAO(ctx.sequelize);
            const result = await video.update({status: 1}, {
                where: {
                    videoId: params.videoId,
                    ownerId: ctx.userId,
                },
            });
            return result;
        } catch(e) {
            ctx.errorLog.error('Remove video error:');
            throw(e);
        }
    },
    getRecommend: async (ctx, params) => {
        try {
            const video = videoDAO(ctx.sequelize);
            let conditions = genSearchQuery(params.q);
            conditions = { ...conditions, status: 0, isOpen: 1 };
            const videoList = await video.findAndCountAll({
                limit: params.pageSize,
                offset: (params.page-1) * params.pageSize,
                order: [['followNum', 'DESC']],
                where: conditions,
            });
            return videoList;
        } catch(e) {
            ctx.errorLog.error('Get recommend video error:');
            throw(e);
        }
    },
    getFocus: async (ctx, params) => {
        try {
            const video = videoDAO(ctx.sequelize);
            const focus = focusDAO(ctx.sequelize);
            let conditions = genSearchQuery(params.q);
            conditions = { ...conditions, status: 0, isOpen: 1 };
            const videoList = await video.findAndCountAll({
                include: {
                    model: focus,
                    as: 'focus',
                    association: video.belongsTo(focus, { foreignKey: 'ownerId', targetKey: 'focusId' }),
                    where: {
                        status: 0,
                        followId: ctx.userId,
                    },
                },
                limit: params.pageSize,
                offset: (params.page-1) * params.pageSize,
                order: [['followNum', 'DESC']],
                where: conditions,
            });
            return videoList;
        } catch(e) {
            ctx.errorLog.error('Get focus video error:');
            throw(e);
        }
    },
    getList: async (ctx, params) => {
        try {
            const video = videoDAO(ctx.sequelize);
            let conditions = genSearchQuery(params.q);
            conditions = { ...conditions, status: 0, isOpen: 1, ownerId: params.userId };
            const videoList = await video.findAndCountAll({
                limit: params.pageSize,
                offset: (params.page-1) * params.pageSize,
                order: [['followNum', 'DESC']],
                where: conditions,
            });
            return videoList;
        } catch(e) {
            ctx.errorLog.error('Get video list error:');
            throw(e);
        }
    },
    getLike: async (ctx, params) => {
        try {
            const video = videoDAO(ctx.sequelize);
            const like = likeDAO(ctx.sequelize);
            let conditions = genSearchQuery(params.q);
            conditions = { ...conditions, status: 0, isOpen: 1 };
            const videoList = await video.findAndCountAll({
                include: {
                    model: like,
                    as: 'like',
                    association: video.belongsTo(like, { foreignKey: 'id', targetKey: 'videoId' }),
                    where: {
                        status: 0,
                        userId: params.userId,
                    },
                },
                limit: params.pageSize,
                offset: (params.page-1) * params.pageSize,
                order: [['followNum', 'DESC']],
                where: conditions,
            });
            return videoList;
        } catch(e) {
            ctx.errorLog.error('Get like video error:');
            throw(e);
        }
    },
    like: async (ctx, params) => {
        try {
            const like = likeDAO(ctx.sequelize);
            const video = videoDAO(ctx.sequelize);
            const result = await ctx.sequelize.transaction((t) => {
                return video.increment({ followNum: 1 }, {
                    where: {
                        videoId: params.videoId,
                    },
                    transaction: t,
                }).then(() => {
                    return like.findOne({
                        where: {
                            videoId: params.videoId,
                            userId: ctx.userId,
                        },
                    })
                }).then((likeDetail) => {
                    if(likeDetail) {
                        return like.update({ status: 0, createTime: Date.now() }, {
                            where: {
                                videoId: params.videoId,
                                userId: ctx.userId,
                            },
                            transaction: t,
                        })
                    }
                    return like.create({
                        videoId: params.videoId,
                        userId: ctx.userId,
                        status: 0,
                        createTime: Date.now(),
                    }, {
                        transaction: t,
                    });
                });
            });
            return result;
        } catch(e) {
            ctx.errorLog.error('Like video error:');
            throw(e);
        }
    },
    unlike: async (ctx, params) => {
        try {
            const like = likeDAO(ctx.sequelize);
            const result = await ctx.sequelize.transaction((t) => {
                return like.update({status: 1}, {
                    where: {
                        videoId: params.videoId,
                        userId: ctx.userId,
                    },
                }).then(([likeDetail, isSuccess]) => {
                    if (!isSuccess) {
                        throw new Error('video repeat');
                    }
                    return video.increment({ followNum: -1 }, {
                        where: {
                            videoId: params.videoId,
                        },
                        transaction: t,
                    })
                });
            });
            return result;
        } catch(e) {
            ctx.errorLog.error('Unlike video error:');
            throw(e);
        }
    },
};

export default videoModel;