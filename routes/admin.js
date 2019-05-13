let Router = require('koa-router');
let router = new Router();
const DB = require('../model/db.js')
const tools = require('../tools/tools.js')
// 继续使用路由的模块化。
let login = require('./admin/login.js')
let manage= require('./admin/manage.js')
let index = require('./admin/index.js')
let articlecate = require('./admin/articlecate.js')
const url = require('url')



router.use(async (ctx,next) => {
  const path = url.parse(ctx.url).pathname;
  let splitUrl = path.substr(1).split('/');
  // console.log(splitUrl)
  ctx.state.__HOST__ = "http://"+ ctx.request.header.host;
  ctx.state.G = {
    userinfo:ctx.session.userinfo,
    url:splitUrl
  }


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






router.use(index)
router.use('/login',login)
router.use('/manage',manage)
router.use('/articlecate',articlecate)
module.exports = router.routes();
