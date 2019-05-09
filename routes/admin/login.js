
let Router = require('koa-router');
let router = new Router();

router.get('/',async (ctx) => {
  ctx.body = '管理员登录'
})


module.exports = router.routes();
