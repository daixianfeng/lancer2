
const pageErrorMiddle = (args) => {
    return async (ctx, next) => {
        try {
            await next();
        } catch(e) {
            ctx.body = JSON.stringify({ error: '521', message: 'Api service error' });
            throw(e);
        }
    };
}
export default pageErrorMiddle;