let Router = require('koa-router');
let router = new Router();



router.get('/',async (ctx) => {
  ctx.body = 'api接口'
})






module.exports = router.routes();
