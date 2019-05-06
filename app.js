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




// 注册路由
app
  .use(router.routes())
  .use(router.allowedMethods());// 这个是可选设置






app.listen(4000)