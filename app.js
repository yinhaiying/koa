let Koa = require('koa');
let app = new Koa();


let Router = require('koa-router');
let router = new Router();

//ejs模板引擎的引入和配置

const views = require('koa-views');
app.use(views('views', { extension: 'ejs' }))


// body-parser中间件的使用
const bodyParser = require('koa-bodyparser');
app.use(bodyParser());
 
// koa-static 静态资源中间件
const server = require('koa-static');
app.use(server(__dirname+'/static'))

// koa-session 中间件的使用
const session = require('koa-session')
app.keys = ['some secret hurr']; // cookie的签名，默认即可
const CONFIG = {
  key: 'koa:sess',// 生成的cookie的名字。由于session是和cookie密切相关的。当生成session时会在浏览器端生成一个cookie
  maxAge: 5000000,// cookie的过期时间， 需要设置
  overwrite: true,  // 默认即可
  httpOnly: true,// 表示只有在服务器端才能操作cookie。
  signed: true,//签名 默认即可。 
  rolling: false, // 每次访问的时候，都重新更新session。可以默认。
  renew: true,// 每次访问的时候，session快要到期时才更新。最好设置为true。
};
app.use(session(CONFIG, app));


// mongodb类库的使用
const Db = require('./module/db.js')



router.post('/add',async ctx => {
  // 所有的内容都会被放置在ctx.request.body
  ctx.body = ctx.request.body;
});


//中间件
app.use(async (ctx,next) => {
  ctx.body = '这是一个中间件'
  // console.log(1)
  await next(); // 在这里执行时出现错误。
  // 进行错误处理
  if(ctx.status == 404){
    ctx.body = '404 page';
    // console.log(2)
  }
})

app.use(async (ctx,next) => {
  ctx.state = {
    title:'ejs标题'
  }
  await next();
})



// ctx 替代了express中的res和res
router.get('/', async (ctx,next) => {
    // 在当前页面设置cookie
    let value = new Buffer('刘亦菲').toString('base64'); // 转换成base64
    console.log(value)
    ctx.cookies.set('userinfo',value,{
      maxAge:60*1000*60*60
    })

    // ctx.cookies.set('userinfo',value,{
    //   maxAge:60*1000*60*60
    // })
})

router.use('/test',async (ctx,next) => {
    console.log('路由级中间件匹配完成之后继续往下执行');
    await next();
})
router.get('/test', async (ctx,next) => {
    ctx.body = '这是一个测试';
})

router.get('/index',async (ctx,next) => {
  // 获取cookie
  let userinfo = ctx.cookies.get('userinfo');
  userinfo = new Buffer(userinfo,'base64').toString();
  console.log(userinfo)
  await ctx.render('index')
})


// session的使用
router.get('/login',async (ctx) => {
  ctx.session.userInfo = {name:'刘亦菲',age:30}
  console.time('start')
  let user = await Db.find('user',{username:'刘亦菲'})
  console.log(user)
  console.timeEnd('start')
})

router.get('/about',async (ctx) => {
  let userInfo = ctx.session.userInfo;
  console.log(userInfo)  // { name: '刘亦菲', age: 30 }
  console.time('start')
  let user = await Db.find('user',{username:'刘亦菲'})
  console.log(user)
  console.timeEnd('start')
  
})

router.get('/add',async (ctx) => {
  let data = await Db.insert('user',{username:'迪丽热巴',age:30})
  console.log(data.result)
})

router.get('/edit',async (ctx) => {
  let data = await Db.update('user',{username:"唐嫣"},{username:'佟丽娅'})
  console.log(data.result)
})

router.get('/delete',async (ctx) => {
   let data =await Db.remove('user',{username:'唐嫣'})
   console.log(data.result)
})


// 注册路由
app
  .use(router.routes())
  .use(router.allowedMethods());// 这个是可选设置






app.listen(4000)