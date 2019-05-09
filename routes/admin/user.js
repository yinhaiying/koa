let Router = require('koa-router');
let router = new Router();

router.get('/add',async (ctx) => {
  ctx.body = '增加用户'
})

router.get('/edit',async (ctx) => {
  ctx.body = '编辑用户'
})

router.get('/delete',async (ctx) => {
  ctx.body = '删除用户'
})

router.get('/add',async (ctx) => {
  ctx.body = '增加用户'
})

module.exports = router.routes();
