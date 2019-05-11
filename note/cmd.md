## CMD系统

### 路由设计
整个项目设计主要分为后台、前台和api三个大类。因此整个路由会先分成这三个子路由。
路由目录结构如下：
```
├── routes                                      // 路由目录
│   ├── admin                                      // admin部分子路由
│   │   ├── login.js                               // 登录路由
│   │   ├── user.js                                // 用户管理路由
│   ├── admin.js                                // admin部分路由
│   │
│   │── api.js                                  // api部分路由
│   │
│   │── index.js                                // index部分路由
```

### 登录功能
#### 登录之权限判断
通常来说在用户没有登录之前，是不需要访问任何页面的。
也就是说我们需要对用户的访问权限进行控制。这session来保存用户信息。
在登录成功后，在session中保存用户信息。再次访问其他页面时，查看session中时候存在这个用户信息。
如果有则表示已经登录，如果没有则表示没有登录，需跳转到登录页面。
```
router.use(async (ctx,next) => {
  ctx.state.__HOST__ = "http://"+ ctx.request.header.host;
  console.log(ctx.url )
  //已经登录继续向下匹配路由
  if(ctx.session.userinfo){
    await next()
  }else{
    // 没有登录跳转到登录页面
    if(ctx.url == '/admin/login'|| ctx.url == '/admin/doLogin'){
      await next();
    }else{
      ctx.redirect('/admin/login')
    }
  }
})

```

#### 登录之验证码校验

登录时带有验证码校验功能。这里的验证码返回一个svg图片。
```
router.get('/code', async (ctx) => {
  var captcha = svgCaptcha.create({
    size:4,
    fontSize:50,
    width:100,
    height:35,
    background:'#cc9966'
  });
  console.log(ctx)
  // 后台session保存这个验证，用来与前端验证码进行对比。
  ctx.session.captcha = captcha.text;
  ctx.response.type = 'image/svg+xml'
  ctx.body = captcha.data
})
```
**验证码更新：当点击图片时，需要重新刷新验证码。可以通过替换图片的img属性实现。**
```
    $(function(){
      $('#code').click(function(){
        $(this).attr('src','{{__HOST__}}/admin/login/code?t='+Math.random()*1000)
      })
    })

```

#### 错误提示页面
通过meta url来实现错误提示：
```
   <meta http-equiv="refresh" content="3; url={{redirect}}" />

```
