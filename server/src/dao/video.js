import moment from 'moment';
import Sequelize from 'sequelize';

export default (sequelize) => {
    return sequelize.define('video', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        ownerId: {
            type:  Sequelize.INTEGER,
            references: {
                model: 'user',
                key: 'id',
            },
            allowNull: false,
        },
        link: {
            type:  Sequelize.STRING,
            allowNull: false,
        },
        title: {
            type: Sequelize.STRING,
        },
        tags: {
            type: Sequelize.STRING,
        },
        isOpen: {
            type: Sequelize.BOOLEAN,
        },
        followNum: {
            type: Sequelize.INTEGER,
        },
        viewNum: {
            type: Sequelize.INTEGER,
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