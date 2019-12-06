import Sequelize from 'sequelize';
import dbConfig from '../../config/mysql.js';

const mysqlMiddle = () => {
    return async (ctx, next) => {
        if(ctx.sequelize){
            await next();
        }else{
            const sequelize = new Sequelize(dbConfig.db, dbConfig.user, dbConfig.password, {
                ...dbConfig,
            });
            try {
                await sequelize.authenticate();
                Object.assign(ctx, {
                    sequelize,
                });
                await next();
            } catch(err) {
                ctx.errorLog.error('Database Connect Error:');
                throw(err);
            }
        }
    };
};
export default mysqlMiddle;