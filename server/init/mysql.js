import Sequelize from 'sequelize';
import dbConfig from '../config/mysql.js';
import userDAO from '../src/dao/user.js';
import focusDAO from '../src/dao/focus.js';
import likeDAO from '../src/dao/like.js';
import tagsDAO from '../src/dao/tags.js';
import videoDAO from '../src/dao/video.js';

const sequelize = new Sequelize(dbConfig.db, dbConfig.user, dbConfig.password, {
    ...dbConfig,
});
try {
    sequelize.authenticate().then(() => {
        // userDAO(sequelize).sync({ alter: true });
    }).then(() => {
        // videoDAO(sequelize).sync({ alter: true });
        // focusDAO(sequelize).sync({ alter: true });
    }).then(() => {
        likeDAO(sequelize).sync({ alter: true });
        tagsDAO(sequelize).sync({ alter: true });
    });
} catch(err) {
    ctx.errorLog.error('Database Connect Error:');
    throw(err);
}