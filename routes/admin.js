let Router = require('koa-router');
let router = new Router();


// 继续使用路由的模块化。
let login = require('./admin/login.js')
let user= require('./admin/user.js')

router.use('/login',login)
router.use('/user',user)

router.get('/',async (ctx) => {
  await ctx.render('admin/index')
})



module.exports = router.routes();
