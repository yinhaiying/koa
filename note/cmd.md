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

### 后台管理相关功能的实现

#### 左侧导航分类选中功能
左侧导航栏通常会有较多的的类别。比如管理员管理,分类管理，内容管理等。我们每次访问不同类别时，对应的nav需要进行高亮或者展开等操作。
**实现方法是：**根据路由来确定究竟访问的是哪个页面。通常每一个分类都有特殊的路由单词。比如管理员/admin或者/manage等。
```
  let splitUrl = path.substr(1).split('/')
  ctx.state.__HOST__ = "http://"+ ctx.request.header.host;
  ctx.state.G = {
    userinfo:ctx.session.userinfo,
    url:splitUrl
  }
```
从url中获取到数组:
```
[ 'admin', 'manage', 'add' ]
```
数组中manage表示这个管理员管理nav。数组中add表示这个管理员管理下面的添加路由。
根据数组中是否存在manage和add等进行管理。
```
<li {{if G.url[1] == 'manage'}} class = "active open" {{/if}}>

```
如上所示：数组中第二个单词是manage表示这是管理员路由，因此对应的导航栏是管理员管理。因此需要展开。
```
<li {{if !G.url[2]}} class = "active" {{/if}} >  // 没有第三个单词

<li {{if G.url[2] == 'add'}} class = "active" {{/if}}>// 第三个单词是add
```
根据是否有第三个单词和第三个单词是否为add来判断子路由。应该高亮哪一个子路由。

#### 管理员的增删改查功能的实现

编辑时需要传递一个对应的id过去。
```
<a href="{{__HOST__}}/admin/manage/edit?id={{@$value._id}}"  class="btn btn-xs btn-info">
    <i class="icon-edit bigger-120"></i>
</a>
```
根据这个传递过来的id，后端获取到对应的信息。前端根据这个信息先进行展示。
```

router.get('/edit',async (ctx) => {
  console.log(ctx.query.id)
  let userInfo = await DB.find('admin',{"_id":DB.getObjectId(ctx.query.id)})
  await ctx.render('admin/manage/edit',{userInfo:userInfo[0]})
})
```
后台想要更新相对应的文档的数据，同样需要获取到这个id。后台想要获取到这个id只能通过一个隐藏的input将id传递过去。
```
<div class="col-sm-10">
        <input type="hidden" name="id" value = "{{@userInfo._id}}">  // 隐藏的input用于将id传递过去。
        <input type="text" id="username"  name="username" class="col-xs-10 col-sm-5" value="{{userInfo.username}}" />
</div>
```
修改完成之后，后台能够接受所有的数据，然后进行更改。
```
router.post('/doEdit',async (ctx) => {
  console.log(ctx.request.body)
  await DB.update('admin',{"_id":DB.getObjectId(ctx.request.body.id)},{username:ctx.request.body.username})
})
```
