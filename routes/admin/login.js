
let Router = require('koa-router');
let router = new Router();
const tools = require('../../tools/tools.js')
const DB = require('../../model/db.js')


router.get('/',async (ctx) => {
  await ctx.render('admin/login')
})



/**
 * 登录流程:
 *
 * 1、验证用户名和密码是否合法
 * 2、验证用户名和密码是否匹配
 * 3、验证通过之后将用户信息写入session
 *
 *
 */



router.post('/doLogin', async (ctx) => {
  let {username,password} = ctx.request.body;
  let result = await DB.find('admin',{username:'admin',password:tools.md5(password)});
  console.log(result[0])
  if(result[0]){
    // 成功以后把用户信息写到session中
    console.log('登录成功')
    ctx.session.userinfo = result[0];
    ctx.redirect('/admin')
  }else{
    // 登录失败
  }

})




module.exports = router.routes();
