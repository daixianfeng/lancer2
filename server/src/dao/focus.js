import moment from 'moment';
import Sequelize from 'sequelize';

export default (sequelize) => {
    return sequelize.define('focus', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        focusId: {
            type:  Sequelize.INTEGER,
            references: {
                model: 'user',
                key: 'id',
            },
            allowNull: false,
        },
        followId: {
            type:  Sequelize.INTEGER,
            references: {
                model: 'user',
                key: 'id',
            },
            allowNull: false,
        },
        nickname: {
            type: Sequelize.STRING,
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