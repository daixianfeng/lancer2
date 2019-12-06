
import koajwt from 'koa-jwt';
import session from 'koa-session';
import compose from 'koa-compose';

import config from '../../config/index.js';

const midAuth = (app, redisClient) => {
    app.keys = [config.keys];
    const midSession = session({
        key: 'SESSIONID', /** cookie-key 名 */
        maxAge: 86400000,
        store: {
            async get(key, maxAge = 3600000){
                const {promisify} = require('util');
                const getAsync = promisify(redisClient.get).bind(redisClient);
                const session = await getAsync(`SESSIONID:${key}`);
                return JSON.parse(session);
            },
            async set(key, value, maxAge = 3600000){
                await redisClient.set(`SESSIONID:${key}`, JSON.stringify(value), 'EX', maxAge/1000);
            },
            async destroy(key){
                await redisClient.set(`SESSIONID:${key}`, undefined);
            },
        }
    }, app);
    const midJwtError = (ctx, next) => {
        return next().catch((err) => {
            if(err.status === 401){
                ctx.status = 401;
                ctx.body = JSON.stringify({ error: 401, message: '认证失败' });
            }else{
                throw err;
            }
        })
    };
    const midJwt = koajwt({
        secret: config.tokenSecret,
        key: config.tokenKey,
    }).unless({
        path: [/\/api/]
    });
    const getAuth = async (ctx, next) => {
        let userId = ctx.state.xToken && ctx.state.xToken.id;
        userId = userId || ctx.session.id;
        ctx.userId = userId;
        await next();
    };
    return compose([midSession, midJwtError, midJwt, getAuth])
};

export default midAuth;