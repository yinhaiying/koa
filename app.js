
const path = require('path');
let Koa = require('koa');
let app = new Koa();


let Router = require('koa-router');
let router = new Router();

// 引入子路由
let api = require('./routes/api.js')
let admin = require('./routes/admin.js')
let index = require('./routes/index.js')

router.use('/api',api)
router.use('/admin',admin)
router.use(index)

// koa-art-template模板的使用
const render = require('koa-art-template');
const sd = require('silly-datetime');
render(app, {
  root: path.join(__dirname, 'views'),
  extname: '.html',
  debug: process.env.NODE_ENV !== 'production',
  dateFormat:dateFormat = function(value){
    return sd.format(new Date(value),'YYYY-MM-DD HH:mm')
  }
});


// body-parser中间件的使用
const bodyParser = require('koa-bodyparser');
app.use(bodyParser());

// koa-static 静态资源中间件
const server = require('koa-static');
app.use(server(__dirname+'/public'))

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

// koa-jsonp中间件的使用
const jsonp = require('koa-jsonp')

app.use(jsonp())






// 注册路由
app
  .use(router.routes())
  .use(router.allowedMethods());// 这个是可选设置

app.listen(4000)
