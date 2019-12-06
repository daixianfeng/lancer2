import focusDAO from '../dao/focus.js';

const focusModel = {
    rename: async (ctx, params) => {
        try {
            const focus = focusDAO(ctx.sequelize);
            const result = await focus.update({ nickname: params.remarkname }, {
                where: {
                    focusId: params.focusId,
                    followId: ctx.userId,
                },
            });
            return result;
        } catch(e) {
            ctx.errorLog.error('Rename focus name error:');
            throw(e);
        }
    },
};

export default focusModel;