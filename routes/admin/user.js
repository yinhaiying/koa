let Router = require('koa-router');
let router = new Router();


router.get('/',async (ctx) => {
  await ctx.render('admin/user/list')
})
router.get('/add',async (ctx) => {
  await ctx.render('admin/user/add')
})




module.exports = router.routes();
