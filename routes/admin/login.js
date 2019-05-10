
let Router = require('koa-router');
let router = new Router();

router.get('/',async (ctx) => {
  await ctx.render('admin/login')
})




module.exports = router.routes();
