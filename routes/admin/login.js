
let Router = require('koa-router');
let router = new Router();

router.get('/',async (ctx) => {
  await ctx.render('admin/login')
})

router.use(async (ctx,next) => {
  ctx.state.__HOST__ = "http://"+ctx.request.header.host;
  await next()
})


module.exports = router.routes();
