
let Router = require('koa-router');
let router = new Router();
const tools = require('../../tools/tools.js')
const DB = require('../../model/db.js')

const svgCaptcha = require('svg-captcha');


router.get('/',async (ctx) => {
  // const result = await DB.insert('admin',{username:'admin',password:tools.md5('123456')});
  await ctx.render('admin/login')
})



/**
 * 登录流程:
 * 1、验证用户名和密码是否合法
 * 2、验证用户名和密码是否匹配
 * 3、验证通过之后将用户信息写入session
 *
 */



router.post('/doLogin', async (ctx) => {
  let {username,password,code} = ctx.request.body;

  if(code.toLocaleLowerCase() == ctx.session.code.toLocaleLowerCase()){
    // 验证用户名和密码是否合法
    let result = await DB.find('admin',{username:'admin',password:tools.md5(password)});
    console.log('...........')
    console.log(result[0])
    if(result[0]){
      // 成功以后把用户信息写到session中
      console.log('登录成功')
      ctx.session.userinfo = result[0];
      ctx.redirect('/admin')
    }else{
      // 登录失败
      await ctx.render('admin/error',{
        message:'登录失败',
        redirect:ctx.state.__HOST__+'/admin/login'
      })
    }
  }else{
    await ctx.render('admin/error',{
      message:'验证码失败',
      redirect:ctx.state.__HOST__+'/admin/login'
    })
  }

})



/**
 * 生成验证码:
 *
 */
router.get('/code', async (ctx) => {
  var captcha = svgCaptcha.create({
    size:4,
    fontSize:50,
    width:100,
    height:35,
    background:'#cc9966'
  });
  // 后台session保存这个验证，用来与前端验证码进行对比。
  ctx.session.code = captcha.text;
  ctx.response.type = 'image/svg+xml'
  ctx.body = captcha.data
})


module.exports = router.routes();
