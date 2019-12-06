import log4js from 'log4js';
import util from 'util';
import moment from 'moment';

const LOGGER_FORMAT = "%s %s -- %s %s HTTP/%s, %s %s";

const errorMiddle = (args) => {
    log4js.configure(args);
    var errorLog = log4js.getLogger('error');
    return async (ctx, next) => {
        ctx.errorLog = errorLog;
        try{
            await next();
        }catch(e){
            let req = ctx.request;
            let serverReq = ctx.req;
            let header = req.header;
            let visitTime = new Date();
            let errorVisit = util.format(LOGGER_FORMAT, moment(visitTime).format('YYYY-MM-DD HH:mm:ss(SSS)'), req.ip, req.method, req.url, serverReq.httpVersion, req.length||null, header['user-agent']);
            errorLog.error(`body: ${JSON.stringify(ctx.request.body)} , query:${JSON.stringify(ctx.query)} `);
            errorLog.error(errorVisit+"\n"+e.stack);
        }
    };
}
export default errorMiddle;