let Koa = require('koa');
let app = new Koa();


let Router = require('koa-router');
let router = new Router();
//中间件
// ctx 替代了express中的res和res
router.get('/', async (ctx,next) => {
    // res.send('返回数据')
    ctx.body = 'router';// ctx.body返回数据
})

router.get('/test', async (ctx,next) => {
    ctx.body = '这是一个测试';
})


// 注册路由
app
  .use(router.routes())
  .use(router.allowedMethods());// 这个是可选设置






app.listen(4000)