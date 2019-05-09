let Router = require('koa-router');
let router = new Router();



router.get('/',async (ctx) => {
  ctx.body = '前端首页'
})


module.exports = router.routes();
