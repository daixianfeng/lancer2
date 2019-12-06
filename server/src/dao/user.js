import moment from 'moment';
import Sequelize from 'sequelize';

export default (sequelize) => {
    return sequelize.define('user', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        username: { //用户唯一标识（注册用）
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        cellphone: {
            type:  Sequelize.STRING,
            allowNull: false,
        },
        password: {
            type:  Sequelize.STRING,
            allowNull: false,
        },
        nickname: {
            type: Sequelize.STRING,
        },
        avatar: {
            type: Sequelize.TEXT('medium'),
        },
        gender: {
            type: Sequelize.INTEGER,
        },
        city: {
            type: Sequelize.STRING,
        },
        birthday: {
            type: Sequelize.DATE,
        },
        contact: { //联系方式
            type: Sequelize.STRING,
        },
        desc: { //介绍
            type: Sequelize.STRING,
        },
        tips: { //备注
            type: Sequelize.STRING,
        },
        createTime: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        status: { //状态
            type: Sequelize.INTEGER,
        },
        wechatID: {
            type: Sequelize.STRING,
        },
        alipayID: {
            type: Sequelize.STRING,
        }
    }, {
        freezeTableName: true,
    });
}