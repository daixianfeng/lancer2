import moment from 'moment';
import Sequelize from 'sequelize';

export default (sequelize) => {
    return sequelize.define('tags', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        videoId: {
            type:  Sequelize.INTEGER,
            references: {
                model: 'video',
                key: 'id',
            },
            allowNull: false,
        },
        name: {
            type:  Sequelize.STRING,
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