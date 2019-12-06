import Koa from 'koa';
import redis from 'redis';
import bodyparser from 'koa-bodyparser';
import serve from 'koa-static';

import config from '../config/index.js';
import router from './router/index.js';
import error from './middleware/error.js';
import pageError from './middleware/page-error.js';
import logger from './middleware/log.js';
import db from './middleware/mysql.js';
import auth from './middleware/auth.js';

const app = new Koa();
const redisClient = redis.createClient();

app.use(error({
    appenders: {
        console: { type: 'console' },
        errorLog: {
            "type": "file",
            "filename": __dirname + "/../log/koa-error/current.log",
            "maxLogSize": 20480,
            "backups": 10,
        }
    },
    categories: {
        error: { appenders: ['errorLog'], level: 'error', enableCallStack: true },
        default: { appenders: ['console'], level: 'trace' },
    },
    pm2: true,
    disableClustering: true
}));
app.use(logger({
    appenders: {
        console: { type: 'console' },
        visitLog : {
            "type": "file",
            "filename": __dirname + "/../log/koa-log/current.log",
            "maxLogSize": 2048000,
            "backups": 10,
        },
        errorLog: {
            "type": "file",
            "filename": __dirname + "/../log/koa-error/current.log",
            "maxLogSize": 20480,
            "backups": 10,
        }
    },
    categories: {
        visit: { appenders: ['visitLog'], level: 'debug' },
        error: { appenders: ['errorLog'], level: 'error', enableCallStack: true },
        default: { appenders: ['console'], level: 'trace' },
    },
    pm2: true,
    disableClustering: true
}));
app.use(serve('.'));
app.use(pageError());
app.use(bodyparser());
app.use(db());
app.use(auth(app, redisClient));

app.use(router.routes()).use(router.allowedMethods());

app.on('error', (err, ctx) => {
    // redisClient.quit();
    console.log('Outset error:'+"\n"+err.stack);
});

app.listen(config.port, () => {
    console.log(`server start at http://127.0.0.1:${config.port}`);
});