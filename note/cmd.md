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

### 权限判断
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
