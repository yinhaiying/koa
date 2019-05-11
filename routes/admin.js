let Router = require('koa-router');
let router = new Router();
const DB = require('../model/db.js')
const tools = require('../tools/tools.js')
// 继续使用路由的模块化。
let login = require('./admin/login.js')
let user= require('./admin/user.js')

const url = require('url')



router.use(async (ctx,next) => {
  ctx.state.__HOST__ = "http://"+ ctx.request.header.host;
  const path = url.parse(ctx.url).pathname;
  //已经登录继续向下匹配路由
  if(ctx.session.userinfo){
    await next()
  }else{
    // 没有登录跳转到登录页面
    if(path == '/admin/login'|| path == '/admin/login/doLogin'|| path == '/admin/login/code'){
      await next();
    }else{
      ctx.redirect('/admin/login')
    }
  }
})




router.get('/',async (ctx) => {
  await ctx.render('admin/index')
})


router.use('/login',login)
router.use('/user',user)
module.exports = router.routes();
