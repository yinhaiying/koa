## koa

### async/await

async是将一个函数变成异步函数。
```
async function getInfo(){
    return '异步返回数据'
}
let result = getInfo();
console.log(result)  // Promise { '异步返回数据' }
```
从上面我们可以看到getInfo函数返回的是一个promise。
如果我们想要得到返回的值，我们可以通过promise.then进行获取。
```
result.then((res) => {
  console.log(res)
})
```
但是这种方法还是存在一定问题。如果我们里面不断嵌套有异步函数。
那么我们需要不断地使用then。我们希望能够以同步的写法来处理异步。
ES6提供了一个await关键字。await等待异步执行完成。
```
let data2 = await getInfo()  // await is only valid in async function
```
当我们直接使用await调用异步函数时，会发现出现报错。await只能在async函数内部使用。
```
async异步函数
async function getInfo(){
    return '异步返回数据'
}

// async异步函数
async function show(){
    await getInfo() // 使用await得到其他异步函数的执行结果
    console.log('2') // 这里的同步执行会在await后面执行。await把异步变成同步
}
let data3 = show() // 异步返回数据

```

### 路由
**路由:** 就是根据不同的url地址，加载不同的页面实现不同的功能。在koa中通过koa-router来实现路由功能。
1. **引入路由并创建实例**
```
let Router = require('koa-router');
let router = new Router();
```
2. **使用路由实例编写路由**(在express中是使用app应用来编写实例)
```
router.get('/', async (ctx,next) => {
    // res.send('返回数据')
    ctx.body = 'router';// ctx.body返回数据
})
```
3. **注册路由**
```
app
  .use(router.routes())
  .use(router.allowedMethods());// 这个是可选设置
```

### 中间件
**中间件:** 匹配路由之前和匹配路由完成之后可能进行的一系列操作。实现这些操作的函数就是中间件。中间件可以访问请求对象(request),响应对象(response)和next变量。


**中间件的定义：**
**通过使用app.use()来定义中间件**。app.use具有两个参数。第一个参数是路由表示中间件使用对应的路由，只有在匹配该路由时才调用中间件。如果不写默认匹配所有路由。第二个参数是回调函数，用来实现中间件的功能。回调函数中的next非常重要，只有在回调函数中调用了next才能够继续往下执行。
1. 匹配指定的路由
```
app.use('/login',async (ctx,next) => {
    // 执行相应功能
    await next(); // 当前中间件执行以后继续往下执行
})

```
2. 匹配所有的路由
```
app.use(async (ctx,next) => {
    // 执行相应功能
    await next();
})
```

**常见的中间件：**
1. 应用级中间件
2. 路由级中间件
3. 错误处理中间件
4. 第三方中间件

**应用级中间件:**匹配路由之前进行的一系列操作。使用方式为app.use()。
在koa中应用级中间件始终是最先匹配。

**路由级中间件:**匹配完成一个路由之后，通常情况下会停止往下匹配。使用路由级中间件可以实现继续往下匹配。使用方式为router.use()
```
// 路由级中间件
router.use('/test',async (ctx,next) => {
    console.log('路由级中间件匹配完成之后继续往下执行');
    await next();
})
router.get('/test', async (ctx,next) => {
    ctx.body = '这是一个测试';
})

```
**错误处理中间件:**
错误处理中间件主要是用来处理路由匹配时出现错误时情况。因此，错误处理中间件一定是等next执行完成以后，如果有错误再进行处理。
```
app.use(async (ctx,next) => {
  ctx.body = '这是一个中间件'
  console.log(1)
  await next(); // 在这里执行时出现错误。
  // 进行错误处理
  if(ctx.status == 404){
    ctx.body = '404 page';
    console.log(2)
  }
})

```
错误处理中间件的执行顺序是：
1. 先执行next前的代码
2. 再执行next。执行next时会跳出中间件，去寻找相对应的路由。
3. 当没有找到路由时，回到中间件函数，执行next下面的错误处理代码。

**第三方中间件:**
第三方中间件是npm上的一些常见的中间件。

**中间件的执行顺序：**
中间件的执行顺序是洋葱模型。

### ejs 模板引擎
e:effective 高效。
js:javascript。
ejs是一套简单的模板语言，帮助你利用简单的javascript代码生成html页面。

**在koa中使用ejs模板引擎.**
1. 安装
```
npm i koa-views
npm i ejs
```

2. 引入koa-views配置中间件
```
const views = require('koa-views');
app.use(views('views', { extension: 'ejs' }))
```
views方法中的第一个参数是ejs文件所在的目录。
{extension:ejs}表示模板引擎的后缀必须是ejs而不是html.
3. 使用ejs模板引擎进行渲染
```
await ctx.render('index')
```

**ejs的语法：牢记一点。在<%...%>...部分书写js代码。**
只需要知道一些常见标签的使用即可。
```
<%= 输出数据到模板，原始数据是什么样就输出什么样。用于绑定常见数据。
<%- 输出数据到模板，会对html标签等数据进行处理。用于绑定html数据。
```

**ejs全部变量的设置**
假设我们在所有的路由的render函数中,都需要渲染一个数据。这时候如果在所有路由
里面去进行设置就显得比较麻烦。我们可以通过ctx.state来进行设置.
```
app.use(async (ctx,next) => {
  ctx.state = {
    title:'ejs标题'
  }
  await next();
})
```

### 在koa中处理post提交的数据

在koa中使用koa-bodyparser来处理post提交的数据.
```
const bodyParser = require('koa-bodyparser');
app.use(bodyParser());
 
router.post('/add',async ctx => {
  // 所有的内容都会被放置在ctx.request.body
  ctx.body = ctx.request.body;
});
```

### 静态资源处理-koa-static
**静态资源：**直接把相应的文件发送到客户端的文件就是静态资源，比如js,css,img等。
每个用户打开网页之后，得到的是相同的结果，那么就是静态资源。

**动态资源：**不同的用户得到的是不同的回答就是动态资源，通常是数据可资源。

为什么要处理静态资源？
首先我们给模板设置一下css样式。
```
<link rel="stylesheet" href="../css/index.css">
```
我们在home页面，通过link标签引入了css。但是打开页面发现css并没有生效。
通过查看发现请求地址是:http://localhost:4000/css/index.css。然而我们
并没有在路由中添加这个路由。因此我们需要给请求的css添加路由。
```
router.get('/css/index.css',async (ctx)=>{
 // 在这里返回样式
})
```
通过添加请求css的路由之后，就能够正常获取到css资源了。但是想像一下，在一个页面中有多少
的静态资源，比如非常多的图片，样式。这么多静态资源如果每一条都需要设置一个路由，那么就太冗余了。
而且这些文件都是静态资源，是不会发生变化的。不需要我们每次都从后端去获取。只需要确保我们能够获取
到这些资源就可以了。因此，我们可以考虑把这些文件托管到本地的一个目录中，然后我们直接从本地的目录中
获取即可。koa中提供了一个koa-static中间件来进行获取。
```
const server = require('koa-static');
app.use(server(__dirname+'/static')) // 配置中间件。将静态资源文件放到指定路径下。
```
接下来引入资源时，只需要从static下进行引入即可。
```
 <link rel="stylesheet" href="css/index.css">
```
我们再看css请求的路径http://localhost:4000/css/index.css。
在请求资源时会首先去static目录下查找。而不是去通过路由查找。如果找不到
会通过next继续往下查找，因为静态资源的目录可以配置多个。

### cookie
koa中cookie的使用不需要第三方中间件。
1. cookie的设置.
```
ctx.cookies.set(name,value,[options])
```
2. cookie的获取.
```
ctx.cookies.get(name)
```

cookie的特点：
1. 在不同页面间共享。也就是说我们可以在任何页面获取到cookie
```
//在主页设置cookie
router.get('/', async (ctx,next) => {
    // 在当前页面设置cookie
    ctx.cookies.set('userinfo','liuyifei',{
      maxAge:60*1000*60*60
    })
})

// 在index页面获取cookie
router.get('/index',async (ctx,next) => {
  // 获取cookie
  let userinfo = ctx.cookies.get('userinfo');
  console.log(userinfo)
  await ctx.render('index')
})
```
当然我们也可以限制可以访问cookie的页面，通过可选参数中的path进行设置
```
    ctx.cookies.set('userinfo','liuyifei',{
      maxAge:60*1000*60*60,
      path:'/index'
    })
```
path:表示能够访问cookie的页面，这里只有index页面才能够访问到cookie。
httpOnly:是表示只有服务器端可以操作cookie。客户端不可以通过js来操作cookie。
2. koa中cookie存在bug。无法将cookie的value值设置成中文。
先通过buffer转换成base64
```
    let value = new Buffer('刘亦菲').toString('base64'); // 转换成base64
    console.log(value)
    ctx.cookies.set('userinfo',value,{
      maxAge:60*1000*60*60
    })
```
获取时再还原回来.
```
  let userinfo = ctx.cookies.get('userinfo');
  userinfo = new Buffer(userinfo,'base64').toString();
  console.log(userinfo)
```