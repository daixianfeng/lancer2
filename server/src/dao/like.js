import moment from 'moment';
import Sequelize from 'sequelize';

export default (sequelize) => {
    return sequelize.define('like', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        userId: {
            type:  Sequelize.INTEGER,
            references: {
                model: 'user',
                key: 'id',
            },
            allowNull: false,
        },
        videoId: {
            type:  Sequelize.INTEGER,
            references: {
                model: 'video',
                key: 'id',
            },
            allowNull: false,
        },
        createTime: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        status: { //状态
            type: Sequelize.INTEGER,
        },
    }, {
        freezeTableName: true,
    });
}